import Icon, {IconProps} from "@chakra-ui/icon";
import {QuestionIcon} from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";

// TODO this needs to be updated when new tokens are added
const imageLinkMap: {[key: string]: string} = {
    "lusd3crv-f": "https://app.element.fi/static/media/crvLUSD.165dc0d4.svg",
    "crv3crypto": "https://app.element.fi/static/media/crvtricrypto.99df341a.svg",
    "crvtricrypto": "https://app.element.fi/static/media/crvtricrypto.99df341a.svg",
    "wbtc": "https://app.element.fi/static/media/WBTC.fa29bebf.svg",
    "usdc": "https://app.element.fi/static/media/USDC.f08e02b1.svg",
    "stecrv": "https://app.element.fi/static/media/crvSTETH.08963a52.svg",
    "dai": "https://app.element.fi/static/media/DAI.1096719c.svg",
    "alusd3crv-f": "https://app.element.fi/static/media/crvALUSD.4c11d542.png",
    "eurscrv": "https://app.element.fi/static/media/crvEURS.f1997513.png",
}

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
