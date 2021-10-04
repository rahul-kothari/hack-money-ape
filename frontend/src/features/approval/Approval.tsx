import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Button, ButtonProps, Spinner } from '@chakra-ui/react'
import { checkApproval, sendApproval } from './approvalAPI';
import { ProviderContext, ERC20Context, CurrentAddressContext, YieldTokenCompoundingContext } from '../../hardhat/SymfoniContext';
import { BigNumber, providers } from 'ethers';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

type AbstractApprovalProps = {
    approveText: string,
    children: ReactElement,
    isLoading: boolean,
    isApproved: boolean,
    provider: providers.Provider | undefined,
    handleCheckApproval: () => Promise<void>,
    handleApprove: () => Promise<void>
} & ButtonProps;

const AbstractApproval: React.FC<AbstractApprovalProps> = (props) => {
    const {approveText, children, handleCheckApproval, handleApprove, provider, isLoading, isApproved, ...rest} = props;


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
        {approveText}
    </Button>
}

// This is a button that is used to approve a specific token for use by a 
type ERC20ApprovalProps = {
    amount?: number | string,
    approvalAddress?: string,
    tokenAddress?: string,
    tokenName?: string,
    children: ReactElement,
} & ButtonProps;


export const ERC20Approval: React.FC<ERC20ApprovalProps> = (props) => {
    const [provider] = useContext(ProviderContext);
    const erc20 = useContext(ERC20Context);
    const [currentAddress] = useContext(CurrentAddressContext)
    const {amount = MAX_UINT_HEX, approvalAddress, tokenAddress, tokenName, children, ...rest} = props;


    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckApproval = useCallback(
        async () => {
            if (tokenAddress && approvalAddress && provider){
                const tokenContract = erc20.factory?.attach(tokenAddress);
                if (tokenContract){
                    checkApproval(amount, approvalAddress, currentAddress, tokenContract).then((result) => {
                        if (result) {
                            setIsApproved(true)
                         } else {
                            setIsApproved(false);
                         }
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

    return <AbstractApproval
        isLoading={isLoading}
        isApproved={isApproved}
        handleApprove={handleApprove}
        handleCheckApproval={handleCheckApproval}
        approveText={`Approve ${tokenName?.toUpperCase()}`}
        provider = {provider}
        {...rest}
    >
        {children}
    </AbstractApproval>


}


interface BalancerApprovalProps {
    trancheAddress: string | undefined;
    children: ReactElement;
}

export const BalancerApproval: React.FC<BalancerApprovalProps> = (props) => {
    const [provider] = useContext(ProviderContext);
    const ytc = useContext(YieldTokenCompoundingContext);

    console.log(ytc.instance?.address);

    const { trancheAddress, children, ...rest} = props;


    const [isApproved, setIsApproved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckApproval = useCallback(
        async () => {
            if(!!trancheAddress){
                const allowance = await ytc.instance?.checkTranchePTAllowanceOnBalancer(trancheAddress)
                if (allowance?.eq(BigNumber.from(MAX_UINT_HEX))){
                    setIsApproved(true);
                }
                else {
                    setIsApproved(false);
                }
            }
        },
        [trancheAddress, ytc],
    )

    const handleApprove = useCallback(
        async () => {
            if (trancheAddress){
                setIsLoading(true);
                const tx = await ytc.instance?.approveTranchePTOnBalancer(trancheAddress);
                if (tx){
                    await tx.wait();
                    handleCheckApproval()
                }
                setIsLoading(false);
            }
        },
        [trancheAddress, handleCheckApproval, ytc],
    )

    if (!trancheAddress){
        return <Button
            {...rest}
            disabled
        >
            Select a Tranche
        </Button>
    }

    return <AbstractApproval
        isLoading={isLoading}
        isApproved={isApproved}
        handleApprove={handleApprove}
        handleCheckApproval={handleCheckApproval}
        approveText="Approve Balancer Pool"
        provider={provider}
        {...rest}
    >
        {children}
    </AbstractApproval>
}