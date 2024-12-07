import { CdpToolkit } from '@coinbase/cdp-langchain';
import { CdpAgentkit } from '@coinbase/cdp-agentkit-core';
import { ChatOpenAI } from '@langchain/openai';
const { Configuration, OpenAIApi } = require('openai');
import { initializeAgentExecutorWithOptions } from 'langchain/agents';

// Import required modules
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON request bodies
const cors = require('cors'); // To enable CORS
// Initialize CDP Agentkit
const agentkit = CdpAgentkit.configureWithWallet();

// Create toolkit
const toolkit = new CdpToolkit(agentkit);

// Get available tools
const tools = toolkit.getTools();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Function to call OpenAI API and extract details
const extractReviewDetails = async (text) => {
  const prompt = `
    Extract the following details from the given text:
    - Product Name
    - Review Description (if present)
    - Rating (as a number)
    - GitHub URL
  
    Text: "${text}"
  
    Return the result in JSON format.
    `;

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 200,
      temperature: 0,
    });

    const extractedDetails = JSON.parse(response.data.choices[0].text.trim());
    return extractedDetails;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to extract review details');
  }
};

// Define a default route
app.get('/addReview', (req, res) => {
  const reviewBreakdow = extractReviewDetails(req);

  res.send('Welcome to the Express.js application!');
});
