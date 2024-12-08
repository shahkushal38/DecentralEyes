// DisplayCampaigns.jsx
import React, { useEffect, useState } from 'react';
// import { useNavigation } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { getAllTools } from '../abi/index';
import { getWalletAddress } from '../context/CoinBaseWallet';
import { useNavigate } from 'react-router-dom';
const DisplayCampaigns = ({ title }) => {
  const address = getWalletAddress();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigate = (tool) => {
    // Navigate to details page with the full tool data
    console.log('state', tool.score);

    navigate(`/campaign-details/1`, {
      state: {
        id: Number(tool.id),
        name: tool.name,
        description: tool.description,
        image: tool.image,
        repoLink: tool.repoLink,
        docsLink: tool.docsLink,
        socials: tool.socials.map((s) => ({
          socialType: s.socialType,
          url: s.url,
        })),
        projects: tool.projects.map((p) => ({
          name: p.name,
          link: p.link,
        })),
        keywords: Object.values(tool.keywords),
        score: Number(tool.score),
        reviewCount: Number(tool.reviewCount),
        totalAttested: Number(tool.totalAttested),
        exists: tool.exists,
        owner: tool.owner,
      },
    });
  };

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true);
      const fetchedTools = await getAllTools();
      setTools(fetchedTools);
      setIsLoading(false);
    };

    fetchTools();
  }, []);

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({tools.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[20px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && tools.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No tools available yet
          </p>
        )}

        {!isLoading &&
          tools.length > 0 &&
          tools.map((tool) => (
            <FundCard
              key={Number(tool.id)}
              id={Number(tool.id)}
              name={tool.name}
              description={tool.description}
              image={tool.image}
              score={Number(tool.score)}
              handleClick={() => handleNavigate(tool)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
