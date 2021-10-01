import { BigNumber, BigNumberish, ethers, Signer } from "ethers";
import YieldTokenCompounding from '../../artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json'
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json'
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json'
import { ConstantsObject, Tranche } from "../../types/manual/types";

// const MILLISECONDS_PER_DAY = 1000*60*60*24;

export interface YieldExposureData {
    baseTokenName: string;
    numberOfCompounds: number,
    trancheIndex: number;
    amountCollateralDeposited: BigNumberish,
    ytcContractAddress: string;
}

export interface YTCOutput {
    ytExposure: number,
    remainingTokens: BigNumberish,
    ethGasFees: number,
}

export interface CalculatorData {
    baseTokenName: string;
    trancheIndex: number;
    amountCollateralDeposited: number,
    speculatedVariableRate: number,
    ytcContractAddress: string;
}

//TODO this shouldn't really exist;
const mockValues: YTCOutput[] = [
    {
        ytExposure: 10, 
        ethGasFees: 0.15,
        remainingTokens: 1000
    },
    {
        ytExposure: 19.8, 
        ethGasFees: 0.1,
        remainingTokens: 1000
    },
    {
        ytExposure: 28.7, 
        ethGasFees: 0.11,
        remainingTokens: 1000
    },
    {
        ytExposure: 37, 
        ethGasFees: 0.22,
        remainingTokens: 1000
    }
]


export const calculateMock = async (userData: CalculatorData): Promise<YTCOutput[]> => {
    return new Promise<YTCOutput[]>((resolve, reject) => {
        setTimeout(() => {
            resolve(mockValues)
        }, 1000)
    })
}

export const calculateYieldExposure = async (userData: YieldExposureData, constants: ConstantsObject, signer: Signer): Promise<YTCOutput>=> {

    const ytcAbi = YieldTokenCompounding.abi;
    const erc20Abi = ERC20.abi;
    const trancheAbi = ITranche.abi;

    // Get data
    const yieldTokenCompoundingAddress = userData.ytcContractAddress;
    const tokens: any = constants.tokens;
    const baseTokenAddress: string = tokens[userData.baseTokenName];

    // Get specific tranche
    const trancheDetails = constants.tranches[userData.baseTokenName][userData.trancheIndex];

    // if it is expired throw an error
    if (!isTrancheActive(trancheDetails)){
        throw new Error("Tranche is expired");
    }

    const trancheAddress = trancheDetails.address;
    const balancerPoolId = trancheDetails.ptPool.poolId;    
    
    // Load contracts
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signer);
    const tranche = new ethers.Contract(trancheAddress, trancheAbi, signer);
    const yieldTokenAddress = await tranche.interestToken();
    const yieldToken = new ethers.Contract(yieldTokenAddress, erc20Abi, signer);
    const yieldTokenDecimals = ethers.BigNumber.from(await yieldToken.decimals()).toNumber();
    const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);
    const baseTokenDecimals = ethers.BigNumber.from(await baseToken.decimals()).toNumber();

    // Call the method statically to calculate the estimated return
    const returnedVals = await ytc.callStatic.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, userData.amountCollateralDeposited, "100");

    // Estimate the required amount of gas, this is likely very imprecise
    const gasAmountEstimate = await ytc.estimateGas.compound(userData.numberOfCompounds, trancheAddress, balancerPoolId, userData.amountCollateralDeposited, "100");

    const ethGasFees = await gasLimitToEthGasFee(signer, gasAmountEstimate);

    // Convert the result to a number
    const [ytExposureDecimals, baseTokensSpentDecimals] = returnedVals.map((val: any) => ethers.BigNumber.from(val).toNumber());
    const ytExposure = ytExposureDecimals / (10**yieldTokenDecimals);
    const baseTokensSpent = baseTokensSpentDecimals / (10**baseTokenDecimals);

    const remainingTokens = BigNumber.from(userData.amountCollateralDeposited).sub(BigNumber.from(baseTokensSpent));

    return {
        ytExposure,
        remainingTokens,
        ethGasFees,
    }
}


