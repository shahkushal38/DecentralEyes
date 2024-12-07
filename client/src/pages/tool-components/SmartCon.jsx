import React, { useState } from 'react';
import { CustomButton } from '../../components';

const SmartContracts = ({ smartContracts }) => {
  const [expandedContract, setExpandedContract] = useState(null);

  const toggleAttestations = (index) => {
    setExpandedContract(expandedContract === index ? null : index);
  };

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
            
            <div className="mt-4 border-t border-[#3a3a43] pt-4">
              <div className="flex justify-between items-center">
                <span className="font-epilogue text-[14px] text-white">Attestations</span>
                <CustomButton 
                  btnType="button"
                  title={expandedContract === index ? "Show Less" : "View More"}
                  styles="bg-[#8c6dfd] py-2 px-4 text-sm"
                  handleClick={() => toggleAttestations(index)}
                />
              </div>

              {expandedContract === index && (
                <div className="mt-4 space-y-4">
                  {contract.attestations ? (
                    contract.attestations.map((attestation, attIndex) => (
                      <div key={attIndex} className="bg-[#13131a] rounded-[10px] p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-epilogue text-[14px] text-white">{attestation.type}</p>
                            <p className="mt-1 font-epilogue text-[12px] text-[#808191]">
                              By: {attestation.attester}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[12px] ${
                            attestation.status === 'Verified' 
                              ? 'bg-[#4acd8d] text-white' 
                              : 'bg-[#3a3a43] text-[#808191]'
                          }`}>
                            {attestation.status}
                          </span>
                        </div>
                        {attestation.details && (
                          <p className="mt-2 font-epilogue text-[13px] text-[#808191]">
                            {attestation.details}
                          </p>
                        )}
                        {attestation.date && (
                          <p className="mt-2 font-epilogue text-[12px] text-[#808191]">
                            Date: {attestation.date}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="font-epilogue text-[14px] text-[#808191]">No attestations available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmartContracts;