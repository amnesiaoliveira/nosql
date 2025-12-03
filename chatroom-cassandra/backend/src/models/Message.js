const client = require('../config/cassandra');
const { v4: uuidv4 } = require('uuid');

class Message {
  static async save(messageData) {
    const message_id = uuidv4();
    const now = new Date();

    const query = `
      INSERT INTO messages_by_room (
        room_id, message_timestamp, message_id, sender_id,
        message_type, content_text, content_data, file_format, file_size
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      messageData.room_id || 'geral',
      now,
      message_id,
      messageData.sender_id || 'anon',
      messageData.message_type || 'text',
      messageData.content_text || null,
      messageData.content_data || null,
      messageData.file_format || null,
      messageData.file_size || null
    ];

    await client.execute(query, params, { prepare: true });

    return {
      message_id: message_id.toString(),
      message_timestamp: now,
      room_id: messageData.room_id,
      sender_id: messageData.sender_id,
      sender_name: messageData.sender_name || 'Anônimo',
      message_type: messageData.message_type,
      content_text: messageData.content_text,
      content_data: messageData.content_data,
      file_format: messageData.file_format,
      file_size: messageData.file_size
    };
  }

  static async getHistory(room_id, limit = 50) {
    const query = `
      SELECT message_timestamp, message_id, sender_id, sender_name,
             message_type, content_text, content_data, file_format, file_size
      FROM messages_by_room 
      WHERE room_id = ? 
      ORDER BY message_timestamp DESC 
      LIMIT ?`;

    try {
      const result = await client.execute(query, [room_id, limit], { prepare: true });

      const messages = result.rows.map(row => ({
        message_id: row.message_id.toString(),
        sender_id: row.sender_id,
        sender_name: row.sender_id, // será sobrescrito no frontend
        message_timestamp: row.message_timestamp,
        message_type: row.message_type,
        content_text: row.content_text,
        content_data: row.content_data, // Buffer ou null
        file_format: row.file_format,
        file_size: row.file_size ? Number(row.file_size) : null
      })).reverse();

      return { messages };
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      return { messages: [] };
    }
  }
}

module.exports = Message;