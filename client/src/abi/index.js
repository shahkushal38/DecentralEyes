import { ethers } from 'ethers';
import contractABI from './DecentralEyesAbi.json';

const contractAddress = '0xc1eF4E329F4A15b22fa4A88aC7ea6113609262fd';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
export const getContract = async () => {
  // if (!window.ethereum) {
  //   alert("Please install MetaMask to use this feature.");
  //   return null;
  // }

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  const APP_NAME = 'DecentralEyes';
  const APP_LOGO_URL = 'https://example.com/logo.png'; // Replace with your app logo
  const RPC_URL =
    'https://base-sepolia.g.alchemy.com/v2/V6dIUMUfsHD4iyTK4sXJkOxQzZ8RA_mt'; // Replace with your JSON-RPC provider
  const DEFAULT_CHAIN_ID = 84532; // Ethereum Mainnet

  // Initialize the Coinbase Wallet SDK
  const coinbaseWallet = new createCoinbaseWalletSDK({
    appName: APP_NAME,
    appLogoUrl: APP_LOGO_URL,
    darkMode: false,
  });
  

  // Create a new EIP-1193 provider from Coinbase Wallet SDK
  const ethereum = coinbaseWallet.getProvider(RPC_URL, DEFAULT_CHAIN_ID);

  // 
  // With ethers v6, use BrowserProvider to wrap the Coinbase provider
  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return contract;
};

export const addTool = async (image, repoLink, docsLink, socials) => {
  try {
    const contract = await getContract();
    if (!contract) return;

    const tx = await contract.addTool(image, repoLink, docsLink, socials);
    console.log("Transaction submitted:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed!");
  } catch (error) {
    console.error("Error adding tool:", error);
  }
};


export const submitReview = async (toolId, score, comment, projectLink, reviewKeywords, nullifierId, isAttested, attestationId) => {
  try {
    const contract = await getContract();
    if (!contract) return;

    const tx = await contract.submitReview(toolId, score, comment, projectLink, reviewKeywords, nullifierId, isAttested, attestationId);
    console.log("Review submitted:", tx.hash);
    await tx.wait();
    console.log("Review confirmed!");
  } catch (error) {
    console.error("Error submitting review:", error);
  }
};

export const getAllTools = async () => {
  try {
    console.log("Fetching tools...");
    const contract = await getContract();
    if (!contract) return [];

    console.log("🚀 ~ getAllTools ~ contract:", contract )
    const allTools = await contract.listAllTools();
    console.log("🚀 ~ getAllTools ~ allTools:", allTools)
    const owner = await contract.owner();
    console.log("🚀 ~ getAllTools ~ owner:", owner)

    // allTools is an array of Tool structs; we can return them directly
    // or map them to a JS object with all fields.
    const mappedTools = allTools.map(tool => {
      return {
        id: Number(tool.id),
        name: tool.name,
        description: tool.description,
        image: tool.image,
        repoLink: tool.repoLink,
        docsLink: tool.docsLink,
        socials: tool.socials.map(s => ({
          socialType: s.socialType,
          url: s.url
        })),
        projects: tool.projects.map(p => ({
          creatorId: p.creatorId,
          creatorGithubProfile: p.creatorGithubProfile,
          repoUrl: p.repoUrl
        })),
        keywords: tool.keywords,
        score: Number(tool.score),
        reviewCount: Number(tool.reviewCount),
        totalAttested: Number(tool.totalAttested),
        exists: tool.exists,
        // owner: owner // Contract-level owner
      };
    });

    console.log("Fetched tools:", mappedTools);
    return mappedTools;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
};


export const getReviewsForTool = async (toolId) => {
  try {
    const contract = await getContract();
    const reviews = await contract.getAllReviewsForTool(toolId);
    // Map reviews to desired format if needed
    const mappedReviews = reviews.map((review) => ({
      userId: review.reviewer,
      userName: 'Anonymous',
      userLogo: '/api/placeholder/30/30',
      text: review.comment,
      rating: Number(review.score)/2, // convert from 1-10 to 1-5 if desired
      githubLink: review.projectLink,
      attestation: review.isAttested ? 'Verified' : 'Not Verified',
      projectsBuilt: []
    }));

    return mappedReviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};
