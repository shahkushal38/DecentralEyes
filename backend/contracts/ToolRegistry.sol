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

  function getTool(uint256 toolId) public view returns (Tool memory) {
    return tools[toolId];
  }
}