// This is for element api calls to get information on tokens, tranches, pools, etc..
import _ from 'lodash';
import { Token, Tranche } from "../../types/manual/types";
import { constants } from '../../constants/mainnet-constants';

// TODO this is a mock this should be replaced with a real function call
export const getTranches = async (tokenAddress: string): Promise<Tranche[]> => {
    // simulate the amount of time required
    await promiseTimeout(1000);
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
    await promiseTimeout(1000);
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
export const getBalance = async (tokenAddress: string): Promise<number> => {
    await promiseTimeout(1000);
    return 1000;
}

const getElementTokens = async (tokenAddress: string): Promise<void> => {
    await promiseTimeout(1000);
    return;
}

const promiseTimeout = (time: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}