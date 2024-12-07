// import axios from 'axios';
const axios = require('axios');
// import dotenv from 'dotenv';
const dotenv = require('dotenv');
// import axios from 'axios';
// import path from 'path';
const path = require('path');

// // import { fileURLToPath } from 'url';
// const fileURLToPath = require()

// // Simulate __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Load the .env file from the backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;

const endpoint = 'https://api.openai.com/v1/completions';

// Function to generate tags from the review text
class generateTags {
  async generateTags(reviewText) {
    const prompt = `
    Extract top 3 relevant tags from the following review about a tool. The tags should represent the core functionalities, use cases, or features of the tool, and be concise, comma-separated keywords. If the user is saying something bad or dislikes any feature of the tool, that feature should not be a part of the tags. Do not include the tool name in the tags.
    
    Review: "${reviewText}"
  
    Tags:
    `;

    try {
      const response = await axios.post(
        endpoint,
        {
          model: 'gpt-3.5-turbo-instruct',
          prompt: prompt,
          max_tokens: 50,
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const tags = response.data.choices[0].text.trim();
      return tags.split(',').map((tag) => tag.trim()); // Convert tags into an array
    } catch (error) {
      console.error('Error generating tags:', error);
      throw new Error('Failed to generate tags');
    }
  }
}
module.exports = new generateTags();
