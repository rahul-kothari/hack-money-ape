import { COINGECKO_TOKEN_NAME_TRANSLATION, validCoingeckoTokens } from "../../constants/apy-mainnet-constants";

export type CoingeckoTokenName = (typeof validCoingeckoTokens[number])
export const isCoingeckoToken = (x: any): x is CoingeckoTokenName => validCoingeckoTokens.includes(x);

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price'

export const getRelativePriceFromCoingecko = async (numeratorTokenName: CoingeckoTokenName, denominatorTokenName: CoingeckoTokenName): Promise<number> => {
    const token1 = COINGECKO_TOKEN_NAME_TRANSLATION[numeratorTokenName];
    const token2 = COINGECKO_TOKEN_NAME_TRANSLATION[denominatorTokenName];

    const params = `?ids=${token1}&vs_currencies=${token2}`

    const jsonResponse = await (await fetch(`${COINGECKO_API_URL}${params}`)).json();

    if (!jsonResponse){
        throw new Error('Could not get price from coingecko')
    }

    return jsonResponse[token1][token2];
};