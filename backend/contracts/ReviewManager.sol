// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import { ToolRegistry } from './ToolRegistry.sol'
import "./ToolRegistry.sol";
import "./UserVerification.sol";

contract ReviewManager {
  struct Review {
    uint256 toolId;
    address reviewer;
    uint8 rating;
    string comment;
    bool isAttested;  // New property for attestation status
    string attestationId;  // New property for attestation ID
  }

  ToolRegistry public toolRegistry;
  UserVerification public userVerification;

  mapping(uint256 => Review[]) public reviews;
  mapping(address => mapping(uint256 => bool)) public favorites;

  event ReviewSubmitted(
    uint256 toolId,
    address reviewer,
    uint8 rating,
    string comment
  );
  event ToolFavorited(uint256 toolId, address user);
  event ToolUnfavorited(uint256 toolId, address user);
  event ReviewAttested(uint256 toolId, address reviewer, string attestationId); // New event for attestation

  constructor(address _toolRegistry, address _userVerification) {
    toolRegistry = ToolRegistry(_toolRegistry);
    userVerification = UserVerification(_userVerification);
  }

  function submitReview(
    uint256 _toolId,
    uint8 _rating,
    string memory _comment,
    bool _isAttested,
    string memory _attestationId
  ) public {
    require(userVerification.isUserVerified(msg.sender), 'User not verified');
    require(_rating >= 1 && _rating <= 10, 'Rating must be between 1 and 10');

    reviews[_toolId].push(
      Review({
        toolId: _toolId,
        reviewer: msg.sender,
        rating: _rating,
        comment: _comment,
        isAttested: _isAttested,
        attestationId: _attestationId
      })
    );

    emit ReviewSubmitted(_toolId, msg.sender, _rating, _comment);
  }

  function favoriteTool(uint256 _toolId) public {
    require(userVerification.isUserVerified(msg.sender), 'User not verified');
    require(!favorites[msg.sender][_toolId], 'Tool already favorited');

    favorites[msg.sender][_toolId] = true;
    emit ToolFavorited(_toolId, msg.sender);
  }

  function unfavoriteTool(uint256 _toolId) public {
    require(favorites[msg.sender][_toolId], 'Tool not favorited');

    favorites[msg.sender][_toolId] = false;
    emit ToolUnfavorited(_toolId, msg.sender);
  }

  function getReviews(uint256 _toolId) public view returns (Review[] memory) {
    return reviews[_toolId];
  }

  function getAllToolIds() public view returns (uint256[] memory) {
    uint256[] memory toolIds = new uint256[](toolRegistry.toolCount());
    // for (uint256 i = 1; i <= toolRegistry.toolCount(); i++) {
    //   toolIds[i - 1] = toolRegistry.tools(i).id;
    // }
    return toolIds;
  }

  function getAllReviews() public view returns (Review[] memory) {
    uint256 totalReviewsCount;
    uint256[] memory toolIds = getAllToolIds();

    // Calculate the total number of reviews
    for (uint256 i = 0; i < toolIds.length; i++) {
      totalReviewsCount += reviews[toolIds[i]].length;
    }

    // Create a memory array to store all reviews
    Review[] memory allReviews = new Review[](totalReviewsCount);
    uint256 currentIndex;

    // Populate the array with all reviews
    for (uint256 i = 0; i < toolIds.length; i++) {
      Review[] memory toolReviews = reviews[toolIds[i]];
      for (uint256 j = 0; j < toolReviews.length; j++) {
        allReviews[currentIndex] = toolReviews[j];
        currentIndex++;
      }
    }

    return allReviews;
  }

  function isFavorited(
    uint256 _toolId,
    address _user
  ) public view returns (bool) {
    return favorites[_user][_toolId];
  }

  // Function to attest a review
  function attestReview(
    uint256 _toolId,
    uint256 _reviewIndex,
    string memory _attestationId
  ) public {
    Review storage review = reviews[_toolId][_reviewIndex];
    
    // Ensure the review exists and is not already attested
    require(!review.isAttested, "Review already attested");

    // Mark the review as attested and set the attestation ID
    review.isAttested = true;
    review.attestationId = _attestationId;

    emit ReviewAttested(_toolId, review.reviewer, _attestationId);
  }
}