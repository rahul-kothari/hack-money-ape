import { Signer, Contract, utils, ethers } from "ethers";
import ICurveFi from '../../artifacts/contracts/yearn/ICurveFi.sol/ICurveFi.json';
import { CURVE_SWAP_ADDRESSES } from "../../constants/apy-mainnet-constants";
import { ERC20 as ERC20Type } from "../../hardhat/typechain/ERC20";
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ICurveFi as ICurveType} from '../../hardhat/typechain/ICurveFi';
import { getRelativePriceFromCoingecko } from "./coingecko";

const validCurveTokens = ["lusd3crv-f" , "crv3crypto" , "crvtricrypto" , "stecrv" , "alusd3crv-f", "mim-3lp3crv-f", "eurscrv"]
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
    const basePrice: number = await getBasePrice(tokenName, swapAddress, signer)

    // get the price of 
    return basePrice * virtualPrice;
}

const getBasePrice = async (tokenName: string, swapAddress: string, signer: Signer): Promise<number> => {
    let basePrice: number;
    let ethPrice;
    switch(tokenName){
        case "crv3crypto": 
            basePrice = await getTriCryptoPrice(swapAddress, signer);
            break;
        case "crvtricrypto": 
            basePrice = await getTriCryptoPrice(swapAddress, signer);
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
        case "eurscrv": 
            basePrice = (1 / await getRelativePriceFromCoingecko("usdc", "eur"))
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

const getTriCryptoPrice = async (tokenAddress: string, signer: Signer): Promise<number> => {
    console.log(tokenAddress)
    const curveAbi = ICurveFi.abi;

    const curveContract = new Contract(tokenAddress, curveAbi, signer) as ICurveType;

    const lpTokenAddress = await curveContract.token();
    console.log("lpTokenAddress", lpTokenAddress);

    const usdtBalanceAbsolute = await curveContract.balances(0);
    console.log("usdtBalanceAbsolute", usdtBalanceAbsolute);

    const erc20Abi = ERC20.abi;

    const erc20Contract = new Contract(lpTokenAddress, erc20Abi, signer) as ERC20Type;

    const totalSupplyAbsolute = await erc20Contract.totalSupply();
    console.log("totalSupplyAbsolute", totalSupplyAbsolute);

    // USDT makes up a third of the pool thus we can multiply the number of tokens by 3
    // USDT decimals is 6
    const approximateTotalValue = parseFloat(ethers.utils.formatUnits(usdtBalanceAbsolute, 6)) * 3;
    console.log("approximateTotalValue", approximateTotalValue)

    // Total supply decimals is 18
    const totalSupplyNormalized = parseFloat(ethers.utils.formatUnits(totalSupplyAbsolute, 18));
    console.log("totalSupplyNormalized", totalSupplyNormalized);

    const price = approximateTotalValue/totalSupplyNormalized;
    console.log("price", price);

    return price;
}