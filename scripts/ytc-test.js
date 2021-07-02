const hre = require("hardhat");
const ethers = hre.ethers;
const prompt = require('prompt-sync')();
const {getAbi, getERC20Balance, getGoerliElementFinanceData} = require("./helpers")

async function main() {
    const signer = (await ethers.getSigners())[0]

    // Get ABIs
    const ytcAbi = getAbi("YieldTokenCompounding.sol/YieldTokenCompounding.json")
    const erc20Abi = getAbi("balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json")
    const trancheAbi = getAbi("element-finance/ITranche.sol/ITranche.json")
    
    let data = getGoerliElementFinanceData();
    const yieldTokenCompoundingAddress = data["yieldTokenCompoundingAddress"];
    // Load YTC contract
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signer);
    
    // Get base token name:
    const baseTokens = Object.keys(data["tokens"]);
    const baseTokenName = prompt(`Enter base token name [${baseTokens}]: `).toLowerCase();
    if (! baseTokenName in baseTokens) {
      throw new Error("Base token not valid on element.fi yet");
    }
    const baseTokenAddress = data["tokens"][baseTokenName];

    //Get amount:
    const amount = parseInt(prompt("Enter base tokens amount in decimals: "));

    // Load erc20 contract of base token and check if enough balance
    const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);
    const baseTokenBforeBalance =  await getERC20Balance(baseToken, signer.getAddress());

    console.log("User base token initial balance: ", baseTokenBforeBalance);
    if(baseTokenBforeBalance <= amount) {
      throw new Error(`Not enough base token balance`);
    }

    // Get specific tranche
    const tranches = data["tranches"][baseTokenName];    
    let expiries = []
    tranches.forEach(tranche => {
      expiries.push(new Date(tranche.expiration * 1000).toLocaleDateString())
    });
    const trancheIndex = parseInt(prompt(`Enter index of the expiry date of the tranche [${expiries}]: `))

    const trancheDetails = tranches[trancheIndex];
    const trancheAddress = trancheDetails["address"];
    const balancerPoolId = trancheDetails["ptPool"]["poolId"];
    const tranche = new ethers.Contract(trancheAddress, trancheAbi, signer)
    console.log(`Selected Tranche ${trancheAddress}`);   
    
    const ptBeforeBalance = await getERC20Balance(tranche, signer.getAddress());
    
    const yieldTokenAddress = await tranche.interestToken();
    const yieldToken = new ethers.Contract(yieldTokenAddress, erc20Abi, signer);
    const ytBeforeBalance = await getERC20Balance(yieldToken, signer.getAddress());

    // Get number of compounds
    const n = parseInt(prompt("Enter number of compounds to do: "));
    
    // 0. Approve balancer to spend tranche tokens on this sc behalf:
    // let tx = await ytc.approveTranchePTOnBalancer(trancheAddress);
    // await tx.wait();
    // console.log(`Approved balancer vault on tranche: ${tx.hash}`);
    // console.log(`Goerli block explorer link: https://goerli.etherscan.io/tx/${tx.hash}`);

    //1. User (signer) approves spending of base tokens to the ytc contract.
    // let tx = await baseToken.approve(yieldTokenCompoundingAddress, beforeBalance);
    // console.log("User approves YTC contract to spend base token on its behalf - SUCCESFUL");
    // console.log(`Goerli block explorer link: https://goerli.etherscan.io/tx/${tx.hash}`);

    //2. Compound!
    console.log(`YTC - compound ${n} times with ${amount} ${baseTokenName}`);
    tx = await ytc.compound(n, trancheAddress, balancerPoolId, amount);
    await tx.wait();
    console.log(`Compounded: ${tx.hash}`);
    console.log(`Goerli block explorer link: https://goerli.etherscan.io/tx/${tx.hash}`);

    //3. Print balances (Base token, YT)
    const baseTokenAfterBalance = await getERC20Balance(baseToken, signer.getAddress());
    console.log("Base Token new balance: ", baseTokenAfterBalance);
    const ytAfterBalance = await getERC20Balance(yieldToken, signer.getAddress());
    console.log("Yield Token balance: ", ytAfterBalance);
    const ptAfterBalance = await getERC20Balance(tranche, signer.getAddress());
    console.log("Yield Token balance: ", ytAfterBalance);

    console.log(`Spent ${baseTokenBforeBalance - baseTokenAfterBalance} for ${ytAfterBalance - ytBeforeBalance} YTs (${await yieldToken.name()}) and ${ptAfterBalance - ptBeforeBalance} PTs (${await tranche.name()})`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });