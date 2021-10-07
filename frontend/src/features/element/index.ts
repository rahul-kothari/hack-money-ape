// This is for element api calls to get information on tokens, tranches, pools, etc..
import _ from 'lodash';
import { ConstantsObject, Token, Tranche } from "../../types/manual/types";
import { ERC20 } from '../../hardhat/typechain/ERC20';
import { isTrancheActive } from '../calculator/calculatorAPI';
import { ethers } from 'ethers';

export const getTranches = async (tokenAddress: string, elementState: ConstantsObject): Promise<Tranche[]> => {
    // get the name of the token
    const tokenName = _.findKey(elementState.tokens, (value) => value === tokenAddress)

    if (tokenName){
        const tranches = elementState.tranches[tokenName];
        if (tranches){
            return tranches;
        }
    }

    return []
}

export const getActiveTranches = async (tokenAddress: string, elementState: ConstantsObject): Promise<Tranche[]> => {
    const tokenName = _.findKey(elementState.tokens, (value) => value === tokenAddress)

    if (tokenName){
        const tranches = elementState.tranches[tokenName]
        if (tranches){
            return tranches.filter((tranche: Tranche) => {
                return isTrancheActive(tranche)
            })
        }
    }

    return []
}

export const getBaseTokens = async (elementState: ConstantsObject): Promise<Token[]> => {
    const tokens = elementState.tokens;

    return Object.entries(tokens).map(([key, value]: [string, string]) => {
        return {
            name: key,
            address: value,
        }
    })
}

export const getBaseTokensWithActiveTranches = async (elementState: ConstantsObject): Promise<any> => {
    const tokens = elementState.tokens;

    const promises = Object.entries(tokens).map(async ([key, value]: [string, string]) => {
        const tranches = await getActiveTranches(value, elementState)

        return {
            name: key,
            address: value,
            tranches,
        }
    });

    return (await Promise.all(promises)).filter(({name, address, tranches}) => {
        return tranches.length > 0
    }).map(({name, address, tranches}) => {
        return {
            name,
            address,
        }
    })
}

// TODO This might be better organized in a different file as it's not element related
export const getBalance = async (currentAddress: string, contract: ERC20 | undefined): Promise<number> => {
    if (contract){
        const decimals = await contract.decimals();

        const balanceAbsolute = await contract.balanceOf(currentAddress);
        const balanceNormalized = ethers.utils.formatUnits(balanceAbsolute, decimals);

        return parseFloat(balanceNormalized);
    }
    return 0;
}