import React, { useState } from 'react';
import { CustomButton } from '../../components';

const Reviews = ({ reviews, address }) => {
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
      userId: address || '0x000...000',
      userName: 'Anonymous',
      userLogo: '/api/placeholder/30/30',
      text: newReview.text,
      rating: newReview.rating,
      attestation: 'Not Verified',
      projectsBuilt: []
    };

    // In a real app, you would call a function to add the review to your backend/contract
    // For now, this is just a placeholder
    console.log('Review added:', reviewToAdd);

    // Reset form
    setNewReview({ text: '', rating: 5 });
    setShowReviewForm(false);
  };

  return (
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
  );
};

export default Reviews;