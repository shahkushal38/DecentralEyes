const processReview = require('./agentkit/addreview.js');
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

app.post('/processReview', async (req, res) => {
  // await res.send(processReview.processReview(req.body.text));
  const data = await processReview.processReview(req.body.text);
  res.send(data);
});

// Start the server
const PORT = process.env.PORT || 3000; // Use environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
