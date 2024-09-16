<p align="center">
  <img src="assets/logo.png" width="300" alt="ChainXS Web3" />
</p>

# ChainXS Web3
This is the main package of web3.js, it contains a collection of comprehensive TypeScript libraries for Interaction with the ChainXS REST API and utility functions.

## Contributors Welcome!
Hello, this is a relatively simple library that connects websites with the ChainXS blockchain. If you have some basic working JS/TS knowledge, please head over to the open bugs/enhancements and help clear the backlog. Thanks in advance! 🤠

---

## Installation
```sh
npm install @chainxs/web3
```

## Usage

Require in `javascript` as
```javascript
const Web3 = require('@chainxs/web3');
```
For `typescript`, use
```javascript
import Web3 from '@chainxs/web3';
```

## Operations

### New instance

```javascript
const chain = 'testnet';
  
const web3 = new Web3({
    initialNodes: ['https://testnet-node1.chainxs.com.br'],
});
```

### Create simple transaction

```javascript
const chain = 'testnet';
  
const web3 = new Web3({
    initialNodes: ['https://testnet-node1.chainxs.com.br'],
});
  
const wallet = web3.wallets.createWallet();

await web3.network.tryConnection();
console.log('connected web3');

if (!(await web3.network.testConnections())) {
    throw new Error('connection failed');
}

const receiveAddress = 'ob2CUupRZfa1aCgvwLsbRzNpuQJUZxvnj';

const tx = await web3.transactions.buildSimpleTx(wallet, chain, receiveAddress, '100');

await web3.transactions.sendTransactionSync(tx);
```
