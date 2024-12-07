import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Web3Provider } from '@ethersproject/providers';
import App from './App';
import './index.css';
import { Web3ReactProvider } from '@web3-react/core';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <App />
  </Router>
);
