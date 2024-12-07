import React from 'react';
import { CustomButton } from '../../components';

const Statistics = ({ state, reviews }) => {
  return (
    <div>
      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Statistics</h4>   

      <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
        <div className="w-full flex flex-col gap-[30px]">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-white">Overall Rating</h4>
            <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
              Based on {reviews.length} reviews
            </p>
            <div className="mt-[10px] flex items-center gap-2">
              <span className="text-[24px] text-[#4acd8d] font-bold">{state.rating}</span>
              <div className="flex-1">
                <div className="w-full bg-[#3a3a43] rounded-full h-2.5">
                  <div 
                    className="bg-[#4acd8d] h-2.5 rounded-full" 
                    style={{ width: `${(state.rating/5)*100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-white">Total Projects</h4>
            <p className="mt-[4px] font-epilogue font-normal text-[24px] text-[#4acd8d]">
              {state.totalProjects.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-white">Smart Contracts</h4>
            <p className="mt-[4px] font-epilogue font-normal text-[24px] text-[#4acd8d]">
              {state.smartContracts?.length || 0}
            </p>
          </div>

          <CustomButton 
            btnType="button"
            title="View Documentation"
            styles="w-full bg-[#8c6dfd]"
            handleClick={() => window.open(state.proofOfConcept?.githubLink, '_blank')}
          />
        </div>
      </div>
    </div>
  );
};

export default Statistics;