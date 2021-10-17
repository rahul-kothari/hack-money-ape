// Calculator is used to estimate the YTC output from the ytc contract
import { YTCInput } from '../frontend/src/features/ytc/ytcHelpers';
import { simulateYTCForCompoundRange } from '../frontend/src/features/ytc/simulateYTC';
import mainnetConstants from '../constants/mainnet-constants.json';
import goerliConstants from '../constants/goerli-constants.json';
import hre, { deployments, ethers } from 'hardhat';
import ERC20 from '../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../frontend/src/hardhat/typechain/ERC20';
import {YieldTokenCompounding as YieldTokenCompoundingType} from '../frontend/src/hardhat/typechain/YieldTokenCompounding'
import { BigNumber } from '@ethersproject/bignumber';
import { getAllTokens } from '../scripts/helpers/getTokens';
import { Deployment } from 'hardhat-deploy/dist/types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ElementAddresses } from '../frontend/src/types/manual/types';

const MAX_UINT_HEX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

let constants: ElementAddresses;

if (hre.network.name == "goerli"){
    constants = goerliConstants;
} else {
    constants = mainnetConstants;
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
        console.log('beforeAll complete')
    })

    it('should yield results', async () => {

        const tokenName = "lusd3crv-f"
        const trancheAddress = constants.tranches[tokenName][1].address;
        const amountNormalized = 1000;

        const tokenAddress = constants.tokens[tokenName];

        erc20Abi = ERC20.abi;

        // erc20 as our main user
        const erc20Contract: ERC20Type  = (new hre.ethers.Contract(tokenAddress, erc20Abi, signer) as ERC20Type);

        // Sending 1000 units of the token
        const decimals = await erc20Contract.decimals()
        const amountAbsolute = ethers.utils.parseUnits(amountNormalized.toString(), decimals);

        console.log('deployment address', deployment.address);

        // approve the amount required for the test
        const tx = await erc20Contract.approve(deployment.address, amountAbsolute.mul(2))

        await tx.wait();

        const yieldTokenCompoundingcontract: YieldTokenCompoundingType = (new hre.ethers.Contract(deployment.address, deployment.abi, signer)) as YieldTokenCompoundingType;

        const allowanceTx1 = await yieldTokenCompoundingcontract.checkTranchePTAllowanceOnBalancer(trancheAddress)
        
        expect(allowanceTx1).to.equal(BigNumber.from(0));

        const tx2 = await yieldTokenCompoundingcontract.approveTranchePTOnBalancer(trancheAddress)

        await tx2.wait();

        const allowanceTx2 = await yieldTokenCompoundingcontract.checkTranchePTAllowanceOnBalancer(trancheAddress)
        
        expect(allowanceTx2).to.equal(BigNumber.from(MAX_UINT_HEX));

        const userData: YTCInput = {
            baseTokenAddress: tokenAddress,
            trancheAddress: trancheAddress,
            amountCollateralDeposited: amountAbsolute,
            numberOfCompounds: 1,
            ytcContractAddress: deployment.address,
        }

        console.log(userData);

        const results = await simulateYTCForCompoundRange(userData, constants, [1,4], signer);
        console.log(results);
    })

})

