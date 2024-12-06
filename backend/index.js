// Import required modules
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON request bodies
const cors = require('cors'); // To enable CORS

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define a default route
app.get('/', (req, res) => {
  res.send('Welcome to the Express.js application!');
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
