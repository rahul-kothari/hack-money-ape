// This is for element api calls to get information on tokens, tranches, pools, etc..
import _ from 'lodash';
import { Token, Tranche } from "../../types/manual/types";
import { constants } from '../../constants/mainnet-constants';
import { ERC20 } from '../../hardhat/typechain/ERC20';
import { BigNumber } from '@ethersproject/bignumber';
import { isTrancheActive } from '../calculator/calculatorAPI';

// TODO this is a mock this should be replaced with a real function call
export const getTranches = async (tokenAddress: string): Promise<Tranche[]> => {
    // get the name of the token
    const tokenName = _.findKey(constants.tokens, (value) => value === tokenAddress)

    if (tokenName){
        const tranches = constants.tranches[tokenName];
        if (tranches){
            return tranches;
        }
    }

    return []
}

export const getActiveTranches = async (tokenAddress: string): Promise<Tranche[]> => {
    const tokenName = _.findKey(constants.tokens, (value) => value === tokenAddress)

    if (tokenName){
        const tranches = constants.tranches[tokenName]
        if (tranches){
            return tranches.filter((tranche: Tranche) => {
                return isTrancheActive(tranche)
            })
        }
    }

    return []
}

// TODO this is a mock this should be replaced with a real function call
export const getBaseTokens = async (): Promise<Token[]> => {
    const tokens = constants.tokens;

    return Object.entries(tokens).map(([key, value]: [string, string]) => {
        return {
            name: key,
            address: value,
        }
    })
}

export const getBaseTokensWithActiveTranches = async (): Promise<any> => {
    const tokens = constants.tokens;

    const promises = Object.entries(tokens).map(async ([key, value]: [string, string]) => {
        const tranches = await getActiveTranches(value)

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
// TODO this is a mock this should be replaced with a real function call
export const getBalance = async (currentAddress: string, contract: ERC20 | undefined): Promise<number> => {
    if (contract){
        const decimals = await contract.decimals();

        const balance = await contract.balanceOf(currentAddress);

        const adjustedBalance = balance.div(BigNumber.from(10).pow(decimals));

        console.log(adjustedBalance);

        return (adjustedBalance).toNumber();
    }
    return 0;
}

// const getElementTokens = async (tokenAddress: string): Promise<void> => {
//     await promiseTimeout(1000);
//     return;
// }
