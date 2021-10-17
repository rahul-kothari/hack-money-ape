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
// TODO this should not be hardcoded and should rather be grabbed from the curve address provider
// The lusd, alusd and mim pools all have erc20/swap pools built together so the adddress is the same as the token address
export const CURVE_SWAP_ADDRESSES: {[tokenName: string]: string} = {
    "crv3crypto": "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46",
    "crvtricrypto": "0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5",
    "stecrv": "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022",
    "lusd3crv-f": "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    "alusd3crv-f": "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
    "mim-3lp3crv-f": "0x5a6A4D54456819380173272A5E8E9B9904BdF41B",
    "eurscrv": "0x0Ce6a5fF5217e38315f87032CF90686C96627CAA",
}

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