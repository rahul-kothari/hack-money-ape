import { Signer } from "ethers"
import { ElementAddresses } from "../../types/manual/types";
import { getRelativePriceFromCoingecko, isCoingeckoToken } from "./coingecko"
import { getPriceOfCurveLP, isCurveToken } from "./curve"

export const getTokenPrice = async (baseTokenName: string, elementAddresses: ElementAddresses, signer: Signer | undefined): Promise<number> => {
    const baseTokenNameLowercase = baseTokenName.toLowerCase();

    if (isCoingeckoToken(baseTokenNameLowercase)){
        return getRelativePriceFromCoingecko(baseTokenNameLowercase, "usd")
    } else {
        if (isCurveToken(baseTokenNameLowercase) && signer){
            return getPriceOfCurveLP(baseTokenNameLowercase, elementAddresses, signer)
        }
    }
    throw new Error(`Could not get token price for ${baseTokenNameLowercase}`);
}