import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { NetworkUserConfig } from 'hardhat/types';
import { HardhatUserConfig, task } from "hardhat/config";
import 'hardhat-docgen'
import "hardhat-gas-reporter"
require('hardhat-contract-sizer');
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import "@nomiclabs/hardhat-etherscan";
//import "@openzeppelin/hardhat-upgrades";
import "solidity-coverage";

// import "./tasks/Bridge/index.ts";
// import "./tasks/ERC20/index.ts";
// import "./tasks/ERC721/index.ts";

//define chainIds for networks 
const chainIds = {
    rinkeby: 4,
    BSC:97,
    kovan:42
} 

// Ensure everything is in place
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error('Please set your MNEMONIC in a .env file')
} else {
  mnemonic = process.env.MNEMONIC;
}
let infuraApiKey: string;
if (!process.env.INFURA_API_KEY) {
  throw new Error('Please set your INFURA_API_KEY in a .env file')
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

// create network obj
function createNetworkConfig(
    network: keyof typeof chainIds,
  ): NetworkUserConfig {
    const url: string = `https://${network}.infura.io/v3/${infuraApiKey}`;
    return {
      accounts: {
        count: 2,
        initialIndex: 0,
        mnemonic,
      },
      chainId: chainIds[network],
      url,
      gas: 2100000,
      gasPrice: 8000000000
    };
  }

export default {
    solidity: {
      compilers: [{
        version: "0.8.2",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.5.0",
      },
      ],
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      defaultNetwork: 'hardhat',
      networks: {
        rinkeby: createNetworkConfig('rinkeby'),
        kovan: createNetworkConfig('kovan'),
        BSC:{
          url:"https://data-seed-prebsc-1-s1.binance.org:8545/",
          accounts: {
            count: 2,
            initialIndex: 0,
            mnemonic,
          },
          chainId: 97,
          gas: 2100000,
          gasPrice: 80000000000
        }
      },
      etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
      },
      paths: {
        artifacts: './artifacts',
        cache: './cache',
        sources: './contracts',
        tests: './test'
      },
      mocha: {
        timeout: 20000
      },
      docgen: {
        path: './docs',
        runOnCompile: true
      },
      contractSizer: {
        alphaSort: false,
        disambiguatePaths: false,
        runOnCompile: true,
        strict: false,
      },
      gasReporter: {
        // enabled by default
        // enabled: process.env.GAS ? true : false,
        currency: "USD",
        token: "ETH",
        gasPriceApi: "https://api.etherscan.io/api?module=proxy&action=eth_gasPrice",
        coinmarketcap: process.env.CMC_API_KEY,
      },
};