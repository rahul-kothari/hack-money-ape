import { Button, Spinner, Flex, FormLabel, Icon, Text, Tooltip } from "@chakra-ui/react";
import { YTCGain, YTCInput } from "../../../../features/ytc/ytcHelpers";
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
import WalletSettings from "../../../Wallet/Settings";
import { BaseTokenPriceTag, YTPriceTag } from "../../../Prices";

export interface ApeProps {
    baseToken: {
        name: string,
    };
    yieldToken: {
        name: string,
    };
    baseTokenAmount: number;
    yieldTokenAmount: number;
    userData: YTCInput;
    inputAmount: number;
    gas: {
        eth: number,
        baseToken: number,
    };
    gain?: YTCGain;
}

export const Ape: React.FC<ApeProps> = (props: ApeProps) => {

    const {baseToken, yieldToken, baseTokenAmount, yieldTokenAmount, userData, gas, inputAmount, gain} = props;
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
                // this is equivalent to base tokens spent
                (inputAmount-baseTokenAmount),
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
                    alignItems='stretch'
                    gridGap={3}
                    p={2}
                >
                    <FormLabel
                        flexDir="row"
                        justify="center"
                        alignItems="center"
                        alignSelf="center"
                    >
                        <Flex
                            flexDir="row"
                            alignItems="center"
                            gridGap={2}
                        >
                            Review Your Transaction
                            {/* <InfoTooltip label="This has no effect on your transaction. Input the average APY that you expect from the vault over the course of the term. This ius used to estimate the expected gain for your position."/> */}
                        </Flex>
                    </FormLabel>
                    <Flex
                        flexDir="column"
                        w="full"
                    >
                        <FormLabel>
                            Input
                        </FormLabel>
                        <TokenResult
                            tokenType="BaseToken"
                            trancheAddress={userData.trancheAddress}
                            token={{
                                name: baseToken.name,
                                amount: inputAmount
                            }}
                        />
                    </Flex>
                    <Flex
                        flexDir="column"
                        w="full"
                    >
                        <FormLabel>
                            Output
                        </FormLabel>
                        <Flex
                            flexDir="column"
                            gridGap={1}
                        >
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
                        </Flex>
                    </Flex>
                    <ExecutionDetails 
                        slippageTolerance={slippageTolerance}
                        estimatedGas={gas.eth}
                        netGain= {gain?.netGain}
                        roi={gain?.roi}
                        apr={gain?.apr}
                        minimumReceived={minimumReturn}
                        expectedReturn={gain?.estimatedRedemption}
                        trancheAddress={userData.trancheAddress}
                        baseTokenName={baseToken.name}
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
    trancheAddress: string,
    baseTokenName: string,
    slippageTolerance: number,
    minimumReceived: number,
    expectedReturn?: number,
    estimatedGas: number,
    netGain?: number,
    roi?: number, 
    apr?: number,
}

const ExecutionDetails: React.FC<ExecutionDetailsProps> = (props) => {
    const {
        slippageTolerance,
        minimumReceived,
        estimatedGas,
        netGain,
        roi,
        apr,
        expectedReturn,
        baseTokenName,
        trancheAddress
    } = props;

    return <DetailPane
        mx={{base: 0, sm: 10}}
    >
        <DetailItem
            name={
                <Flex flexDir="row" alignItems="center" gridGap={1}>
                    <Text>
                        Slippage Tolerance 
                    </Text>
                    <WalletSettings icon={<SmallGearIcon/>}/>
                </Flex>
                    }
            value={`${slippageTolerance}%`}
        />
        <DetailItem
            name="Minimum YT Received:"
            value={
                <Flex flexDir="row" gridGap={1}>
                    <Text>
                        {shortenNumber(minimumReceived)}
                    </Text>
                    (<YTPriceTag
                        amount={expectedReturn}
                        baseTokenName={baseTokenName}
                        trancheAddress={trancheAddress}
                    />)
                </Flex>
            }
        />
        <DetailItem
            name="Expected Redemption:"
            value={expectedReturn ? 
                <Flex flexDir="row" gridGap={1}>
                    <Text>
                        {shortenNumber(expectedReturn)}
                    </Text>
                    (<BaseTokenPriceTag
                        amount={expectedReturn}
                        baseTokenName={baseTokenName}
                    />)
                </Flex> : <Text>?</Text>
            }
        />
        <DetailItem
            name="Estimated Gas Cost:"
            value={
                <Flex flexDir="row" gridGap={1}>
                    <Text>
                        {shortenNumber(estimatedGas)} ETH
                    </Text>
                    (<BaseTokenPriceTag
                        amount={estimatedGas}
                        baseTokenName={"eth"}
                    />)
                </Flex>
            }
        />
        <DetailItem
            name="Expected Earned:"
            value={netGain ? 
                <Flex
                    flexDir="row"
                    gridGap={1}
                    color={(netGain > 0 ? "green.600" : "red.500")}
                >
                    <Text>
                        {shortenNumber(netGain)}
                    </Text>
                    (<BaseTokenPriceTag
                        amount={netGain}
                        baseTokenName={baseTokenName}
                    />)
                </Flex> : "?"
            }
        />
        <DetailItem
            name="Return on Investment:"
            value={roi ? 
                <Text
                    color={(roi > 0 ? "green.600" : "red.500")}
                >
                    {shortenNumber(roi)}%
                </Text> : "?"
            }
        />
        <Tooltip
            label="Return on investment over the term annualized."
        >
            <div>
                <DetailItem
                    name="APR: "
                    value={apr ? 
                        <Text
                            color={(apr > 0 ? "green.600" : "red.500")}
                        >
                            {shortenNumber(apr)}%
                        </Text> : "?"
                    }

                />
            </div>
        </Tooltip>
    </DetailPane>
}

const SmallGearIcon = () => {
    return <Flex justifyContent="center" alignItems="center" tabIndex={0} rounded="full" cursor="pointer">
        {/** This is a gear icon */}
        <Icon viewBox="0 0 20 20" color="text.primary" h={3} w={3} stroke="text.primary" fill="text.primary">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </Icon>
    </Flex>
}