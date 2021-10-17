import { Signer } from "ethers";
import _ from "lodash";
import { ElementAddresses, Tranche } from "../../types/manual/types";
import { calcSpotPriceYt } from "../../utils/element/calcSpotPrice";
import { getReserves } from "../../utils/element/getReserves";

export const getYTCSpotPrice = async (tokenName: string, trancheAddress: string, elementAddresses: ElementAddresses, signer: Signer): Promise<number> => {
    const tranche = _.find(elementAddresses.tranches[tokenName], (tranche: Tranche) => (tranche.address === trancheAddress));
    const balancerAddress = elementAddresses.balancerVault;

    if (!tranche) {
        throw new Error('Cannot find tranche pool')
    }

    const ytPool = tranche.ytPool;

    const reserves = await getReserves(ytPool.address, balancerAddress, signer);

    const ytcSpot = calcSpotPriceYt(reserves.balances[0].toString(), reserves.balances[1].toString())
    
    return ytcSpot;
}