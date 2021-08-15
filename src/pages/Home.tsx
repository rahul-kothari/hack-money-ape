import Head from '../components/Head'
import NavBar from '../components/NavBar'
import YtcCreator from '../components/YtcCreator'
// import Image from 'next/image'
import { Box, Container, Text } from '@chakra-ui/react'
import Calculator from '../features/calculator/Calculator'
import CalculatorForm from '../features/calculator/component/CalculatorForm'
import {data} from '../constants/goerli-constants';

export default function Home() {
  return (
    <div>
      <Head
        title='APY - Ape Predicting Yield'
        description='Token yield compounding using Element.fi and Balancer'
      />
      <Box minHeight="100vh" display="flex" flexDir="column" bg="white">
        <NavBar title='APY' />
        <Container maxW="xl" mt="15px" flex={1}>
          {/* <YtcCreator /> */}
            {/* <Calculator/> */}
            <CalculatorForm 
              tranches={
                data.tranches.usdc
              }
              onSubmit = {async (values, formikHelpers) => {
                alert(JSON.stringify(values));
                return
              }}
            />
        </Container>
      </Box>
    </div>
  )
}
