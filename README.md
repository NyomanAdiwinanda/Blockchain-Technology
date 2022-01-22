# Blockchain Technology

#### **What is Blockchain?**

![Blockchain Image](https://www.guru99.com/images/1/053018_0719_BlockchainT2.png)

Blockchain can be defined as a chain of blocks that contains information.
The technique is intended to timestamp digital documents so that it’s not
possible to backdate them or temper them. The purpose of blockchain is to
solve the double records problem without the need for a central server.

The blockchain is used for the secure transfer of items like money, property,
contracts, etc, without requiring a third-party intermediary like a bank or
government. Once data is recorded inside a blockchain, it is very difficult
to change it.

Sometimes the term is used for Bitcoin Blockchain or The Ethereum Blockchain,
and sometimes, it’s other virtual currencies or digital tokens. However, most
of them are talking about distributed ledgers.

The data which is stored inside a block depends on the type of blockchain. For Example,
A Bitcoin Block contains information about the Sender, Receiver, number of bitcoins to be
transferred.

![Bitcoin Block Example](https://www.guru99.com/images/1/053018_0719_BlockchainT3.png)

#### **Understanding Hash**

A block also has a hash. A can be understood as a fingerprint which is unique to each block.
It identifies a block and all of its contents, and it’s always unique, just like a fingerprint.
So once a block is created, any change inside the block will cause the Hash to change.

![Hash Picture 1](https://www.guru99.com/images/1/053018_0719_BlockchainT4.png)

Therefore, the Hash is very useful when you want to detect changes to intersections.
If the fingerprint of a block changes, it does not remain the same block.

Each Block has:

1\. Data

2\. Hash

3\. Hash of the previous block

Consider the following example, where we have a chain of 3 blocks. The 1st block has no
predecessor. Hence, it does not contain has the previous block. Block 2 contains a hash of
block 1. While block 3 contains Hash of block 2.

![Hash Picture 2](https://www.guru99.com/images/1/053018_0719_BlockchainT5.png)

Hence, all blocks are contained hashes of previous blocks. This is the technique that makes a
blockchain so secure. Let’s see how it works –

Assume an attacker can change the data present in Block 2. Correspondingly, the Hash of the Block
also changes. But Block 3 still contains the old Hash of Block 2. This makes Block 3, and all
succeeding blocks invalid as they do not have the correct Hash of the previous block.

![Hash Picture 3](https://www.guru99.com/images/1/053018_0719_BlockchainT6.png)

Therefore, changing a single block can quickly make all following blocks invalid.

#### _Reference:_ [https://www.guru99.com/blockchain-tutorial.html](https://www.guru99.com/blockchain-tutorial.html)

# Blockchain Implementation

Below, I have made a simple implementation of Blockchain written in javascript to demonstrate
how the explanation above works. Or you can navigate to the file by click [here](https://github.com/NyomanAdiwinanda/Blockchain-Technology/blob/main/main.js)

```js
/*
A cryptographic hash function is an algorithm that takes an arbitrary amount of data input and produces a fixed-size output of enciphered text called a hash value, or just “hash.”

SHA256 -> hash function used in Bitcoin(BTC) blockchain
SHA512 -> hash function used in Ripple(XRP) blockchain
Keccak-256 -> hash function used in etherium(ETH) blockchain
... and many more
*/

// for this example, I'm using SHA256 hash function. Imported from "crypto-js" npm library
const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(data = "Genesis Block") {
    this.index = 0; // the index of the block
    this.timeCreated = new Date(); // the time when the block is created
    this.data = data; // value of data passed in the constructor, Genesis Block is the term known for the first block in the chain
    this.previousHash = null; // hash from the previous block, first block will be null
    this.hash = this.generateHash(); // hash for the current block generated with generateHash() method below
  }

  generateHash() {
    // add toString() method at the end or otherwise it will return an object return from the function
    return SHA256(this.index + this.timeCreated + JSON.stringify(this.data) + this.previousHash).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createFirstBlock()]; // create the first block of the BlockChain when create an instance
  }

  createFirstBlock() {
    return new Block(null);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    // some modification before pushing the Block to the BlockChain

    newBlock.index = this.chain.length; // change the index of the new Block with previous Block index + 1
    newBlock.previousHash = this.getLatestBlock().hash; // change the previousHash of the new Block with the hash value of latest block in the BlockChain
    newBlock.hash = newBlock.generateHash(); // change the hash of the new Block with generated hash of the new keys from the new Block after modification above

    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // if the hash of current Block is not the same with the generated hash from current Block keys, then it's NOT VALID because the BlockChain has been modified
      if (currentBlock.hash !== currentBlock.generateHash()) {
        return console.log("The chain is NOT VALID");
      }

      // if the previous hash of current Block is not the same with the hash from previous Block, then it's NOT VALID because the BlockChain has been modified
      if (currentBlock.previousHash !== previousBlock.hash) {
        return console.log("The chain is NOT VALID");
      }
    }

    return console.log("The chain is VALID");
  }
}

const coin = new BlockChain();
coin.addBlock(new Block({ amount: 10 }));
coin.addBlock(new Block({ amount: 30 }));

// TEST CASE 1
console.log(JSON.stringify(coin, null, 2));
coin.isChainValid(); // will return VALID because the chain hasn't been modified

// TEST CASE 2
coin.chain[1].data = { amount: 200 }; // modify the BlockChain to check if it's still VALID
console.log(JSON.stringify(coin, null, 2));
coin.isChainValid(); // will return NOT VALID because the hash generated after modified is not the same with the hash produced before modified

// TEST CASE 3
coin.chain[1].hash = coin.chain[1].generateHash(); // what if we modify the hash too? Will it become valid
console.log(JSON.stringify(coin, null, 2));
coin.isChainValid(); // will also return NOT VALID because the current Block hash is now different from the previous Block hash
```

# Running The Code

```
git clone https://github.com/NyomanAdiwinanda/Blockchain-Technology.git

cd Blockchain-Technology

npm install

node main.js
```
