import { Signer } from "ethers"
import { ElementAddresses } from "../../types/manual/types"
import { getRelativePriceFromCoingecko, isCoingeckoToken } from "./coingecko"
import { getPriceOfCurveLP, isCurveToken } from "./curve"

export const getTokenPrice = async (baseTokenName: string, elementAddresses: ElementAddresses, signer: Signer | undefined): Promise<number> => {
    if (isCoingeckoToken(baseTokenName.toLowerCase())){
        return getRelativePriceFromCoingecko(baseTokenName?.toLowerCase(), "usd")
    } else {
        if (isCurveToken(baseTokenName.toLowerCase()) && signer){
            return getPriceOfCurveLP(baseTokenName.toLowerCase(), elementAddresses, signer)
        }
    }
    throw new Error(`Could not get token price for ${baseTokenName}`);
}