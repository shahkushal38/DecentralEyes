// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToolRegistry {
  struct Project {
    address creatorId;
    string creatorGithubProfile;
    string repoUrl;
  }

  struct Social {
    string socialType;
    string url;
    Project[] projects;
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

  struct ToolInput {
    string image;
    string[] keywords;
    string repoLink;
    string docsLink;
    Social[] socials;
    Project[][] projectsPerSocial;
  }

  function addTool(ToolInput calldata toolInput) external {
    require(toolInput.keywords.length > 0, 'Keywords cannot be empty');
    require(
      toolInput.socials.length == toolInput.projectsPerSocial.length,
      'Mismatched socials and projects'
    );

    toolCount++;

        // Initialize the new Tool in storage
    Tool storage newTool = tools[toolCount];
    newTool.id = toolCount;

    // Store basic tool information
    _storeBasicToolInfo(
      newTool,
      toolInput.image,
      toolInput.repoLink,
      toolInput.docsLink,
      toolInput.keywords
    );

    // Store socials and their projects
    _storeSocials(newTool, toolInput.socials, toolInput.projectsPerSocial);
  }

  function _storeBasicToolInfo(
    Tool storage tool,
    string calldata _image,
    string calldata _repoLink,
    string calldata _docsLink,
    string[] calldata _keywords
  ) internal {
    tool.image = _image;
    tool.repoLink = _repoLink;
    tool.docsLink = _docsLink;

    for (uint256 i = 0; i < _keywords.length; i++) {
      tool.keywords.push(_keywords[i]);
    }
  }

  function _storeSocials(
    Tool storage tool,
    Social[] calldata _socials,
    Project[][] calldata _projectsPerSocial
  ) internal {
    for (uint256 i = 0; i < _socials.length; i++) {
      tool.socials.push();
      Social storage storedSocial = tool.socials[tool.socials.length - 1];
      storedSocial.socialType = _socials[i].socialType;
      storedSocial.url = _socials[i].url;

      for (uint256 j = 0; j < _projectsPerSocial[i].length; j++) {
        storedSocial.projects.push(_projectsPerSocial[i][j]);
      }
    }
  }

  // Retrieve a tool by its ID
  function getTool(uint256 toolId) external view returns (Tool memory) {
    require(toolId > 0 && toolId <= toolCount, 'Tool ID out of range');
    return tools[toolId];
  }
}
