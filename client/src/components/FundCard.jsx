// FundCard.jsx
import React from 'react';

const FundCard = ({ 
  id,
  image,
  score, // score is from 1 to 10
  handleClick
}) => {
  const rating = Number(score);

  return (
    <div 
      className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer hover:shadow-lg transition-shadow duration-300 p-4" 
      onClick={handleClick}
    >
      <img 
        src={image || '/api/placeholder/288/158'} 
        alt="tool" 
        className="w-full h-[158px] object-cover rounded-[15px] mb-4"
      />

      <h3 className="font-epilogue font-semibold text-[16px] text-white leading-[26px] break-words">
        Tool ID: {id}
      </h3>

      {/* Rating Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] text-white font-semibold">
            Rating: {rating}/10
          </span>
        </div>
        <div className="w-full bg-[#2c2c35] rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${(rating/10)*100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default FundCard;
