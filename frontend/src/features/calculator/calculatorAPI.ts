import { BigNumber, BigNumberish, Contract, ethers, Signer } from "ethers";
import YieldTokenCompounding from '../../artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json'
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json'
import {ITranche as ITrancheType} from '../../hardhat/typechain/ITranche';
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json'
import {ERC20 as ERC20Type} from '../../hardhat/typechain/ERC20';
import { ConstantsObject, Tranche } from "../../types/manual/types";
import _ from 'lodash';
import { YieldTokenCompounding as YieldTokenCompoundingType } from "../../hardhat/typechain/YieldTokenCompounding";

const MILLISECONDS_PER_DAY = 1000*60*60*24;
const MILLISECONDS_PER_YEAR = MILLISECONDS_PER_DAY*365;
// TODO: Not sure how this will be calculated, as it's required in order to simulate in the first place
const MINIMUM_OUTPUT = "0";

export interface YieldExposureData {
    baseTokenAddress: string;
    numberOfCompounds: number,
    trancheAddress: string;
    amountCollateralDeposited: BigNumberish,
    ytcContractAddress: string;
}

export interface YTCOutput {
    ytExposure: number,
    remainingTokens: number,
    ethGasFees: number,
    baseTokensSpent: number,
    trancheExpiration: number,
    baseTokenName: string,
    ytName: string,
    inputs: YieldExposureData,
}

interface YieldCalculationParameters {
    ytc: Contract;
    trancheAddress: string;
    balancerPoolId: string;
    yieldTokenDecimals: number;
    baseTokenDecimals: number;
    trancheExpiration: number;
    baseTokenName: string;
    ytName: string;
}

const getYieldCalculationParameters = async (userData: YieldExposureData, constants: ConstantsObject, signer: Signer): Promise<YieldCalculationParameters> => {
    const ytcAbi = YieldTokenCompounding.abi;
    const erc20Abi = ERC20.abi;
    const trancheAbi = ITranche.abi;

    // Get data
    const baseTokenName = getTokenNameByAddress(userData.baseTokenAddress, constants.tokens);
    if (!baseTokenName){
        throw new Error("Could not find base token name");
    }

    const yieldTokenCompoundingAddress = userData.ytcContractAddress;
    const baseTokenAddress: string = userData.baseTokenAddress;

    // Get specific tranche
    const trancheDetails: Tranche | undefined = getTrancheByAddress(userData.trancheAddress, constants.tranches[baseTokenName]);
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
    const ytName = await yieldToken.symbol();
    const yieldTokenDecimals = ethers.BigNumber.from(await yieldToken.decimals()).toNumber();
    const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);
    const baseTokenDecimals = ethers.BigNumber.from(await baseToken.decimals()).toNumber();

    return {
        ytc,
        trancheAddress,
        trancheExpiration,
        balancerPoolId,
        yieldTokenDecimals,
        baseTokenDecimals,
        baseTokenName,
        ytName,
    }

}


export const calculateYieldExposure = async ({ytc, trancheAddress, trancheExpiration, balancerPoolId, yieldTokenDecimals, baseTokenDecimals, baseTokenName, ytName}: YieldCalculationParameters, userData: YieldExposureData, signer: Signer): Promise<YTCOutput> => {
    console.log('Calculating Yield Exposure');
    const baseTokenAmountAbsolute = ethers.utils.parseUnits(userData.amountCollateralDeposited.toString(), baseTokenDecimals);

    console.log({
        numberOfCompounds: userData.numberOfCompounds,
        trancheAddress,
        balancerPoolId,
        baseTokenAmountAbsolute,
        MINIMUM_OUTPUT
    })
    // Call the method statically to calculate the estimated return
    const returnedVals = await ytc.callStatic.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, MINIMUM_OUTPUT);

    // Estimate the required amount of gas, this is likely very imprecise
    const gasAmountEstimate = await ytc.estimateGas.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, MINIMUM_OUTPUT);

    const ethGasFees = await gasLimitToEthGasFee(signer, gasAmountEstimate);

    // Convert the result to a number
    const [ytExposureAbsolute, baseTokensSpentAbsolute]: BigNumber[] = returnedVals.map((val: any) => ethers.BigNumber.from(val));

    const remainingTokensAbsolute = BigNumber.from(baseTokenAmountAbsolute).sub(BigNumber.from(baseTokensSpentAbsolute));

    const ytExposureNormalized = parseFloat(ethers.utils.formatUnits(ytExposureAbsolute, yieldTokenDecimals))
    const remainingTokensNormalized = parseFloat(ethers.utils.formatUnits(remainingTokensAbsolute, baseTokenDecimals))
    const baseTokensSpentNormalized = parseFloat(ethers.utils.formatUnits(baseTokensSpentAbsolute, baseTokenDecimals))

    return {
        ytExposure: ytExposureNormalized,
        remainingTokens: remainingTokensNormalized,
        ethGasFees,
        baseTokensSpent: baseTokensSpentNormalized,
        trancheExpiration,
        baseTokenName,
        ytName,
        inputs: userData,
    }
}

