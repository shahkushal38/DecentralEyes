import React from 'react';

const ProofOfConcept = ({ proofOfConcept }) => {
  return (
    <div>
      <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Proof of Concept</h4>
      <div className="mt-[20px]">
        <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
          {proofOfConcept?.description}
        </p>
        <a 
          href={proofOfConcept?.githubLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 inline-block font-epilogue text-[#8c6dfd] hover:underline"
        >
          View on GitHub
        </a>
      </div>
    </div>
  );
};

export default ProofOfConcept;