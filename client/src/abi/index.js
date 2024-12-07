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
  console.log("🚀 ~ getContract ~ contract:", contract)
  
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
          id: tool.id.toNumber(),
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
          score: tool.score.toNumber(),
          reviewCount: tool.reviewCount.toNumber(),
          totalAttested: tool.totalAttested.toNumber(),
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
  