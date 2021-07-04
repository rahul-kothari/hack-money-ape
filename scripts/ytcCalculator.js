const hre = require("hardhat");
const ethers = hre.ethers;
const fs = require("fs");
const {getAbi} = require("./helpers");
const prompt = require('prompt-sync')();

function getUserInput(data) {
      let userData = {}
      
      // Get base token name:
      const baseTokens = Object.keys(data["tokens"]);
      const baseTokenName = prompt(`Enter base token name [${baseTokens}]: `).toLowerCase();
      if (! baseTokenName in baseTokens) {
        throw new Error("Base token not valid on element.fi yet");
      }
      userData["baseTokenName"] = baseTokenName
      
      //Get amount:
      userData["amountCollateralDeposited"] = parseInt(prompt("Enter base tokens amount in decimals: "));
  
      // Get specific tranche
      const tranches = data["tranches"][baseTokenName];    
      let expiries = []
      tranches.forEach(tranche => {
        expiries.push(new Date(tranche.expiration * 1000).toLocaleDateString())
      });
      userData["trancheIndex"] = parseInt(prompt(`Enter index of the expiry date of the tranche [${expiries}]: `))

      // Get speculated interest rate
      userData["speculatedVariableRate"] = parseFloat(prompt("Enter speculated variable interest rate: "));

      return userData;
}

// Demo script to show how to build a YTC calculator!
async function main() {
    const signer = (await ethers.getSigners())[0];
    
    //Get Abis
    const ytcAbi = getAbi("YieldTokenCompounding.sol/YieldTokenCompounding.json")
    const trancheAbi = getAbi("element-finance/ITranche.sol/ITranche.json")    
    const erc20Abi = getAbi("balancer-core-v2/lib/openzeppelin/ERC20.sol/ERC20.json")

    // Get data
    let data = JSON.parse(fs.readFileSync("./goerli-constants.json"));
    const yieldTokenCompoundingAddress = data["yieldTokenCompoundingAddress"];
    const userData = getUserInput(data);
    const baseTokenAddress = data["tokens"][userData["baseTokenName"]];
    // Get specific tranche
    
    const trancheDetails = data["tranches"][userData["baseTokenName"]][userData["trancheIndex"]];
    const trancheAddress = trancheDetails["address"];
    const balancerPoolId = trancheDetails["ptPool"]["poolId"];    
    
    // Load contracts
    const ytc = new ethers.Contract(yieldTokenCompoundingAddress, ytcAbi, signer);
    const tranche = new ethers.Contract(trancheAddress, trancheAbi, signer);
    const yieldTokenAddress = await tranche.interestToken();
    const yieldToken = new ethers.Contract(yieldTokenAddress, erc20Abi, signer);
    const yieldTokenDecimals = ethers.BigNumber.from(await yieldToken.decimals()).toNumber();
    const baseToken = new ethers.Contract(baseTokenAddress, erc20Abi, signer);
    const baseTokenDecimals = ethers.BigNumber.from(await baseToken.decimals()).toNumber();

    /**
     * FORMULA: 
     * Collateral Deposited = amount of base tokens deposited = `amountCollateralDeposited`
     * Balance = final amount of base tokens left
     * base tokens spent = Collateral Deposited - Balance
     * term = days left in term /365
     * yield exposure = number of YTs
     * gross gain = (speculated variable rate * term) * Yield exposure + Balance
     * Net gain = gross gain - collateral deposited - gas fee
     *       = (speculated variable rate * term) * Yield exposure - base Tokens Spent - gas fee
     * Adjusted APR = (Net Gain / (Collateral Deposited - Balance))*100 
     *              = (Net Gain / (base tokens spent))*100 
     */
    const trancheExpirationTimestamp = parseInt(trancheDetails["expiration"]) * 1000
    const daysLeftInTerm = Math.floor((trancheExpirationTimestamp - new Date().getTime())/(1000*60*60*24));

    //On goerli, as of today (July), there is only 1 active tranche due to expire on August so YTC gives poor APY. For demo purposes, we mimicked a tranche which would expire 6 months from today. Hence term = 0.5
    const term = 0.5//daysLeftInTerm/365
    // console.log("Days left in term, term: ", daysLeftInTerm, term);
    
    let values = {};
    for (let i=1; i<11; i++) {
        // TODO: Gas fee estimation + tx fee + convert to base token amount
        // let gasFee = ethers.utils.formatEther(ethers.BigNumber.from(await ytc.estimateGas.compound(i,trancheAddress, balancerPoolId, userData["amountCollateralDeposited"], "100")).toNumber());
        // FIXME: Need to convert gasFee in baseToken amount!
        
        let returnedVals = await ytc.callStatic.compound(i,trancheAddress, balancerPoolId, userData["amountCollateralDeposited"], "100");

        [ytExposure, baseTokensSpent] = returnedVals.map(val => ethers.BigNumber.from(val).toNumber());
        ytExposure = ytExposure / (10**yieldTokenDecimals);
        baseTokensSpent = baseTokensSpent / (10**baseTokenDecimals);
        // console.log("yt exposure, base token spent: ", ytExposure, baseTokensSpent);
        // console.log("grossYtGain: ", userData["speculatedVariableRate"] * term * ytExposure)
        let netGain = (userData["speculatedVariableRate"] * term * ytExposure) - baseTokensSpent //- gasFee;
        let finalApy = (netGain / baseTokensSpent)*100

        // Add values to table.
        values[i] = {
          "YT Exposure": ytExposure, 
          "Net Gain": `${netGain} ${userData["baseTokenName"]}`,
          "Final APR": finalApy
        }
    }
    console.table(values);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });