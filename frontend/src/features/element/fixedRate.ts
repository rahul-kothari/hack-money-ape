// calculate the fixed rate of the pToken

import { Signer } from "ethers";
import { ElementAddresses, Tranche } from "../../types/manual/types";
import { getReserves } from "../../utils/element/getReserves";
import { calcSpotPricePt } from "../../utils/element/calcSpotPrice";
import { calcFixedAPR } from "../../utils/element/calcFixedAPR";
import _ from 'lodash';

// calculate the fixed rate of the pTokens for a tranche

const SECONDS_PER_YEAR = 3.154 * 10 ** 7;

export const getFixedRate = async (tokenName: string, trancheAddress: string, elementAddresses: ElementAddresses, signer: Signer): Promise<number> => {
    const tranche = _.find(elementAddresses.tranches[tokenName], (tranche: Tranche) => (tranche.address === trancheAddress));
    const balancerAddress = elementAddresses.balancerVault;

    if (!tranche) {
        throw new Error('Cannot find tranche pool')
    }

    const ptPool = tranche.ptPool;

    const reserves = await getReserves(ptPool.address, balancerAddress, signer);

    const tParamSeconds = ptPool.timeStretch * SECONDS_PER_YEAR;

    const timeRemainingSeconds = tranche.expiration - (new Date()).getTime()/1000;

    const spot = calcSpotPricePt(reserves.balances[0].toString(), reserves.balances[1].toString(), reserves.totalSupply.toString(), timeRemainingSeconds, tParamSeconds, reserves.decimals[0])
    
    return calcFixedAPR(spot, timeRemainingSeconds)/100;
}