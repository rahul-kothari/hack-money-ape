import { BigNumber, ethers, Signer } from "ethers";
import _ from "lodash";
import { ElementAddresses } from "../../types/manual/types";
import { calculateGain, getYTCParameters, YTCInput, YTCOutput, YTCParameters } from "./ytcHelpers";

// Simulates a single yield token compounding execution to determine what the output would be
// No actual transaction is executed
// param YTC Parameters, derived params required to execute the transaction, a ytc contract instance, the balancer pool, decimals for tokens, the name of the yield token etc.
// param userData, user input data for simulating the transaction
// param signer, Signer of the transaction
// returns YTCOutput, contains both input data, and the results fo the simulation, including yield exposure, gas fees, tokens spent, remaining tokens etc.
export const simulateYTC = async ({ytc, trancheAddress, trancheExpiration, balancerPoolId, yieldTokenDecimals, baseTokenDecimals, baseTokenName, ytSymbol: ytName, baseTokenAmountAbsolute}: YTCParameters, userData: YTCInput, signer: Signer): Promise<YTCOutput> => {
    // Call the method statically to calculate the estimated return
    const returnedVals = await ytc.callStatic.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, "0");

    // Estimate the required amount of gas, this is likely very imprecise
    // const gasAmountEstimate = await ytc.estimateGas.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, baseTokenAmountAbsolute, "0");

    // const ethGasFees = await gasLimitToEthGasFee(signer, gasAmountEstimate);

    // Convert the result to a number
    const [ytExposureAbsolute, baseTokensSpentAbsolute]: BigNumber[] = returnedVals.map((val: any) => ethers.BigNumber.from(val));

    const remainingTokensAbsolute = BigNumber.from(baseTokenAmountAbsolute).sub(BigNumber.from(baseTokensSpentAbsolute));

    const ytExposureNormalized = parseFloat(ethers.utils.formatUnits(ytExposureAbsolute, yieldTokenDecimals))
    const remainingTokensNormalized = parseFloat(ethers.utils.formatUnits(remainingTokensAbsolute, baseTokenDecimals))
    const baseTokensSpentNormalized = parseFloat(ethers.utils.formatUnits(baseTokensSpentAbsolute, baseTokenDecimals))

    let gain = undefined;
    if (userData.variableApy){
        gain = calculateGain(ytExposureNormalized, userData.variableApy, trancheExpiration, baseTokensSpentNormalized);
    }


    return {
        ytExposure: ytExposureNormalized,
        remainingTokens: remainingTokensNormalized,
        ethGasFees: 0,
        baseTokensSpent: baseTokensSpentNormalized,
        trancheExpiration,
        baseTokenName,
        gain,
        ytName,
        inputs: userData,
    }
}

// Runs the simulateYTC method for a range of compounds, rather than just one
// param userData, user input data for simulating the transaction
// param elementAddresses, constant containing the deployment addresses of tokens vaults and pools
// param compound Range, the lowest, and largest number of compounds for the simulation to execute
// param signer, Signer of the transaction
// Returns YTCOutput[], an array of yield token compounding outputs
export const simulateYTCForCompoundRange = async (userData: YTCInput, constants: ElementAddresses, compoundRange: [number, number], signer: Signer): Promise<YTCOutput[]> => {

    const yieldCalculationParameters = await getYTCParameters(userData, constants, signer);

    const promises =  _.range(compoundRange[0], compoundRange[1] + 1).map((index) => {
        const data: YTCInput = { 
            ...userData,
            numberOfCompounds: index
        }

        return simulateYTC(
            yieldCalculationParameters,
            data,
            signer
        )
    })

    return await Promise.all(promises)
}

//eslint-disable-next-line
const gasLimitToEthGasFee = async (signer: ethers.Signer, gasAmountEstimate: ethers.BigNumber): Promise<number> => {
    const {maxFeePerGas, maxPriorityFeePerGas} = await signer.getFeeData();

    if (!maxFeePerGas || !maxPriorityFeePerGas){
        throw Error('get gas fees failed')
    }

    const gasCostWei: ethers.BigNumber = gasAmountEstimate.mul(maxFeePerGas.add(maxPriorityFeePerGas));

    const gasCostEth: string = ethers.utils.formatEther(gasCostWei);
    
    return parseFloat(gasCostEth);
}
