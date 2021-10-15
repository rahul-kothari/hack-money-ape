import React, { useEffect, useState } from "react"
import { getBaseTokensWithActiveTranches } from "../../../features/element";
import { elementAddressesAtom } from "../../../recoil/element/atom";
import { Token } from "../../../types/manual/types";
import { Calculator } from "./Calculator";
import { Ape, ApeProps } from "./Executor";
import { useRecoilValue } from 'recoil';
import { simulationResultsAtom } from '../../../recoil/simulationResults/atom';
import { YTCOutput } from "../../../features/ytc/ytcHelpers";
import { Title } from "../../Title";
import ResultsTable from "./Table";
import Icon from "@chakra-ui/icon";
import { Flex } from "@chakra-ui/layout";

interface YTCProps {}

export const YTC: React.FC<YTCProps> = (props) => {

    const [baseTokens, setBaseTokens] = useState<Token[]>([]);
    const [resultIndex, setResultIndex] = useState<number | undefined>(undefined);
    const simulationResults: YTCOutput[] = useRecoilValue(simulationResultsAtom);
    const elementAddresses = useRecoilValue(elementAddressesAtom);

    useEffect(() => {
        getBaseTokensWithActiveTranches(elementAddresses).then((res) => {
            setBaseTokens(res);
        })
    }, [elementAddresses])

    // TODO this is a stopgap
    const processSimulationResult = (result: YTCOutput): ApeProps => {
        return {
            baseToken: {
                name: result.baseTokenName,
            },
            yieldToken: {
                name: result.ytName,
            },
            baseTokenAmount: result.remainingTokens,
            yieldTokenAmount: result.ytExposure,
            userData: result.inputs,
            estimatedGas: result.ethGasFees,
            estimatedApy: result.gain?.finalApy
        }
    }

    return <div>
        <Title
            title="Yield Token Compounding"
            infoLinkText="What is Yield Token Compounding?"
            infoLink="https://medium.com/element-finance/intro-to-yield-token-compounding-40a75a11e18c#:~:text=Element%20lets%20you%20put%20otherwise,Yield%20Token%20Compounding%20(YTC)."
        />
        <Calculator
            tokens={baseTokens}
        />
        {
            (simulationResults.length > 0) && <>
                <Flex width="full">
                    <Icon stroke="text.primary" viewBox="0 0 24 24" h={7} w={10} mx="auto">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                    </Icon>
                </Flex>

                <ResultsTable
                    selected={resultIndex}
                    onSelect={setResultIndex}
                />
                {
                    (resultIndex !== undefined ) && <>
                        <Flex width="full">
                            <Icon stroke="text.primary" viewBox="0 0 24 24" h={7} w={10} mx="auto">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                            </Icon>
                        </Flex>
                        <Ape
                        {
                            ...(processSimulationResult(
                                simulationResults[resultIndex]
                            ))
                        }
                        />
                    </>

                }
            </>
        }
    </div>
}
