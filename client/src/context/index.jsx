import React, { useContext, createContext, useState } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xf59A1f8251864e1c5a6bD64020e3569be27e6AA9');
  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  
  const [walletType, setWalletType] = useState(null);
  
  // Wallet connection methods
  const connectMetamask = useMetamask();
  
  const connectCoinbase = async () => {
    try {
      // Check if Coinbase Wallet is available
      if (window.ethereum && window.ethereum.isCoinbaseWallet) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletType('coinbase');
        return true;
      }
      
      // If Coinbase Wallet extension is not installed, prompt to install
      window.open('https://www.coinbase.com/wallet', '_blank');
      return false;
    } catch (error) {
      console.error('Coinbase Wallet Connection Error:', error);
      return false;
    }
  };

  const connectWallet = async (type) => {
    try {
      if (type === 'metamask') {
        await connectMetamask();
        setWalletType('metamask');
      } else if (type === 'coinbase') {
        await connectCoinbase();
      } else {
        throw new Error('Unsupported wallet type');
      }
    } catch (error) {
      console.error('Wallet Connection Error:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    // Basic wallet disconnection
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
      setWalletType(null);
    }
  };

  return (
    <StateContext.Provider 
      value={{ 
        address: useAddress(), 
        contract, 
        createCampaign,
        connectWallet,
        disconnectWallet,
        walletType
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);