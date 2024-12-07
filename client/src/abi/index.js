import { ethers } from "ethers";
import contractABI from "./DecentralEyesAbi.json"

const contractAddress = "0x35731A7cb0e685FAe5279fcae3699aa85c1f5b2f";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask to use this feature.");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
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
      const contract = await getContract();
      if (!contract) return;
  
      const tools = await contract.listAllTools();
      console.log("Fetched tools:", tools);
      return tools;
    } catch (error) {
      console.error("Error fetching tools:", error);
      return [];
    }
  };

  
  export const getReviewsForTool = async (toolId) => {
    try {
      const contract = await getContract();
      if (!contract) return;
  
      const reviews = await contract.getAllReviewsForTool(toolId);
      console.log("Fetched reviews:", reviews);
      return reviews;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  };
  