
// Find the total amount of tokens in the underlying wrapped position
import { BigNumber, Contract, ethers, Signer } from 'ethers';
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json';
import IWrappedPosition from '../../artifacts/contracts/element-finance/IWrappedPosition.sol/IWrappedPosition.json';
import {IWrappedPosition as IWrappedPositionType} from '../../hardhat/typechain/IWrappedPosition';
import {ITranche as ITrancheType} from '../../hardhat/typechain/ITranche';
import { ElementAddresses, Tranche } from '../../types/manual/types';
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import { ERC20 as ERC20Type} from '../../hardhat/typechain/ERC20';

export const getUnderlyingTotal = async (elementAddresses: ElementAddresses, trancheAddress: string, signer: Signer): Promise<number> => {
    // get the tranche
    const tranche = new Contract(trancheAddress, ITranche.abi, signer) as ITrancheType;

    // get the wrapped position address
    const wrappedPositionAddress = await tranche.position();
    const wrappedPosition = new Contract(wrappedPositionAddress, IWrappedPosition.abi, signer) as IWrappedPositionType;
    const wrappedPositionERC20 = new Contract(wrappedPositionAddress, ERC20.abi, signer) as ERC20Type;

    // get the balance of the tranche for the wrapped position
    const balance = await wrappedPosition.balanceOfUnderlying(trancheAddress);

    // get the decimals of the wrapped position
    const decimals = await wrappedPositionERC20.decimals()

    // normalize the tranche balance and return
    return parseFloat(ethers.utils.formatUnits(balance, decimals));
}