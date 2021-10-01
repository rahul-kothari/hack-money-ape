import { Flex, Text, Link } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react"
import { getBaseTokensWithActiveTranches } from "../../../features/element";
import { Token } from "../../../types/manual/types";
// TODO move this to tyeps file
import { Calculator } from "./Calculator";
import { Ape, ApeProps } from "./Executor";

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const [simulatedResults, setSimulatedResults] = useState<ApeProps | undefined>(undefined)
    const [baseTokens, setBaseTokens] = useState<Token[]>([]);

    useEffect(() => {
        getBaseTokensWithActiveTranches().then((res) => {
            setBaseTokens(res);
        })
    }, [])

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
        <Flex
            id="title"
            flexDir="column"
            justify="center"
            alignItems="center"
        >
            <Text 
                fontSize="2xl"
                fontWeight="bold"
            >
                Yield Token Compounding
            </Text>
            <Link
                href="https://medium.com/element-finance/intro-to-yield-token-compounding-40a75a11e18c#:~:text=Element%20lets%20you%20put%20otherwise,Yield%20Token%20Compounding%20(YTC)."
                isExternal
                fontSize="xs"
                textColor="indigo.400"
            >
                What is Yield Token Compounding?
            </Link>
        </Flex>
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
