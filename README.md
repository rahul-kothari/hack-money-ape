## Ape - YTC

![YTC](./images/ytc-representation)

Iteration 1: User deposits 10 USDC to get 9.9 PT and 10 YT. 9.9 PT sold for 9.7 USDC. 
Iteration 2: Deposit USDC back for more PT and YT. Sell PT for USDC and return to user.
(Iteration 2 is where the real magic happens)

At the end of i=2, user put in 10 USDC to get 19.72 YT and 9.54 USDC.

## Instructions:
```
npm i
npx hardhat compile

```

This generates the ABI/artificats. This can be found in the `src/artifacts` directory.

ABI for the YTC contract can be accessed like so:
```
JSON.parse(fs.readFileSync("./src/artifacts/contracts/YieldTokenCompounding.sol/YieldTokenCompounding.json")).abi
```

### Element.fi contract addresses:
[`./goerli-constants.json`](./goerli-constants.json)
Alternatively use the elf-sdk.

### Hardhat stuff:
Run a hardhat node through:
```
npx hardhat node
```

Deploy contracts using:
```
npx hardhat run --network localhost scripts/deploy.js
```
Use any network defined in [`hardhat.config.js`](./hardhat.config.js)
Note that for this, you would need to first deploy Balancer pools, tranches, mint base tokens etc..

## React:
```
npm run start
```
UI available at localhost:3000

