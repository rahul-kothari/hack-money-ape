import { Button, Spinner } from "@chakra-ui/react";
import { executeYieldTokenCompounding, YieldExposureData } from "../../../features/calculator/calculatorAPI";
import { elementAddressesAtom } from "../../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { useContext, useState } from "react";
import { SignerContext } from "../../../hardhat/SymfoniContext";
import { slippageToleranceAtom } from "../../../recoil/transactionSettings/atom";
import { notificationAtom } from "../../../recoil/notifications/atom";
import { useRecoilState } from 'recoil';

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
}

export const Ape: React.FC<ApeProps> = (props: ApeProps) => {

    const {baseToken, yieldToken, baseTokenAmount, yieldTokenAmount, userData} = props;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const elementAddresses = useRecoilValue(elementAddressesAtom);
    const [signer] = useContext(SignerContext);
    const slippageTolerance = useRecoilValue(slippageToleranceAtom);
    const [notification, setNotification] = useRecoilState(notificationAtom);

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
                setNotification('YTC Execution Succesful');
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }

    return (
        <div id="ape" className="py-5 flex flex-col gap-3">
            <div id="form" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400">
                <div id="asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                    <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                    </div>
                    <div id="asset-details" className="flex-grow text-left font-bold">
                        <div id="asset-name">
                            {baseToken.name.toUpperCase()}
                        </div>
                    </div>

                </div>
                <div id="amount" className="h-16 flex-grow rounded-r-full flex px-3">
                    <div id="amount-text" className="self-center text-lg">
                        {baseTokenAmount}
                    </div>
                </div>
            </div>
            <div id="form" className="flex flex-row w-full bg-gray-200 rounded-2xl border border-gray-400">
                <div id="asset" className="h-16 rounded-l-full border-r border-gray-600 flex flex-row p-3 items-center gap-2">
                    <div id="proxy-asset-icon" className="w-8 h-8 bg-gray-50">
                    </div>
                    <div id="asset-details" className="flex-grow text-left">
                        <div id="asset-name" className="font-bold">
                            {yieldToken.name}
                        </div>
                        {/* <div id="asset-date">
                            {(new Date(yieldToken.expiry * 1000)).toLocaleDateString()}
                        </div> */}
                    </div>

                </div>
                <div id="amount" className="h-16 flex-grow rounded-r-full flex px-3">
                    <div id="amount-text" className="self-center text-lg">
                        {yieldTokenAmount}
                    </div>
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