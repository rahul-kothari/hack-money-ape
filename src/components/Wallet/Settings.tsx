import { ButtonGroup } from "@chakra-ui/button";
import { Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/popover";
import React, { useState } from "react";

export const WalletSettings = () => {
    const [slippageTolerance, setSlippageTolerance] = useState(1);

    const handleSlippageChange = (percentage: number) => {
        setSlippageTolerance(percentage);
    }

    const handleSlippageInputChange: React.ChangeEventHandler<HTMLInputElement>  = (event) => {
        event.preventDefault();

        handleSlippageChange(parseInt(event.target.value));
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="hover:bg-gray-200 rounded-full cursor-pointer p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverCloseButton/>
                <PopoverHeader>Transaction Settings</PopoverHeader>
                <PopoverBody>
                    <div className="flex flex-col">
                        <text id="slippage" className="text-sm text-left">Slippage Tolerance</text>
                        <div className="flex flex-row justify-center gap-4 items-center">
                            <ButtonGroup>
                                {
                                    [0.1, 0.5, 1].map((percentage) => (
                                        <button
                                            onClick={ () => handleSlippageChange(percentage) }
                                            className={`hover:bg-gray-50 px-2 py-1 rounded-2xl ${percentage === slippageTolerance && "text-indigo-400"}`}
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