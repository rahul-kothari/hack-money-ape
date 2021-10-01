import hre, { deployments } from 'hardhat';
import ERC20 from '../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../frontend/src/types/ERC20';
import { BigNumber } from '@ethersproject/bignumber';
import { constants as mainnetConstants } from './mainnet-constants';
import { constants as goerliConstants} from './goerli-constants';
import { tokenHolders } from '../test/constants/tokenHolders';

if (hre.network.name == "goerli"){
    var constants = goerliConstants;
} else {
    var constants = mainnetConstants;
}

const getTokens = async (largeHolderAddress: string, tokenName: string, decimalAmount: number) => {
    const YTCDeployment = await hre.deployments.get('YieldTokenCompounding');

    const signer = (await hre.ethers.getSigners())[0];
    console.log('signer address', signer.address);
    // impersonate a large holder of lusdcurve3
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [largeHolderAddress],
      });

    const largeHolderSigner = await hre.ethers.getSigner(largeHolderAddress)

    const erc20Abi = ERC20.abi;

    const tokenAddress = constants.tokens[tokenName];

    console.log(tokenName, tokenAddress);

    const erc20Contract: ERC20Type  = (new hre.ethers.Contract(tokenAddress, erc20Abi, largeHolderSigner) as ERC20Type);

    // Sending 1000 units of the token
    const decimals = await erc20Contract.decimals()
    const amount = BigNumber.from(decimalAmount).mul(BigNumber.from(10).pow(decimals))

    const balance = await erc20Contract.balanceOf(largeHolderSigner.address);

    if (balance.sub(amount).isNegative()){
      console.log('The account does not have enough tokens');
      return;
    }

    // Create the transfer transaction
    const transaction = await erc20Contract.transfer(signer.address, amount);
    await transaction.wait()

}


async function main() {

  const promises = tokenHolders.map((entry) => {
    return getTokens(entry.largeHolderAddress, entry.tokenName, entry.amount)
  })

  await Promise.all(promises);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
