import { Flex, Text } from "@chakra-ui/layout"
import { Title } from "../../Title"

export const Decollateralize: React.FC<any> = () => {
    return <>
        <Title
            title="De-Collateralize"
            infoLinkText="What is De-Collateralize?"
            infoLink="https://medium.com/element-finance/de-collateralize-an-alternative-to-collateral-backed-loans-b4a7eb49f00"
        />
        <Flex
            justify="center"
            alignItems="center"
            height="40"
        >
            <Text
                fontSize="xl"
                fontWeight="bold"
            >
                Coming Soon
            </Text>
        </Flex>
    </>
}