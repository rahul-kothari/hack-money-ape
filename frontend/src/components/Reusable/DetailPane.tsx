import { Flex } from "@chakra-ui/layout"

export const DetailPane: React.FC<{}> = (props) => {

    return <Flex
        p={2}
        mx={5}
        flexDir="column"
        bgColor="light_card"
    >
        {props.children}
    </Flex>
}