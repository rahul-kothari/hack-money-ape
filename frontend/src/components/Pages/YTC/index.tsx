import { Flex, Text, Link } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react"
import { getBaseTokensWithActiveTranches } from "../../../features/element";
import { elementAddressesAtom } from "../../../recoil/element/atom";
import { Token } from "../../../types/manual/types";
import { Calculator } from "./Calculator";
import { Ape, ApeProps } from "./Executor";
import { useRecoilValue } from 'recoil';
import { simulationResultsAtom } from '../../../recoil/simulationResults/atom';
import { YTCOutput } from "../../../features/calculator/calculatorAPI";
import { Title } from "../../Title";

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const [baseTokens, setBaseTokens] = useState<Token[]>([]);
    const simulationResults: YTCOutput[] = useRecoilValue(simulationResultsAtom);
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        getBaseTokensWithActiveTranches(elementAddresses).then((res) => {
            setBaseTokens(res);
        })
    }, [elementAddresses])

    // TODO this is a stopgap
    const processSimulationResults = (results: YTCOutput[]): ApeProps => {
        const result = results[0];

        return {
            baseToken: {
                name: result.baseTokenName,
            },
            yieldToken: {
                name: result.ytName,
                expiry: result.trancheExpiration,
            },
            baseTokenAmount: result.remainingTokens,
            yieldTokenAmount: result.ytExposure
        }
    }

    return <div>
        <Title
            title="Yield token Compounding"
            infoLinkText="What is Yield Token Compounding"
            infoLink="https://medium.com/element-finance/intro-to-yield-token-compounding-40a75a11e18c#:~:text=Element%20lets%20you%20put%20otherwise,Yield%20Token%20Compounding%20(YTC)."
        />
        <Calculator
            tokens={baseTokens}
        />
        {
            (simulationResults.length > 0) && <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                </svg>

                <Ape
                    {
                        ...(processSimulationResults(
                            simulationResults
                        ))
                    }
                />
            </>
        }
    </div>
}
