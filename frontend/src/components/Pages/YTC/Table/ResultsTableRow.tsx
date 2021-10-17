import { Tr, Td } from "@chakra-ui/react";
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
            bgColor={isSelected ? "main.primary" : "inherit"}
            cursor="pointer"
            _hover={{
                bgColor: isSelected ? "main.primary" : "main.primary_hover"
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
                <br/>
                {output.gain ? ` (%${shortenNumber(output.gain.finalApy)})` : "?"}
            </Td>
        </Tr>
    )
}