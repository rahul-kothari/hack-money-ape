const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");

function getAbi(path) {
    return JSON.parse(fs.readFileSync(path)).abi
}

// TODO: NOT TESTED!
async function main(amount=100, n=1, baseTokenName="weth", trancheIndex=0) {
    const signer = (await ethers.getSigners())[0]

    const ytcAbi = getAbi("./src/artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json")
    const erc20Abi = getAbi("./src/artifacts/contracts/balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json")

    let data = JSON.parse(fs.readFileSync("./goerli-constants.json"));
    const yieldTokenCompoundingAddress = data["yieldTokenCompoundingAddress"];
    const baseTokenAddress = data["tokens"][baseTokenName];
    const trancheDetails = data["tranches"][baseTokenName][trancheIndex];
    const trancheAddress = trancheDetails["address"];
    const balancerPoolId = trancheDetails["ptPool"]["poolId"];
    
    if (!yieldTokenCompoundingAddress) {
      throw new Error("Add YTC contract details");
    }
    
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signer);
    const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);

    if(await baseToken.balanceOf(signer.getAddress) <= 0) {
      throw new Error(`Not enough base token balance`);
    }

    //1. Approve balancer to spend tranche tokens on this sc behalf:
    let tx = await ytc.approveTranchePTOnBalancer(trancheAddress);
    await tx.wait();
    console.log(`Approved balancer vault on tranche: ${tx.hash}`);
    console.log(`Goerli block explorer link: https://goerli.etherscan.io/tx/${tx.hash}`);

    //2. User (signer) approves spending of base tokens to the ytc contract.
    await baseToken.approve(yieldTokenCompoundingAddress, amount)

    //3. Compound!
    tx = await ytc.compound(1, trancheAddress, balancerPoolId, amount);
    await tx.wait();
    console.log(`Compounded: ${tx.hash}`);

    //4. TODO: Print balances (Base token, PT, YT)
    // baseToken.balanceOf(signer.getAddress);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });