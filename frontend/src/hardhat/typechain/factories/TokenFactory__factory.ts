/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { TokenFactory, TokenFactoryInterface } from "../TokenFactory";

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
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "TokenCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
    ],
    name: "create",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "start",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "end",
        type: "uint256",
      },
    ],
    name: "getTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalTokens",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50611bbc806100206000396000f3fe60806040523480156200001157600080fd5b5060043610620000465760003560e01c8063494cfc6c146200004b578063ecbfd4b6146200007a578063f08b82e614620000a0575b600080fd5b620000626200005c3660046200062a565b620000b9565b60405162000071919062000744565b60405180910390f35b620000916200008b3660046200058b565b6200019f565b604051620000719190620006e1565b620000aa620002d1565b6040516200007191906200084f565b6060828210158015620000d95750620000d36000620002e4565b83830311155b620001015760405162461bcd60e51b8152600401620000f89062000793565b60405180910390fd5b606083830367ffffffffffffffff811180156200011d57600080fd5b5060405190808252806020026020018201604052801562000148578160200160208202803683370190505b50905060005b81518110156200019557620001676000828701620002e8565b8282815181106200017457fe5b6001600160a01b03909216602092830291909101909101526001016200014e565b5090505b92915050565b6000606060405180602001620001b590620004ff565b601f1982820381018352601f909101166040819052620001e0908890889088908890602001620006f5565b60408051601f1981840301815290829052620002009291602001620006ae565b60405160208183030381529060405290506000620002296000801b83805190602001206200030f565b90506200023f816001600160a01b03166200031e565b156200024f579150620002c99050565b60006200025e81808562000324565b9050816001600160a01b0316816001600160a01b0316146200027c57fe5b620002896000826200039f565b506040516001600160a01b038216907f2e2b3f61b70d2d131b2a807371103cc98d51adcaa5e9a8f9c32658ad8426e74e90600090a29250620002c9915050565b949350505050565b6000620002df6000620002e4565b905090565b5490565b8154600090620002fc908310606462000407565b6200030883836200041c565b9392505050565b6000620003088383306200044a565b3b151590565b600080844710156200034a5760405162461bcd60e51b8152600401620000f890620007ba565b82516200036b5760405162461bcd60e51b8152600401620000f89062000820565b8383516020850187f590506001600160a01b038116620002c95760405162461bcd60e51b8152600401620000f890620007f1565b6000620003ad83836200048b565b620003fe57508154600180820184556000848152602080822090930180546001600160a01b0319166001600160a01b0386169081179091558554908252828601909352604090209190915562000199565b50600062000199565b8162000418576200041881620004ac565b5050565b60008260000182815481106200042e57fe5b6000918252602090912001546001600160a01b03169392505050565b60008060ff60f81b8386866040516020016200046a94939291906200067a565b60408051808303601f19018152919052805160209091012095945050505050565b6001600160a01b031660009081526001919091016020526040902054151590565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fd5b6112fb806200088c83390190565b600082601f8301126200051e578081fd5b813567ffffffffffffffff808211156200053457fe5b604051601f8301601f1916810160200182811182821017156200055357fe5b6040528281529250828483016020018610156200056f57600080fd5b8260208601602083013760006020848301015250505092915050565b60008060008060808587031215620005a1578384fd5b84356001600160a01b0381168114620005b8578485fd5b9350602085013567ffffffffffffffff80821115620005d5578485fd5b620005e3888389016200050d565b94506040870135915080821115620005f9578384fd5b5062000608878288016200050d565b925050606085013560ff811681146200061f578182fd5b939692955090935050565b600080604083850312156200063d578182fd5b50508035926020909101359150565b600081518084526200066681602086016020860162000858565b601f01601f19169290920160200192915050565b6001600160f81b031994909416845260609290921b6001600160601b03191660018401526015830152603582015260550190565b60008351620006c281846020880162000858565b835190830190620006d881836020880162000858565b01949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b03851681526080602082018190526000906200071b908301866200064c565b82810360408401526200072f81866200064c565b91505060ff8316606083015295945050505050565b6020808252825182820181905260009190848201906040850190845b81811015620007875783516001600160a01b03168352928401929184019160010162000760565b50909695505050505050565b6020808252600d908201526c4f55545f4f465f424f554e445360981b604082015260600190565b6020808252601c908201527f435245415445325f494e53554646494349454e545f42414c414e434500000000604082015260600190565b60208082526015908201527410d4915055114c97d111541313d657d19052531151605a1b604082015260600190565b602080825260159082015274435245415445325f42595445434f44455f5a45524f60581b604082015260600190565b90815260200190565b60005b83811015620008755781810151838201526020016200085b565b8381111562000885576000848401525b5050505056fe60806040523480156200001157600080fd5b50604051620012fb380380620012fb833981810160405260808110156200003757600080fd5b8151602083018051604051929492938301929190846401000000008211156200005f57600080fd5b9083019060208201858111156200007557600080fd5b82516401000000008111828201881017156200009057600080fd5b82525081516020918201929091019080838360005b83811015620000bf578181015183820152602001620000a5565b50505050905090810190601f168015620000ed5780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200011157600080fd5b9083019060208201858111156200012757600080fd5b82516401000000008111828201881017156200014257600080fd5b82525081516020918201929091019080838360005b838110156200017157818101518382015260200162000157565b50505050905090810190601f1680156200019f5780820380516001836020036101000a031916815260200191505b5060405260209081015185519093508592508491620001c4916004918501906200034f565b508051620001da9060059060208401906200034f565b50506006805460ff1916601217905550620001f58162000238565b620002026000856200024e565b6200022e7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6856200024e565b50505050620003eb565b6006805460ff191660ff92909216919091179055565b6200025a82826200025e565b5050565b60008281526020818152604090912062000283918390620008e0620002c5821b17901c565b156200025a5760405133906001600160a01b0383169084907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d90600090a45050565b6000620002d383836200032e565b6200032457508154600180820184556000848152602080822090930180546001600160a01b0319166001600160a01b0386169081179091558554908252828601909352604090209190915562000328565b5060005b92915050565b6001600160a01b031660009081526001919091016020526040902054151590565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200039257805160ff1916838001178555620003c2565b82800160010185558215620003c2579182015b82811115620003c2578251825591602001919060010190620003a5565b50620003d0929150620003d4565b5090565b5b80821115620003d05760008155600101620003d5565b610f0080620003fb6000396000f3fe608060405234801561001057600080fd5b506004361061012d5760003560e01c806370a08231116100b357806370a082311461034957806379cc67901461036f5780639010d07c1461039b57806391d14854146103da57806395d89b4114610406578063a217fddf1461040e578063a457c2d714610416578063a9059cbb14610442578063ca15c8731461046e578063d53913931461048b578063d547741f14610493578063dd62ed3e146104bf5761012d565b806306fdde0314610132578063095ea7b3146101af57806318160ddd146101ef57806323b872dd14610209578063248a9ca31461023f5780632f2ff15d1461025c578063313ce5671461028a57806336568abe146102a857806339509351146102d457806340c10f191461030057806342966c681461032c575b600080fd5b61013a6104ed565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561017457818101518382015260200161015c565b50505050905090810190601f1680156101a15780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101db600480360360408110156101c557600080fd5b506001600160a01b038135169060200135610583565b604080519115158252519081900360200190f35b6101f761059a565b60408051918252519081900360200190f35b6101db6004803603606081101561021f57600080fd5b506001600160a01b038135811691602081013590911690604001356105a0565b6101f76004803603602081101561025557600080fd5b50356105f4565b6102886004803603604081101561027257600080fd5b50803590602001356001600160a01b0316610609565b005b61029261063f565b6040805160ff9092168252519081900360200190f35b610288600480360360408110156102be57600080fd5b50803590602001356001600160a01b0316610648565b6101db600480360360408110156102ea57600080fd5b506001600160a01b038135169060200135610669565b6102886004803603604081101561031657600080fd5b506001600160a01b03813516906020013561069f565b6102886004803603602081101561034257600080fd5b5035610711565b6101f76004803603602081101561035f57600080fd5b50356001600160a01b031661071e565b6102886004803603604081101561038557600080fd5b506001600160a01b038135169060200135610739565b6103be600480360360408110156103b157600080fd5b508035906020013561076f565b604080516001600160a01b039092168252519081900360200190f35b6101db600480360360408110156103f057600080fd5b50803590602001356001600160a01b031661078e565b61013a6107a6565b6101f7610807565b6101db6004803603604081101561042c57600080fd5b506001600160a01b03813516906020013561080c565b6101db6004803603604081101561045857600080fd5b506001600160a01b038135169060200135610845565b6101f76004803603602081101561048457600080fd5b5035610852565b6101f7610869565b610288600480360360408110156104a957600080fd5b50803590602001356001600160a01b031661088d565b6101f7600480360360408110156104d557600080fd5b506001600160a01b03813581169160200135166108b5565b60048054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105795780601f1061054e57610100808354040283529160200191610579565b820191906000526020600020905b81548152906001019060200180831161055c57829003601f168201915b5050505050905090565b6000610590338484610943565b5060015b92915050565b60035490565b60006105ad8484846109d3565b6001600160a01b0384166000908152600260209081526040808320338085529252909120546105ea9186916105e5908661019e610aab565b610943565b5060019392505050565b60009081526020819052604090206002015490565b60008281526020819052604090206002015461063190610629903361078e565b6101a6610ac1565b61063b8282610acf565b5050565b60065460ff1690565b61065f6001600160a01b03821633146101a8610ac1565b61063b8282610b28565b3360008181526002602090815260408083206001600160a01b038716845290915281205490916105909185906105e59086610b81565b6106c97f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a63361078e565b610707576040805162461bcd60e51b815260206004820152600a6024820152692727aa2fa6a4a72a22a960b11b604482015290519081900360640190fd5b61063b8282610b93565b61071b3382610c2f565b50565b6001600160a01b031660009081526001602052604090205490565b6000610753826101a161074c86336108b5565b9190610aab565b9050610760833383610943565b61076a8383610c2f565b505050565b60008281526020819052604081206107879083610cd4565b9392505050565b60008281526020819052604081206107879083610cf0565b60058054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105795780601f1061054e57610100808354040283529160200191610579565b600081565b3360008181526002602090815260408083206001600160a01b038716845290915281205490916105909185906105e5908661019f610aab565b60006105903384846109d3565b600081815260208190526040812061059490610d11565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b60008281526020819052604090206002015461065f906108ad903361078e565b6101a7610ac1565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b60006108ec8383610cf0565b61093b57508154600180820184556000848152602080822090930180546001600160a01b0319166001600160a01b03861690811790915585549082528286019093526040902091909155610594565b506000610594565b61095a6001600160a01b038416151561019c610ac1565b6109716001600160a01b038316151561019d610ac1565b6001600160a01b03808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6109ea6001600160a01b0384161515610198610ac1565b610a016001600160a01b0383161515610199610ac1565b610a0c83838361076a565b6001600160a01b038316600090815260016020526040902054610a3290826101a0610aab565b6001600160a01b038085166000908152600160205260408082209390935590841681522054610a619082610b81565b6001600160a01b038084166000818152600160209081526040918290209490945580518581529051919392871692600080516020610eab83398151915292918290030190a3505050565b6000610aba8484111583610ac1565b5050900390565b8161063b5761063b81610d15565b6000828152602081905260409020610ae790826108e0565b1561063b5760405133906001600160a01b0383169084907f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d90600090a45050565b6000828152602081905260409020610b409082610d68565b1561063b5760405133906001600160a01b0383169084907ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b90600090a45050565b60008282016107878482101583610ac1565b610baa6001600160a01b038316151561019a610ac1565b610bb66000838361076a565b600354610bc39082610b81565b6003556001600160a01b038216600090815260016020526040902054610be99082610b81565b6001600160a01b0383166000818152600160209081526040808320949094558351858152935192939192600080516020610eab8339815191529281900390910190a35050565b610c466001600160a01b038316151561019b610ac1565b610c528260008361076a565b6001600160a01b038216600090815260016020526040902054610c7890826101a1610aab565b6001600160a01b038316600090815260016020526040902055600354610c9e9082610e6f565b6003556040805182815290516000916001600160a01b03851691600080516020610eab8339815191529181900360200190a35050565b8154600090610ce69083106064610ac1565b6107878383610e7d565b6001600160a01b031660009081526001919091016020526040902054151590565b5490565b62461bcd60e51b6000908152602060045260076024526642414c23000030600a808404818106603090810160081b95839006959095019082900491820690940160101b939093010160c81b604452606490fd5b6001600160a01b03811660009081526001830160205260408120548015610e655783546000198083019190810190600090879083908110610da557fe5b60009182526020909120015487546001600160a01b0390911691508190889085908110610dce57fe5b600091825260208083209190910180546001600160a01b0319166001600160a01b03948516179055918316815260018981019092526040902090840190558654879080610e1757fe5b60008281526020808220830160001990810180546001600160a01b03191690559092019092556001600160a01b03881682526001898101909152604082209190915594506105949350505050565b6000915050610594565b600061078783836001610aab565b6000826000018281548110610e8e57fe5b6000918252602090912001546001600160a01b0316939250505056feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa264697066735822122089956c937b8115b2dd34ce180a9a34b2a9a6317248e6b04b8d40cfcb205ca5d564736f6c63430007030033a264697066735822122037109669588459fb0ecce85d34a10e016978753c329a067556e50b265f75e2f364736f6c63430007030033";

export class TokenFactory__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<TokenFactory> {
    return super.deploy(overrides || {}) as Promise<TokenFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): TokenFactory {
    return super.attach(address) as TokenFactory;
  }
  connect(signer: Signer): TokenFactory__factory {
    return super.connect(signer) as TokenFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenFactoryInterface {
    return new utils.Interface(_abi) as TokenFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenFactory {
    return new Contract(address, _abi, signerOrProvider) as TokenFactory;
  }
}