# OpenChain-AI-Analyst
This project is built for ETHIndia 2024


- Smart Contracts in contracts folder in backend
- Deploy using deploy.js in scripts
- Anon Adhar used.
- Akave (Storage) - Docker Instance should be running https://docs.akave.ai/js-docker-example-code
- npx hardhat run scripts/deploy.js --network sepolia_base
- .env in backend folder

- For deployed contract - MainDecentralEyes 
For testing in Remix
Testing Inputs1. addTool
text
Copy code
_image: "https://example.com/tool-image.png"
_repoLink: "https://github.com/example/tool-repo"
_docsLink: "https://example.com/tool-docs"
_socials: [["twitter", "https://twitter.com/tool"], ["instagram", "https://instagram.com/tool"]]
2. submitReview
text
Copy code
_toolId: 1
_score: 9
_comment: "Great tool for developers!"
_projectLink: "https://github.com/example/project" // Optional, can be ""
_reviewKeywords: ["useful", "innovative"]
_nullifierId: "NULLIFIER123456"
_isAttested: true
_attestationId: "ATT12345" // Optional if `_isAttested` is false
4. getToolInfo
_toolId: 1

- Imp: Compiled on Solidity version 0.8.26