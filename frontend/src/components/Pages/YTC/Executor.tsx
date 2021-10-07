import { Button, Text, Spinner } from "@chakra-ui/react";
import { executeYieldTokenCompounding, YieldExposureData } from "../../../features/calculator/calculatorAPI";
import { elementAddressesAtom } from "../../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { useContext, useState } from "react";
import { SignerContext } from "../../../hardhat/SymfoniContext";
import { slippageToleranceAtom } from "../../../recoil/transactionSettings/atom";
import { notificationAtom } from "../../../recoil/notifications/atom";
import { useRecoilState } from 'recoil';
import { simulationResultsAtom } from "../../../recoil/simulationResults/atom";

export interface ApeProps {
    baseToken: {
        name: string,
    };
    yieldToken: {
        name: string,
    };
    baseTokenAmount: number;
    yieldTokenAmount: number;
    userData: YieldExposureData
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
        <div id="ape" className="py-5 flex flex-col gap-3">
            <div id="ape-params" className="flex flex-col p-4 gap-3 shadow-lg rounded-2xl border bg-indigo-100">
                <Text fontSize="large" fontWeight="extrabold">Output</Text>
                <div id="outputs" className="flex flex-col gap-1">
                    <div id="base-token" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400 shadow-lg justify-between">
                        <div id="base-token-asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                            {/* <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                            </div> */}
                            <div id="asset-details" className="flex-grow text-left font-bold">
                                <div id="base-token-asset-name">
                                    {baseToken.name.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div id="base-token-amount" className="h-16 rounded-r-full flex px-3">
                            <div id="base-token-amount-text" className="self-center text-lg">
                                {baseTokenAmount}
                            </div>
                        </div>
                    </div>
                    <div id="y-token" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400 shadow-lg justify-between">
                        <div id="y-token-asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                            {/* <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50"> */}
                            {/* </div> */}
                            <div id="y-token-asset-details" className="flex-grow text-left">
                                <div id="y-token-asset-name" className="font-bold">
                                    {yieldToken.name}
                                </div>
                                {/* <div id="asset-date">
                                    {(new Date(yieldToken.expiry * 1000)).toLocaleDateString()}
                                </div> */}
                            </div>

                        </div>
                        <div id="y-token-amount" className="h-16 rounded-r-full flex px-3">
                            <div id="amount-text" className="self-center text-lg">
                                {yieldTokenAmount}
                            </div>
                        </div>
                    </div>
                </div>
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
                    <div></div>
                </div>
            </div>
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
        </div>
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