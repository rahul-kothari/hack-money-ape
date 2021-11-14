import { ElementAddresses } from "../../types/manual/types";
import _ from 'lodash'

const YEARN_API_ENDPOINT = 'https://api.yearn.finance/v1/chains/1/vaults/all';

export const getVariableAPY = async (baseTokenName: string, elementAddresses: ElementAddresses) => {

    const yearnVaultAddress = elementAddresses.vaults.yearn[baseTokenName];
    if (!yearnVaultAddress){
        throw new Error('Could not find yearn vault address');
    }

    const yearnVaultData = await (await fetch(YEARN_API_ENDPOINT)).json()

    const yearnVaultDetails = _.find(yearnVaultData, (vault) => (
        vault.address === yearnVaultAddress
    ))

    // The curve pools for some reason don't have a weekly average available, so instead we rely on their computed net_apr
    try{
        const variableApy = yearnVaultDetails.apy.points.week_ago;
        return variableApy * 100;
    } catch {
        const netApy = yearnVaultDetails.apy.net_apy;
        return netApy * 100;
    }

}