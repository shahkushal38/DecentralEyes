import React from 'react';

const SmartContracts = ({ smartContracts }) => {
  return (
    <div>
      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Smart Contracts</h4>
      <div className="mt-[20px] flex flex-col gap-6">
        {smartContracts?.map((contract, index) => (
          <div key={index} className="bg-[#1c1c24] rounded-[10px] p-4">
            <h5 className="font-epilogue font-semibold text-[16px] text-white">{contract.name}</h5>
            <p className="mt-2 font-epilogue text-[14px] text-[#808191]">{contract.description}</p>
            <div className="mt-4">
              <p className="font-epilogue text-[14px] text-white">Review:</p>
              <p className="mt-1 font-epilogue text-[14px] text-[#808191]">{contract.review}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-epilogue text-[14px] text-white">Rating:</span>
              <span className="font-epilogue text-[14px] text-[#4acd8d]">{contract.rating}/5.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartContracts;