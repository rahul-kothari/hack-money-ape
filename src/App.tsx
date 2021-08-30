import React from 'react';
import './App.css';
import {UseWalletProvider} from 'use-wallet';
import Layout from './components/Layout';

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
