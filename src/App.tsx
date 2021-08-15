import React from 'react';
import './App.css';
import Layout from './components/Layout';
import {UseWalletProvider} from 'use-wallet';

function App() {
  return (
    <div className="App">
      <UseWalletProvider
      // TODO add walletconect as a configuration option with a specified rpc node
        chainId={5}
      >
        <Layout/>
      </UseWalletProvider>
    </div>
  );
}

export default App;
