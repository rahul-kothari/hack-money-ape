import { Signer } from "ethers";
import _ from "lodash";
import { ElementAddresses, Tranche } from "../../types/manual/types";
import { calcSpotPriceYt } from "../../utils/element/calcSpotPrice";
import { getReserves } from "../../utils/element/getReserves";

export const getYTCSpotPrice = async (tokenName: string, trancheAddress: string, elementAddresses: ElementAddresses, signer: Signer): Promise<number> => {
    const tranche = _.find(elementAddresses.tranches[tokenName], (tranche: Tranche) => (tranche.address === trancheAddress));
    const balancerAddress = elementAddresses.balancerVault;

    const tokenAddress = elementAddresses.tokens[tokenName];

    if (!tranche) {
        throw new Error('Cannot find tranche pool')
    }

    const ytPool = tranche.ytPool;

    const reserves = await getReserves(ytPool.address, balancerAddress, signer);

    // The getReserves function does not return the base/yt reserves in a particular order
    // It does return the token address in tokens in the same index as it's balance in "balance"
    let baseTokenReserve;
    let yTReserve;
    if (reserves.tokens[0] === tokenAddress){
        [baseTokenReserve, yTReserve] = reserves.balances;
    } else {
        [yTReserve, baseTokenReserve] = reserves.balances;
    }

    const ytcSpot = calcSpotPriceYt(baseTokenReserve.toString(), yTReserve.toString())
    
    return ytcSpot;
}