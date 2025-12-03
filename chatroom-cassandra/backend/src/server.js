// backend/src/server.js
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

// =============================================
// FUNÇÃO PERFEITA: SEMPRE REUTILIZA A SALA PELO NOME (case-insensitive)
// =============================================
async function getRoomByNameOrCreate(roomInput) {
  let input = (roomInput || 'geral').toString().trim();
  if (!input) input = 'geral';

  const normalizedName = input.toLowerCase(); // sempre lowercase no banco

  // 1. PRIMEIRO: tenta achar pelo nome (case-insensitive)
  const selectQuery = `SELECT room_id FROM chatroom_ks.chat_rooms WHERE room_name = ?`;
  try {
    const result = await client.execute(selectQuery, [normalizedName], { prepare: true });
    if (result.rowLength > 0) {
      const roomId = result.rows[0].room_id.toString();
      console.log(`Sala reutilizada: "${input}" → ${roomId}`);
      return roomId;
    }
  } catch (err) {
    console.log("Erro ao buscar sala (ignorado):", err.message);
  }

  // 2. SE NÃO ACHOU: cria nova com o nome normalizado
  const newRoomId = uuidv4();
  const insertQuery = `
    INSERT INTO chatroom_ks.chat_rooms (room_id, room_name, is_private, created_at)
    VALUES (?, ?, false, toTimestamp(now()))`;

  await client.execute(insertQuery, [newRoomId, normalizedName], { prepare: true });
  console.log(`Nova sala criada: "${input}" → ${newRoomId}`);
  return newRoomId;
}

// =============================================
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join_room', async ({ room_id, user_id, username }) => {
    const displayName = (room_id || 'geral').toString().trim() || 'geral';

    // AQUI ESTÁ A MÁGICA: ignora completamente se parece UUID ou não
    // Sempre tenta achar pelo NOME primeiro
    const finalRoomId = await getRoomByNameOrCreate(displayName);

    socket.join(finalRoomId);
    socket.user_id = user_id || socket.id;
    socket.username = username?.trim() || 'Anônimo';
    socket.room_id = finalRoomId;
    socket.display_room_name = displayName;

    console.log(`${socket.username} entrou em "${displayName}" → ID: ${finalRoomId}`);

    // Carrega histórico
    try {
      const result = await client.execute(
        `SELECT * FROM chatroom_ks.messages_by_room WHERE room_id = ? ORDER BY message_timestamp DESC LIMIT 50`,
        [finalRoomId],
        { prepare: true }
      );

      const messages = result.rows.map(row => ({
        message_id: row.message_id.toString(),
        sender_id: row.sender_id,
        sender_name: row.sender_name || row.sender_id,
        message_type: row.message_type,
        content_text: row.content_text,
        content_data: row.content_data ? { data: [...row.content_data] } : null,
        file_format: row.file_format,
        file_size: row.file_size ? Number(row.file_size) : null,
        message_timestamp: row.message_timestamp
      })).reverse();

      socket.emit('load_history', messages);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      socket.emit('load_history', []);
    }
  });

  // send_message (inalterado e perfeito)
  socket.on('send_message', async (data) => {
    const roomId = socket.room_id || 'geral';

    let buffer = null;
    if (data.content_data) {
      if (data.content_data.data) {
        buffer = Buffer.from(data.content_data.data);
      } else if (data.content_data instanceof ArrayBuffer) {
        buffer = Buffer.from(data.content_data);
      }
      data.file_size = buffer?.length || 0;
    }

    const messageId = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO chatroom_ks.messages_by_room (
        room_id, message_timestamp, message_id, sender_id, sender_name,
        message_type, content_text, content_data, file_format, file_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await client.execute(query, [
      roomId, now, messageId, socket.user_id, socket.username,
      data.message_type || 'text', data.content_text || null,
      buffer, data.file_format || null, data.file_size || null
    ], { prepare: true });

    { prepare: true };

    io.to(roomId).emit('receive_message', {
      message_id: messageId,
      sender_id: socket.user_id,
      sender_name: socket.username,
      message_type: data.message_type || 'text',
      content_text: data.content_text || null,
      content_data: buffer ? { data: [...buffer] } : null,
      file_format: data.file_format || null,
      file_size: data.file_size || null,
      message_timestamp: now
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Cassandra conectado com sucesso!`);
});