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

    let tokenNameElement;
    const tokenName = token.name.split('-')

    if (tokenName.length > 1){
        tokenNameElement = <> {tokenName[0]} <br></br> {tokenName[1]} </>
    } else {
        tokenNameElement = tokenName[0]
    }


    return <Flex
        id="base-token"
        flexDir="row"
        width="full"
        bgColor="gray.200"
        rounded="2xl"
        shadow="lg"
        justify="space-between"
        className="border border-gray-600"
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
                    {tokenNameElement}
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
                justify="end"
                align="end"
            >
                <Flex
                    id="base-token-amount-text"
                    fontSize="lg"
                    justifySelf="center"
                >
                    {shortenNumber(token.amount)}
                </Flex>
                <Flex
                    id="base-token-dollar-value"
                    textColor="gray.500"
                >
                    {
                        tokenType === "BaseToken"
                            && <BaseTokenPriceTag
                                amount={token.amount}
                                baseTokenName={token.name}
                            />
                    }
                    {
                        tokenType === "YToken"
                            && <YTPriceTag
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