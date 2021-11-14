import { BigNumber, BigNumberish, Contract, ethers, Signer } from "ethers";
import YieldTokenCompounding from '../../artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json'
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json'
import {ITranche as ITrancheType} from '../../hardhat/typechain/ITranche';
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json'
import {ERC20 as ERC20Type} from '../../hardhat/typechain/ERC20';
import { ElementAddresses, Tranche } from "../../types/manual/types";
import { getRemainingTrancheYears, getTrancheByAddress } from "../element";
import { getTokenPrice } from "../prices";
import { getUnderlyingTotal } from "../element/wrappedPositionAmount";
import { getPrincipalTotal } from "../element/principalTotal";
import { getYieldTotal } from "../element/yieldTotal";

export interface YTCInput {
    baseTokenAddress: string;
    numberOfCompounds: number,
    trancheAddress: string;
    amountCollateralDeposited: BigNumberish,
    ytcContractAddress: string;
    variableApy?: number;
    baseTokenPrice?: number;
}

export interface YTCGain {
    estimatedRedemption: number;
    netGain: number,
    roi: number,
    apy: number,
}

export interface YTCOutput {
    receivedTokens: {
        yt: {
            name: string,
            amount: number,
        }
        baseTokens: {
            name: string,
            amount: number,
        }
    },
    spentTokens: {
        baseTokens: {
            name: string,
            amount: number
        }
    },
    gas: {
        eth: number,
        baseToken: number,
    },
    tranche: {
        expiration: number,
    },
    inputs: YTCInput,
    gain?: YTCGain
}

export interface YTCParameters {
    ytc: Contract;
    trancheAddress: string;
    balancerPoolId: string;
    yieldTokenDecimals: number;
    baseTokenDecimals: number;
    trancheExpiration: number;
    baseTokenName: string;
    baseTokenAmountAbsolute: BigNumber;
    ytSymbol: string;
    ethToBaseTokenRate: number;
}

// helper function to retrieve parameters required for running the YTC transaction
// param userData, the user selections for simulation or execution, includes the baseToken, number of compounds, tranche, amount of collateral
// param elementAddresses, constant containing the deployment addresses of tokens vaults and pools
// param signer, the signer of the transaction
// Returns, YTC parameters, a ytc contract instance, the balancer pool, decimals for tokens, the name of the yield token ...etc
export const getYTCParameters = async (userData: YTCInput, elementAddresses: ElementAddresses, signer: Signer): Promise<YTCParameters> => {
    const ytcAbi = YieldTokenCompounding.abi;
    const erc20Abi = ERC20.abi;
    const trancheAbi = ITranche.abi;

    // Get data
    const baseTokenName = getTokenNameByAddress(userData.baseTokenAddress, elementAddresses.tokens);
    if (!baseTokenName){
        throw new Error("Could not find base token name");
    }

    const yieldTokenCompoundingAddress = userData.ytcContractAddress;
    const baseTokenAddress: string = userData.baseTokenAddress;

    // Get specific tranche
    const trancheDetails: Tranche | undefined = getTrancheByAddress(userData.trancheAddress, elementAddresses.tranches[baseTokenName]);
    if (!trancheDetails){
        throw new Error("Could not find tranche");
    }

    // if it is expired throw an error
    if (!isTrancheActive(trancheDetails)){
        throw new Error("Tranche is expired");
    }

    const trancheAddress = trancheDetails.address;
    const balancerPoolId = trancheDetails.ptPool.poolId;    
    
    // Load contracts
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signer);
    const tranche: ITrancheType = (new ethers.Contract(trancheAddress, trancheAbi, signer)) as ITrancheType;
    const trancheExpiration = trancheDetails.expiration;
    const yieldTokenAddress = await tranche.interestToken();
    const yieldToken: ERC20Type = (new ethers.Contract(yieldTokenAddress, erc20Abi, signer)) as ERC20Type;
    const ytSymbol = await yieldToken.symbol();
    const yieldTokenDecimals = ethers.BigNumber.from(await yieldToken.decimals()).toNumber();
    const baseToken: ERC20Type = new ethers.Contract(baseTokenAddress, erc20Abi, signer) as ERC20Type;
    const baseTokenDecimals = ethers.BigNumber.from(await baseToken.decimals()).toNumber();

    const baseTokenBalance = await baseToken.balanceOf(await signer.getAddress());
    const amountCollateralDespositedAbsolute = ethers.utils.parseUnits(userData.amountCollateralDeposited.toString(), baseTokenDecimals);

    // if the suggested amount is greater than the total amount, return the total amount instead
    let amount = amountCollateralDespositedAbsolute;
    if (amountCollateralDespositedAbsolute.sub(baseTokenBalance).gt(0)){
        amount = baseTokenBalance;
    }

    const ethToBaseToken = await ethToBaseTokenRate(baseTokenName, elementAddresses, signer);

    return {
        ytc,
        trancheAddress,
        trancheExpiration,
        balancerPoolId,
        yieldTokenDecimals,
        baseTokenDecimals,
        baseTokenName,
        baseTokenAmountAbsolute: amount,
        ytSymbol,
        ethToBaseTokenRate: ethToBaseToken,
    }

}



