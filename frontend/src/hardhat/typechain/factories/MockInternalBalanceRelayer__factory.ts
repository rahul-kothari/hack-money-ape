/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  MockInternalBalanceRelayer,
  MockInternalBalanceRelayerInterface,
} from "../MockInternalBalanceRelayer";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IVault",
        name: "_vault",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "sender",
        type: "address",
      },
      {
        internalType: "contract IAsset",
        name: "asset",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "depositAmounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "withdrawAmounts",
        type: "uint256[]",
      },
    ],
    name: "depositAndWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vault",
    outputs: [
      {
        internalType: "contract IVault",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161056d38038061056d83398101604081905261002f91610054565b600080546001600160a01b0319166001600160a01b0392909216919091179055610082565b600060208284031215610065578081fd5b81516001600160a01b038116811461007b578182fd5b9392505050565b6104dc806100916000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80637b58efc11461003b578063fbfa77cf14610050575b600080fd5b61004e61004936600461036e565b61006e565b005b610058610198565b604051610065919061047a565b60405180910390f35b61007a825182516101a7565b60005b82518110156101915760606100a86000878787868151811061009b57fe5b60200260200101516101b8565b6000546040516303a38fa160e21b81529192506001600160a01b031690630e8e3e84906100d99084906004016103f4565b600060405180830381600087803b1580156100f357600080fd5b505af1158015610107573d6000803e3d6000fd5b5050505060606101206001888887878151811061009b57fe5b6000546040516303a38fa160e21b81529192506001600160a01b031690630e8e3e84906101519084906004016103f4565b600060405180830381600087803b15801561016b57600080fd5b505af115801561017f573d6000803e3d6000fd5b50506001909401935061007d92505050565b5050505050565b6000546001600160a01b031681565b6101b48183146067610259565b5050565b604080516001808252818301909252606091816020015b6101d76102af565b8152602001906001900390816101cf5790505090506040518060a0016040528086600381111561020357fe5b8152602001846001600160a01b03168152602001838152602001856001600160a01b03168152602001856001600160a01b03168152508160008151811061024657fe5b6020026020010181905250949350505050565b816101b45762461bcd60e51b600090815260206004526007602452600a808304818104828106603090810160101b848706949093060160081b92909201016642414c230000300160c81b6044526101b491606490fd5b6040805160a081019091528060008152600060208201819052604082018190526060820181905260809091015290565b600082601f8301126102ef578081fd5b813567ffffffffffffffff8082111561030457fe5b60208083026040518282820101818110858211171561031f57fe5b60405284815294508185019250858201818701830188101561034057600080fd5b600091505b84821015610363578035845292820192600191909101908201610345565b505050505092915050565b60008060008060808587031215610383578384fd5b843561038e8161048e565b9350602085013561039e8161048e565b9250604085013567ffffffffffffffff808211156103ba578384fd5b6103c6888389016102df565b935060608701359150808211156103db578283fd5b506103e8878288016102df565b91505092959194509250565b602080825282518282018190526000919060409081850190868401855b8281101561046d57815180516004811061042757fe5b8552808701516001600160a01b03908116888701528682015187870152606080830151821690870152608091820151169085015260a09093019290850190600101610411565b5091979650505050505050565b6001600160a01b0391909116815260200190565b6001600160a01b03811681146104a357600080fd5b5056fea264697066735822122063f4cc2ac9038ddcdb5523834d11ee40ffcdf51ede992e0ca21a6d8c1460886d64736f6c63430007030033";

export class MockInternalBalanceRelayer__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _vault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockInternalBalanceRelayer> {
    return super.deploy(
      _vault,
      overrides || {}
    ) as Promise<MockInternalBalanceRelayer>;
  }
  getDeployTransaction(
    _vault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_vault, overrides || {});
  }
  attach(address: string): MockInternalBalanceRelayer {
    return super.attach(address) as MockInternalBalanceRelayer;
  }
  connect(signer: Signer): MockInternalBalanceRelayer__factory {
    return super.connect(signer) as MockInternalBalanceRelayer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockInternalBalanceRelayerInterface {
    return new utils.Interface(_abi) as MockInternalBalanceRelayerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockInternalBalanceRelayer {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as MockInternalBalanceRelayer;
  }
}
