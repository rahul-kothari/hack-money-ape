import hre, { deployments, ethers } from 'hardhat';
import ERC20 from '../../frontend/src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import {ERC20 as ERC20Type} from '../../frontend/src/hardhat/typechain/ERC20';
import mainnetConstants from '../../constants/mainnet-constants.json';
import goerliConstants from '../../constants/goerli-constants.json';
import { tokenHolders } from '../../test/constants/tokenHolders';
import { ContractReceipt } from '@ethersproject/contracts';
import { ElementAddresses } from '../../frontend/src/types/manual/types';

let constants: ElementAddresses;
if (hre.network.name == "goerli"){
    constants = goerliConstants;
} else {
    constants = mainnetConstants;
}

export const getTokens = async (largeHolderAddress: string, tokenName: string, amountNormalized: number) => {
    const signer = (await hre.ethers.getSigners())[0];
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
    const amountAbsolute = ethers.utils.parseUnits(amountNormalized.toString(), decimals);

    const balance = await erc20Contract.balanceOf(largeHolderSigner.address);

    if (balance.sub(amountAbsolute).isNegative()){
      console.log(`The account ${largeHolderAddress} does not have enough ${tokenName} tokens`);
      return;
    }

    // Create the transfer transaction
    const transaction = await erc20Contract.transfer(signer.address, amountAbsolute);
    return transaction.wait()

}

export const getAllTokens = async (): Promise<(ContractReceipt | undefined)[]> => {
  const promises = tokenHolders.map((entry) => {
    return getTokens(entry.largeHolderAddress, entry.tokenName, entry.amount)
  })

  return Promise.all(promises);
}

