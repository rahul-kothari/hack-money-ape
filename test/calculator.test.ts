// Calculator is used to estimate the YTC output from the ytc contract
import { calculateYieldExposure, YieldExposureData } from '../frontend/src/features/calculator/calculatorAPI';
import hre, { deployments } from 'hardhat';
import ERC20 from '../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../frontend/src/types/ERC20';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { constants as mainnetConstants } from './mainnet-constants';
import { constants as goerliConstants} from './goerli-constants';

if (hre.network.name == "goerli"){
    var constants = goerliConstants;
} else {
    var constants = mainnetConstants;
}

const TOKEN_WHALE = "0x959fdba32f2a3aa6099e5ff9290977d89c20270f"
const TOKEN_NAME = "lusd3crv-f"

describe('calculate yield exposure test', () => {
    it('should yield results', async () => {

        await deployments.fixture(['YieldTokenCompounding'])

        const YTCDeployment = await hre.deployments.get('YieldTokenCompounding');

        const signer = (await hre.ethers.getSigners())[0];
        // impersonate a large holder of lusdcurve3
        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [TOKEN_WHALE],
          });
        const whaleSigner = await hre.ethers.getSigner(TOKEN_WHALE)

        // allow the contract to transfer tokens
        const tokenName = TOKEN_NAME

        const erc20Abi = ERC20.abi;

        const tokenAddress = constants.tokens[tokenName];

        console.log(tokenName, tokenAddress);

        const erc20Contract: ERC20Type  = (new hre.ethers.Contract(tokenAddress, erc20Abi, whaleSigner) as ERC20Type);

        // Sending 1000 units of the token
        const decimals = await erc20Contract.decimals()
        const amount = BigNumber.from(1000).mul(BigNumber.from(10).pow(decimals))

        // Create the transfer transaction
        const transaction = await erc20Contract.transfer(signer.address, amount);

        // Wait until the transaction is confirmed
        transaction.wait();

        const userData: YieldExposureData = {
            baseTokenName: tokenName,
            trancheIndex: 0,
            amountCollateralDeposited: 100000000,
            numberOfCompounds: 1,
            ytcContractAddress: YTCDeployment.address,
        }

        console.log(await calculateYieldExposure(userData, constants, signer))
    })

})

