import { Contract, ethers, Signer } from "ethers";
import ITranche from '../../artifacts/contracts/element-finance/ITranche.sol/ITranche.json';
import { ITranche as ITrancheType} from "../../hardhat/typechain/ITranche";
import { ElementAddresses } from "../../types/manual/types";
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';
import { ERC20 as ERC20Type} from '../../hardhat/typechain/ERC20';

export const getYieldTotal = async (elementAddresses: ElementAddresses, trancheAddress: string, signer: Signer): Promise<number> => {
    const tranche = new Contract(trancheAddress, ITranche.abi, signer) as ITrancheType;
    const trancheERC20 = new Contract(trancheAddress, ERC20.abi, signer) as ERC20Type;

    const supply = await tranche.interestSupply();

    const decimals = await trancheERC20.decimals();

    // normalize the tranche balance and return
    return parseFloat(ethers.utils.formatUnits(supply, decimals));
}