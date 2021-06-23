// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

async function main() {
  [signer] = await ethers.getSigners();
  console.log(`Deploying contracts using ${signer.address}`);

  //If running standalone like `$ node scripts/deploy.js` uncomment next line:
  //await hre.run("compile");

  const data = fs.readFileSync("../constants.json");
  const bytecodeHash = ethers.utils.solidityKeccak256(["bytes"], [data.trancheBytecode]);
  const balVault = data.balancerVaultAddress;
  const trancheFactory = data.trancheFactoryAddress;

  const YTC = await ethers.getContractFactory("YieldTokenCompounding");
  const ytc_contract = await YTC.deploy(balVault, trancheFactory, bytecodeHash);
  await ytc_contract.deployed();
  
  console.log("ytc_contract deployed to:", ytc_contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
