import { Box, Flex } from '@chakra-ui/layout';
import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { disclaimerAtom } from '../recoil/disclaimer/atom';
import Footer from './Footer';
import Header from './Header';
import { Notifications } from './Notifications';
import { Decollateralize } from './Pages/Decollateralize';
import Home from './Pages/Home';
import { Ladder } from './Pages/Ladder';
import { YTC } from './Pages/YTC';
import { Alert } from './Reusable/Alert';

interface Props {
}

export const Template: React.FC<Props> = (props: Props) => {
    const [open, setOpen] = useRecoilState(disclaimerAtom);

    return (
        <Flex
            bg="background"
            flexDir="column"
            justify="space-between"
            minH="100vh"
        >
            <Alert
                primaryText="This product is in beta:"
                secondaryText="The smart contracts are peer reviewed with formal audits coming soon, please use at your own risk."
                open={open}
                setOpen={setOpen}
            />
            <Header/>
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
                        <Decollateralize/>
                    </Route>
                    <Route path="/ladder">
                        <Ladder/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </Box>
            <Footer/>
            <Notifications/>
        </Flex>
    )
}

export default Template
