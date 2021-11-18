import { Flex, FlexProps} from "@chakra-ui/layout"

export const DetailPane: React.FC<FlexProps> = (props) => {

    return <Flex
        p={2}
        mx={5}
        gridGap={1}
        flexDir="column"
        bgColor="light_card"
        {...props}
    >
        {props.children}
    </Flex>
}