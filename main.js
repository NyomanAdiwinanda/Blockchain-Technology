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
    this.timestamp = new Date(); // the time when the block is created
    this.data = data; // value of data passed in the constructor, Genesis Block is the term known for the first block in the chain
    this.previousHash = null; // hash from the previous block, first block will be null
    this.hash = this.generateHash(); // hash for the current block generated with generateHash() method below
  }

  generateHash() {
    // add toString() method at the end or otherwise it will return an object return from the function
    return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createFirstBlock()]; // create the first block of the BlockChain when create an instance
  }

  createFirstBlock() {
    return new Block();
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
