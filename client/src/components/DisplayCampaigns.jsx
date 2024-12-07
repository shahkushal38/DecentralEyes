import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import FundCard from './FundCard';
import { loader } from '../assets';

const sampleTools = [
  {
    id: 1,
    title: "Hardhat",
    description: "lorem ipsum",
    image: "/api/placeholder/288/158",
    rating: 4.8,
    owner: "Nomic Labs",
    link:"www.xample.com",
    proofOfConcept: {
      description: "Complete development and testing environment",
      githubLink: "https://github.com/NomicFoundation/hardhat",
    },
    smartContracts: [
      {
        name: "HardhatToken",
        description: "ERC20 implementation with Hardhat",
        review: "Highly secure implementation with comprehensive testing suite",
        rating: 4.9
      },
      {
        name: "NFT Marketplace",
        description: "NFT trading platform",
        review: "Well-structured with good security practices",
        rating: 4.7
      }
    ],
    totalProjects: 15000,
    reviews: [
      {
        userId: "0x123...abc",
        userName: "Alex Dev",
        userLogo: "/api/placeholder/30/30",
        text: "Best tool for Ethereum development",
        rating: 5.0,
        attestation: "0xabc...123", // Ethereum Attestation Service ID
        projectsBuilt: ["DeFi Protocol", "NFT Platform"]
      },
      {
        userId: "0x456...def",
        userName: "Sarah Chain",
        userLogo: "/api/placeholder/30/30",
        text: "Excellent testing capabilities",
        rating: 4.7,
        attestation: "0xdef...456",
        projectsBuilt: ["DEX", "Lending Protocol"]
      }
    ]
  },
  // ... (other sample tools remain the same)
];

const DisplayCampaigns = ({ title, isLoading, tools = sampleTools }) => {
  const navigate = useNavigate();

  const handleNavigate = (tool) => {
    navigate(`/campaign-details/${tool.title}`, { state: tool })
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({tools.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[20px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && tools.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No tools available yet
          </p>
        )}

        {!isLoading && tools.length > 0 && tools.map((tool) => (
          <FundCard 
            key={uuidv4()}
            {...tool}
            handleClick={() => handleNavigate(tool)}
          />
        ))}
      </div>
    </div>
  )
}

export default DisplayCampaigns;