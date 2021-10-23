import { Button, Spinner, Flex, FormLabel } from "@chakra-ui/react";
import { YTCInput } from "../../../../features/ytc/ytcHelpers";
import { executeYieldTokenCompounding } from "../../../../features/ytc/executeYieldTokenCompounding";
import { elementAddressesAtom } from "../../../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { useContext, useEffect, useRef, useState } from "react";
import { SignerContext } from "../../../../hardhat/SymfoniContext";
import { slippageToleranceAtom } from "../../../../recoil/transactionSettings/atom";
import { notificationAtom } from "../../../../recoil/notifications/atom";
import { useRecoilState } from 'recoil';
import { simulationResultsAtom } from "../../../../recoil/simulationResults/atom";
import Card from "../../../Reusable/Card";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { DetailItem } from '../../../Reusable/DetailItem';
import { TokenResult } from "./TokenResult";
import { DetailPane } from "../../../Reusable/DetailPane";

export interface ApeProps {
    baseToken: {
        name: string,
    };
    yieldToken: {
        name: string,
    };
    baseTokenAmount: number;
    yieldTokenAmount: number;
    userData: YTCInput
    estimatedGas: number;
    estimatedApy?: number;
}

export const Ape: React.FC<ApeProps> = (props: ApeProps) => {

    const {baseToken, yieldToken, baseTokenAmount, yieldTokenAmount, userData, estimatedGas, estimatedApy} = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setSimulationResults = useRecoilState(simulationResultsAtom)[1];
    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [signer] = useContext(SignerContext);
    const slippageTolerance = useRecoilValue(slippageToleranceAtom);
    const setNotification = useRecoilState(notificationAtom)[1];

    const minimumReturn = yieldTokenAmount * (1-(slippageTolerance/100))


    const executorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(executorRef.current){
            executorRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [executorRef])

    // Execute the actual calculation transaction
    const handleExecuteTransaction = () => {
        if (signer){
            setIsLoading(true);
            executeYieldTokenCompounding(
                userData,
                yieldTokenAmount,
                slippageTolerance,
                elementAddresses,
                signer
            ).then((receipt) => {
                setSimulationResults([]);
                setNotification(
                    {
                        text: "YTC Execution Succesful",
                        type: "SUCCESS",
                        linkText: "View on Explorer",
                        link: `https://etherscan.io/tx/${receipt.transactionHash}`
                    }
            );
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <Flex
            ref={executorRef}
            id="ape"
            py={5}
            flexDir="column"
            gridGap={3}
        >
            <Card>
                <Flex
                    id="outputs"
                    flexDir='column'
                    alignItems='center'
                    gridGap={1}
                    p={2}
                >
                    <FormLabel>
                        Review Your Transaction
                    </FormLabel>
                    <TokenResult
                        tokenType="BaseToken"
                        trancheAddress={userData.trancheAddress}
                        token={{
                            name: baseToken.name,
                            amount: baseTokenAmount
                        }}
                    />
                    <TokenResult
                        tokenType="YToken"
                        trancheAddress={userData.trancheAddress}
                        token={{
                            name: yieldToken.name,
                            amount: yieldTokenAmount
                        }}
                        baseTokenName={baseToken.name}
                    />
                    <ExecutionDetails 
                        slippageTolerance={slippageTolerance}
                        estimatedGas={estimatedGas}
                        percentageReturn={estimatedApy}
                        minimumReturn={minimumReturn}
                    />
                </Flex>
            </Card>
            <Button
                id="approve-calculate-button"
                rounded="full"
                bgColor="main.primary"
                _hover={{
                    bgColor:"main.primary_hover"
                }}
                mt="4"
                p="2"
                textColor="text.secondary"
                onClick={handleExecuteTransaction}
            >
                {isLoading ? <Spinner/> : "CONFIRM TRANSACTION"}
            </Button>
        </Flex>
    )
}


interface ExecutionDetailsProps {
    slippageTolerance: number,
    minimumReturn: number,
    estimatedGas: number,
    percentageReturn : number | undefined,
}

const ExecutionDetails: React.FC<ExecutionDetailsProps> = (props) => {
    const {slippageTolerance, minimumReturn, estimatedGas, percentageReturn} = props;

    return <DetailPane>
        <DetailItem
            name="Slippage Tolerance:"
            value={`${slippageTolerance}%`}
        />
        <DetailItem
            name="Minimum YT Received:"
            value={shortenNumber(minimumReturn)}
        />
        <DetailItem
            name="Estimated Gas Cost:"
            value={`${shortenNumber(estimatedGas)} ETH`}
        />
        <DetailItem
            name="Percentage Return"
            value={percentageReturn ? `${shortenNumber(percentageReturn)}%` : "?"}
        />
    </DetailPane>
}