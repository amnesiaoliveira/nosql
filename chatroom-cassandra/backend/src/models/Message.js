// backend/src/models/Message.js
const client = require('../config/cassandra');
const { v4: uuidv4 } = require('uuid');
const { types } = require('cassandra-driver');

const { Uuid } = types;

// Converte string para Uuid com fallback seguro
function safeUuid(str) {
  if (!str) return null;
  try {
    return Uuid.fromString(str.trim());
  } catch (e) {
    return null;
  }
}

class Message {
  static async save(messageData) {
    const message_id = uuidv4();
    const query = `INSERT INTO messages_by_room (
        room_id, message_timestamp, message_id, sender_id,
        message_type, content_text, content_url, file_format, file_size
      ) VALUES (?, toTimestamp(now()), ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      safeUuid(messageData.room_id) || Uuid.random(),   // fallback se inválido
      message_id,
      safeUuid(messageData.sender_id) || Uuid.random(),
      messageData.message_type || 'text',
      messageData.content_text || null,
      messageData.content_url || null,
      messageData.file_format || null,
      messageData.file_size || null
    ];

    await client.execute(query, params, { prepare: true });

    return {
      message_id,
      message_timestamp: new Date(),
      room_id: messageData.room_id,
      sender_id: messageData.sender_id,
      sender_name: messageData.sender_name || 'Anônimo',
      ...messageData
    };
  }

  static async getHistory(room_id, limit = 50) {
    const roomUuid = safeUuid(room_id);
    if (!roomUuid) {
      console.warn('room_id inválido, retornando histórico vazio:', room_id);
      return { messages: [], pagingState: null };
    }

    const query = `SELECT * FROM messages_by_room WHERE room_id = ? ORDER BY message_timestamp DESC LIMIT ?`;
    
    try {
      const result = await client.execute(query, [roomUuid, limit], { prepare: true });

      const messages = result.rows.map(row => ({
        room_id: row.room_id.toString(),
        message_id: row.message_id.toString(),
        sender_id: row.sender_id.toString(),
        sender_name: 'Usuário', // será sobrescrito no frontend se precisar
        message_timestamp: row.message_timestamp,
        message_type: row.message_type,
        content_text: row.content_text,
        content_url: row.content_url,
        file_format: row.file_format,
        file_size: row.file_size ? Number(row.file_size) : null
      })).reverse(); // ordem cronológica

      return { messages, pagingState: null };
    } catch (err) {
      console.error('Erro ao buscar histórico:', err.message);
      return { messages: [], pagingState: null };
    }
  }
}

module.exports = Message;