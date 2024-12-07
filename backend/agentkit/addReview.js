const generateTags = require('./generateTag.js');
const dotenv = require('dotenv');
// import  from 'dotenv';
// import axios from 'axios';
const path = require('path');
const axios = require('axios');
// import path from 'path';
// import { fileURLToPath } from 'url';
const fileURLToPath = require('url');

// Simulate __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Load the .env file from the backend folder
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.OPENAI_API_KEY;
class processReview {
  async checkNSFW(text) {
    try {
      const url = 'https://api.openai.com/v1/completions';

      // Define the prompt to assess the content
      const prompt = `
      You are a content moderation assistant. Analyze the following text and determine if it contains:
      - Profanity
      - Abusive language
      - NSFW content (sexual, hateful, violent, or otherwise inappropriate)

      Respond with a JSON object containing:
      {
        "safe": true or false,
        "reason": "Explain why it is unsafe, or state 'Content is safe.'"
      }

      Text: "${text}"
    `;

      // API request to OpenAI Chat Completion endpoint
      const response = await axios.post(
        url,
        {
          model: 'gpt-3.5-turbo-instruct', // Replace with 'gpt-3.5-turbo' for cost efficiency
          prompt: prompt,
          max_tokens: 150,
          temperature: 0.0,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const moderationResult = JSON.parse(response.data.choices[0].text.trim());
      console.log("moderationResult", moderationResult);

      // Check for NSFW content
      if (moderationResult.safe == false) {
        console.log('NSFW content detected');
        return {
          safe: false,
          flagged: true,
        };
      }

      console.log('Content is safe.');
      return { safe: true, flagged: false };
    } catch (error) {
      console.error('Error during NSFW moderation check:', error.message);
      return { safe: false, flagged: false, error: error.message };
    }
  }

  // Function to call OpenAI API and extract details
  async extractReviewDetails(text) {
    const prompt = `
    Extract the following details from the given text:
    - Product Name
    - Review Description (if present)
    - Rating (as a number)
    - GitHub URL
  
    Text: "${text}"

    All the content other than the rating and github url will be a part the review description. If there is no clear prduct name, put the text as part of the review description.
  
    Return the result in JSON format.
    {"ToolName": name,
    "ReviewDescription" : description,
    "Rating" : rating,
    "GithubUrl" : github url
    }
    `;

    try {
      const endpoint = 'https://api.openai.com/v1/completions';

      const response = await axios.post(
        endpoint,
        {
          model: 'gpt-3.5-turbo-instruct',
          prompt: prompt,
          max_tokens: 200,
          temperature: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("response.data.choices[0].text.trim()", response.data.choices[0].text.trim())

      const extractedDetails = JSON.parse(response.data.choices[0].text.trim());
      return extractedDetails;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to extract review details');
    }
  }

  async processReview(text) {
    console.log("🚀 ~ processReview ~ processReview ~ text:", text)
    try {
      // Step 1: Check for NSFW content
      const nsfwCheck = await this.checkNSFW(text);
      console.log("🚀 ~ processReview ~ processReview ~ nsfwCheck:", nsfwCheck)
      const isSafe = nsfwCheck.safe;

      if (!isSafe) {
        console.log('NSFW content detected. Skipping tag generation.');
        return {
          success: false,
          message: 'Review contains NSFW content. Tag generation skipped.',
          categories: nsfwCheck.categories,
        };
      }

      // Step 2: Extract review details
      const reviewBreakdown = await this.extractReviewDetails(text);
      console.log('Extracted Review Details:', reviewBreakdown);

      // Step 3: Generate tags if the content is safe
      if (reviewBreakdown['ReviewDescription'] != '') {
        const tags = await  generateTags.generateTags(
          reviewBreakdown['ReviewDescription']
        );
        console.log('Generated Tags:', tags);
        return {
          success: true,
          message: 'Review processed successfully',
          reviewBreakdown,
          tags,
        };
      }
      return {
        success: true,
        message: 'Review processed successfully',
        reviewBreakdown,
      };
    } catch (error) {
      console.error('Error processing review:', error);
      throw new Error('Failed to process the review');
    }
  }
}

module.exports = new processReview();
