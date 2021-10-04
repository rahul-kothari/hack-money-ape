import React, { useEffect } from 'react';
import Layout from './components/Layout';
import LoadingComponent from './components/LoadingComponent';
import { Symfoni } from "./hardhat/SymfoniContext";
import { useRecoilState, useRecoilValue } from 'recoil';
import { elementAddressesAtom } from './recoil/element/atom';
import { fetchElementState } from './recoil/element/fetch';
import { chainNameAtom } from './recoil/chain/atom';

function App() {

  const [, setElementState] = useRecoilState(elementAddressesAtom);
  const chainName = useRecoilValue(chainNameAtom);

  // Get the element state file from their github repo
  // TODO this is reliant on the github repository
  useEffect(() => {
    fetchElementState(chainName).then((json) => {
      setElementState(json);
    })
  }, [])

  return (
    <div className="App">
      <Symfoni autoInit={false} loadingComponent={<LoadingComponent/>}>
          <Layout/>
      </Symfoni>
    </div>
  );
}

export default App;
