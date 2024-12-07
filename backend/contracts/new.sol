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
        string socialType; // e.g., "instagram", "twitter"
        string url;        // e.g., "https://instagram.com/xyz"
        Project[] projects;
    }

    struct Tool {
        uint256 id;
        string image;              // URL or CID of the tool’s image
        string repoLink;           // URL to code repository
        string docsLink;           // URL to documentation
        Social[] socials;          // Social presence with associated projects
        Project[] projects;        // Projects associated with the tool
        string[] keywords;         // Keywords for filtering tools
        uint256 score;             // Average score for the tool
        uint256 reviewCount;       // Number of reviews
        bool exists;
    }

    struct Review {
        address reviewer;
        uint8 score;               // 1-10
        string comment;
        string projectLink;        // Project link from the reviewer
        string[] reviewKeywords;   // Keywords associated with the review
    }

    // State variables
    uint256 public toolCount;
    uint256 public totalReviews;                   // Total number of reviews across all tools
    mapping(uint256 => Tool) public tools;         // toolId => Tool
    mapping(uint256 => Review[]) public toolReviews; // toolId => array of reviews
    mapping(address => bool) public verifiedUsers; // track if a user is Aadhaar-verified
    mapping(address => uint256[]) public userReviews; // track all reviews submitted by a user

    // Events
    event ToolAdded(uint256 toolId);
    event UserVerified(address user);
    event ReviewSubmitted(uint256 toolId, address reviewer, uint8 score);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyVerifiedUser() {
        require(verifiedUsers[msg.sender], "User not verified");
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

        for (uint256 i = 0; i < _socials.length; i++) {
            t.socials.push(_socials[i]);
        }

        // Dynamic arrays are automatically initialized as empty
        t.score = 0;                 // Default score is 0
        t.reviewCount = 0;
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
        string memory _creatorId,
        string memory _creatorGithubProfile
    ) external onlyVerifiedUser {
        require(tools[_toolId].exists, "Tool does not exist");
        require(_score >= 1 && _score <= 10, "Score must be 1-10");

        Tool storage t = tools[_toolId];

        // Add review keywords to tool's keywords
        for (uint256 i = 0; i < _reviewKeywords.length; i++) {
            t.keywords.push(_reviewKeywords[i]);
        }

        // Calculate adjusted score
        uint256 adjustedScore = (_score * 80) / 100; // 80% of user's rating
        if (bytes(_projectLink).length > 0) {
            adjustedScore += 2; // Add 20% bonus for project link
        }

        // Update the tool's average score
        t.reviewCount++;
        t.score = ((t.score * (t.reviewCount - 1)) + adjustedScore) / t.reviewCount;

        // Add project data to the tool's projects array
        if (bytes(_projectLink).length > 0) {
            t.projects.push(Project({
                creatorId: _creatorId,
                creatorGithubProfile: _creatorGithubProfile,
                repoUrl: _projectLink
            }));
        }

        // Add the review to the reviews array
        toolReviews[_toolId].push(Review({
            reviewer: msg.sender,
            score: _score,
            comment: _comment,
            projectLink: _projectLink,
            reviewKeywords: _reviewKeywords
        }));

        // Increment total reviews
        totalReviews++;

        // Record the tool ID in user's review history
        userReviews[msg.sender].push(_toolId);

        emit ReviewSubmitted(_toolId, msg.sender, _score);
    }

    // Verify a user after off-chain Aadhaar verification
    function verifyUser(address _user) external onlyOwner {
        verifiedUsers[_user] = true;
        emit UserVerified(_user);
    }

    // Retrieve all reviews for a specific tool
    function getReviews(uint256 _toolId) external view returns (Review[] memory) {
        return toolReviews[_toolId];
    }

    // Retrieve basic tool information
    function getToolInfo(uint256 _toolId) external view returns (
        string memory image,
        string memory repoLink,
        string memory docsLink,
        string[] memory keywords,
        uint256 score,
        uint256 reviewCount,
        Project[] memory projects
    ) {
        require(tools[_toolId].exists, "Tool does not exist");
        Tool storage t = tools[_toolId];
        return (t.image, t.repoLink, t.docsLink, t.keywords, t.score, t.reviewCount, t.projects);
    }

    // Retrieve socials and projects of a given tool
    function getToolSocials(uint256 _toolId) external view returns (Social[] memory) {
        require(tools[_toolId].exists, "Tool does not exist");
        return tools[_toolId].socials;
    }

    // List all tools
    function listAllTools() external view returns (Tool[] memory) {
        Tool[] memory allTools = new Tool[](toolCount);
        for (uint256 i = 1; i <= toolCount; i++) {
            allTools[i - 1] = tools[i];
        }
        return allTools;
    }

    // List all reviews for a specific tool
    function listToolReviews(uint256 _toolId) external view returns (Review[] memory) {
        require(tools[_toolId].exists, "Tool does not exist");
        return toolReviews[_toolId];
    }

    // List all reviews submitted by a specific user
    function listUserReviews(address _user) external view returns (uint256[] memory) {
        return userReviews[_user];
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
