// DisplayCampaigns.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { getAllTools } from '../abi/index';

const DisplayCampaigns = ({ title }) => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigate = (tool) => {
    // Navigate to details page with the full tool data
    navigate(`/campaign-details/${tool.id}`, { state: tool });
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
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && tools.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            No tools available yet
          </p>
        )}

        {!isLoading && tools.length > 0 && tools.map((tool) => (
          <FundCard 
            key={tool.id}
            id={tool.id}
            image={tool.image}
            score={tool.score}
            handleClick={() => handleNavigate(tool)}
          />
        ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
