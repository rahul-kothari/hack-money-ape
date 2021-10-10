import React from 'react'
import { useRecoilValue } from 'recoil';
import { simulationResultsAtom } from '../../../../recoil/simulationResults/atom'
import { Table, Tr, Td, Th, Thead, Text, Flex} from '@chakra-ui/react';
import { YTCOutput } from '../../../../features/ytc/ytcHelpers';

interface TableProps {
    onSelect: (index: number) => void;
    selected: number | undefined;
}

const ResultsTable: React.FC<TableProps> = (props) => {

    const {onSelect, selected} = props;

    const simulationResults = useRecoilValue(simulationResultsAtom);

    return (
        <Flex
            bgColor="indigo.100"
            flexDir="column"
            shadow="lg"
            rounded="2xl"
            p={2}
            my={5}
            fontSize="sm"
        >
            <Text fontSize="large" fontWeight="extrabold">Select Number of Compounds</Text>
            <Table
                variant="simple"
                size="sm"
            >
                <Thead>
                    <Th isNumeric>
                    </Th>
                    <Th isNumeric>
                        YT Exposure
                    </Th>
                    <Th isNumeric>
                        Cost
                    </Th>
                    <Th isNumeric>
                        APY
                    </Th>
                </Thead>
                {simulationResults.map((result: YTCOutput, index) => {
                    return <ResultsTableRow
                                output={result}
                                key={result.inputs.numberOfCompounds}
                                isSelected={index === selected}
                                onSelect={() => {onSelect(index)}}
                            />
                })}
            </Table>
        </Flex>
    )
}

interface ResultsTableRowInterface {
    output: YTCOutput;
    onSelect: () => void;
    isSelected: boolean;
}

export const ResultsTableRow: React.FC<ResultsTableRowInterface> = (props) => {

    const {output, onSelect, isSelected} = props;

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
                {Math.trunc(output.ytExposure)}
            </Td>
            <Td isNumeric>
                {Math.trunc(output.baseTokensSpent)}
            </Td>
            <Td isNumeric>
                %10
            </Td>
        </Tr>
    )
}

export default ResultsTable
