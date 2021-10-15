import React, { useContext, useEffect } from 'react';
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
    }, [provider, setChainName])

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
                            color="text.primary"
                        >
                            {chainName}
                        </Text>
                    </Flex>
                    <Button
                        onClick={handleDisconnect}
                        fontSize={'sm'}
                        fontWeight={600}
                        color="text.secondary"
                        bg={'card'}
                        href={'#'}
                        _hover={{
                            bg: 'text.primary',
                        }}>
                            {shortenAddress(currentAddress)}
                    </Button> 
                </Flex> :
                <Button
                    onClick={handleConnect}
                    display={{  md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color="text.secondary"
                    bg='main.primary'
                    href={'#'}
                    _hover={{
                        bg: 'main.primary_hover',
                    }}>
                        CONNECT WALLET
                </Button>
            }
        </div>
    )
}

export default Wallet;