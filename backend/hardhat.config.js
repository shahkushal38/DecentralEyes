/** @type import('hardhat/config').HardhatUserConfig */


// require('dotenv').config({path:__dirname+'.env'})
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY

console.log(PRIVATE_KEY)
module.exports = {
    solidity: "0.8.0",
    networks: {
        // goerli: {
        //     url: process.env.GOERLI_RPC_URL,
        //     accounts: [process.env.PRIVATE_KEY],
        // },
        // polygon_mumbai: {
        //   url: POLYGON_RPC_URL,
        //   accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
        //   chainId: 80002,
        // },

// Network name
// Base Sepolia Testnet
// Block explorer URL
// https://sepolia.basescan.org

        sepolia_base: {
          url: "https://sepolia.base.org",
          accounts: [PRIVATE_KEY],
          chainId: 84532,
        }

    },
};


// Base Sepolia deployment addresses

// toolRegistry - 0x6DC209410F004F092b8e9388D2ac2a19Fa9b6970
// userVerification - 0x2cf9d50207431a1b192173AAacc4Fcc315bD51B1
// ReviewManager - 0x649A5dD5fd26174eF1693CC7523C1023Eb93F9e7

// ["https://example.com/image.png",["blockchain","solidity","tools"],"https://github.com/example/repo","https://example.com/docs",[["Twitter","https://twitter.com/example",[]],["GitHub","https://github.com/example",[]]],[[],[["0x1234567890abcdef1234567890abcdef12345678","https://github.com/dev1","https://github.com/example/project1"]]]]