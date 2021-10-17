/*
 * Copyright 2021 Element Finance, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Provider } from "@ethersproject/providers";
import { BigNumber, Signer, Contract } from "ethers";
import {Vault as VaultType} from '../../hardhat/typechain/Vault';
import Vault from '../../artifacts/contracts/balancer-core-v2/vault/Vault.sol/Vault.json';
import {BasePool as BasePoolType} from '../../hardhat/typechain/BasePool';
import BasePool from '../../artifacts/contracts/balancer-core-v2/pools/BasePool.sol/BasePool.json'
import {ERC20 as ERC20type} from '../../hardhat/typechain/ERC20';
import ERC20 from '../../artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json';

export interface ReservesResult {
  /**
   * addresses of tokens
   */
  tokens: string[];
  /**
   * balances of tokens in same order as tokens
   */
  balances: BigNumber[];
  /**
   * decimals of tokens in same order as tokens
   */
  decimals: number[];
  /**
   * Total supply of pool liquidity shares
   */
  totalSupply: BigNumber;
}
/**
 * Returns the reserves for a given pool.
 * @param poolAddress any pool with a getPoolId method
 * @param balancerVaultAddress the address of the balancer v2 vault
 * @param signerOrProvider
 */
export async function getReserves(
  poolAddress: string,
  balancerVaultAddress: string,
  signerOrProvider: Signer | Provider
): Promise<ReservesResult> {

  const vaultAbi = Vault.abi;

  const balancerVault = new Contract(balancerVaultAddress, vaultAbi, signerOrProvider) as VaultType;

  const poolAbi = BasePool.abi;

  const poolContract = new Contract(poolAddress, poolAbi, signerOrProvider) as BasePoolType;

  const totalSupply = await poolContract.totalSupply();

  const poolId = await poolContract.getPoolId();
  const poolTokens = await balancerVault.getPoolTokens(poolId);
  
  const decimals: number[] = [];
  await Promise.all(
    poolTokens.tokens.map(async (token) => {
      const erc20Abi = ERC20.abi

      const poolTokenContract = new Contract(token, erc20Abi, signerOrProvider) as ERC20type;
      const poolTokenDecimals = await poolTokenContract.decimals();
      decimals.push(poolTokenDecimals);
    })
  );

  return {
    tokens: poolTokens.tokens,
    totalSupply,
    balances: poolTokens.balances,
    decimals: decimals,
  };
}