import { Signer, ethers, ContractReceipt } from 'ethers'
import { ERC20 } from '../../types/ERC20';
import ERC20Artifact from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json'

export const sendApproval = async (wallet: any, amount: number | string, approvalAddress: string, tokenAddress: string, onComplete: () => void): Promise<ContractReceipt> => {

    const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(wallet.ethereum)

    const signer: Signer = await provider.getSigner();

    const erc20Abi = ERC20Artifact.abi;

    const erc20Contract = new ethers.Contract(tokenAddress, erc20Abi, signer) as ERC20;

    const transaction = await erc20Contract.approve(approvalAddress, amount);

    return transaction.wait();
}


export const checkApproval = async (wallet: any, amount: number | string, tokenAddress: string, approvalAddress: string): Promise<boolean> => {
    const provider: ethers.providers.Web3Provider = new ethers.providers.Web3Provider(wallet.ethereum)

    const signer: Signer = await provider.getSigner();

    const erc20Abi = ERC20Artifact.abi;

    const erc20Contract = new ethers.Contract(tokenAddress, erc20Abi, signer) as ERC20;

    const allowance = await erc20Contract.allowance(wallet.account, approvalAddress)
    const bigNumAmount = ethers.BigNumber.from(amount);

    console.log('allowance', allowance.toString());
    console.log('amount', bigNumAmount);


    return allowance.gte(bigNumAmount);
}