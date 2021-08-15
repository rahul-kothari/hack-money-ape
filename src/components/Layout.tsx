import React from 'react'
import Head from './Head'
import NavBar from './NavBar'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import YtcCreator from '../components/YtcCreator';
import {data} from '../constants/goerli-constants';

// import Image from 'next/image'
import { Box, Container } from '@chakra-ui/react'
import CalculatorForm from '../features/calculator/component/CalculatorForm'

export default function Layout() {
  return (
    <div>
        <Router>
          <Head
            title='APY - Ape Predicting Yield'
            description='Token yield compounding using Element.fi and Balancer'
          />
          <Box minHeight="100vh" display="flex" flexDir="column" bg="white">
            <NavBar title='APY' />
            <Container maxW="xl" mt="15px" flex={1}>
              <Switch>
                  <Route path="/calculator">
                      <CalculatorForm 
                      tranches={
                          data.tranches.usdc
                      }
                      onSubmit = {async (values, formikHelpers) => {
                          alert(JSON.stringify(values));
                          return
                      }}
                      />
                  </Route>
                  <Route path="/creator">
                      <YtcCreator/>
                  </Route>
                  <Route path="/">
                    <div>Home</div>
                  </Route>
              </Switch>
            </Container>
          </Box>
        </Router>
    </div>
  )
}
