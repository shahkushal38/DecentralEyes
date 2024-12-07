import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getReviewsForTool } from '../abi'; // Ensure this is correctly imported
import { loader } from '../assets'; // If you have a loader asset

const CampaignDetails = () => {
  const { state } = useLocation(); // state should be the 'tool' object
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  console.log('state', state);
  // If the tool doesn't exist in state, you might want to handle that gracefully

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
  } = state;

  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoadingReviews(true);
      try {
        const fetchedReviews = await getReviewsForTool(id);
        console.log("🚀 ~ fetchReviews ~ fetchedReviews:", fetchedReviews)
        setReviews(fetchedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
      setIsLoadingReviews(false);
    };
    fetchReviews();
  }, [id]);

  // Convert score from a 1-10 scale to a percentage for a rating bar
  const ratingOutOf10 = Number(score);
  const ratingPercentage = (ratingOutOf10 / 10) * 100;

  return (
    <div className="text-white p-6 max-w-5xl mx-auto space-y-8">
      {/* Top Section: Image and Basic Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img
            src={image || '/api/placeholder/600/300'}
            alt="Tool"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="font-bold text-2xl">Tool ID: {id}</h2>
          <h1 className="font-bold text-4xl">{name}</h1>
          <p className="text-[#808191]">{description}</p>
          <p>
            <strong>Repo Link:</strong>{' '}
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all"
            >
              {repoLink}
            </a>
          </p>
          <p>
            <strong>Docs Link:</strong>{' '}
            <a
              href={docsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline break-all"
            >
              {docsLink}
            </a>
          </p>

          <div className="space-y-1">
            <p>
              <strong>Review Count:</strong> {reviewCount}
            </p>
            <p>
              <strong>Attested Reviews:</strong> {totalAttested}
            </p>
          </div>

          {/* Rating bar */}
          <div>
            <span className="text-sm font-semibold block mb-1">
              Rating: {ratingOutOf10}/10
            </span>
            <div className="w-full bg-[#2c2c35] rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${ratingPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Socials */}
      {socials && socials.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-xl">Socials</h3>
          <ul className="list-disc list-inside space-y-1 text-[#808191]">
            {socials.map((social, index) => (
              <li key={index}>
                <strong className="text-white">{social.socialType}:</strong>{' '}
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline break-all"
                >
                  {social.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-xl">Projects</h3>
          <ul className="list-disc list-inside space-y-4 text-[#808191]">
            {projects.map((project, index) => (
              <li key={index} className="bg-[#1c1c24] p-4 rounded-lg">
                <p>
                  <strong className="text-white">Creator ID:</strong>{' '}
                  {project.creatorId || 'N/A'}
                </p>
                <p>
                  <strong className="text-white">Creator GitHub:</strong>{' '}
                  {project.creatorGithubProfile || 'N/A'}
                </p>
                <p>
                  <strong className="text-white">Project Repo URL:</strong>{' '}
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline break-all"
                  >
                    {project.repoUrl}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {keywords && keywords.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-xl">Keywords</h3>
          <div className="flex flex-wrap gap-2">
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
      <div className="space-y-4">
        <h3 className="font-bold text-xl">Reviews</h3>
        {isLoadingReviews && (
          <div className="flex justify-center">
            <img src={loader} alt="Loading..." className="w-8 h-8" />
          </div>
        )}

        {!isLoadingReviews && reviews.length === 0 && (
          <p className="text-[#808191]">No reviews yet.</p>
        )}

        {!isLoadingReviews && reviews.length > 0 && (
          <div className="space-y-4">
            {reviews.map((review, index) => {
              const reviewRating = Number(review.rating);
              const reviewRatingPercentage = (reviewRating / 10) * 100;

              return (
                <div
                  key={index}
                  className="bg-[#1c1c24] p-4 rounded-lg space-y-2 border border-[#3a3a43]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-[#13131a] flex items-center justify-center">
                      <img
                        src={review.userLogo || '/api/placeholder/30/30'}
                        alt="user"
                        className="w-1/2 h-1/2 object-cover rounded-full"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="text-white font-semibold">
                        {review.userId}
                      </p>
                      {review.githubLink && (
                        <a
                          href={review.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 underline text-xs"
                        >
                          GitHub Project
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-[#808191]">{review.text}</p>

                  {/* Review rating */}
                  <div>
                    <span className="text-white text-sm font-semibold">
                      Rating: {reviewRating}/10
                    </span>
                    <div className="w-full bg-[#2c2c35] rounded-full h-2.5 mt-1">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${reviewRatingPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Attestation */}
                  <div>
                    <span className="text-white text-sm font-semibold mr-2">
                      Attestation:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        review.attestation === 'Verified'
                          ? 'bg-[#4acd8d] text-white'
                          : 'bg-[#3a3a43] text-[#808191]'
                      }`}
                    >
                      {review.attestation}
                    </span>
                  </div>

                  {/* Review Keywords if any */}
                  {review.reviewKeywords &&
                    review.reviewKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
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
  );
};

export default CampaignDetails;
