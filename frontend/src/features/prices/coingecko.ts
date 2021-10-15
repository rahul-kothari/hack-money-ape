
const validCoingeckoTokens = ["usdt" , "alusd" , "usdc" , "dai" , "wbtc" , "weth" , "eth" , "steth" , "usd"]
export type CoingeckoTokenName = (typeof validCoingeckoTokens[number])
export const isCoingeckoToken = (x: any): x is CoingeckoTokenName => validCoingeckoTokens.includes(x);


const COINGECKO_TOKEN_NAME_TRANSLATION: {[key: string]: string} = {
    "usdt": "tether",
    "alusd": "alchemix-usd",
    "usdc": "usd-coin",
    "dai": "dai",
    "wbtc": "wrapped-bitcoin",
    "weth": "weth",
    "eth": "ethereum",
    "steth": "lido-staked-ether",
    "usd": "usd",
    "eur": "eur"
}

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