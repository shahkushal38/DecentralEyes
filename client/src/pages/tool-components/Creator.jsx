import React from 'react';

const Creator = ({ owner, description, link }) => {
    return (
      <div className="p-4">
        
          <h4 className="font-semibold text-lg text-white">
            {owner}
          </h4>
          <p className="mt-2 text-sm text-gray-400">
            {description}
          </p>
        
      </div>
    );
  };
export default Creator;