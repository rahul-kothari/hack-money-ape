import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy-ethers";
import "hardhat-deploy";
import "hardhat-ethernal";
import "@symfoni/hardhat-react";
import "@typechain/hardhat";
import "@typechain/ethers-v5";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

task("compile", "Compiles the entire project, building all artifacts", async (args, hre, runSuper) => {
  await runSuper(args);

  const fs = require('fs');

  // File destination.txt will be created or overwritten by default.
  await new Promise<void>((resolve, reject) => {
    fs.copyFile('./constants/mainnet-constants.json', './frontend/src/hardhat/mainnet-constants.json', (err: Error) => {
      if (err) reject(err);
      console.log('mainnet-constants.json was copied to the frontend');
      resolve()
    });
  })

  await new Promise<void>((resolve, reject) => {
    fs.copyFile('./constants/goerli-constants.json', './frontend/src/hardhat/goerli-constants.json', (err: Error) => {
      if (err) reject(err);
      console.log('goerli-constants.json was copied to the frontend');
      resolve()
    });
  })
})

task("clean", "Clears the cache and deletes all artifacts",  async (args, hre, runSuper) => {
  await runSuper(args);

  const fs = require('fs');

  fs.rmdirSync('./frontend/src/hardhat', { recursive: true });
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  react: {
    providerPriority: ["web3modal", "hardhat"],
  },
  paths: {
    react: "./frontend/src/hardhat",
    sources: "./contracts",
    artifacts: "./frontend/src/artifacts",
    tests: "./test",
    cache: "./cache",
    deployments: "./frontend/src/hardhat/deployments"

  },
  networks: {
    hardhat: {
      inject: false, // optional. If true, it will EXPOSE your mnemonic in your frontend code. Then it would be available as an "in-page browser wallet" / signer which can sign without confirmation.
      hardfork: "london",
      accounts: [
        {
          balance: "10000000000000000000000",
          privateKey: `0x${process.env.PRIVATE_KEY}`,
        },
      ],
      forking: {
        url: `${process.env.MAINNET_PROVIDER_URL}`,
        blockNumber: 13577800
      },
    },
    goerli: {
      url: `${process.env.GOERLI_PROVIDER_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.7.3",
        settings: {
          optimizer: {
            enabled: true,
            runs: 50,
          },
        },
      },
    ],
  },
};
export default config;
