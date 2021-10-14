import { BigNumber, BigNumberish, Contract, ethers, Signer } from "ethers";
import YieldTokenCompounding from '../../artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json'
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json'
import {ITranche as ITrancheType} from '../../hardhat/typechain/ITranche';
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json'
import {ERC20 as ERC20Type} from '../../hardhat/typechain/ERC20';
import { ElementAddresses, Tranche } from "../../types/manual/types";
import { getRemainingTrancheYears, getTrancheByAddress } from "../element";

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
    netGain: number,
    finalApy: number,
}

export interface YTCOutput {
    ytExposure: number,
    remainingTokens: number,
    ethGasFees: number,
    baseTokensSpent: number,
    trancheExpiration: number,
    baseTokenName: string,
    ytName: string,
    inputs: YTCInput,
    gain?: YTCGain,
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
    }

}



// Calculates the expected gains from a set of yield token compound simulation, at a specific average variable rate
// param speculatedVariableRate, the estimated average yield of the underlying vault over the course of the term
// param ytcOutputs, a set of yield token compounding simulation results to have gains calculated upon
// Returns YTCOutput[], an aray of yield token compounding results augmented with gain information
export const calculateGainsFromSpeculatedRate = (speculatedVariableRate: number, ytcOutputs: YTCOutput[]): YTCOutput[] => {
    const rates = ytcOutputs.map((ytcOutput) => {
        return {
            ...ytcOutput,
            gain: calculateGain(ytcOutput.ytExposure, speculatedVariableRate, ytcOutput.trancheExpiration, ytcOutput.baseTokensSpent)
        }
    })

    return rates;
}

// Calculates the expected gains from a yield token compound simulation
// param speculatedVariableRate
export const calculateGain = (ytExposure: number, speculatedVariableRate: number, trancheExpiration: number, baseTokensSpent: number): YTCGain => {
    const termRemainingYears = getRemainingTrancheYears(trancheExpiration);

    console.log(speculatedVariableRate, termRemainingYears, ytExposure, baseTokensSpent)

    const netGain = (speculatedVariableRate * termRemainingYears * ytExposure) - baseTokensSpent //- gasFee;
    const finalApy = (netGain / baseTokensSpent)*100
    console.log('finalApy', finalApy)

    return {
        netGain,
        finalApy
    }
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