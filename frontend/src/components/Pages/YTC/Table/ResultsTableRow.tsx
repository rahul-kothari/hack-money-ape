import { Td, Tr } from "@chakra-ui/react";
import { YTCOutput } from "../../../../features/ytc/ytcHelpers";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { BaseTokenPriceTag } from "../../../Prices";

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
            <Td isNumeric
                textColor={
                    output.gain ?
                        (output.gain?.netGain >= 0) ? 
                            "green.600" : 
                            "red.500" :
                        "inherit"
                }
            >
                {output.gain ? <BaseTokenPriceTag amount={output.gain.netGain} baseTokenName={baseTokenName}/> : "?"}
            </Td>
            <Td isNumeric
                textColor={
                    output.gain ?
                        (output.gain?.netGain >= 0) ? 
                            "green.600" : 
                            "red.500" :
                        "inherit"
                }
            >
                {output.gain ? `%${shortenNumber(output.gain.finalApy)}` : "?"}
            </Td>
        </Tr>
    )
}