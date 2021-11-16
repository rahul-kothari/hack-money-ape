import { ButtonGroup } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Flex } from "@chakra-ui/layout";
import { Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/popover";
import React from "react";
import { useRecoilState } from "recoil";
import { slippageToleranceAtom } from "../../recoil/transactionSettings/atom";

interface Props {
    icon: React.ReactElement
}

export const WalletSettings: React.FC<Props> = (props) => {
    const { icon } = props;
    const [slippageTolerance, setSlippageTolerance] = useRecoilState(slippageToleranceAtom);

    const handleSlippageChange = (percentage: number) => {
        setSlippageTolerance(percentage);
    }

    const handleSlippageInputChange: React.ChangeEventHandler<HTMLInputElement>  = (event) => {
        event.preventDefault();

        handleSlippageChange(parseInt(event.target.value));
    }

    return (
        <Popover>
            {/** This is a button that causes the popover to open */}
            <PopoverTrigger>
                <a>
                    {icon}
                </a>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverCloseButton/>
                <PopoverHeader>Transaction Settings</PopoverHeader>
                <PopoverBody>
                    <div className="flex flex-col">
                        <div id="slippage" className="text-sm text-left">Slippage Tolerance</div>
                        <div className="flex flex-row justify-center gap-4 items-center">
                            <ButtonGroup>
                                {
                                    [0.1, 0.5, 1].map((percentage) => (
                                        <button
                                            onClick={ () => handleSlippageChange(percentage) }
                                            className={`hover:bg-gray-50 px-2 py-1 rounded-2xl ${percentage === slippageTolerance && "text-indigo-400"}`}
                                            key={percentage}
                                        >
                                            {percentage}%
                                        </button>
                                    ))
                                }
                            </ButtonGroup>
                            <div className="shadow-inner flex flex-row items-center p-2 w-16 rounded-xl">
                                <input type="number" value={slippageTolerance} onChange={handleSlippageInputChange} className="min-w-0 text-indigo-400">
                                </input>
                                <div>%</div>
                            </div>
                        </div>
                    </div>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default WalletSettings;