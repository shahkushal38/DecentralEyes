// Import required modules
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON request bodies
const cors = require('cors'); // To enable CORS
const axios = require('axios');
const { ethers } = require('ethers');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// GitHub API URL
const GITHUB_API_URL = 'https://api.github.com/search/repositories';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Function to check if a word is present in a user's repositories
export async function findWordInGitHub(username, word) {
  try {
    const query = `${word}+user:${username}`;

    // Make a request to the GitHub Search API
    const response = await axios.get(
      `${GITHUB_API_URL}?q=${word}+user:${username}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
        },
      }
    );

    // Check if any items match the query
    if (response.data.total_count > 0) {
      console.log(
        `The word "${word}" is found in the GitHub account of "${username}".`
      );
      return true;
    } else {
      console.log(
        `The word "${word}" is not found in the GitHub account of "${username}".`
      );
      return false;
    }
  } catch (error) {
    console.error('Error querying the GitHub API:', error.message);
    return false;
  }
}
