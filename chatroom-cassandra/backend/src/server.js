require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const client = require('./config/cassandra');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));

// Cache em memória para performance
const roomNameToId = new Map();
const roomIdToName = new Map();

async function getOrCreateRoom(displayName) {
  const normalized = displayName.toLowerCase().trim();
  
  // Cache rápido
  if (roomNameToId.has(normalized)) {
    const roomId = roomNameToId.get(normalized);
    roomIdToName.set(roomId, displayName);
    return roomId;
  }

  // Busca no Cassandra
  let result;
    try {
      result = await client.execute(
        `SELECT room_id FROM chatroom_ks.chat_rooms WHERE room_name = ?`,
        [normalized],
        { prepare: true }
      );
    } catch (err) {
      if (err.code === 8704) { // ALLOW FILTERING necessário
        console.log("Usando ALLOW FILTERING (índice ainda não criado)");
        result = await client.execute(
          `SELECT room_id FROM chatroom_ks.chat_rooms WHERE room_name = ? ALLOW FILTERING`,
          [normalized],
          { prepare: true }
        );
      } else {
        throw err;
      }
    }

  let roomId;
  if (result.rowLength > 0) {
    roomId = result.rows[0].room_id.toString();
    console.log(`Sala encontrada: "${displayName}" → ${roomId}`);
  } else {
    roomId = uuidv4();
    await client.execute(
      `INSERT INTO chatroom_ks.chat_rooms (room_id, room_name, is_private, created_at) 
       VALUES (?, ?, false, toTimestamp(now()))`,
      [roomId, normalized],
      { prepare: true }
    );
    console.log(`Sala criada: "${displayName}" → ${roomId}`);
  }

  roomNameToId.set(normalized, roomId);
  roomIdToName.set(roomId, displayName);
  return roomId;
}

async function getAllRooms() {
  const result = await client.execute(`SELECT room_id, room_name FROM chatroom_ks.chat_rooms`);
  return result.rows.map(row => {
    const id = row.room_id.toString();
    const savedName = row.room_name;
    const displayName = roomIdToName.get(id) || savedName.charAt(0).toUpperCase() + savedName.slice(1);
    return { room_id: id, room_name: displayName, is_private: false };
  });
}

const usersInRoom = new Map();

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // LIMPEZA AUTOMÁTICA DO USUÁRIO ANTIGO AO RECONECTAR
  socket.on('join_room', async ({ room_id: inputName, username }) => {
    const displayName = (inputName || 'geral').toString().trim() || 'geral';

    // REMOVE USUÁRIO ANTIGO DE TODAS AS SALAS (evita duplicação ao F5)
    for (const [roomId, users] of usersInRoom.entries()) {
      users.forEach(user => {
        if (user.username === username?.trim()) {
          users.delete(user);
          console.log(`Usuário antigo removido: ${username} da sala ${roomId}`);
        }
      });
      // Atualiza lista de online na sala afetada
      io.to(roomId).emit('users_in_room', Array.from(users).map(u => ({ username: u.username })));
    }

    const roomId = await getOrCreateRoom(displayName);

    // Sai da sala anterior (se já estava em alguma)
    if (socket.room_id && socket.room_id !== roomId) {
      socket.leave(socket.room_id);
      usersInRoom.get(socket.room_id)?.delete({ socketId: socket.id });
    }

    socket.join(roomId);
    socket.room_id = roomId;
    socket.username = username?.trim() || 'Anônimo';
    socket.display_room_name = displayName;

    if (!usersInRoom.has(roomId)) usersInRoom.set(roomId, new Set());
    usersInRoom.get(roomId).add({ socketId: socket.id, username: socket.username });

    // Atualiza lista de salas para todos
    const rooms = await getAllRooms();
    io.emit('rooms_list', rooms);

    // Atualiza usuários online na sala atual
    io.to(roomId).emit('users_in_room', Array.from(usersInRoom.get(roomId)).map(u => ({ username: u.username })));

    // Carrega histórico
    try {
      const result = await client.execute(
        `SELECT * FROM chatroom_ks.messages_by_room WHERE room_id = ? ORDER BY message_timestamp DESC LIMIT 100`,
        [roomId],
        { prepare: true }
      );

      const messages = result.rows.map(row => ({
        message_id: row.message_id.toString(),
        sender_id: row.sender_id,
        sender_name: row.sender_name || 'Anônimo',
        message_type: row.message_type,
        content_text: row.content_text,
        content_data: row.content_data ? { data: [...row.content_data] } : null,
        file_format: row.file_format,
        file_size: row.file_size ? Number(row.file_size) : null,
        message_timestamp: row.message_timestamp
      })).reverse();

      socket.emit('load_history', messages);
    } catch (err) {
      console.error('Erro histórico:', err);
      socket.emit('load_history', []);
    }
  });

  socket.on('request_rooms_list', async () => {
    const rooms = await getAllRooms();
    socket.emit('rooms_list', rooms);
  });

  socket.on('send_message', async (data) => {
    const roomId = socket.room_id;
    if (!roomId) return;

    let buffer = null;
    if (data.content_data?.data) buffer = Buffer.from(data.content_data.data);
    else if (data.content_data instanceof ArrayBuffer) buffer = Buffer.from(data.content_data);

    const messageId = uuidv4();
    const now = new Date();

    await client.execute(`
      INSERT INTO chatroom_ks.messages_by_room (
        room_id, message_timestamp, message_id, sender_id, sender_name,
        message_type, content_text, content_data, file_format, file_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      roomId, now, messageId, socket.id, socket.username,
      data.message_type || 'text', data.content_text || null,
      buffer, data.file_format || null, buffer?.length || null
    ], { prepare: true });

    io.to(roomId).emit('receive_message', {
      message_id: messageId,
      sender_id: socket.id,
      sender_name: socket.username,
      message_type: data.message_type || 'text',
      content_text: data.content_text || null,
      content_data: buffer ? { data: [...buffer] } : null,
      file_format: data.file_format || null,
      file_size: buffer?.length || null,
      message_timestamp: now
    });
  });

    socket.on('disconnect', () => {
      if (socket.room_id && usersInRoom.has(socket.room_id)) {
        // Remove apenas este socket.id
        const roomUsers = usersInRoom.get(socket.room_id);
        for (const user of roomUsers) {
          if (user.socketId === socket.id) {
            roomUsers.delete(user);
            break;
          }
        }

        // Atualiza lista de online
        io.to(socket.room_id).emit('users_in_room', Array.from(roomUsers).map(u => ({ username: u.username })));

        if (roomUsers.size === 0) {
          usersInRoom.delete(socket.room_id);
        }
      }
      console.log('Cliente desconectado:', socket.id);
    });
  });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Chat-APX rodando → http://localhost:${PORT}`);
  console.log(`Tudo funcionando com seu schema exato!`);
});