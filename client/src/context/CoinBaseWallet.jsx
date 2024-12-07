import { createContext, useContext } from 'react';
import { createCoinbaseWalletSDK } from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';

const APP_NAME = 'DecentralEyes';
const APP_LOGO_URL = 'https://example.com/logo.png'; // Replace with your app logo
const ETH_JSONRPC_URL =
  'https://base-sepolia.g.alchemy.com/v2/V6dIUMUfsHD4iyTK4sXJkOxQzZ8RA_mt'; // Replace with your JSON-RPC provider
const CHAIN_ID = 84532; // Ethereum Mainnet

let walletProvider; // For Coinbase Wallet instance
let provider; // For ethers.js instance
let walletAddress = null;

const connectWallet = async () => {
  console.log('In connectWallet');
  try {
    // Initialize Coinbase Wallet SDK
    const walletSDK = new createCoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
    });

    // Create a provider and enable the wallet
    walletProvider = walletSDK.getProvider(ETH_JSONRPC_URL, CHAIN_ID);
    provider = new ethers.getDefaultProvider(walletProvider);

    // Request accounts
    const accounts = await walletProvider.request({
      method: 'eth_requestAccounts',
    });
    walletAddress = accounts[0]; // Save wallet address
    console.log('Connected Wallet Address:', walletAddress);

    return walletAddress;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    return null;
  }
};

const disconnectWallet = () => {
  if (walletProvider) {
    walletProvider.disconnect();
    walletProvider = null;
    provider = null;
    walletAddress = null;
    console.log('Disconnected wallet');
  }
};

const getWalletAddress = () => {
  console.log('In wallet Address');
  return walletAddress;
};

export { connectWallet, disconnectWallet, getWalletAddress };
