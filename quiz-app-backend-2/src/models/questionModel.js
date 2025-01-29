// src/models/questionModel.js
import pkg from 'pg';
const { Client } = pkg;
import { connect } from '../db.js';
connect();

class Question {
  static async createQuestion({ id, quiz_id, text, options, correct_answer, media_url }) {
    const client = new Client();
    await client.connect();
    const query = `
      INSERT INTO questions (id, quiz_id, text, options, correct_answer, media_url)
      VALUES ($1, $2, $3, $4::json, $5::json, $6)
      RETURNING *;
    `;
    const values = [id, quiz_id, text, options, correct_answer, media_url];
    const result = await client.query(query, values);
    await client.end();
    return result.rows[0];
  }

  static async getQuestionsByQuizId(quiz_id) {
    const client = new Client();
    await client.connect();
    const query = 'SELECT * FROM questions WHERE quiz_id = $1;';
    const result = await client.query(query, [quiz_id]);
    await client.end();
    return result.rows;
  }
}

export default Question;
