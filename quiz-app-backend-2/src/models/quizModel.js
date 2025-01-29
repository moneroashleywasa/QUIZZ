// src/models/quizModel.js
import pkg from 'pg';
const { Client } = pkg;
import { connect } from '../db.js';
connect();

class Quiz {
  static async createQuiz({ id, title, description, creator_id, status }) {
    const client = new Client();
    await client.connect();
    const query = `
      INSERT INTO quizzes (id, title, description, creator_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5, now())
      RETURNING *;
    `;
    const values = [id, title, description, creator_id, status];
    const result = await client.query(query, values);
    await client.end();
    return result.rows[0];
  }

  static async getQuizzes() {
    const client = new Client();
    await client.connect();
    const query = 'SELECT * FROM quizzes;';
    const result = await client.query(query);
    await client.end();
    return result.rows;
  }
}

export default Quiz;
