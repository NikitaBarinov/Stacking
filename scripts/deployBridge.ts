const fs = require('fs');
const dotenv = require('dotenv');
import { ethers } from "hardhat";
const hre = require("hardhat");

async function main() {
    const network = hre.network.name;
    const envConfig = dotenv.parse(fs.readFileSync(`.env-${network}`));
    for (const parameter in envConfig) {
      process.env[parameter] = envConfig[parameter];
    }
    const accounts = await ethers.getSigners();
    console.log('Deploying contract with account:',accounts[1].address);
    
    const balance = await accounts[1].getBalance();
    console.log('Account balance ',balance.toString());
 
    const TradingFloor = await ethers.getContractFactory("Bridge");
    const tradingFloor = await TradingFloor.connect(accounts[1]).deploy(accounts[1].address, process.env.ERC721_ADDRESS);
    await tradingFloor.deployed();
    
    console.log('Bridge address:', tradingFloor.address);
    console.log(network);

    fs.appendFileSync(
      `.env-${network}`,
    `\r\# Deployed at \rBRIDGE_ADDRESS=${tradingFloor.address}\r`
    );
}   

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });