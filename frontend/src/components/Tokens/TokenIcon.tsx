import Icon, {IconProps} from "@chakra-ui/icon";
import {QuestionIcon} from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { imageLinkMap } from "../../constants/apy-mainnet-constants";


interface TokenIconInterface {
    tokenName: string | undefined;
}

export const TokenIcon: React.FC<TokenIconInterface> = (props) => {
    const {tokenName} = props;
    if (!tokenName){
        return <QuestionIcon/>
    }

    const tokenUrl = imageLinkMap[tokenName];

    if (tokenUrl){
        return <Flex
            h={10}
            w={10}
        >
            <img
                src={tokenUrl}
                alt={`${tokenName} Logo`}
            /> 
        </Flex>
    }

    return <></>
}