// Demo script to show how to build a YTC calculator!
export const calculate = async (userData: CalculatorData, constants: ConstantsObject, signer: Signer) => {

    const ytcAbi = YieldTokenCompounding.abi;
    const erc20Abi = ERC20.abi;
    const trancheAbi = ITranche.abi;

    // Get data
    const yieldTokenCompoundingAddress = userData.ytcContractAddress;
    const tokens: any = constants.tokens;
    const baseTokenAddress: string = tokens[userData.baseTokenName];
    // Get specific tranche
    
    const trancheDetails = constants.tranches[userData.baseTokenName][userData.trancheIndex];
    const trancheAddress = trancheDetails.address;
    const balancerPoolId = trancheDetails.ptPool.poolId;    
    
    // Load contracts
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signer);
    const tranche = new ethers.Contract(trancheAddress, trancheAbi, signer);
    const yieldTokenAddress = await tranche.interestToken();
    const yieldToken = new ethers.Contract(yieldTokenAddress, erc20Abi, signer);
    const yieldTokenDecimals = ethers.BigNumber.from(await yieldToken.decimals()).toNumber();
    const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);
    const baseTokenDecimals = ethers.BigNumber.from(await baseToken.decimals()).toNumber();

    /**
     * FORMULA: 
     * Collateral Deposited = amount of base tokens deposited = `amountCollateralDeposited`
     * Balance = final amount of base tokens left
     * base tokens spent = Collateral Deposited - Balance
     * term = days left in term /365
     * yield exposure = number of YTs
     * gross gain = (speculated variable rate * term) * Yield exposure + Balance
     * Net gain = gross gain - collateral deposited - gas fee
     *       = (speculated variable rate * term) * Yield exposure - base Tokens Spent - gas fee
     * Adjusted APR = (Net Gain / (Collateral Deposited - Balance))*100 
     *              = (Net Gain / (base tokens spent))*100 
     */
    // Calculate the expiration in milliseconds
    // const trancheExpirationTimestamp = trancheDetails.expiration * 1000
    // const daysLeftInTerm = Math.floor((trancheExpirationTimestamp - new Date().getTime())/MILLISECONDS_PER_DAY);

    // const term = daysLeftInTerm/365
    
    let values: YTCOutput[] = [];
    for (let i=1; i<11; i++) {
        // TODO: Gas fee estimation + tx fee + convert to base token amount
        // let gasFee = ethers.utils.formatEther(ethers.BigNumber.from(await ytc.estimateGas.compound(i,trancheAddress, balancerPoolId, userData["amountCollateralDeposited"], "100")).toNumber());
        // FIXME: Need to convert gasFee in baseToken amount!
        const returnedVals = await ytc.callStatic.compound(i,trancheAddress, balancerPoolId, userData.amountCollateralDeposited, "100");

        const ethGasEstimate = await ytc.estimateGas.compound(i,trancheAddress, balancerPoolId, userData.amountCollateralDeposited, "100");

        const ethGasFees = await gasLimitToEthGasFee(signer, ethGasEstimate);


        const [ytExposureDecimals, baseTokensSpentDecimals] = returnedVals.map((val: any) => ethers.BigNumber.from(val).toNumber());
        const ytExposure = ytExposureDecimals / (10**yieldTokenDecimals);
        const baseTokensSpent = baseTokensSpentDecimals / (10**baseTokenDecimals);
        const remainingTokens = userData.amountCollateralDeposited - baseTokensSpent;
        // console.log("yt exposure, base token spent: ", ytExposure, baseTokensSpent);
        // console.log("grossYtGain: ", userData["speculatedVariableRate"] * term * ytExposure)

        // Add values to table.
        values[i] = {
            ytExposure,
            ethGasFees,
            remainingTokens
        }
    }
    return values;
}

export const calculateGain = (ytExposure: number, speculatedVariableRate: number, term: number, baseTokensSpent: number) => {

    const netGain = (speculatedVariableRate * term * ytExposure) - baseTokensSpent //- gasFee;
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

// // Grabs the pricefeed of the base asset compared to eth used for gas
// const ethToBaseAsset = async (provider: ethers.providers.Web3Provider, baseTokenContract: Contract): Promise<BigNumber> => {

// }