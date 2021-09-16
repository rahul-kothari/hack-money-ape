import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Button, ButtonProps, Spinner } from '@chakra-ui/react'
import { useWallet } from 'use-wallet';
import { checkApproval, sendApproval } from './approvalAPI';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// This is a button that is used to approve a specific token for use by a 
type Props = {
    amount?: number | string,
    approvalAddress?: string,
    tokenAddress?: string,
    tokenName?: string,
    children: ReactElement,
} & ButtonProps;


export const Approval: React.FC<Props> = (props: Props) => {
    const {amount = MAX_UINT_HEX, approvalAddress, tokenAddress, tokenName, children, ...rest} = props;

    const wallet = useWallet();

    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleCheckApproval = useCallback(
        () => {
            if (tokenAddress && approvalAddress){
                checkApproval(wallet, amount, tokenAddress, approvalAddress).then((result) => {
                    if (result) setIsApproved(true);
                }).catch((error: Error) => {
                    console.error(error);
                })
            }
        },
        [wallet, amount, tokenAddress, approvalAddress],
    )


    useEffect(() => {
        if (wallet.status === "connected") {
            handleCheckApproval();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallet.status])

    const handleApprove = useCallback(
        async () => {
            if (approvalAddress && tokenAddress) {
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
        },
        [wallet, amount, tokenAddress, approvalAddress, handleCheckApproval]
    )

    console.log(approvalAddress, tokenAddress);
    if (!approvalAddress || !tokenAddress){
        return <Button
            {...rest}
            disabled
        >
            CONNECT YOUR WALLET
        </Button>
    }
    if (isLoading){
        return <Button
            {...rest}
            disabled
        >
            <Spinner/>
        </Button>
    }
    if (isApproved){
        return children;
    }
    return <Button
        {...rest}
        onClick = {handleApprove}
    >
        {`Approve ${tokenName?.toUpperCase() || ""}`}
    </Button>
}

export default Approval;