// src/models/userModel.js
import pkg from 'pg';
const { Client } = pkg;
import { connect } from '../db.js';
connect();

class User {
  static async createUser({ id, email, password, username, role }) {
    const client = new Client();
    await client.connect();
    const query = `
      INSERT INTO users (id, email, password, username, role, created_at)
      VALUES ($1, $2, $3, $4, $5, now())
      RETURNING *;
    `;
    const values = [id, email, password, username, role];
    const result = await client.query(query, values);
    await client.end();
    return result.rows[0];
  }

  static async getUserByEmail(email) {
    const client = new Client();
    await client.connect();
    const query = 'SELECT * FROM users WHERE email = $1;';
    const result = await client.query(query, [email]);
    await client.end();
    return result.rows[0];
  }
}

export default User;