// This function is not currently used, but could still be valuable if the ux flow is changed slightly
// Calculates the expected gains from a set of yield token compound simulation, at a specific average variable rate
// param speculatedVariableRate, the estimated average yield of the underlying vault over the course of the term
// param ytcOutputs, a set of yield token compounding simulation results to have gains calculated upon
// Returns YTCOutput[], an aray of yield token compounding results augmented with gain information
// export const calculateGainsFromSpeculatedRate = (speculatedVariableRate: number, ytcOutputs: YTCOutput[]): YTCOutput[] => {
//     const rates = ytcOutputs.map((ytcOutput) => {
//         return {
//             ...ytcOutput,
//             gain: calculateGain(ytcOutput.ytExposure, speculatedVariableRate, ytcOutput.trancheExpiration, ytcOutput.baseTokensSpent, 0)
//         }
//     })

//     return rates;
// }

// Calculates the expected gains from a yield token compound simulation
// param speculatedVariableRate
export const calculateGain = (ytExposure: number, speculatedVariableRate: number = 0, trancheExpiration: number, baseTokensSpent: number, estimatedBaseTokensGas: number, yieldTokenAccruedValue: number): YTCGain => {
    const termRemainingYears = getRemainingTrancheYears(trancheExpiration);


    // speculated variable rate is an apy, but we need this as an apr
    const returnPercentage = (1 + speculatedVariableRate/100)**termRemainingYears - 1;

    const returnedTokens = (returnPercentage + yieldTokenAccruedValue) * ytExposure;

    // Returned amount
    // Tokens spent
    // Net Gain
    // Gas
    // APY
    // ROI

    const netGain = (returnedTokens) - baseTokensSpent - estimatedBaseTokensGas;
    const roi = (netGain / baseTokensSpent);
    const apy = (1+roi)**(1/termRemainingYears) - 1;

    return {
        estimatedRedemption: returnedTokens,
        netGain: netGain,
        roi,
        apy
    }
}

export const yieldTokenAccruedValue = async (elementAddresses: ElementAddresses, trancheAddress: string, signer: Signer): Promise<number> => {
    const wrappedPositionTotal = await getUnderlyingTotal(elementAddresses, trancheAddress, signer);

    const principalTotal = await  getPrincipalTotal(elementAddresses, trancheAddress, signer);

    const yieldTotal = await getYieldTotal(elementAddresses, trancheAddress, signer);

    return (wrappedPositionTotal - principalTotal) / yieldTotal;
}

export const isTrancheActive = (tranche: Tranche): boolean => {
    const time = new Date().getTime();
    // expiration is in seconds normally
    const expirationInMs = tranche.expiration * 1000

    return time <= expirationInMs;
}

export const getTokenNameByAddress = (address: string, tokens: {[name: string]: string}): string | undefined => {
    const result = Object.entries(tokens).find(([key, value]) => (
        value === address
    ))

    return result && result[0]
}

const ethToBaseTokenRate = async (baseTokenName: string, elementAddresses: ElementAddresses, signer: Signer) => {
    const baseTokenPrice = await getTokenPrice(baseTokenName, elementAddresses, signer);
    const ethPrice =  await getTokenPrice("eth", elementAddresses, signer);

    return (ethPrice/baseTokenPrice);

}