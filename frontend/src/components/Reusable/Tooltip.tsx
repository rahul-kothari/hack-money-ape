import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Tooltip } from "@chakra-ui/react";

interface InfoTooltipProps {
    label: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = (props) => {
    const {label} = props;

    return <Tooltip label={label}>
        <InfoOutlineIcon/>
    </Tooltip>
}