import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Button, ButtonProps, Spinner } from '@chakra-ui/react'
import { checkApproval, sendApproval } from './approvalAPI';
import { ProviderContext, ERC20Context, CurrentAddressContext } from '../../hardhat/SymfoniContext';

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
    const [provider] = useContext(ProviderContext);
    const erc20 = useContext(ERC20Context);
    const [currentAddress] = useContext(CurrentAddressContext)
    const {amount = MAX_UINT_HEX, approvalAddress, tokenAddress, tokenName, children, ...rest} = props;


    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckApproval = useCallback(
        () => {
            if (tokenAddress && approvalAddress && provider){
                const tokenContract = erc20.factory?.attach(tokenAddress);
                if (tokenContract){
                    console.log('checking approval')
                    checkApproval(amount, approvalAddress, currentAddress, tokenContract).then((result) => {
                        if (result) setIsApproved(true);
                    }).catch((error: Error) => {
                        console.error(error);
                    })
                }
            }
        },
        [currentAddress, amount, approvalAddress, erc20.factory, provider, tokenAddress],
    )

    const handleApprove = useCallback(
        async () => {
            if (approvalAddress && tokenAddress && provider) {
                setIsLoading(true);
                // send the approval request
                // This does not resolve based on the approval being successful
                // Rather it resolves on the approval happening in the wallet
                const tokenContract = erc20.factory?.attach(tokenAddress);
                if (tokenContract){
                    sendApproval(
                        amount,
                        approvalAddress,
                        tokenContract
                    ).then(() => {
                        handleCheckApproval();
                    }).catch((error: Error) => {
                        console.error(error);
                    }).finally(() => {
                        setIsLoading(false);
                    })
                }
            }
        },
        [amount, tokenAddress, approvalAddress, handleCheckApproval, erc20.factory, provider]
    )


    useEffect(() => {
        if (provider) {
            handleCheckApproval();
        }
    }, [provider, handleCheckApproval])


    if (!provider){
        return <Button
            {...rest}
            disabled
        >
            CONNECT YOUR WALLET
        </Button>
    }
    if (!approvalAddress || !tokenAddress){
        return <Button
            {...rest}
            disabled
        >
            SELECT TRANCHE
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