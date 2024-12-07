import axios from 'axios';
// GitHub API URL
const GITHUB_API_URL = 'https://api.github.com/search/repositories';

const GITHUB_TOKEN = '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';

// Function to check if a word is present in a user's repositories
export const findWordInGitHub = async (username, word) => {
  try {
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
};
