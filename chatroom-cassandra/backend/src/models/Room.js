// backend/src/models/Room.js
const client = require('../config/cassandra');
const { v4: uuidv4 } = require('uuid');
const { types } = require('cassandra-driver');
const { Uuid } = types;

class Room {
  static async create({ room_name, is_private = false }) {
    const room_id = uuidv4(); // aqui continua UUID real
    const query = `INSERT INTO chat_rooms (room_id, room_name, is_private, created_at) 
                   VALUES (?, ?, ?, toTimestamp(now()))`;
    await client.execute(query, [room_id, room_name, is_private], { prepare: true });
    return { room_id: room_id.toString(), room_name, is_private };
  }

  static async findAll() {
    const query = 'SELECT room_id, room_name, is_private FROM chat_rooms';
    const result = await client.execute(query);
    return result.rows.map(r => ({
      room_id: r.room_id.toString(),
      room_name: r.room_name,
      is_private: r.is_private
    }));
  }
}

module.exports = Room;