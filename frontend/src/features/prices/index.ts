import { Signer } from "ethers"
import { getRelativePriceFromCoingecko, isCoingeckoToken } from "./coingecko"
import { getPriceOfCurveLP, isCurveToken } from "./curve"

export const getTokenPrice = async (baseTokenName: string, signer: Signer | undefined): Promise<number> => {
    if (isCoingeckoToken(baseTokenName.toLowerCase())){
        return getRelativePriceFromCoingecko(baseTokenName?.toLowerCase(), "usd")
    } else {
        if (isCurveToken(baseTokenName.toLowerCase()) && signer){
            return getPriceOfCurveLP(baseTokenName.toLowerCase(), signer)
        }
    }
    throw new Error(`Could not get token price for ${baseTokenName}`);
}