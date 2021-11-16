import { Alert as ChakraAlert, AlertDescription, AlertIcon, AlertTitle, CloseButton, Flex } from "@chakra-ui/react";

interface Props {
    primaryText: string;
    secondaryText: string;
    open: boolean;
    setOpen: (arg0: boolean) => void;
}

export const Alert: React.FC<Props> = (props) => {

    const {open, setOpen, primaryText, secondaryText} = props;

    return open ?  <ChakraAlert status="error">
        <AlertIcon />
            <Flex flexDir={{base: "column",md: "row"}}>
                <AlertTitle mr={2}>{primaryText}</AlertTitle>
                <AlertDescription>{secondaryText}</AlertDescription>
            </Flex>
        <CloseButton position="absolute" right="8px" top="8px" onClick={() => {setOpen(false)}}/>
    </ChakraAlert> : <></>
}