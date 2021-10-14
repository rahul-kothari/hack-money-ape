import React, { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil';
import { simulationResultsAtom } from '../../../../recoil/simulationResults/atom'
import { Table, Tr, Td, Th, Thead, Text, Flex } from '@chakra-ui/react';
import { YTCOutput } from '../../../../features/ytc/ytcHelpers';
import Card from '../../../Reusable/Card';
import { BaseTokenPriceTag } from '../../../Prices';
import { shortenNumber } from '../../../../utils/shortenNumber';

interface TableProps {
    onSelect: (index: number | undefined) => void;
    selected: number | undefined;
}

const ResultsTable: React.FC<TableProps> = (props) => {

    const {onSelect, selected} = props;

    const simulationResults = useRecoilValue(simulationResultsAtom);

    const tableRef = useRef<HTMLTableElement>(null);

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
        >
            <Card>
                <Text fontSize="large" fontWeight="extrabold">Select Number of Compounds</Text>
                <Table
                    ref={tableRef}
                    variant="simple"
                    size="sm"
                >
                    <Thead>
                        <Th isNumeric>
                        </Th>
                        <Th isNumeric>
                            Yield Tokens
                        </Th>
                        <Th isNumeric>
                            Tokens Spent
                        </Th>
                        <Th isNumeric>
                            Net Gain
                        </Th>
                        <Th isNumeric>
                            Term Yield
                        </Th>
                    </Thead>
                    {simulationResults.map((result: YTCOutput, index) => {
                        return <ResultsTableRow
                                    output={result}
                                    key={result.inputs.numberOfCompounds}
                                    isSelected={index === selected}
                                    onSelect={() => {onSelect(index)}}
                                    baseTokenName={simulationResults[0].baseTokenName}
                                />
                    })}
                </Table>
            </Card>
        </Flex>
    )
}

interface ResultsTableRowInterface {
    baseTokenName: string;
    output: YTCOutput;
    onSelect: () => void;
    isSelected: boolean;
}

export const ResultsTableRow: React.FC<ResultsTableRowInterface> = (props) => {

    const {output, onSelect, isSelected, baseTokenName} = props;

    return (
        <Tr
            onClick={onSelect}
            bgColor={isSelected ? "indigo.300" : "inherit"}
            cursor="pointer"
            _hover={{
                bgColor:"indigo.50"
            }}
        >
            <Td isNumeric>
                {output.inputs.numberOfCompounds}
            </Td>
            <Td isNumeric>
                {shortenNumber(output.ytExposure)}
            </Td>
            <Td isNumeric>
                {shortenNumber(output.baseTokensSpent)}
            </Td>
            <Td isNumeric>
                {output.gain ? <BaseTokenPriceTag amount={output.gain.netGain} baseTokenName={baseTokenName}/> : "?"}
            </Td>
            <Td isNumeric>
                {output.gain ? `%${shortenNumber(output.gain.finalApy)}` : "?"}
            </Td>
        </Tr>
    )
}

export default ResultsTable
