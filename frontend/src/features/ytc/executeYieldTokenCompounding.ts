import { ContractReceipt, ethers, Signer } from "ethers";
import { ElementAddresses } from "../../types/manual/types";
import { getYTCParameters, YTCInput } from "./ytcHelpers";
import { YieldTokenCompounding as YieldTokenCompoundingType } from "../../hardhat/typechain/YieldTokenCompounding";


// Executes the compound method on the YTC contract
// param userData, input data selected by the user, token, number of compounds, amount of collateral
// param expectedYieldTokens, the number of yTokens that the simulation of the compound resulted in
// param slippageTolerancePercentage, the percentage that the actual number of yTokens can be less than the expectedYieldTokens
// param elementAddresses, the constants object containing element deployment addresses
// param signer, the signer of the transaction
// Returns a transaction receipt
export const executeYieldTokenCompounding = async (userData: YTCInput, expectedYieldTokens: number, expectedBaseTokensSpent: number, slippageTolerancePercentage: number, elementAddresses: ElementAddresses, signer: Signer): Promise<ContractReceipt> => {
    const yieldCalculationParameters = await getYTCParameters(userData, elementAddresses, signer);

    const expectedYieldTokensAbsolute = ethers.utils.parseUnits(expectedYieldTokens.toString(), yieldCalculationParameters.yieldTokenDecimals);

    let expectedBaseTokensSpentAbsolute;
    try {
        // If there are too many decimals parsing the units will fail, thus we cut it to 6 decimals
        expectedBaseTokensSpentAbsolute = ethers.utils.parseUnits(expectedBaseTokensSpent.toString(), yieldCalculationParameters.baseTokenDecimals);
    } catch {
        expectedBaseTokensSpentAbsolute = ethers.utils.parseUnits((expectedBaseTokensSpent.toFixed(6)), yieldCalculationParameters.baseTokenDecimals)
    }

    // The maximum number of yTokens that can be lost due to slippage
    // This will be half the maximum slippage
    const maximumSlippageYTokens = expectedYieldTokens * (slippageTolerancePercentage/2/100);

    // The maximum number of base tokens that can be lost due to slippage
    // This will be half the maximum slippage
    const maximumSlippageBaseTokens = expectedBaseTokensSpent * (slippageTolerancePercentage/2/100);

    let maximumSlippageYTokensAbsolute;
    try {
        // If there are too many decimals parsing the units will fail, thus we cut it to 6 decimals
        maximumSlippageYTokensAbsolute = ethers.utils.parseUnits((maximumSlippageYTokens).toString(), yieldCalculationParameters.yieldTokenDecimals);
    } catch {
        maximumSlippageYTokensAbsolute = ethers.utils.parseUnits((maximumSlippageYTokens.toFixed(6)), yieldCalculationParameters.yieldTokenDecimals)
    }
    let maximumSlippageBaseTokensAbsolute;
    try {
        // If there are too many decimals parsing the units will fail, thus we cut it to 6 decimals
        maximumSlippageBaseTokensAbsolute = ethers.utils.parseUnits((maximumSlippageBaseTokens).toString(), yieldCalculationParameters.baseTokenDecimals);
    } catch {
        maximumSlippageBaseTokensAbsolute = ethers.utils.parseUnits((maximumSlippageBaseTokens.toFixed(6)), yieldCalculationParameters.baseTokenDecimals)
    }

    // The minimum number of yTokens that should be received
    const minimumYieldAbsolute = expectedYieldTokensAbsolute.sub(maximumSlippageYTokensAbsolute);
    const maximumSpentAbsolute = expectedBaseTokensSpentAbsolute.add(maximumSlippageBaseTokensAbsolute);

    console.log(maximumSpentAbsolute.toString());

    const ytc: YieldTokenCompoundingType = yieldCalculationParameters.ytc as YieldTokenCompoundingType;

    const transaction = await ytc.compound(userData.numberOfCompounds, userData.trancheAddress, yieldCalculationParameters.balancerPoolId, yieldCalculationParameters.baseTokenAmountAbsolute, minimumYieldAbsolute, maximumSpentAbsolute);

    const transactionReceipt = await transaction.wait();

    return transactionReceipt;
}