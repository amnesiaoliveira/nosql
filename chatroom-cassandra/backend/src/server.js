require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join_room', async ({ room_id, user_id, username }) => {
  console.log('Tentativa de entrada:', { room_id, user_id, username });

  // Aceita qualquer string como ID (não precisa mais ser UUID válido)
  room_id = room_id?.toString().trim() || 'sala-geral';
  user_id = user_id?.toString().trim() || 'anon-' + socket.id;
  username = username?.trim() || 'Anônimo';

  socket.join(room_id);
  socket.user_id = user_id;
  socket.username = username;
  socket.room_id = room_id;

  // Notifica os outros
  socket.to(room_id).emit('user_joined', { user_id, username });

  // Carrega histórico (agora nunca dá erro)
  try {
    const { messages } = await Message.getHistory(room_id, 50);
    socket.emit('load_history', messages);
  } catch (err) {
    socket.emit('load_history', []);
  }
});

  socket.on('send_message', async (data) => {
    const saved = await Message.save({
      room_id: data.room_id,
      sender_id: data.sender_id,
      message_type: data.message_type,
      content_text: data.content_text,
      content_url: data.content_url,
      file_format: data.file_format,
      file_size: data.file_size
    });

    const messageWithUser = {
      ...saved,
      sender_name: data.sender_name
    };

    io.to(data.room_id).emit('receive_message', messageWithUser);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});