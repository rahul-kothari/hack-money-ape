const fs = require("fs");
const ethers = require('ethers');
const {georli} = require('./constants/goerli-constants');

const DEFAULT_ARTIFACTS_PATH = "./src/artifacts/contracts";

function getGoerliElementFinanceData() {
    return georli;
}

function getAbi(path) {
    return JSON.parse(fs.readFileSync(`${DEFAULT_ARTIFACTS_PATH}/${path}`)).abi
};

async function getERC20Balance(token, address) {
    return ethers.BigNumber.from(await token.balanceOf(address)).toNumber();
}

module.exports = {getAbi, getERC20Balance, getGoerliElementFinanceData};
