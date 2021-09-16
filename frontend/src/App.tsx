import React from 'react';
import './App.css';
import Layout from './components/Layout';
import LoadingComponent from './components/LoadingComponent';
import { Symfoni } from "./hardhat/SymfoniContext";
import { UseWalletProvider } from 'use-wallet';


function App() {
  return (
    <div className="App">
	<Symfoni autoInit={true} loadingComponent={<LoadingComponent/>}>
    <UseWalletProvider>
      <Layout/>
    </UseWalletProvider>
	</Symfoni>
    </div>
  );
}

export default App;
