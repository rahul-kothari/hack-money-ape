import { Button, Text, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {useWallet} from 'use-wallet';


interface Props {
}

export const Wallet = (props: Props) => {
    const wallet = useWallet();

    const handleConnect = () => {
        wallet.connect()
    }

    const handleDisconnect = () => {
        wallet.reset()
    }

    return (
        <div>
            {
                wallet.status === 'connected' ? 
                <Flex
                    flexShrink = {1}
                    justifyContent = "space-between"
                    alignItems = "center"
                >
                    <Flex
                        flexShrink = {1}
                        justifyContent = "space-between"
                        alignItems = "center"
                        px = {2}
                    >
                        <Text style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                            p={1}
                            flexShrink={1}
                        >
                            {wallet.account}
                        </Text>
                        <Text
                            p={1}
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
                            Disconnect
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
