import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { Button, ButtonProps, Spinner } from '@chakra-ui/react'
import { checkApproval, sendApproval } from './approvalAPI';
import { ProviderContext, ERC20Context, CurrentAddressContext, YieldTokenCompoundingContext, SymfoniContext } from '../../hardhat/SymfoniContext';
import { BigNumber, ContractReceipt, providers } from 'ethers';
import { notificationAtom } from '../../recoil/notifications/atom';
import { useRecoilState } from 'recoil';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

type AbstractApprovalProps = {
    approveText: string,
    approvalMessage: string,
    children: ReactElement,
    isLoading: boolean,
    setIsLoading: (bool: boolean) => void,
    isApproved: boolean,
    provider: providers.Provider | undefined,
    handleCheckApproval: () => Promise<void>,
    handleApprove: () => Promise<ContractReceipt>
} & ButtonProps;

const AbstractApproval: React.FC<AbstractApprovalProps> = (props) => {
    const {approveText, approvalMessage, children, handleCheckApproval, handleApprove, provider, isLoading, isApproved, setIsLoading, ...rest} = props;

    const {init} = useContext(SymfoniContext);


    useEffect(() => {
        if (provider) {
            handleCheckApproval();
        }
    }, [provider, handleCheckApproval])

    const setNotification = useRecoilState(notificationAtom)[1];

    const abstractHandleApprove = () => {
        handleApprove().then((receipt) => {
            setNotification({
                text: approvalMessage,
                type: "SUCCESS",
                linkText: "View on Explorer",
                link: `https://etherscan.io/tx/${receipt.transactionHash}`
            })
        }).catch(() => {
            setNotification({
                type: "ERROR",
                text: "Token Approval Failed"
            })
        }).finally(() => {
            setIsLoading(false);
        })
    }

    if (!provider){
        return <Button
            {...rest}
            onClick={() => init()}
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
        onClick = {abstractHandleApprove}
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

    const handleApprove: () => Promise<ContractReceipt> = useCallback(
        async () => {
            if (approvalAddress && tokenAddress && provider) {
                setIsLoading(true);

                // send the approval request
                const tokenContract = erc20.factory?.attach(tokenAddress);
                if (tokenContract){
                    const receipt = await sendApproval(amount, approvalAddress, tokenContract)
                    handleCheckApproval();
                    return receipt;
                } 
            }
            throw new Error('Could not connect to token contract')
        },
        [amount, tokenAddress, approvalAddress, handleCheckApproval, erc20.factory, provider]
    )

    return <AbstractApproval
        isLoading={isLoading}
        approvalMessage={`${tokenName?.toUpperCase()} approved`}
        isApproved={isApproved}
        setIsLoading={setIsLoading}
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

    const handleApprove: () => Promise<ContractReceipt> = useCallback(
        async () => {
            if (trancheAddress){
                setIsLoading(true);
                const tx = await ytc.instance?.approveTranchePTOnBalancer(trancheAddress);
                if (tx){
                    const receipt = await tx.wait();
                    handleCheckApproval()
                    return receipt;
                }
            }
            throw new Error('Could not approve balancer pool');
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
        setIsLoading={setIsLoading}
        handleApprove={handleApprove}
        handleCheckApproval={handleCheckApproval}
        approveText="Approve Balancer Pool"
        approvalMessage="Balancer Pool Approved"
        provider={provider}
        {...rest}
    >
        {children}
    </AbstractApproval>
}