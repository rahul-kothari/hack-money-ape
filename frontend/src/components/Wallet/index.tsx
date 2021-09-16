import React, { useContext, useEffect } from 'react';
import { Button, Text, Flex } from '@chakra-ui/react'
import { useWallet } from 'use-wallet';
import { ProviderContext, CurrentAddressContext, SignerContext } from "../../hardhat/SymfoniContext";
import Web3Modal from "web3modal";

interface Props {
}

const providerOptions = {
    injected: {
        package: null,
    }
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions // required
});


export const Wallet = (props: Props) => {

    const [provider, setProvider] = useContext(ProviderContext);
    const [currentAddress, setCurrentAddress] = useContext(CurrentAddressContext)
    const [signer, setSigner] = useContext(SignerContext)

    const wallet = useWallet();

    const handleConnect = async () => {
        // const provider = await web3Modal.connect();
        // setProvider(provider)
        wallet.connect();
    }

    const handleDisconnect = () => {
        wallet.reset()
        // setProvider(undefined)
    }

    const shortenAddress = (address: string): string => {
        return address.slice(0, 6) + '....' + address.slice(-4)
    }

    return (
        <div>
            {
                wallet.status === 'connected' ? 
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
                            {wallet.networkName}
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
                            {shortenAddress(wallet.account)}
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