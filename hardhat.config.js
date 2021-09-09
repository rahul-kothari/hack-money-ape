require("@nomiclabs/hardhat-waffle");
require('@typechain/hardhat');
require('dotenv').config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const INFURA_KEY = 
module.exports = {
  solidity: {
    version: "0.7.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    artifacts: './src/artifacts',
  },
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
      chainId: 1337
    },
    goerli: {
      url: `${process.env.GOERLI_PROVIDER_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
  },
};

