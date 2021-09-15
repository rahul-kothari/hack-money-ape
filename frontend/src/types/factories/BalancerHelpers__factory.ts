/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BalancerHelpers,
  BalancerHelpersInterface,
} from "../BalancerHelpers";

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
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "minAmountsOut",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "userData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "toInternalBalance",
            type: "bool",
          },
        ],
        internalType: "struct IVault.ExitPoolRequest",
        name: "request",
        type: "tuple",
      },
    ],
    name: "queryExit",
    outputs: [
      {
        internalType: "uint256",
        name: "bptIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        components: [
          {
            internalType: "contract IAsset[]",
            name: "assets",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "maxAmountsIn",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "userData",
            type: "bytes",
          },
          {
            internalType: "bool",
            name: "fromInternalBalance",
            type: "bool",
          },
        ],
        internalType: "struct IVault.JoinPoolRequest",
        name: "request",
        type: "tuple",
      },
    ],
    name: "queryJoin",
    outputs: [
      {
        internalType: "uint256",
        name: "bptOut",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
    ],
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
  "0x60c060405234801561001057600080fd5b50604051610e93380380610e9383398101604081905261002f916100bf565b806001600160a01b031663ad5c46486040518163ffffffff1660e01b815260040160206040518083038186803b15801561006857600080fd5b505afa15801561007c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906100a091906100bf565b6001600160601b0319606091821b811660805291901b1660a0526100fa565b6000602082840312156100d0578081fd5b81516100db816100e2565b9392505050565b6001600160a01b03811681146100f757600080fd5b50565b60805160601c60a05160601c610d5861013b6000398060a05280610156528061030252806103b8528061049852806104e45250806107405250610d586000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80639ebbf05d14610046578063c7b2c52c14610070578063fbfa77cf14610083575b600080fd5b610059610054366004610b27565b610098565b604051610067929190610ca2565b60405180910390f35b61005961007e366004610abd565b6102fa565b61008b610496565b6040516100679190610c8e565b6000606060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663f6c00927886040518263ffffffff1660e01b81526004016100ea9190610bf6565b604080518083038186803b15801561010157600080fd5b505afa158015610115573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061013991906109b5565b5090506060600061014e8987600001516104ba565b9150915060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d2946c2b6040518163ffffffff1660e01b815260040160206040518083038186803b1580156101ad57600080fd5b505afa1580156101c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101e59190610b3c565b9050836001600160a01b03166387ec68178b8b8b8787876001600160a01b03166355c676286040518163ffffffff1660e01b815260040160206040518083038186803b15801561023457600080fd5b505afa158015610248573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061026c9190610b5f565b8e604001516040518863ffffffff1660e01b81526004016102939796959493929190610bff565b600060405180830381600087803b1580156102ad57600080fd5b505af11580156102c1573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526102e99190810190610b77565b909b909a5098505050505050505050565b6000606060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663f6c00927886040518263ffffffff1660e01b815260040161034c9190610bf6565b604080518083038186803b15801561036357600080fd5b505afa158015610377573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061039b91906109b5565b509050606060006103b08987600001516104ba565b9150915060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d2946c2b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561040f57600080fd5b505afa158015610423573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104479190610b3c565b9050836001600160a01b0316636028bfd48b8b8b8787876001600160a01b03166355c676286040518163ffffffff1660e01b815260040160206040518083038186803b15801561023457600080fd5b7f000000000000000000000000000000000000000000000000000000000000000081565b606060006060806104ca856105ee565b604051631f29a8cd60e31b81529091506001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000169063f94d466890610519908990600401610bf6565b60006040518083038186803b15801561053157600080fd5b505afa158015610545573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261056d91908101906109f1565b825184519297509095509193506105849190610691565b60005b82518110156105e457600083828151811061059e57fe5b602002602001015190506105db8383815181106105b757fe5b60200260200101516001600160a01b0316826001600160a01b0316146102086106a2565b50600101610587565b5050509250929050565b606080825167ffffffffffffffff8111801561060957600080fd5b50604051908082528060200260200182016040528015610633578160200160208202803683370190505b50905060005b835181101561068a5761065e84828151811061065157fe5b60200260200101516106b0565b82828151811061066a57fe5b6001600160a01b0390921660209283029190910190910152600101610639565b5092915050565b61069e81831460676106a2565b5050565b8161069e5761069e816106db565b60006106bb8261072e565b6106cd576106c88261073b565b6106d5565b6106d561073e565b92915050565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fd5b6001600160a01b03161590565b90565b7f000000000000000000000000000000000000000000000000000000000000000090565b600082601f830112610772578081fd5b813561078561078082610cea565b610cc3565b8181529150602080830190848101818402860182018710156107a657600080fd5b60005b848110156107ce5781356107bc81610d0a565b845292820192908201906001016107a9565b505050505092915050565b600082601f8301126107e9578081fd5b81356107f761078082610cea565b81815291506020808301908481018184028601820187101561081857600080fd5b60005b848110156107ce5781358452928201929082019060010161081b565b600082601f830112610847578081fd5b815161085561078082610cea565b81815291506020808301908481018184028601820187101561087657600080fd5b60005b848110156107ce57815184529282019290820190600101610879565b803580151581146106d557600080fd5b600082601f8301126108b5578081fd5b813567ffffffffffffffff8111156108cb578182fd5b6108de601f8201601f1916602001610cc3565b91508082528360208285010111156108f557600080fd5b8060208401602084013760009082016020015292915050565b60006080828403121561091f578081fd5b6109296080610cc3565b9050813567ffffffffffffffff8082111561094357600080fd5b61094f85838601610762565b8352602084013591508082111561096557600080fd5b610971858386016107d9565b6020840152604084013591508082111561098a57600080fd5b50610997848285016108a5565b6040830152506109aa8360608401610895565b606082015292915050565b600080604083850312156109c7578182fd5b82516109d281610d0a565b6020840151909250600381106109e6578182fd5b809150509250929050565b600080600060608486031215610a05578081fd5b835167ffffffffffffffff80821115610a1c578283fd5b818601915086601f830112610a2f578283fd5b8151610a3d61078082610cea565b80828252602080830192508086018b828387028901011115610a5d578788fd5b8796505b84871015610a88578051610a7481610d0a565b845260019690960195928101928101610a61565b508901519097509350505080821115610a9f578283fd5b50610aac86828701610837565b925050604084015190509250925092565b60008060008060808587031215610ad2578081fd5b843593506020850135610ae481610d0a565b92506040850135610af481610d0a565b9150606085013567ffffffffffffffff811115610b0f578182fd5b610b1b8782880161090e565b91505092959194509250565b60008060008060808587031215610ad2578384fd5b600060208284031215610b4d578081fd5b8151610b5881610d0a565b9392505050565b600060208284031215610b70578081fd5b5051919050565b60008060408385031215610b89578182fd5b82519150602083015167ffffffffffffffff811115610ba6578182fd5b610bb285828601610837565b9150509250929050565b6000815180845260208085019450808401835b83811015610beb57815187529582019590820190600101610bcf565b509495945050505050565b90815260200190565b6000888252602060018060a01b03808a168285015280891660408501525060e06060840152610c3160e0840188610bbc565b8660808501528560a085015283810360c08501528451808252835b81811015610c67578681018401518382018501528301610c4c565b81811115610c7757848483850101525b50601f01601f191601019998505050505050505050565b6001600160a01b0391909116815260200190565b600083825260406020830152610cbb6040830184610bbc565b949350505050565b60405181810167ffffffffffffffff81118282101715610ce257600080fd5b604052919050565b600067ffffffffffffffff821115610d00578081fd5b5060209081020190565b6001600160a01b0381168114610d1f57600080fd5b5056fea26469706673582212203b407ab5a8d0b12a8e981cb85a42d823e151645bb8ffad663e7e6ae7cab8ef7164736f6c63430007010033";

export class BalancerHelpers__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _vault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BalancerHelpers> {
    return super.deploy(_vault, overrides || {}) as Promise<BalancerHelpers>;
  }
  getDeployTransaction(
    _vault: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_vault, overrides || {});
  }
  attach(address: string): BalancerHelpers {
    return super.attach(address) as BalancerHelpers;
  }
  connect(signer: Signer): BalancerHelpers__factory {
    return super.connect(signer) as BalancerHelpers__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BalancerHelpersInterface {
    return new utils.Interface(_abi) as BalancerHelpersInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BalancerHelpers {
    return new Contract(address, _abi, signerOrProvider) as BalancerHelpers;
  }
}
