import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getReviewsForTool } from '../abi';
import { loader } from '../assets';
import { getWalletAddress } from '../context/CoinBaseWallet';
import { CustomButton, Loader, CountBox } from '../components'; // Assuming these exist
import profileLogo from "../assets/profile.svg";
const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const address = getWalletAddress();

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    text: '',
    rating: '',
    githubLink: '',
  });

  // Ensure the tool exists
  if (!state || !state.id) {
    console.error('Tool not found');
    return (
      <div className="text-white p-4">
        <h1>Tool not found</h1>
      </div>
    );
  }

  const {
    id,
    name,
    description,
    image,
    repoLink,
    docsLink,
    socials,
    projects,
    keywords,
    score,
    reviewCount,
    totalAttested,
    owner,
  } = state;

  // Fetch reviews from the contract
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const fetchedReviews = await getReviewsForTool(id);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
      setIsLoadingReviews(false);
    };
    fetchReviews();
  }, [id]);

  const ratingOutOf10 = score;

  const handleRatingChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers with up to 1 decimal place
    if (value === '' || /^\d*\.?\d{0,1}$/.test(value)) {
      setNewReview((prev) => ({ ...prev, rating: value }));
    }
  };

  const handleAddReview = () => {
    // Just a placeholder for the old form logic
    // In real scenario, you'd integrate contract calls here
    if (!newReview.text.trim()) {
      alert('Please enter a review text');
      return;
    }

    const ratingNum = parseFloat(newReview.rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      alert('Please enter a valid rating between 0 and 5');
      return;
    }

    if (
      newReview.githubLink &&
      !newReview.githubLink.startsWith('https://github.com/')
    ) {
      alert('Please enter a valid GitHub URL');
      return;
    }

    // After verification, you'd typically send to the contract
    // For now, we'll just close the form
    setNewReview({ text: '', rating: '', githubLink: '' });
    setShowReviewForm(false);
  };

  return (
    <div>
      {isLoadingReviews && <Loader />}

      {/* Top Section */}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={image || '/api/placeholder/600/300'}
            alt="tool"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            {/* Rating bar based on 5 stars scale */}
            <div
              className="absolute h-full bg-[#4acd8d]"
              style={{
                width: `${(ratingOutOf10 / 5) * 100}%`,
                maxWidth: '100%',
              }}
            ></div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          {/* CountBoxes */}
          <CountBox title="Rating" value={`${ratingOutOf10.toFixed(1)}/10`} />
          <CountBox title="Review Count" value={reviewCount} />
          <CountBox title="Attested Reviews" value={totalAttested} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        {/* Left Section */}
        <div className="flex-[2] flex flex-col gap-[40px]">

          {/* Creator Section */}
          <div className="bg-[#1c1c24] p-6 rounded-[10px]">
            <h4 className="font-semibold text-lg text-white">
              {name || 'Unknown Owner'}
            </h4>
            <p className="mt-2 text-sm text-gray-400">
              {description}
            </p>
            <div className="mt-4">
              {repoLink && (
                <div className="mt-2">
                  <span className="text-white font-semibold text-sm">Repository: </span>
                  <a
                    href={repoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8c6dfd] hover:underline text-sm break-all"
                  >
                    {repoLink}
                  </a>
                </div>
              )}
              {docsLink && (
                <div className="mt-2">
                  <span className="text-white font-semibold text-sm">Documentation: </span>
                  <a
                    href={docsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8c6dfd] hover:underline text-sm break-all"
                  >
                    {docsLink}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Socials Section (New) */}
          {socials && socials.length > 0 && (
            <div className="bg-[#1c1c24] p-6 rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Socials</h4>
              <ul className="mt-4 list-none space-y-2">
                {socials.map((social, index) => (
                  <li key={index}>
                    <span className="text-white font-semibold">{social.socialType}: </span>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8c6dfd] hover:underline break-all"
                    >
                      {social.url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects Section (New) */}
          {projects && projects.length > 0 && (
            <div className="bg-[#1c1c24] p-6 rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Projects</h4>
              <div className="mt-[20px] flex flex-col gap-6">
                {projects.map((project, index) => (
                  <div key={index} className="bg-[#13131a] rounded-[10px] p-4">
                    {project.link && (
                      <p className="mt-2 font-epilogue text-[14px] text-[#8c6dfd] hover:underline">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          {project.link}
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Section (New) */}
          {keywords && keywords.length > 0 && (
            <div className="bg-[#1c1c24] p-6 rounded-[10px]">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Keywords</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-sm bg-[#2c2c35] text-white rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-[#1c1c24] p-6 rounded-[10px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">
                User Reviews
              </h4>
              <CustomButton
                btnType="button"
                title="Add Review"
                styles="bg-[#8c6dfd] text-white py-2 px-4"
                handleClick={() => setShowReviewForm(!showReviewForm)}
              />
            </div>

            {showReviewForm && (
              <div className="bg-[#13131a] rounded-[10px] p-6 mb-6 shadow-lg">
                <textarea
                  className="w-full bg-[#1c1c24] text-white p-4 rounded-[10px] mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#8c6dfd]"
                  placeholder="Write your review here..."
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, text: e.target.value }))
                  }
                  rows="4"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2 text-[14px]">
                      Rating
                    </label>
                    <div className="flex items-center">
                      <input
                        type="text"
                        className="bg-[#1c1c24] text-white p-2 rounded-lg w-24"
                        placeholder="2.5"
                        value={newReview.rating}
                        onChange={handleRatingChange}
                      />
                      <span className="ml-2 text-[#4acd8d]">/10</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-[14px]">
                      GitHub Link
                    </label>
                    <input
                      type="url"
                      className="w-full bg-[#1c1c24] text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8c6dfd]"
                      placeholder="https://github.com/username/repo"
                      value={newReview.githubLink}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          githubLink: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <CustomButton
                  btnType="button"
                  title="Submit Review"
                  styles="w-full mt-4 bg-[#8c6dfd] text-white py-3"
                  handleClick={handleAddReview}
                />
              </div>
            )}

            {isLoadingReviews && (
              <div className="flex justify-center">
                <img src={loader} alt="Loading..." className="w-8 h-8" />
              </div>
            )}

            {!isLoadingReviews && reviews.length === 0 && (
              <p className="text-[#808191]">No reviews yet.</p>
            )}

            {!isLoadingReviews && reviews.length > 0 && (
              <div className="space-y-6">
                {reviews.map((review, index) => {
                  const reviewRatingOutOf10 = (Number(review.rating) / 10) * 10;
                  return (
                    <div
                      key={index}
                      className="bg-[#13131a] rounded-[10px] p-6 border border-[#3a3a43]"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={profileLogo || '/assets/profile.svg'}
                          alt="user"
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#8c6dfd]"
                        />
                        <div>
                          <h5 className="font-epilogue font-semibold text-[16px] text-white">
                            {review.userId}
                          </h5>
                          {review.githubLink && (
                            <a
                              href={review.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4acd8d] hover:underline text-[14px]"
                            >
                              View GitHub
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-[#808191] mb-4">{review.text}</p>

                      {/* Rating and Attestation */}
                      <div className="flex justify-between items-center border-t border-[#3a3a43] pt-4">
                        <div className="flex space-x-4">
                          <div>
                            <span className="text-white mr-2 text-[14px]">Rating:</span>
                            <span className="text-[#4acd8d]">{reviewRatingOutOf10.toFixed(1)}/10</span>
                          </div>
                          <div>
                            <span className="text-white mr-2 text-[14px]">
                              Attestation:
                            </span>
                            <span
                              className={
                                'px-2 py-1 rounded-full text-[12px] ' +
                                (review.attestation === 'Verified'
                                  ? 'bg-[#4acd8d] text-white'
                                  : 'bg-[#3a3a43] text-[#808191]')
                              }
                            >
                              {review.attestation}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Keywords if any */}
                      {review.reviewKeywords && review.reviewKeywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {review.reviewKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-[#2c2c35] text-white rounded-full"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Section: Statistics */}
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Statistics</h4>   
          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <div className="w-full flex flex-col gap-[30px]">
              {/* Overall Rating */}
              <div className="flex flex-col">
                <h4 className="font-epilogue font-semibold text-[14px] text-white">Overall Rating</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">
                  Based on {reviewCount} reviews
                </p>
                <div className="mt-[10px] flex items-center gap-2">
                  <span className="text-[24px] text-[#4acd8d] font-bold">{ratingOutOf10.toFixed(1)}</span>
                  <div className="flex-1">
                    <div className="w-full bg-[#3a3a43] rounded-full h-2.5">
                      <div 
                        className="bg-[#4acd8d] h-2.5 rounded-full" 
                        style={{ width: `${(ratingOutOf10 / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Projects */}
              <div className="flex flex-col">
                <h4 className="font-epilogue font-semibold text-[14px] text-white">Total Projects</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[24px] text-[#4acd8d]">
                  {projects ? projects.length.toLocaleString() : 0}
                </p>
              </div>

              {/* Attested Reviews */}
              <div className="flex flex-col">
                <h4 className="font-epilogue font-semibold text-[14px] text-white">Attested Reviews</h4>
                <p className="mt-[4px] font-epilogue font-normal text-[24px] text-[#4acd8d]">
                  {totalAttested}
                </p>
              </div>

              {docsLink && (
                <CustomButton 
                  btnType="button"
                  title="View Documentation"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={() => window.open(docsLink, '_blank')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
