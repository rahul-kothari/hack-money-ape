import React from 'react'
import { Flex } from '@chakra-ui/layout'
import { StyleProps } from '@chakra-ui/styled-system';

interface Props {
}

const Card: React.FC<Props & StyleProps > = (props) => {
    const {children, ...rest} = props;

    return (
        <Flex
            id="card"
            flexDir="column"
            alignItems="stretch"
            bgColor="card"
            rounded="2xl"
            shadow="lg"
            width="full"
            px={4}
            py={2}
            {...rest}
        >
            {props.children}
        </Flex>
    )
}

export default Card

