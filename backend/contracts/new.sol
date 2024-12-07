// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToolReviewManager {
    address public owner;

    struct Project {
        string creatorId;
        string creatorGithubProfile;
        string repoUrl;
    }

    struct Social {
        string socialType; // e.g., "twitter", "instagram"
        string url;        // e.g., "https://twitter.com/tool"
    }

    struct Tool {
        uint256 id;
        string image;              // URL or CID of the tool’s image
        string repoLink;           // URL to code repository
        string docsLink;           // URL to documentation
        Social[] socials;          // Social presence
        Project[] projects;        // Projects associated with the tool
        string[] keywords;         // Keywords for filtering tools
        uint256 score;             // Average score for the tool
        uint256 reviewCount;       // Number of reviews
        uint256 totalAttested;     // Number of attested reviews
        bool exists;
    }

    struct Review {
        address reviewer;          // Reviewer's wallet address
        string nullifierId;        // Required nullifier ID for the review
        bool isAttested;           // Whether the review is attested
        string attestationId;      // Optional attestation ID
        uint8 score;               // Score (1-10)
        string comment;            // Textual comment
        string projectLink;        // Project link or null
        string[] reviewKeywords;   // Keywords associated with the review
    }

    // State variables
    uint256 public toolCount;
    uint256 public totalReviews;                     // Total number of reviews across all tools
    mapping(uint256 => Tool) public tools;           // toolId => Tool
    mapping(uint256 => Review[]) public toolReviews; // toolId => array of reviews

    // Events
    event ToolAdded(uint256 toolId);
    event ReviewSubmitted(uint256 toolId, address reviewer, uint8 score);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    // Add a new tool to the system
    function addTool(
        string memory _image,
        string memory _repoLink,
        string memory _docsLink,
        Social[] memory _socials
    ) external onlyOwner returns (uint256) {
        toolCount++;
        uint256 newToolId = toolCount;

        Tool storage t = tools[newToolId];
        t.id = newToolId;
        t.image = _image;
        t.repoLink = _repoLink;
        t.docsLink = _docsLink;

        // Add socials to the tool
        for (uint256 i = 0; i < _socials.length; i++) {
            Social memory social = _socials[i];
            t.socials.push(Social({ socialType: social.socialType, url: social.url }));
        }

        t.score = 0;                 // Default score is 0
        t.reviewCount = 0;
        t.totalAttested = 0;         // Default attested review count is 0
        t.exists = true;

        emit ToolAdded(newToolId);
        return newToolId;
    }

    // Submit a review for a tool
    function submitReview(
        uint256 _toolId,
        uint8 _score,
        string memory _comment,
        string memory _projectLink,
        string[] memory _reviewKeywords,
        string memory _nullifierId,
        bool _isAttested,
        string memory _attestationId
    ) external {
        require(tools[_toolId].exists, "Tool does not exist");
        require(_score >= 1 && _score <= 10, "Score must be 1-10");
        require(bytes(_nullifierId).length > 0, "Nullifier ID is required");

        Tool storage t = tools[_toolId];

        // Add review keywords to tool's keywords
        for (uint256 i = 0; i < _reviewKeywords.length; i++) {
            t.keywords.push(_reviewKeywords[i]);
        }

        // Calculate adjusted score
        uint256 adjustedScore = (_score * 80) / 100; // 80% of user's rating
        if (_isAttested) {
            adjustedScore += 2; // Add 20% bonus for attested review
            t.totalAttested++;
        }

        // Update the tool's average score
        t.reviewCount++;
        t.score = ((t.score * (t.reviewCount - 1)) + adjustedScore) / t.reviewCount;

        // Add project data to the tool's projects array
        if (bytes(_projectLink).length > 0) {
            t.projects.push(Project({
                creatorId: "",
                creatorGithubProfile: "",
                repoUrl: _projectLink
            }));
        }

        // Add the review to the reviews array
        toolReviews[_toolId].push(Review({
            reviewer: msg.sender,
            nullifierId: _nullifierId,
            isAttested: _isAttested,
            attestationId: _isAttested ? _attestationId : "",
            score: _score,
            comment: _comment,
            projectLink: bytes(_projectLink).length > 0 ? _projectLink : "",
            reviewKeywords: _reviewKeywords
        }));

        // Increment total reviews
        totalReviews++;

        emit ReviewSubmitted(_toolId, msg.sender, _score);
    }

    // Get all reviews for a specific tool
    function getAllReviewsForTool(uint256 _toolId) external view returns (Review[] memory) {
        require(tools[_toolId].exists, "Tool does not exist");
        return toolReviews[_toolId];
    }

    // Get all tools with all details
    function listAllTools() external view returns (Tool[] memory) {
        Tool[] memory allTools = new Tool[](toolCount);
        for (uint256 i = 1; i <= toolCount; i++) {
            allTools[i - 1] = tools[i];
        }
        return allTools;
    }

    // Retrieve specific tool information including socials and projects
    function getToolInfo(uint256 _toolId) external view returns (
        string memory image,
        string memory repoLink,
        string memory docsLink,
        Social[] memory socials,
        Project[] memory projects,
        string[] memory keywords,
        uint256 score,
        uint256 reviewCount,
        uint256 totalAttested
    ) {
        require(tools[_toolId].exists, "Tool does not exist");
        Tool storage t = tools[_toolId];
        return (
            t.image,
            t.repoLink,
            t.docsLink,
            t.socials,
            t.projects,
            t.keywords,
            t.score,
            t.reviewCount,
            t.totalAttested
        );
    }

    // Get total number of tools
    function getTotalToolCount() external view returns (uint256) {
        return toolCount;
    }

    // Get total number of reviews across all tools
    function getTotalReviewCount() external view returns (uint256) {
        return totalReviews;
    }
}
