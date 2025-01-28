import app from './app.js';  // Import the app
import { connect } from './db.js';  // Import the database connection

const PORT = process.env.PORT || 3000;  // Set a default port or use the one from the environment

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Test database connection
  connect((err) => {
    if (err) {
      console.error('Error connecting to the database', err.stack);
    } else {
      console.log('Connected to the PostgreSQL database');
    }
  });
});
