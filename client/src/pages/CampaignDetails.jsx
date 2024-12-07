import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';

import Creator from './tool-components/Creator';
import ProofOfConcept from './tool-components/Proof';
import SmartContracts from './tool-components/SmartCon';
import Reviews from './tool-components/Reviews';
import Statistics from './tool-components/Stats';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState(state.reviews || []);

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="tool"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${(state.rating / 5) * 100}%`,
                maxWidth: '100%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Rating" value={`${state.rating}/5.0`} />
          <CountBox
            title="Smart Contracts"
            value={state.smartContracts?.length || 0}
          />
          <CountBox title="Review Count" value={state.reviews?.length || 0} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <Creator
            owner={state.owner}
            description={state.description}
            link={state.link}
          />
          <ProofOfConcept proofOfConcept={state.proofOfConcept} />
          <SmartContracts smartContracts={state.smartContracts} />
          <Reviews reviews={reviews} address={address} />
        </div>

        <div className="flex-1">
          <Statistics state={state} reviews={reviews} />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
