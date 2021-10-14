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
export const executeYieldTokenCompounding = async (userData: YTCInput, expectedYieldTokens: number, slippageTolerancePercentage: number, elementAddresses: ElementAddresses, signer: Signer): Promise<ContractReceipt> => {
    const yieldCalculationParameters = await getYTCParameters(userData, elementAddresses, signer);

    const expectedYieldTokensAbsolute = ethers.utils.parseUnits(expectedYieldTokens.toString(), yieldCalculationParameters.yieldTokenDecimals);

    // The maximum number of yTokens that can be lost due to slippage
    const maximumSlippageTokens = expectedYieldTokens * (slippageTolerancePercentage/100);

    let maximumSlippageTokensAbsolute;
    try {
        // If there are too many decimals parsing the units will fail, thus we cut it to 8 decimals
        maximumSlippageTokensAbsolute = ethers.utils.parseUnits((maximumSlippageTokens).toString(), yieldCalculationParameters.yieldTokenDecimals);
    } catch {
        maximumSlippageTokensAbsolute = ethers.utils.parseUnits((maximumSlippageTokens.toFixed(6)), yieldCalculationParameters.yieldTokenDecimals)
    }

    // The minimum number of yTokens that should be received
    const minimumYieldAbsolute = expectedYieldTokensAbsolute.sub(maximumSlippageTokensAbsolute);

    const ytc: YieldTokenCompoundingType = yieldCalculationParameters.ytc as YieldTokenCompoundingType;

    const transaction = await ytc.compound(userData.numberOfCompounds, userData.trancheAddress, yieldCalculationParameters.balancerPoolId, yieldCalculationParameters.baseTokenAmountAbsolute, minimumYieldAbsolute);

    const transactionReceipt = await transaction.wait();

    return transactionReceipt;
}