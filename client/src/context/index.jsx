import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import React, { useContext, createContext, useState, act } from 'react';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { activate, deactivate, account } = useWeb3React();

  // const CoinbaseWallet = new WalletLinkConnector({
  //   url: `https://sepolia.base.org`,
  //   appName: 'DecentralEyes',
  //   supportedChainIds: [84532],
  // });

  // console.log('COinbase Wallet- ', CoinbaseWallet);

  const Injected = new InjectedConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
  });

  const connectWallet = async (type) => {
    try {
      activate(Injected);
    } catch (error) {
      console.error('Wallet Connection Error:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    deactivate;
  };

  console.log('Account - ', account);
  return (
    <StateContext.Provider
      value={{
        address: account,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
