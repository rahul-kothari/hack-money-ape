import React, { ReactElement, useEffect, useState } from 'react'
import { Button, Spinner } from '@chakra-ui/react'
import { useWallet } from 'use-wallet';
import { checkApproval, sendApproval } from './approvalAPI';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// This is a button that is used to approve a specific token for use by a 
interface Props {
    amount?: number | string;
    approvalAddress: string;
    tokenAddress: string;
    tokenName: string;
    children: ReactElement;
}

const Approval: React.FC<Props> = (props: Props) => {
    const {amount = MAX_UINT_HEX, approvalAddress, tokenAddress, tokenName, children} = props;

    const wallet = useWallet();

    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckApproval = () => {
        checkApproval(wallet, amount, tokenAddress, approvalAddress).then((result) => {
            if (result) setIsApproved(true);
        }).catch((error: Error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        if (wallet.status === "connected") {
            handleCheckApproval();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.status])

    const handleApprove = async () => {
        setIsLoading(true);
        // send the approval request
        // This does not resolve based on the approval being successful
        // Rather it resolves on the approval happening in the wallet
        sendApproval(
            wallet, 
            amount,
            approvalAddress,
            tokenAddress,
            () => {setIsApproved(true)}
        ).then(() => {
            handleCheckApproval();
        }).catch((error: Error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    if (isLoading){
        return <Button
            disabled
        >
            <Spinner/>
        </Button>
    }
    if (isApproved){
        return children;
    }
    return <Button
        onClick = {handleApprove}
    >
        {`Approve ${tokenName.toUpperCase()}`}
    </Button>
}

export default Approval;