import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { thirdweb } from '../assets';

const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { contract, address } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState(state.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    text: '',
    rating: 5,
  });

  const handleAddReview = () => {
    if (!newReview.text.trim()) {
      alert('Please enter a review text');
      return;
    }

    const reviewToAdd = {
      userId: address || '0x000...000', // Use connected wallet address
      userName: 'Anonymous', // Could be enhanced with user profile
      userLogo: '/api/placeholder/30/30',
      text: newReview.text,
      rating: newReview.rating,
      attestation: 'Not Verified', // Could be enhanced with actual attestation
      projectsBuilt: [] // Could be enhanced to allow user input
    };

    // Add the new review to the existing reviews
    const updatedReviews = [...reviews, reviewToAdd];
    setReviews(updatedReviews);
    
    // Reset form
    setNewReview({ text: '', rating: 5 });
    setShowReviewForm(false);
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="tool" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${(state.rating/5)*100}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox title="Rating" value={`${state.rating}/5.0`} />
          <CountBox title="Total Projects" value={state.totalProjects} />
          <CountBox title="Smart Contracts" value={state.smartContracts?.length || 0} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          {/* Creator Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">{state.owner}</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">Tool Developer</p>
              </div>
            </div>
          </div>

          {/* Proof of Concept Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Proof of Concept</h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                {state.proofOfConcept?.description}
              </p>
              <a 
                href={state.proofOfConcept?.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 inline-block font-epilogue text-[#8c6dfd] hover:underline"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {/* Smart Contracts Section */}
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Smart Contracts</h4>
            <div className="mt-[20px] flex flex-col gap-6">
              {state.smartContracts?.map((contract, index) => (
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

          <div>
        <div className="flex justify-between items-center">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">User Reviews</h4>
          <CustomButton 
            btnType="button"
            title="Add Review"
            styles="bg-[#8c6dfd]"
            handleClick={() => setShowReviewForm(!showReviewForm)}
          />
        </div>

        {/* Add Review Form */}
        {showReviewForm && (
          <div className="mt-[20px] bg-[#1c1c24] rounded-[10px] p-4">
            <textarea 
              className="w-full bg-[#13131a] text-white p-2 rounded-[10px] mb-4"
              placeholder="Write your review here..."
              value={newReview.text}
              onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
              rows="4"
            />
            <div className="flex items-center mb-4">
              <label className="mr-4 text-white">Rating:</label>
              <select 
                className="bg-[#13131a] text-white p-2 rounded-[10px]"
                value={newReview.rating}
                onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <CustomButton 
              btnType="button"
              title="Submit Review"
              styles="w-full bg-[#4acd8d]"
              handleClick={handleAddReview}
            />
          </div>
        )}

        {/* Reviews List */}
        <div className="mt-[20px] flex flex-col gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-[#1c1c24] rounded-[10px] p-4">
              <div className="flex items-center gap-3">
                <img 
                  src={review.userLogo} 
                  alt="user" 
                  className="w-[40px] h-[40px] rounded-full object-cover"
                />
                <div>
                  <h5 className="font-epilogue font-semibold text-[16px] text-white">{review.userName}</h5>
                  <p className="font-epilogue text-[12px] text-[#808191]">{review.userId}</p>
                </div>
              </div>
              <p className="mt-4 font-epilogue text-[14px] text-[#808191]">{review.text}</p>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-epilogue text-[14px] text-white">Rating:</span>
                  <span className="font-epilogue text-[14px] text-[#4acd8d]">{review.rating}/5.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-epilogue text-[14px] text-white">Attestation:</span>
                  <span className="font-epilogue text-[14px] text-[#8c6dfd]">{review.attestation}</span>
                </div>
              </div>
              {review.projectsBuilt && review.projectsBuilt.length > 0 && (
                <div className="mt-4">
                  <p className="font-epilogue text-[14px] text-white">Projects Built:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {review.projectsBuilt.map((project, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-[#13131a] rounded-full font-epilogue text-[12px] text-[#808191]"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
        </div>

        {/* Stats Card */}
        <div className="flex-1">
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
      </div>
    </div>
  )
}

export default CampaignDetails