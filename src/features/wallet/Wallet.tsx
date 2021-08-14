import { Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import {useAppDispatch, useAppSelector} from '../../app/hooks';
import { disconnectWallet, walletConnectAsync, selectSigner } from './walletSlice';

interface Props {
    
}

export const Wallet = (props: Props) => {
    const signer = useAppSelector(selectSigner);
    const dispatch = useAppDispatch();
    const [address, setAddress] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (signer){
            signer.getAddress().then((address) => {
                setAddress(address)
            })
        }
    }, [signer])

    const handleConnect = () => {
        dispatch(walletConnectAsync())
    }

    const handleDisconnect = () => {
        dispatch(disconnectWallet())
    }

    return (
        <div>
            {
                !signer ? 
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
                </Button> :
                <Button
                    onClick={handleDisconnect}
                    display={{  md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.400'}
                    href={'#'}
                    _hover={{
                        bg: 'pink.300',
                    }}>
                    {address}
                </Button>
            
                
            }
        </div>
    )
}

export default Wallet;
