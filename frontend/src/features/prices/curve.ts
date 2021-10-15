import { Signer, Contract, utils} from "ethers";
import ICurveFi from '../../artifacts/contracts/yearn/ICurveFi.sol/ICurveFi.json'
import { CURVE_SWAP_ADDRESSES } from "../../constants/apy-mainnet-constants";
import {ICurveFi as ICurveType} from '../../hardhat/typechain/ICurveFi'
import { getRelativePriceFromCoingecko } from "./coingecko";

const validCurveTokens = ["lusd3crv-f" , "crv3crypto" , "crvtricrypto" , "stecrv" , "alusd3crv-f", "mim-3lp3crv-f"]
export type CurveTokenName = (typeof validCurveTokens[number])
export const isCurveToken = (x: any): x is CurveTokenName => {
    return validCurveTokens.includes(x);
}

export const getPriceOfCurveLP = async (tokenName: string, signer: Signer) => {
    const swapAddress = CURVE_SWAP_ADDRESSES[tokenName];

    if (!swapAddress){
        throw new Error('Could not find swap address for curve token')
    }

    const virtualPrice: number = await getCurveVirtualPrice(swapAddress, signer);
    // get the price of the underlying assets
    const basePrice: number = await getBasePrice(tokenName)

    // get the price of 
    return basePrice * virtualPrice;
}

const getBasePrice = async (tokenName: string): Promise<number> => {
    let basePrice: number;
    let ethPrice;
    let wbtcPrice;
    let usdtPrice
    switch(tokenName){
        case "crv3crypto": 
            ethPrice = await getRelativePriceFromCoingecko("eth", "usd")
            wbtcPrice = await getRelativePriceFromCoingecko("wbtc", "usd")
            usdtPrice = await getRelativePriceFromCoingecko("usdt", "usd")
            // TODO where is this multiple coming from?
            basePrice = (ethPrice * wbtcPrice * usdtPrice) / (1000000*0.11260245)
            break;
        case "crvtricrypto": 
            ethPrice = await getRelativePriceFromCoingecko("eth", "usd")
            wbtcPrice = await getRelativePriceFromCoingecko("wbtc", "usd")
            usdtPrice = await getRelativePriceFromCoingecko("usdt", "usd")
            // TODO where is this multiple coming from?
            basePrice = (ethPrice * wbtcPrice * usdtPrice)/(1000000*0.11260245)
            break;
        case "stecrv": 
            ethPrice = await getRelativePriceFromCoingecko("eth", "usd")
            basePrice = ethPrice;
            break;
        case "lusd3crv-f": 
            basePrice = 1;
            break;
        case "alusd3crv-f": 
            basePrice = 1;
            break;
        case "mim-3lp3crv-f": 
            basePrice = 1;
            break;
        default:
            throw new Error('Could not find curve token price')
    }
    return basePrice;
}

const getCurveVirtualPrice = async (tokenAddress: string, signer: Signer): Promise<number> => {
    // get the curve pool contract
    const curveAbi = ICurveFi.abi;
    // get the number of decimals
    const curveContract = new Contract(tokenAddress, curveAbi, signer) as ICurveType;

    const virtualPriceAbsolute = await curveContract.get_virtual_price();

    // virtual price precision for curve contracts is 18 decimal places
    const virtualPriceNormalized = parseFloat(utils.formatUnits(virtualPriceAbsolute, 18));

    // get the virtual price
    return virtualPriceNormalized;
}