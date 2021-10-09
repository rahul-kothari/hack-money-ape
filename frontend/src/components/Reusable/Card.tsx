import React from 'react'
import { Flex } from '@chakra-ui/layout'

interface Props {
}

const Card: React.FC<Props> = (props) => {
    return (
        <Flex
            id="parameters"
            flexDir="column"
            alignItems="stretch"
            bgColor="indigo.100"
            rounded="2xl"
            shadow="lg"
            px={4}
            py={1}
        >
            {props.children}
        </Flex>
    )
}

export default Card

