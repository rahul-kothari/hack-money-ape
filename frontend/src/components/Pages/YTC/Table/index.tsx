import React, { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil';
import { simulationResultsAtom } from '../../../../recoil/simulationResults/atom'
import { Table, Th, Thead, Flex, Tr, Tbody, FormLabel, Tooltip } from '@chakra-ui/react';
import { YTCOutput } from '../../../../features/ytc/ytcHelpers';
import Card from '../../../Reusable/Card';
import { ResultsTableRow } from './ResultsTableRow';
import { InfoOutlineIcon } from '@chakra-ui/icons';

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
                        <Tooltip label="Select the number of iterations you would like to execute. The more compounds the larger the yield token position.">
                            <InfoOutlineIcon/>
                        </Tooltip>
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
                                Yield Tokens
                            </Th>
                            <Th isNumeric>
                                Tokens Spent
                            </Th>
                            <Th isNumeric>
                                Net Gain
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
                                        baseTokenName={simulationResults[0].baseTokenName}
                                    />
                        })}
                    </Tbody>
                </Table>
            </Card>
        </Flex>
    )
}


export default ResultsTable
