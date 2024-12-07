// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToolReviewManager {
    address public owner;

    // Basic structures
    struct Project {
        string creatorId;
        string creatorGithubProfile;
        string repoUrl;
    }

    struct Social {
        string socialType; // e.g. "instagram", "twitter"
        string url;        // e.g. "https://instagram.com/xyz"
        Project[] projects;
    }

    struct Tool {
        uint256 id;
        string image;             // URL or CID of the tool’s image
        string repoLink;          // URL to code repository
        string docsLink;          // URL to documentation
        string[] keywords;        // keywords to filter tools
        Social[] socials;         // social presence with associated projects
        bool exists;
    }

    struct Review {
        address reviewer;
        uint8 score;              // 1-10
        string comment;
        string[] reviewKeywords;  // optional keywords for the review
    }

    // State variables
    uint256 public toolCount;
    mapping(uint256 => Tool) public tools;           // toolId => Tool
    mapping(uint256 => Review[]) public toolReviews; // toolId => array of reviews
    mapping(address => bool) public verifiedUsers;   // track if a user is Aadhaar-verified

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

    /**
     * @dev Owner adds a new tool to the system.
     * @param _image The image link or CID.
     * @param _repoLink The repository link for the tool.
     * @param _docsLink The documentation link for the tool.
     * @param _keywords The keywords for filtering this tool.
     * param _socials Social links and associated projects (passed as encoded data or done in multiple calls for simplicity).
     *
     * For simplicity in this example, the socials and projects might need multiple transactions or a more complex input method.
     * We will show a simple approach that allows adding socials separately.
     */

    function addTool(
        string memory _image,
        string memory _repoLink,
        string memory _docsLink,
        string[] memory _keywords
    ) external onlyOwner returns (uint256) {
        toolCount++;
        uint256 newToolId = toolCount;
        
        Tool storage t = tools[newToolId];
        t.id = newToolId;
        t.image = _image;
        t.repoLink = _repoLink;
        t.docsLink = _docsLink;
        for (uint256 i = 0; i < _keywords.length; i++) {
            t.keywords.push(_keywords[i]);
        }
        t.exists = true;
        
        emit ToolAdded(newToolId);
        return newToolId;
    }

    /**
     * @dev Add a social link and associated projects to a particular tool.
     * @param _toolId The tool's ID.
     * @param _socialType The type of social (e.g., "instagram").
     * @param _url The URL to the social page.
     * @param _creatorIds Array of creator IDs.
     * @param _creatorGithubProfiles Array of creator GitHub profiles.
     * @param _repoUrls Array of repository URLs for projects under this social link.
     *
     * All arrays must have the same length.
     */
    function addToolSocial(
        uint256 _toolId,
        string memory _socialType,
        string memory _url,
        string[] memory _creatorIds,
        string[] memory _creatorGithubProfiles,
        string[] memory _repoUrls
    ) external onlyOwner {
        require(tools[_toolId].exists, "Tool does not exist");
        // require(
        //     _creatorIds.length == _creatorGithubProfiles.length && 
        //     _creatorIds.length == _repoUrls.length,
        //     "Arrays length mismatch"
        // );

        Tool storage t = tools[_toolId];
        Social storage s = t.socials.push();
        s.socialType = _socialType;
        s.url = _url;

        for (uint256 i = 0; i < _creatorIds.length; i++) {
            Project memory p;
            p.creatorId = _creatorIds[i];
            p.creatorGithubProfile = _creatorGithubProfiles[i];
            p.repoUrl = _repoUrls[i];
            s.projects.push(p);
        }

        t.socials.push(s);
    }

    /**
     * @dev Owner verifies a user after an off-chain Aadhaar verification is done.
     * @param _user The address of the user who got verified.
     */
    function verifyUser(address _user) external onlyOwner {
        verifiedUsers[_user] = true;
        emit UserVerified(_user);
    }

    /**
     * @dev Verified user submits a review for a tool.
     * @param _toolId The ID of the tool to review.
     * @param _score The numeric score (1-10).
     * @param _comment A textual comment for the review.
     * @param _reviewKeywords Keywords associated with this review.
     */
    function submitReview(
        uint256 _toolId,
        uint8 _score,
        string memory _comment,
        string[] memory _reviewKeywords
    ) external {
        require(tools[_toolId].exists, "Tool does not exist");
        require(_score >= 0 && _score <= 10, "Score must be 0-10");

        Review memory r;
        r.reviewer = msg.sender;
        r.score = _score;
        r.comment = _comment;
            // Copy keywords to a temporary array in memory
    string[] memory tempKeywords = new string[](_reviewKeywords.length);
    for (uint256 i = 0; i < _reviewKeywords.length; i++) {
        tempKeywords[i] = _reviewKeywords[i];
    }

    // Push the review into the storage array
    toolReviews[_toolId].push(Review({
        reviewer: r.reviewer,
        score: r.score,
        comment: r.comment,
        reviewKeywords: tempKeywords
    }));

        emit ReviewSubmitted(_toolId, msg.sender, _score);
    }

    /**
     * @dev Retrieve the reviews of a given tool.
     * @param _toolId The ID of the tool.
     */
    function getReviews(uint256 _toolId) external view returns (Review[] memory) {
        return toolReviews[_toolId];
    }

    /**
     * @dev Retrieve basic tool information.
     * @param _toolId The ID of the tool.
     */
    function getToolInfo(uint256 _toolId) external view returns (
        string memory image,
        string memory repoLink,
        string memory docsLink,
        string[] memory keywords
    ) {
        require(tools[_toolId].exists, "Tool does not exist");
        Tool storage t = tools[_toolId];
        return (t.image, t.repoLink, t.docsLink, t.keywords);
    }

    /**
     * @dev Retrieve socials and projects of a given tool.
     * Note: This might be too large to return in one call if there are many socials/projects.
     */
    function getToolSocials(uint256 _toolId) external view returns (Social[] memory) {
        require(tools[_toolId].exists, "Tool does not exist");
        return tools[_toolId].socials;
    }

    // Additional functions for permissions, modifications, etc., can be added as needed.
}