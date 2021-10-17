import fs from 'fs';
import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const [signer] = await hre.ethers.getSigners();
  const {deploy} = hre.deployments;
  console.log(`Deploying contracts using ${signer.address}`);


  if (hre.network.name === "hardhat"){
    // give 100 eth to the account 
    await hre.network.provider.send('hardhat_setBalance', [
      signer.address,
      "0x21E19E0C9BAB2400000"
    ])
  }

  if (hre.network.name === "goerli"){
    var data = JSON.parse(fs.readFileSync("./constants/goerli-constants.json").toString());
  } else {
    var data = JSON.parse(fs.readFileSync("./constants/mainnet-constants.json").toString());
  }

  // const bytecodeHash = ethers.utils.solidityKeccak256(["bytes"], [data.trancheBytecode]);
  const balVault = data.balancerVault;
  // const trancheFactory = data.trancheFactory;

  // const ytc_contract = await YTC.deploy(balVault, trancheFactory, bytecodeHash);
  await deploy('YieldTokenCompounding', {
    from: signer.address,
    args: [balVault],
    log: true,
  });

  const deployedContract = await hre.deployments.get('YieldTokenCompounding');

  console.log('contract deployed to: ', deployedContract.address)
  
};
export default func;
