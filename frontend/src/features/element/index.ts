// This is for element api calls to get information on tokens, tranches, pools, etc..
import _ from 'lodash';
import { Token, Tranche } from "../../types/manual/types";
import { constants } from '../../constants/mainnet-constants';
import { ERC20 } from '../../hardhat/typechain/ERC20';
import { BigNumber } from '@ethersproject/bignumber';

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
