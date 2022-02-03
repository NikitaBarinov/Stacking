const fs = require('fs');
import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
    const network = hre.network.name;
    const accounts = await ethers.getSigners();
    console.log('Deploying contract with account:',accounts[1].address);
    
    const balance = await accounts[1].getBalance();
    console.log('Account balance ',balance.toString());

    const Token = await ethers.getContractFactory("ACDM721");
    const token = await Token.connect(accounts[1]).deploy();
    await token.deployed();

    console.log('Token address:',token.address);
    
    fs.appendFileSync(
      `.env-${network}`,
    `\r\# Deployed at \rERC721_ADDRESS=${token.address}\r`
    );
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 