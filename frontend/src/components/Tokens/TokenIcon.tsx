import { Flex } from "@chakra-ui/layout";
import { imageLinkMap } from "../../constants/apy-mainnet-constants";
import { elementAddressesAtom } from "../../recoil/element/atom";
import { useRecoilValue } from 'recoil';
import { ElementAddresses } from "../../types/manual/types";
import Icon from "@chakra-ui/icon";
import { useEffect, useState } from "react";

const UNISWAP_IMAGE_URL = "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/"

interface TokenIconInterface {
    tokenName: string | undefined;
}

// The token icon has three options for sources,
// First the hardcoded image links in the constants file
// Second the uniswap assets repository logos
// Third a backup svg
export const TokenIcon: React.FC<TokenIconInterface> = (props) => {
    const elementAddresses: ElementAddresses = useRecoilValue(elementAddressesAtom);
    const [tokenUrl, setTokenUrl] = useState<string | undefined>(undefined);

    const {tokenName} = props;

    useEffect(() => {
        if (tokenName){
            const tokenAddress = elementAddresses.tokens[tokenName];
            if (tokenAddress){
                // First check if we have hardcoded an image link
                const hardcodedImageUrl = imageLinkMap[tokenName];
                if (!hardcodedImageUrl){
                    // then check if uniswap image library has one
                    const uniswapTokenUrl = UNISWAP_IMAGE_URL + tokenAddress + '/logo.png';
                    fetch(uniswapTokenUrl).then((response) => {
                        if (response.status !== 404){
                            setTokenUrl(uniswapTokenUrl);
                        } else {
                            setTokenUrl(undefined);
                        }
                    })
                } else {
                    setTokenUrl(hardcodedImageUrl);
                }
            }
        }
    }, [tokenName, elementAddresses])

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

    return <BackupImage/>
}


const BackupImage: React.FC<{}> = () => {
    return <Icon stroke="black" w={10} h={10} viewBox="0 0 28.25 28.25" x="0px" y="0px" >
        <g>
            <path d="M14.125,0C6.337,0,0,6.337,0,14.125S6.337,28.25,14.125,28.25S28.25,21.913,28.25,14.125S21.913,0,14.125,0z M4,14.125
                C4,8.542,8.542,4,14.125,4c2.251,0,4.325,0.747,6.009,1.994L5.993,20.134C4.747,18.45,4,16.376,4,14.125z M14.125,24.25
                c-2.251,0-4.326-0.748-6.011-1.995l14.141-14.14c1.247,1.684,1.995,3.759,1.995,6.01C24.25,19.708,19.708,24.25,14.125,24.25z"/>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
        <g>
        </g>
    </Icon>
}