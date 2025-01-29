// src/models/leaderboardModel.js
import pkg from 'pg';
const { Client } = pkg;
import { connect } from '../db.js';
connect();

class Leaderboard {
  static async createLeaderboardEntry({ id, quiz_id, user_id, score, rank }) {
    const client = new Client();
    await client.connect();
    const query = `
      INSERT INTO leaderboard (id, quiz_id, user_id, score, rank)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [id, quiz_id, user_id, score, rank];
    const result = await client.query(query, values);
    await client.end();
    return result.rows[0];
  }

  static async getLeaderboardByQuizId(quiz_id) {
    const client = new Client();
    await client.connect();
    const query = 'SELECT * FROM leaderboard WHERE quiz_id = $1 ORDER BY score DESC;';
    const result = await client.query(query, [quiz_id]);
    await client.end();
    return result.rows;
  }
}

export default Leaderboard;
