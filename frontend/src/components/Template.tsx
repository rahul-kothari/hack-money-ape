import { Box, Flex } from '@chakra-ui/layout';
import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import { YTC } from './Pages/YTC';

interface Props {
}

export const Template: React.FC<Props> = (props: Props) => {
    return (
        <Flex
            bg="gray.100"
            flexDir="column"
            justify="space-between"
            minH="100vh"
        >
            <Header/>
            {/* <div id="body" className="p-5 mx-auto max-w-lg w-full flex-1"> */}
            <Box
                p={5}
                mx="auto"
                maxW="lg"
                w="full"
                flexGrow={1}
            >
                <Switch>
                    <Route path="/ytc">
                        <YTC/>
                    </Route>
                    <Route path="/decollateralize">
                        Decollateralize
                    </Route>
                    <Route path="/ladder">
                        Ladder
                    </Route>
                    <Route path="/">
                        Home
                    </Route>
                </Switch>
            </Box>
            {/* </div> */}
            <Footer/>
        </Flex>
    )
}

export default Template
