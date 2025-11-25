const client = require('../config/cassandra');
const { types } = require('cassandra-driver');
const bcrypt = require('bcrypt');
const { Uuid } = types;

class User {
  static async create({ username, email, password }) {
    const user_id = Uuid.random();
    const password_hash = await bcrypt.hash(password, 10);

    const query = `INSERT INTO users (user_id, username, email, password_hash, created_at) 
                   VALUES (?, ?, ?, ?, toTimestamp(now()))`;
    await client.execute(query, [user_id, username, email, password_hash], { prepare: true });

    return { user_id: user_id.toString(), username, email };
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const result = await client.execute(query, [email], { prepare: true });
    if (result.rowLength === 0) return null;
    const row = result.rows[0];
    return {
      user_id: row.user_id.toString(),
      username: row.username,
      email: row.email,
      password_hash: row.password_hash
    };
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User;