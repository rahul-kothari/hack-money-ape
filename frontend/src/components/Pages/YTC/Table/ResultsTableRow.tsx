import { Tr, Td, Tooltip } from "@chakra-ui/react";
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
            color={isSelected ? "text.secondary" : "text.primary"}
            cursor="pointer"
            _hover={{
                bgColor: isSelected ? "main.primary" : "blue.100",
            }}
        >
            <Td isNumeric>
                {output.inputs.numberOfCompounds}
            </Td>
            <Td isNumeric>
                {shortenNumber(output.receivedTokens.yt.amount)}
            </Td>
            <Td isNumeric>
                {shortenNumber(output.spentTokens.baseTokens.amount)}
                <br/>
                (<BaseTokenPriceTag amount={output.spentTokens.baseTokens.amount} baseTokenName={baseTokenName}/>)
            </Td>
            <Td isNumeric
                textColor={
                    output.gain ?
                        (output.gain.netGain >= 0) ? 
                            (isSelected ? "green.200" : "green.600") : 
                            (isSelected ? "red.200" : "red.500") :
                        "inherit"
                }
            >
                {output.gain ? 
                    <BaseTokenPriceTag amount={output.gain.netGain} baseTokenName={baseTokenName}/> :
                    "?"
                }
                <br/>
                <Tooltip
                    label={`Return on investment over the term annualized. ${output.gain && shortenNumber(output.gain.roi)}% x ${output.gain && shortenNumber(output.gain.apr/output.gain.roi)}`}
                >
                    {output.gain ? ` (%${shortenNumber(output.gain.apr)} APR)` : "?"}
                </Tooltip>
            </Td>
        </Tr>
    )
}