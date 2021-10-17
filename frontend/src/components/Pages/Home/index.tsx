import React, { useContext } from 'react'
import { ProviderContext, SymfoniContext } from '../../../hardhat/SymfoniContext'
import { Button } from '@chakra-ui/button';
import { useHistory } from 'react-router';
import { Flex } from '@chakra-ui/layout';
import { Title } from '../../Title';

interface Props {
    
}

const Home = (props: Props) => {
    const [provider] = useContext(ProviderContext);
    const history = useHistory();
    const { init } = useContext(SymfoniContext);

    const handleConnect = async () => {
        init();
    }

    const handleStart = () => {
        history.push('/ytc')
    }

    return (
        <>
            <Title
                title="Welcome To Ape Predicted Yield"
                infoLinkText="Learn more about APY"
                infoLink=""
            />
            <Flex
                id="home-page-content"
                alignItems="center"
                justifyContent="center"
                flexDir="column"
                pt={10}
            >
                {
                    !provider ?
                        <Button
                            rounded="full"
                            onClick={handleConnect}
                            bg={'main.primary'}
                            color="text.secondary"
                            _hover={{
                                bg: 'main.primary_hover'
                            }}
                            width="full"
                        >
                            CONNECT WALLET
                        </Button>
                        :
                        <Button
                            rounded="full"
                            onClick={handleStart}
                            bg={'main.primary'}
                            color="text.secondary"
                            _hover={{
                                bg: 'main.primary_hover'
                            }}
                            width="full"
                        >
                            GET STARTED WITH YTC
                        </Button>

                }
            </Flex>
        </>
    )
}

export default Home
