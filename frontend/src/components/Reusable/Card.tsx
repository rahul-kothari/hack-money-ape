import React from 'react'
import { Box, Flex } from '@chakra-ui/layout'
import { StyleProps } from '@chakra-ui/styled-system';

interface Props {
}

const Card: React.FC<Props & StyleProps > = (props) => {
    const {children, ...rest} = props;

    return (
        <Box
            id="card-border"
            padding="0.1rem"
            rounded="2xl"
            bgGradient="linear(to-r, component.red, component.orange, component.green, component.yellow, component.blue)"
            shadow="lg"
            {...rest}
        >
            <Flex
                id="card"
                flexDir="column"
                alignItems="stretch"
                bgColor="card"
                rounded="2xl"
                width="full"
                px={4}
                py={2}
            >
                {props.children}
            </Flex>
        </Box>
    )
}

export default Card

