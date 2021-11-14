import React, { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import { calculatorGainSelector } from '../../../../recoil/simulationResults/atom'
import { Table, Th, Thead, Flex, Tr, Tbody, FormLabel, Text, Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import { YTCOutput } from '../../../../features/ytc/ytcHelpers';
import Card from '../../../Reusable/Card';
import { ResultsTableRow } from './ResultsTableRow';
import { InfoTooltip } from '../../../Reusable/Tooltip';
import { predictedRateAtom } from '../../../../recoil/predictedRate/atom';
import { trancheSelector } from '../../../../recoil/trancheRates/atom';

interface TableProps {
    onSelect: (index: number | undefined) => void;
    selected: number | undefined;
}

const ResultsTable: React.FC<TableProps> = (props) => {

    const {onSelect, selected} = props;

    const [predictedRate, setPredictedRate] = useRecoilState(predictedRateAtom);
    const simulationResults = useRecoilValue(calculatorGainSelector);

    // Multiply by 100 to display as percent rather than a decimal
    const predictedRatePercentage = predictedRate || undefined;

    const trancheAddress = simulationResults[0]?.inputs.trancheAddress;
    const trancheRate = useRecoilValue(trancheSelector(trancheAddress));

    const tableRef = useRef<HTMLTableElement>(null);

    const handlePredictedRateChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPredictedRate(parseFloat(e.target.value) || 0);
    }

    // Set the predicted rate to equal the tranche variable rate on load
    useEffect(() => {
        if (trancheRate.variable){
            setPredictedRate(trancheRate.variable)
        }
    }, [setPredictedRate, trancheRate.variable])

    useEffect(() => {
        if (tableRef.current){
            tableRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }, [tableRef])

    useEffect(() => {
        return () => {
            onSelect(undefined)
        }
    }, [onSelect])

    return (
        <Flex
            id="results-table"
            py={5}
            flexDir="column"
            gridGap={5}
        >
            <Card>
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
                            Estimated Variable Rate
                            <InfoTooltip label="This has no effect on your transaction. Input the average APY that you expect from the vault over the course of the term. This ius used to estimate the expected gain for your position."/>
                        </Flex>
                    </FormLabel>
                    <InputGroup
                        bgColor="text.primary"
                        rounded="2xl"
                    >
                        <Input
                            type="number"
                            value={predictedRatePercentage}
                            onChange={handlePredictedRateChange}
                        />
                        <InputRightAddon
                            bgColor="text.primary"
                        >
                            <Text
                                id="amount-token-label"
                                fontSize="2xl"
                                whiteSpace="nowrap"
                                color="gray.500"
                            >
                                %
                            </Text>
                        </InputRightAddon>
                    </InputGroup>
            </Card>
            <Card>
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
                        Number of Compounds
                        <InfoTooltip label="Select the number of iterations you would like to execute. The more compounds the larger the yield token position."/>
                    </Flex>
                </FormLabel>
                <Table
                    ref={tableRef}
                    variant="simple"
                    size="sm"
                >
                    <Thead>
                        <Tr>
                            <Th isNumeric>
                            </Th>
                            <Th isNumeric>
                                <Flex alignItems="center" gridGap={1}>
                                    <Text>
                                        Yield Tokens
                                    </Text>
                                    <InfoTooltip label="The number of yTokens that you would receive"/>
                                </Flex>
                            </Th>
                            <Th isNumeric>
                                <Flex alignItems="center" gridGap={1}>
                                    <Text>
                                        Tokens Spent
                                    </Text>
                                    <InfoTooltip label="The number of base tokens that you would get back"/>
                                </Flex>
                            </Th>
                            <Th isNumeric>
                                <Flex alignItems="center" gridGap={1}>
                                    <Text>
                                        Expected Gain
                                    </Text>
                                    <InfoTooltip label="This is the expected return by the end of the tranche term including gas costs.  This assumes that the current variable yield is the average variable yield over the course of the terms."/>
                                </Flex>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {simulationResults.map((result: YTCOutput, index) => {
                            return <ResultsTableRow
                                        output={result}
                                        key={result.inputs.numberOfCompounds}
                                        isSelected={index === selected}
                                        onSelect={() => {onSelect(index)}}
                                        baseTokenName={simulationResults[0].receivedTokens.baseTokens.name}
                                    />
                        })}
                    </Tbody>
                </Table>
            </Card>
        </Flex>
    )
}


export default ResultsTable
