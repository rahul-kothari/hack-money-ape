import { Button, Text, Spinner, Flex } from "@chakra-ui/react";
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
import { BaseTokenPriceTag, YTPriceTag } from "../../../Prices";
import Card from "../../../Reusable/Card";
import { shortenNumber } from "../../../../utils/shortenNumber";

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
}

export const Ape: React.FC<ApeProps> = (props: ApeProps) => {

    const {baseToken, yieldToken, baseTokenAmount, yieldTokenAmount, userData, estimatedGas} = props;
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
                <Text fontSize="large" fontWeight="extrabold">Output</Text>
                <Flex
                    flexDir='column'
                    gridGap={3}
                    py={2}
                >
                    <Flex
                        id="outputs"
                        flexDir='column'
                        gridGap={1}
                    >
                        <TokenResult
                            tokenType="BaseToken"
                            token={{
                                name: baseToken.name,
                                amount: baseTokenAmount
                            }}
                        />
                        <TokenResult
                            tokenType="YToken"
                            token={{
                                name: yieldToken.name,
                                amount: yieldTokenAmount
                            }}
                            baseTokenName={baseToken.name}
                        />
                    </Flex>
                    <div id="ape-details" className="">
                        <DetailItem
                            name="Slippage Tolerance:"
                            value={`%${slippageTolerance}`}
                        />
                        <DetailItem
                            name="Minimum YT Received:"
                            value={`${minimumReturn}`}
                        />
                        <DetailItem
                            name="Estimated Gas Cost:"
                            value={`${estimatedGas} ETH`}
                        />
                        <DetailItem
                            name="Estimated APY:"
                            value={`%${""}`}
                        />
                    </div>
                </Flex>
            </Card>
            <Button
                id="approve-calculate-button"
                className="rounded-full w-full bg-indigo-500 mt-4 p-2 text-gray-50 hover:bg-indigo-400"
                rounded="full"
                bgColor="#6366F1"
                mt="4"
                p="2"
                textColor="gray.50"
                onClick={handleExecuteTransaction}
            >
                {isLoading ? <Spinner/> : "APE"}
            </Button>
        </Flex>
    )
}

interface DetailItemProps {
    name: string,
    value: string,
}

const DetailItem: React.FC<DetailItemProps> = (props) => {
    const {name, value} = props;

    return <div className="flex flex-row justify-between">
        <Text>{name}</Text>
        <Text>{value}</Text>
    </div>
}

interface TokenResultProps {
    token: {
        name: string,
        amount: number,
    };
    baseTokenName?: string,
    tokenType: "YToken" | "BaseToken";
}

const TokenResult: React.FC<TokenResultProps> = (props) => {
    const { token, tokenType } = props;

    let tokenNameElement;
    const tokenName = token.name.split('-')

    if (tokenName.length > 1){
        tokenNameElement = <> {tokenName[0]} <br></br> {tokenName[1]} </>
    } else {
        tokenNameElement = tokenName[0]
    }


    return <Flex
        id="base-token"
        flexDir="row"
        width="full"
        bgColor="gray.200"
        rounded="2xl"
        shadow="lg"
        justify="space-between"
        className="border border-gray-600"
    >
        <Flex
            id="base-token-asset"
            flexDir="row"
            height={16}
            px={3}
            alignItems="center"
            className="border-r border-gray-600"
        >
            <Flex
                id="asset-details"
                flexGrow={1}
                textAlign="left"
                fontWeight="bold"
            >
                <Flex
                    id="base-token-asset-name"
                >
                    {tokenNameElement}
                </Flex>
            </Flex>
        </Flex>
        <Flex
            id="base-token-amount"
            height={16}
            rounded="full"
            flexDir="row"
            px={3}
        >
            <Flex
                flexDir="column"
                justify="end"
                align="end"
            >
                <Flex
                    id="base-token-amount-text"
                    fontSize="lg"
                    justifySelf="center"
                >
                    {shortenNumber(token.amount)}
                </Flex>
                <Flex
                    id="base-token-dollar-value"
                >
                    {
                        tokenType === "BaseToken"
                            && <BaseTokenPriceTag
                                amount={token.amount}
                                baseTokenName={token.name}
                            />
                    }
                    {
                        tokenType === "YToken"
                            && <YTPriceTag
                                amount={token.amount}
                                baseTokenName={props.baseTokenName}
                            />
                    }
                </Flex>
            </Flex>
        </Flex>
    </Flex>
}
