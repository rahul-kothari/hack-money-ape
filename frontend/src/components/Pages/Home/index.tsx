import React, { useContext, useEffect } from 'react'
import { ProviderContext, SymfoniContext } from '../../../hardhat/SymfoniContext'
import {useRecoilState} from 'recoil';
import { chainNameAtom } from '../../../recoil/chain/atom';
import { Button } from '@chakra-ui/button';
import { useHistory } from 'react-router';
import { Flex } from '@chakra-ui/layout';
import { Title } from '../../Title';

interface Props {
    
}

const Home = (props: Props) => {
    const [provider, setProvider] = useContext(ProviderContext);
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
                title="Welcome To Ape Predicted Yield!"
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
                            onClick={handleConnect}
                            bg={'indigo.500'}
                            color="white"
                            _hover={{
                                bg: 'indigo.300'
                            }}
                            width="full"
                        >
                            CONNECT WALLET
                        </Button>
                        :
                        <Button
                            onClick={handleStart}
                            bg={'indigo.500'}
                            color="white"
                            _hover={{
                                bg: 'indigo.300'
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
