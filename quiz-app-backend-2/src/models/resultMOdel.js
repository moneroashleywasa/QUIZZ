// src/models/resultModel.js
import pkg from 'pg';
const { Client } = pkg;
import { connect } from '../db.js';
connect();

class Result {
  static async createResult({ id, user_id, quiz_id, score, answers, time_taken }) {
    const client = new Client();
    await client.connect();
    const query = `
      INSERT INTO results (id, user_id, quiz_id, score, answers, time_taken, created_at)
      VALUES ($1, $2, $3, $4, $5::json, $6, now())
      RETURNING *;
    `;
    const values = [id, user_id, quiz_id, score, answers, time_taken];
    const result = await client.query(query, values);
    await client.end();
    return result.rows[0];
  }

  static async getResultsByUserId(user_id) {
    const client = new Client();
    await client.connect();
    const query = 'SELECT * FROM results WHERE user_id = $1;';
    const result = await client.query(query, [user_id]);
    await client.end();
    return result.rows;
  }
}

export default Result;
