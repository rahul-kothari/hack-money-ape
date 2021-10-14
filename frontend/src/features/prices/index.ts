import { Signer } from "ethers"
import { getRelativePriceFromCoingecko, isCoingeckoToken } from "./coingecko"
import { getPriceOfCurveLP, isCurveToken } from "./curve"

export const getTokenPrice = async (baseTokenName: string, signer: Signer | undefined): Promise<number> => {
    const baseTokenNameLowercase = baseTokenName.toLowerCase();

    if (isCoingeckoToken(baseTokenNameLowercase)){
        return getRelativePriceFromCoingecko(baseTokenNameLowercase, "usd")
    } else {
        if (isCurveToken(baseTokenNameLowercase) && signer){
            return getPriceOfCurveLP(baseTokenNameLowercase, signer)
        }
    }
    throw new Error(`Could not get token price for ${baseTokenNameLowercase}`);
}