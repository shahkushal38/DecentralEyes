// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToolRegistry {
    struct Social {
        string socialType;
        string url;
        Project[] projects;
    }

    struct Project {
        address creatorId;
        string creatorGithubProfile;
        string repoUrl;
    }

    struct Tool {
        uint256 id;
        string image;
        string[] keywords;
        string repoLink;
        string docsLink;
        Social[] socials;
    }

    uint256 public toolCount;
    mapping(uint256 => Tool) public tools;

    function addTool(
        string memory _image,
        string[] memory _keywords,
        string memory _repoLink,
        string memory _docsLink,
        Social[] memory _socials
    ) public {
        toolCount++;
        tools[toolCount] = Tool({
            id: toolCount,
            image: _image,
            keywords: _keywords,
            repoLink: _repoLink,
            docsLink: _docsLink,
            socials: _socials
        });
    }
}

contract UserVerification {
    mapping(address => bool) public verifiedUsers;

    event UserVerified(address user);

    function verifyUser(address _user) public {
        // Add integration with Anon Aadhaar verification mechanism here
        // Placeholder for now:
        require(!verifiedUsers[_user], "User already verified");
        verifiedUsers[_user] = true;
        emit UserVerified(_user);
    }

    function isUserVerified(address _user) public view returns (bool) {
        return verifiedUsers[_user];
    }
}

contract ReviewManager {
    struct Review {
        uint256 toolId;
        address reviewer;
        uint8 rating;
        string comment;
    }

    ToolRegistry public toolRegistry;
    UserVerification public userVerification;

    mapping(uint256 => Review[]) public reviews;
    mapping(address => mapping(uint256 => bool)) public favorites;

    event ReviewSubmitted(uint256 toolId, address reviewer, uint8 rating, string comment);
    event ToolFavorited(uint256 toolId, address user);
    event ToolUnfavorited(uint256 toolId, address user);

    constructor(address _toolRegistry, address _userVerification) {
        toolRegistry = ToolRegistry(_toolRegistry);
        userVerification = UserVerification(_userVerification);
    }

    function submitReview(uint256 _toolId, uint8 _rating, string memory _comment) public {
        require(userVerification.isUserVerified(msg.sender), "User not verified");
        require(_rating >= 1 && _rating <= 10, "Rating must be between 1 and 10");

        reviews[_toolId].push(Review({
            toolId: _toolId,
            reviewer: msg.sender,
            rating: _rating,
            comment: _comment
        }));

        emit ReviewSubmitted(_toolId, msg.sender, _rating, _comment);
    }

    function favoriteTool(uint256 _toolId) public {
        require(userVerification.isUserVerified(msg.sender), "User not verified");
        require(!favorites[msg.sender][_toolId], "Tool already favorited");

        favorites[msg.sender][_toolId] = true;
        emit ToolFavorited(_toolId, msg.sender);
    }

    function unfavoriteTool(uint256 _toolId) public {
        require(favorites[msg.sender][_toolId], "Tool not favorited");

        favorites[msg.sender][_toolId] = false;
        emit ToolUnfavorited(_toolId, msg.sender);
    }

    function getReviews(uint256 _toolId) public view returns (Review[] memory) {
        return reviews[_toolId];
    }

    function isFavorited(uint256 _toolId, address _user) public view returns (bool) {
        return favorites[_user][_toolId];
    }
}
