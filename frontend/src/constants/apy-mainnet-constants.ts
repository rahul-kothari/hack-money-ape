// TODO this needs to be updated when new tokens are added
export const imageLinkMap: {[key: string]: string} = {
    "lusd3crv-f": "https://app.element.fi/static/media/crvLUSD.165dc0d4.svg",
    "crv3crypto": "https://app.element.fi/static/media/crvtricrypto.99df341a.svg",
    "crvtricrypto": "https://app.element.fi/static/media/crvtricrypto.99df341a.svg",
    "wbtc": "https://app.element.fi/static/media/WBTC.fa29bebf.svg",
    "usdc": "https://app.element.fi/static/media/USDC.f08e02b1.svg",
    "stecrv": "https://app.element.fi/static/media/crvSTETH.08963a52.svg",
    "dai": "https://app.element.fi/static/media/DAI.1096719c.svg",
    "alusd3crv-f": "https://app.element.fi/static/media/crvALUSD.4c11d542.png",
    "eurscrv": "https://app.element.fi/static/media/crvEURS.f1997513.png",
    "mim-3lp3crv-f": "/mim.png"
}

// TODO this potentially needs to be updated when new tokens are added
export const COINGECKO_TOKEN_NAME_TRANSLATION: {[key: string]: string} = {
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

// TODO this list needs to be updated every time that element deploys a new curve token
// This could potentially be resolved by using the element finance tokenlist
export const validCurveTokens = [
    "crv3crypto",
    "crvtricrypto",
    "stecrv",
    "lusd3crv-f",
    "alusd3crv-f",
    "mim-3lp3crv-f",
    "eurscrv",
]
export const validCoingeckoTokens = Object.keys(COINGECKO_TOKEN_NAME_TRANSLATION);