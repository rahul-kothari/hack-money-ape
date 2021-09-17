import React from 'react';
import './App.css';
import Layout from './components/Layout';
import LoadingComponent from './components/LoadingComponent';
import { Symfoni } from "./hardhat/SymfoniContext";


function App() {
  return (
    <div className="App">
      <Symfoni autoInit={false} loadingComponent={<LoadingComponent/>}>
        <Layout/>
      </Symfoni>
    </div>
  );
}

export default App;
