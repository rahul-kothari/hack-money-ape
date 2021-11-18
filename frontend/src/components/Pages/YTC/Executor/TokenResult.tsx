import { Flex } from "@chakra-ui/react";
import { shortenNumber } from "../../../../utils/shortenNumber";
import { BaseTokenPriceTag, YTPriceTag } from "../../../Prices";

interface TokenResultProps {
    token: {
        name: string,
        amount: number,
    };
    baseTokenName?: string,
    tokenType: "YToken" | "BaseToken";
    trancheAddress: string,
}

export const TokenResult: React.FC<TokenResultProps> = (props) => {
    const { token, tokenType } = props;

    return <Flex
        id="base-token"
        flexDir="row"
        width="full"
        bgColor="input_bg"
        rounded="2xl"
        justify="space-between"
    >
        <Flex
            id="base-token-asset"
            flexDir="row"
            height={16}
            px={3}
            alignItems="center"
            className="border-r border-gray-600"
        >
            <Flex
                id="asset-details"
                flexGrow={1}
                textAlign="left"
                fontWeight="bold"
            >
                <Flex
                    id="base-token-asset-name"
                >
                    <TokenNameElement
                        isYToken={tokenType === "YToken"}
                        tokenName={token.name}
                    />
                </Flex>
            </Flex>
        </Flex>
        <Flex
            id="base-token-amount"
            height={16}
            rounded="full"
            flexDir="row"
            px={3}
        >
            <Flex
                flexDir="column"
                // justify="end"
                align="end"
            >
                <Flex
                    id="base-token-amount-text"
                    fontSize="lg"
                    // justifySelf="center"
                    flexDir="column"
                    justify="end"
                    height="66%"
                >
                    {shortenNumber(token.amount)}
                </Flex>
                <Flex
                    id="base-token-dollar-value"
                    textColor="gray.500"
                    flexDir="column"
                    justify="end"
                    height="33%"
                >
                    {
                        tokenType === "BaseToken"
                            && <BaseTokenPriceTag
                                amount={token.amount}
                                baseTokenName={token.name}
                            />
                    }
                    {
                        tokenType === "YToken" &&
                            // This is commented out due to a bug in yt price calculation
                            <YTPriceTag
                                amount={token.amount}
                                baseTokenName={props.baseTokenName}
                                trancheAddress={props.trancheAddress}
                            />
                    }
                </Flex>
            </Flex>
        </Flex>
    </Flex>
}

interface TokenNameElementProps {
    isYToken: boolean;
    tokenName: string;
}

const TokenNameElement: React.FC<TokenNameElementProps> = (props) => {
    const {isYToken, tokenName} = props;

    if (!isYToken){
        // if the token is not a ytoken, the name needs no modification
        return <> 
            { tokenName }
        </>
    } else {
        // split the name at the dashes
        const splitName = tokenName.split('-');

        // if the last part of the name is a date of format DDMMMYY then split it off
        // otherwise just return the name by itself
        const lastComponent = splitName[splitName.length - 1];
        const regexp: RegExp = /\d{2}[a-zA-z]{3}\d{2}/;
        const matches = lastComponent.match(regexp);

        if (matches){
            return <> { splitName.slice(0, -1).join("-") }  <br/> {lastComponent} </>
        } else {
            return <>
                { tokenName } 
            </> 
        }
    }
}