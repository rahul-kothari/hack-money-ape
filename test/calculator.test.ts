// Calculator is used to estimate the YTC output from the ytc contract
import { calculateYieldExposure, YieldExposureData } from '../frontend/src/features/calculator/calculatorAPI';
import hre, { deployments } from 'hardhat';
import ERC20 from '../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../frontend/src/types/ERC20';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { constants as mainnetConstants } from './mainnet-constants';
import { constants as goerliConstants} from './goerli-constants';
import { getAllTokens } from '../scripts/helpers/getTokens';
import { Deployment } from 'hardhat-deploy/dist/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

if (hre.network.name == "goerli"){
    var constants = goerliConstants;
} else {
    var constants = mainnetConstants;
}

let deployment: Deployment;
let erc20Abi;
let signer: SignerWithAddress;

describe('calculate yield exposure test', () => {
    before(async () => {
        // Check that the contract has been deployed
        await deployments.fixture(['YieldTokenCompounding'])
        // This transfers tokens to the user account
        await getAllTokens();
        deployment = await hre.deployments.get('YieldTokenCompounding');
        signer = (await hre.ethers.getSigners())[0];
    })

    it('should yield results', async () => {

        const tokenName = "lusd3crv-f"
        const decimalAmount = 1000;

        const tokenAddress = constants.tokens[tokenName];

        erc20Abi = ERC20.abi;

        // erc20 as our main user
        const erc20Contract: ERC20Type  = (new hre.ethers.Contract(tokenAddress, erc20Abi, signer) as ERC20Type);

        // Sending 1000 units of the token
        const decimals = await erc20Contract.decimals()
        const amount = BigNumber.from(decimalAmount).mul(BigNumber.from(10).pow(decimals))

        // approve the amount required for the test
        const tx = await erc20Contract.approve(deployment.address, amount)

        const userData: YieldExposureData = {
            baseTokenName: tokenName,
            trancheIndex: 0,
            amountCollateralDeposited: amount.toNumber(),
            numberOfCompounds: 1,
            ytcContractAddress: deployment.address,
        }

        console.log(await calculateYieldExposure(userData, constants, signer))
    })

})

