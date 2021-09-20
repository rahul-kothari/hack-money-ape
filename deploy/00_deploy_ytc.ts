import fs from 'fs';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [signer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts using ${signer.address}`);

  
  // give 100 eth to the account 
  await hre.network.provider.send('hardhat_setBalance', [
    signer.address,
    "0x21E19E0C9BAB2400000"
  ])


  let data = JSON.parse(fs.readFileSync("./frontend/src/constants/mainnet-constants.json").toString());
  // const bytecodeHash = ethers.utils.solidityKeccak256(["bytes"], [data.trancheBytecode]);
  const balVault = data.balancerVault;
  // const trancheFactory = data.trancheFactory;

  const YTC = await hre.ethers.getContractFactory("YieldTokenCompounding");
  // const ytc_contract = await YTC.deploy(balVault, trancheFactory, bytecodeHash);
  const ytc_contract = await YTC.deploy(balVault);
  await ytc_contract.deployed();
  
  console.log("ytc_contract deployed to:", ytc_contract.address);

  data["yieldTokenCompoundingAddress"] = ytc_contract;
  fs.writeFileSync("./goerli-constants.json", JSON.stringify(data, null, 2));
};
export default func;
