const fs = require("fs");
const hre = require("hardhat");
const ethers = hre.ethers;


const DEFAULT_ARTIFACTS_PATH = "./src/artifacts/contracts";

function getGoerliElementFinanceData() {
    return JSON.parse(fs.readFileSync("./goerli-constants.json"))
}

function getAbi(path) {
    return JSON.parse(fs.readFileSync(`${DEFAULT_ARTIFACTS_PATH}/${path}`)).abi
};

async function getERC20Balance(token, address) {
    return ethers.BigNumber.from(await token.balanceOf(address)).toNumber();
}

module.exports = {getAbi, getERC20Balance, getGoerliElementFinanceData};
