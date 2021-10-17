// TODO This is hardcoding gas estimates for each number of compounds
// This could be replaced by either ethers gas estimation (seems to be innacurate)
// OR on chain gas used for transactions can be compiled

export const GAS_LIMITS: {[key: number]: number} = {
    1: 290196,
    2: 354059,
    3: 460043,
    4: 567440,
    5: 674754,
    6: 782084,
    7: 889901,
    8: 997314
}