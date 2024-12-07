import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3Provider } from '@ethersproject/providers';
import { StateContextProvider } from './context';
import App from './App';
import './index.css';
import { Web3ReactProvider } from '@web3-react/core';

const root = ReactDOM.createRoot(document.getElementById('root'));

function getLibrary(provider) {
  console.log(' In library');
  return new Web3Provider(provider);
}

root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </Web3ReactProvider>
);
