import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
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

    const [approved, setApproved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckApproval = () => {
        checkApproval(wallet, amount, tokenAddress, approvalAddress).then((result) => {
            if (result) setApproved(true);
        }).catch((error: Error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        if (wallet.status === "connected") {
            handleCheckApproval();
        }
    }, [wallet.status])

    const handleApprove = async () => {
        setLoading(true);
        // send the approval request
        // This does not resolve based on the approval being successful
        // Rather it resolves on the approval happening in the wallet
        sendApproval(
            wallet, 
            amount,
            approvalAddress,
            tokenAddress,
            () => {setApproved(true)}
        ).then(() => {
            handleCheckApproval();
        }).catch((error: Error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        })
    }

    if (loading){
        return <Button
            disabled
        >
            <Spinner/>
        </Button>
    }
    if (approved){
        return children;
    }
    return <Button
        onClick = {handleApprove}
    >
        {`Approve ${tokenName}`}
    </Button>
}

export default Approval;