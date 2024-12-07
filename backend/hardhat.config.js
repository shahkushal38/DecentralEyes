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

