import express from 'express';
import usersRoute from './routes/users.js';  // Ensure this is correct and exists

const app = express();

// Set up middleware, routes, etc.
app.use(express.json());  // For parsing JSON bodies
app.use('/users', usersRoute);  // Set up users route

export default app;
