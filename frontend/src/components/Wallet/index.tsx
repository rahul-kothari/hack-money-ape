import React, { useContext, useEffect, useState } from 'react';
import { Button, Text, Flex } from '@chakra-ui/react'
import { ProviderContext, CurrentAddressContext, SymfoniContext } from "../../hardhat/SymfoniContext";
import { chainNameAtom } from '../../recoil/chain/atom';
import { useRecoilState } from 'recoil';

interface Props {
}

export const Wallet = (props: Props) => {

    const [provider, setProvider] = useContext(ProviderContext);
    const [currentAddress] = useContext(CurrentAddressContext)
    const {init} = useContext(SymfoniContext);

    const [chainName, setChainName] = useRecoilState(chainNameAtom);

    // Set the network name when connected
    useEffect(() => {
        provider?.getNetwork().then(
            ({name}) => {
                if (name === "homestead"){
                    setChainName('mainnet')
                } else {
                    setChainName(name);
                }
            }
        )
    }, [provider])

    const handleConnect = async () => {
        init();
    }

    const handleDisconnect = () => {
        setProvider(undefined);
    }

    const shortenAddress = (address: string): string => {
        return address.slice(0, 6) + '....' + address.slice(-4)
    }

    return (
        <div>
            {
                !!provider ? 
                <Flex
                    justifyContent = "space-between"
                    alignItems = "center"
                >
                    <Flex
                        justifyContent = "space-between"
                        alignItems = "center"
                    >
                        <Text
                            pr={2}
                        >
                            {chainName}
                        </Text>
                    </Flex>
                    <Button
                        onClick={handleDisconnect}
                        fontSize={'sm'}
                        fontWeight={600}
                        color={'white'}
                        bg={'teal.400'}
                        href={'#'}
                        _hover={{
                            bg: 'teal.300',
                        }}>
                            {shortenAddress(currentAddress)}
                    </Button> 
                </Flex> :
                <Button
                    onClick={handleConnect}
                    display={{  md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'pink.400'}
                    href={'#'}
                    _hover={{
                        bg: 'pink.300',
                    }}>
                        Connect Wallet
                </Button>
            }
        </div>
    )
}

export default Wallet;