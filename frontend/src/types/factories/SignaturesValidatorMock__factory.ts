/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  SignaturesValidatorMock,
  SignaturesValidatorMockInterface,
} from "../SignaturesValidatorMock";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "Authenticated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "CalldataDecoded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "anotherFunction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "authenticateCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decodeCalldata",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getDomainSeparator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getNextNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "increaseNonce",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101006040527f088e910861b9d0ac056c32bb5d44fcdd155bbfa025bdca87c7390e174ac6179560e05234801561003557600080fd5b50604080518082018252601181527010985b185b98d95c88158c8815985d5b1d607a1b6020808301918252835180850190945260018452603160f81b908401908152915190206080529051902060a0527f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f60c05260805160a05160c05160e0516106a06100de6000398061059f5250806102f452508061033652508061031552506106a06000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806325e511851461006757806378ea7ae71461008f5780638247a97c146100b557806390193b7c146100db57806394df26d614610113578063ed24911d1461011b575b600080fd5b61008d6004803603602081101561007d57600080fd5b50356001600160a01b0316610123565b005b61008d600480360360208110156100a557600080fd5b50356001600160a01b031661017d565b61008d600480360360208110156100cb57600080fd5b50356001600160a01b0316610180565b610101600480360360208110156100f157600080fd5b50356001600160a01b03166101a0565b60408051918252519081900360200190f35b61008d6101bb565b6101016101c5565b61012f816101f86101d5565b61013761020e565b604080516001600160a01b038316815233602082015281517fd42c368decf104a7572c7884ea7028fe04ef7d3e76dbd706484f9175d6c4ec62929181900390910190a150565b50565b6001600160a01b0316600090815260208190526040902080546001019055565b6001600160a01b031660009081526020819052604090205490565b6101c361020e565b565b60006101cf6102f0565b90505b90565b6001600160a01b038216600090815260208190526040902080546001810190915561020961020384836103ae565b836104fe565b505050565b600080600061021b610510565b9250925092507f6ab714885e85fe1094a5f8af742b0c2eb868ce590c1280ec1c3594899d143cbf61024a61053e565b61025261058d565b85858560405180806020018681526020018560ff168152602001848152602001838152602001828103825287818151815260200191508051906020019080838360005b838110156102ad578181015183820152602001610295565b50505050905090810190601f1680156102da5780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390a1505050565b60007f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000007f000000000000000000000000000000000000000000000000000000000000000061035d610599565b3060405160200180868152602001858152602001848152602001838152602001826001600160a01b031681526020019550505050505060405160208183030381529060405280519060200120905090565b6000806103b961058d565b9050428110156103cd5760009150506104f8565b60006103d761059d565b9050806103e9576000925050506104f8565b6000816103f461053e565b80516020918201206040805180840194909452838101919091523360608401526080830188905260a08084018790528151808503909101815260c09093019052815191012090506000610446826105c1565b90506000806000610455610510565b925092509250600060018585858560405160008152602001604052604051808581526020018460ff1681526020018381526020018281526020019450505050506020604051602081039080840390855afa1580156104b7573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116158015906104ed57508a6001600160a01b0316816001600160a01b0316145b985050505050505050505b92915050565b8161050c5761050c8161060d565b5050565b600080600061051f6020610660565b925061052b6040610660565b91506105376060610660565b9050909192565b60606000368080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152505082519293505050608010156101d25760803603815290565b60006101cf6000610660565b4690565b7f000000000000000000000000000000000000000000000000000000000000000090565b60006105cb6102f0565b82604051602001808061190160f01b81525060020183815260200182815260200192505050604051602081830303815290604052805190602001209050919050565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fd5b3601607f1901359056fea2646970667358221220841a0fde0880204832ad63ddf650624b1329d81d7ef2096122a5e4999a61730964736f6c63430007010033";

export class SignaturesValidatorMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<SignaturesValidatorMock> {
    return super.deploy(overrides || {}) as Promise<SignaturesValidatorMock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): SignaturesValidatorMock {
    return super.attach(address) as SignaturesValidatorMock;
  }
  connect(signer: Signer): SignaturesValidatorMock__factory {
    return super.connect(signer) as SignaturesValidatorMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SignaturesValidatorMockInterface {
    return new utils.Interface(_abi) as SignaturesValidatorMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SignaturesValidatorMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SignaturesValidatorMock;
  }
}
