import { Flex } from '@chakra-ui/react'
import React, { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

const BodyWrapper: React.FC<Props> = (props) => {
    return (
        <Flex
            backgroundColor="gray.100"
        >

        </Flex>
    )
}

export default BodyWrapper
