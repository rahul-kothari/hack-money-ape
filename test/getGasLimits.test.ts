// This is to get the amount of gas used to perform ytc with a variety of tokens and number of compounds
import hre, { deployments } from 'hardhat';
import mainnetConstants from '../constants/mainnet-constants.json';
import goerliConstants from '../constants/goerli-constants.json';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Deployment } from 'hardhat-deploy/dist/types';
import { getAllTokens } from '../scripts/helpers/getTokens';
import { YieldTokenCompounding as YieldTokenCompoundingType} from '../frontend/src/hardhat/typechain/YieldTokenCompounding';
import { ERC20 as ERC20Type} from '../frontend/src/hardhat/typechain/ERC20';
import ERC20 from '../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import { getActiveTranches } from '../frontend/src/features/element';
import {sendApproval} from '../frontend/src/features/approval/approvalAPI';
import { ethers } from 'ethers';
import _ from 'lodash';
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
let ytc: YieldTokenCompoundingType;

const gasUsed: {[key: number]: string[]} = {};

describe('get gas used for tokens', () => {
    before(async () => {
        // Check that the contract has been deployed
        await deployments.fixture(['YieldTokenCompounding'])
        deployment = await hre.deployments.get('YieldTokenCompounding');
        signer = (await hre.ethers.getSigners())[0];
        ytc = (new hre.ethers.Contract(deployment.address, deployment.abi, signer)) as YieldTokenCompoundingType;
        // This transfers tokens to the user account
        return getAllTokens();

    })

    it('should execute ytc with usdc and 1-8 compounds', async function(){
        this.timeout(40000);
        // we already have the tokens required
        // We need to approve the balancer pool for the token
        return executeYTCForToken('usdc', [1,8])
    })
    it('should execute ytc with crv3crypto and 1-8 compounds', async function(){
        this.timeout(40000);
        // we already have the tokens required
        // We need to approve the balancer pool for the token
        return executeYTCForToken('crv3crypto', [1,8])
    })
})

const executeYTCForToken = async (baseTokenName: string, compoundRange: [number, number]) => {
    // get the token address
    const baseTokenAddress = constants.tokens[baseTokenName];
    // get the active tranches, if none, there is no point in running the test
    const activeTranches = await getActiveTranches(baseTokenAddress, constants)
    if (activeTranches.length === 0){
        console.log(baseTokenName, "has no active tranches");
        return;
    }
    const trancheDetails = activeTranches[0];
    // approve the balancer pool to spend the tranche tokens
    ytc.approveTranchePTOnBalancer(trancheDetails.address);

    // get the erc20 contract for the token
    const erc20 = new ethers.Contract(baseTokenAddress, ERC20.abi, signer) as ERC20Type;
    // approve the tranche to spend signer's tokens
    await sendApproval(MAX_UINT_HEX, ytc.address, erc20);

    const balance = await erc20.balanceOf(signer.address);

    const amount = balance.div((compoundRange[1] + 1 - compoundRange[0]));

    // execute YTC for the range of compounds
    const promises = _.range(compoundRange[0], compoundRange[1] + 1).map(async (number: number) => {
       const tx = await ytc.compound(number, trancheDetails.address, trancheDetails.ptPool.poolId, amount, 0);
       const receipt = await tx.wait();
       if (!gasUsed[number]){
           gasUsed[number] = [];
       }
       gasUsed[number].push(receipt.gasUsed.toString());
    })

    await Promise.all(promises);
    console.log(gasUsed);
}