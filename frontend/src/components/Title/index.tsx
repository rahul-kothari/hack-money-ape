import { Flex, Link, Text } from "@chakra-ui/layout"

interface TitleProps {
    title: string;
    infoLink: string;
    infoLinkText: string;
}

export const Title: React.FC<TitleProps> = (props) => {

    const {title, infoLink, infoLinkText} = props;

    return <Flex
        id="title"
        flexDir="column"
        justify="center"
        alignItems="center"
    >
        <Text
            fontSize="2xl"
            fontWeight="bold"
            color="text.primary"
        >
            {title}
        </Text>
        <Link
            href={infoLink}
            isExternal
            fontSize="sm"
            textColor="main.primary"
        >
            {infoLinkText}
        </Link>
    </Flex>
}