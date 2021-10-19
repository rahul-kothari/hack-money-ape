import {Spinner as ChakraSpinner} from '@chakra-ui/react';

export const Spinner: typeof ChakraSpinner = (props) => {
    const {...rest} = props;

    return <ChakraSpinner
        speed="1.2s"
        emptyColor="light_card"
        size="xs"
        thickness="1px"
        {...rest}
    />
}