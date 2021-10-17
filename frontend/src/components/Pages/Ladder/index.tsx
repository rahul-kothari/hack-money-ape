import { Title } from "../../Title"
import { Flex, Text } from '@chakra-ui/layout';

export const Ladder: React.FC<any> = () => {
    return <> 
        <Title
            title="Yield Ladder"
            infoLinkText="What are Yield Ladders"
            infoLink="https://paper.element.fi/#61-yield-ladders"
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