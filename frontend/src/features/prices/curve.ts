// get the price of curve lp tokens

import { BigNumber } from "@ethersproject/bignumber";
import { Signer, Contract, utils} from "ethers";
import ICurveFi from '../../artifacts/contracts/yearn/ICurveFi.sol/ICurveFi.json'
import {ICurveFi as ICurveType} from '../../hardhat/typechain/ICurveFi'
import { ElementAddresses } from "../../types/manual/types";
import { getRelativePriceFromCoingecko } from "./coingecko";

const validCurveTokens = ["lusdcrv-f" , "crv3crypto" , "crvtricrypto" , "stecrv" , "alusd3crv-f", "mim-3lp3crv-f"]
export type CurveTokenName = (typeof validCurveTokens[number])
export const isCurveToken = (x: any): x is CurveTokenName => validCurveTokens.includes(x);

// TODO this should not be hardcoded and should rather be grabbed from the curve address provider
// The lusd, alusd and mim pools all have erc20/swap pools built together so the adddress is the same as the token address
const CURVE_SWAP_ADDRESSES: {[tokenName: string]: string} = {
    "crv3crypto": "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46",
    "crvtricrypto": "0x80466c64868E1ab14a1Ddf27A676C3fcBE638Fe5",
    "stecrv": "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022",
    "lusdcrv-f": "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA",
    "alusd3crv-f": "0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c",
    "mim-3lp3crv-f": "0x5a6A4D54456819380173272A5E8E9B9904BdF41B"
}

export const getPriceOfCurveLP = async (tokenName: string, elementAddreses: ElementAddresses, signer: Signer) => {

    const tokenAddress: string = elementAddreses.tokens[tokenName];

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
    switch(tokenName){
        case "crv3crypto": 
            var ethPrice = await getRelativePriceFromCoingecko("eth", "usd")
            var wbtcPrice = await getRelativePriceFromCoingecko("wbtc", "usd")
            var usdtPrice = await getRelativePriceFromCoingecko("usdt", "usd")
            console.log(ethPrice, wbtcPrice, usdtPrice)
            // TODO where is this multiple coming from?
            basePrice = (ethPrice * wbtcPrice * usdtPrice) / (1000000*0.11260245)
            break;
        case "crvtricrypto": 
            var ethPrice = await getRelativePriceFromCoingecko("eth", "usd")
            var wbtcPrice = await getRelativePriceFromCoingecko("wbtc", "usd")
            var usdtPrice = await getRelativePriceFromCoingecko("usdt", "usd")
            // TODO where is this multiple coming from?
            basePrice = (ethPrice * wbtcPrice * usdtPrice)/(1000000*0.11260245)
            break;
        case "stecrv": 
            var ethPrice = await getRelativePriceFromCoingecko("eth", "usd")
            basePrice = ethPrice;
            break;
        case "lusdcrv-f": 
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