export const calculateYieldExposures = async (userData: YieldExposureData, constants: ConstantsObject, compoundRange: [number, number], signer: Signer): Promise<YTCOutput[]> => {

    const yieldCalculationParameters = await getYieldCalculationParameters(userData, constants, signer);

    const promises =  _.range(...compoundRange).map((index) => {
        const data: YieldExposureData = { 
            ...userData,
            numberOfCompounds: index
        }

        return calculateYieldExposure(
            yieldCalculationParameters,
            data,
            signer
        )
    })

    return await Promise.all(promises)
}

export const calculateGainsFromSpeculatedRate = (speculatedVariableRate: number, ytcOutputs: YTCOutput[]) => {
    const rates = ytcOutputs.map((ytcOutput) => {
        return {
            ...ytcOutput,
            ...calculateGain(ytcOutput.ytExposure, speculatedVariableRate, ytcOutput.trancheExpiration, ytcOutput.baseTokensSpent)
        }
    })

    return rates;
}

export const executeYieldTokenCompounding = async (userData: YieldExposureData, expectedYieldTokens: number, slippageTolerancePercentage: number, constants: ConstantsObject, signer: Signer) => {
    const yieldCalculationParameters = await getYieldCalculationParameters(userData, constants, signer);

    const baseTokenAmountAbsolute = ethers.utils.parseUnits(userData.amountCollateralDeposited.toString(), yieldCalculationParameters.baseTokenDecimals);
    const expectedYieldTokensAbsolute = ethers.utils.parseUnits(expectedYieldTokens.toString(), yieldCalculationParameters.yieldTokenDecimals);

    // The maximum number of yTokens that can be lost due to slippage
    const maximumSlippageTokens = expectedYieldTokens * (slippageTolerancePercentage/100);
    const maximumSlippageTokensAbsolute = ethers.utils.parseUnits(maximumSlippageTokens.toString(), yieldCalculationParameters.yieldTokenDecimals);

    // The minimum number of yTokens that should be received
    const minimumYieldAbsolute = expectedYieldTokensAbsolute.sub(maximumSlippageTokensAbsolute);

    const ytc: YieldTokenCompoundingType = yieldCalculationParameters.ytc as YieldTokenCompoundingType;

    const transaction = await ytc.compound(userData.numberOfCompounds, userData.trancheAddress, yieldCalculationParameters.balancerPoolId, baseTokenAmountAbsolute, minimumYieldAbsolute);

    const transactionReceipt = await transaction.wait();

    return transactionReceipt;
}

const getTrancheByAddress = (address: string, tranches: Tranche[]): Tranche | undefined => {
    return _.find(tranches, (tranche) => {
        return tranche.address === address
    })
}

const getRemainingTrancheYears = (trancheExpiration: number): number => {
    const ms = getRemainingTrancheTimeMs(trancheExpiration);

    return ms/MILLISECONDS_PER_YEAR;
}

const getRemainingTrancheTimeMs = (trancheExpiration: number): number => {
    const currentMs = (new Date()).getTime();
    const trancheMs = trancheExpiration * 1000;

    return trancheMs - currentMs;
}

export const calculateGain = (ytExposure: number, speculatedVariableRate: number, trancheExpiration: number, baseTokensSpent: number) => {
    const termRemainingYears = getRemainingTrancheYears(trancheExpiration);

    const netGain = (speculatedVariableRate * termRemainingYears * ytExposure) - baseTokensSpent //- gasFee;
    const finalApy = (netGain / baseTokensSpent)*100

    return {
        netGain,
        finalApy
    }
}

// eslint-disable-next-line
const gasLimitToEthGasFee = async (signer: ethers.Signer, gasAmountEstimate: ethers.BigNumber): Promise<number> => {
    const {maxFeePerGas, maxPriorityFeePerGas} = await signer.getFeeData();

    if (!maxFeePerGas || !maxPriorityFeePerGas){
        throw Error('get gas fees failed')
    }

    const gasCostWei: ethers.BigNumber = gasAmountEstimate.mul(maxFeePerGas.add(maxPriorityFeePerGas));

    const gasCostEth: string = ethers.utils.formatEther(gasCostWei);
    
    return parseFloat(gasCostEth);
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

// // Grabs the pricefeed of the base asset compared to eth used for gas
// const ethToBaseAsset = async (provider: ethers.providers.Web3Provider, baseTokenContract: Contract): Promise<BigNumber> => {

// }