import React, { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil';
import { simulationResultsAtom } from '../../../../recoil/simulationResults/atom'
import { Table, Th, Thead, Flex, Tr } from '@chakra-ui/react';
import { YTCOutput } from '../../../../features/ytc/ytcHelpers';
import Card from '../../../Reusable/Card';
import { ResultsTableRow } from './ResultsTableRow';

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


export default ResultsTable
