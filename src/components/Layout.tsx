import React from 'react'
import Head from './Head'
import NavBar from './NavBar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import YtcCreator from '../components/YtcCreator';
import Template from './Template';

// import Image from 'next/image'
import { Box, Container } from '@chakra-ui/react'
import Home from '../pages/Home';
import CalculatorRoute from '../features/calculator/CalculatorRoute';
import SelectAsset from '../features/calculator/component/SelectAsset';
import {data} from '../constants/goerli-constants';

export default function Layout() {
  return (
    <div>
        {/* <Router>
          <Head
            title='APY - Ape Predicting Yield'
            description='Token yield compounding using Element.fi and Balancer'
          />
          <Box minHeight="100vh" display="flex" flexDir="column" bg="white">
            <NavBar title='APY' />
            <Container maxW="xl" mt="15px" flex={1}>
              <Switch>
                  <Route path="/calculator/:token">
                    <CalculatorRoute />
                  </Route>
                  <Route path="/calculator">
                    <SelectAsset basePath={'/calculator'} assets={data.tokens}/>
                  </Route>
                  <Route path="/creator">
                      <YtcCreator/>
                  </Route>
                  <Route path="/">
                      <Home/>
                  </Route>
              </Switch>
            </Container>
          </Box>
        </Router> */}
        <Template />
    </div>
  )
}
