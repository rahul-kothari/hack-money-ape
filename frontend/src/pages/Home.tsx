import { Button } from '@chakra-ui/react'
import React from 'react'
import Approval from '../features/approval/Approval'
import { useWallet } from 'use-wallet';
// TODO this wouldn't be imported, but would be a input instead
import {data } from '../constants/goerli-constants';

interface Props {
    
}

const Home = (props: Props) => {
    const wallet = useWallet();

    return (
        (wallet.status === 'connected') ?
            <Approval
                approvalAddress = "0x489478eA4117093D21701a0135BdA3859C556072"
                tokenAddress = {data.tokens.dai}
                tokenName = "dai"
            >
                <Approval
                    approvalAddress = "0x489478eA4117093D21701a0135BdA3859C556072"
                    tokenAddress = {data.tokens.usdc}
                    tokenName = "usdc"
                >
                    <Button>
                        Hello
                    </Button>
                </Approval>
            </Approval> :
        <div>
            Not Connected
        </div>
    )
}

export default Home
