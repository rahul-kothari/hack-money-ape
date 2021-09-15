import React, { useEffect, useState } from "react"
import { getBaseTokens } from "../../../features/element";
import { Token } from "../../../types/manual/types";
// TODO move this to tyeps file
import { Calculator } from "./Calculator";
import { Ape, ApeProps } from "./Executor";

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const [simulatedResults, setSimulatedResults] = useState<ApeProps | undefined>(undefined)
    const [baseTokens, setBaseTokens] = useState<Token[]>([]);

    useEffect(() => {
        getBaseTokens().then((res) => {
            setBaseTokens(res);
        })
    })

    const handleSimulation = () => {
        setSimulatedResults({
            principleToken: {
                name: 'ePT-CRV3USDC',
                expiry: 1640057082,
            },
            yieldToken: {
                name: 'eYT-CRV3USDC',
                expiry: 1671593082,
            },
            principleTokenAmount: 34.0,
            yieldTokenAmount: 0.9,
        })
    }

    return <div>
        <div id="title" className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-bold">
                Yield Token Compounding
            </h2>
            {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg> */}
            <a href="https://medium.com/element-finance/intro-to-yield-token-compounding-40a75a11e18c#:~:text=Element%20lets%20you%20put%20otherwise,Yield%20Token%20Compounding%20(YTC)." target="_blank" rel="noreferrer" className="text-xs text-indigo-400">
                What is Yield Token Compounding?
            </a>
        </div>
        <Calculator
            tokens={baseTokens}
            onSimulate={handleSimulation}
            simulated={!!simulatedResults}
        />
        {
            simulatedResults && <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                </svg>

                <Ape
                    {
                        ...simulatedResults
                    }
                />
            </>
        }
    </div>
}
