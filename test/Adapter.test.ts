import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const { expect } = require("chai");
const { ethers } = require("hardhat");

import {
    WETH__factory,
    WETH,
    UniswapV2Factory__factory,
    UniswapV2Factory,
    UniswapV2Pair__factory,
    UniswapV2Pair
  } from "../typechain";

describe('Bridge contract', () => {
    let 
        erc20Token1: WETH,
        erc20Token2: WETH,  
        factory: UniswapV2Factory,
        pair: UniswapV2Pair, 
        owner: SignerWithAddress, 
        addr1: SignerWithAddress, 
        addr2: SignerWithAddress,
        ownerTokenId: number,
        addr1TokenId: number,
        nonce: number,
        chainTo: number,
        ramsesURI: string;
    
    const minterRole =ethers.utils.solidityKeccak256(["string"],["MINTER_ROLE"]);
    const adminRole = ethers.constants.HashZero;
    const zero_address = "0x0000000000000000000000000000000000000000";
    ownerTokenId = 1;
    addr1TokenId = 2;
    nonce = 3;
    chainTo = 97;
    const tenThousendTokens = 10000;
    const hundredTokens = 100;

    before(async () => {
        [addr1, owner, addr2] = await ethers.getSigners();
    });
    
    beforeEach(async () => {
        erc20Token1 = await new WETH__factory(owner).deploy();
        await erc20Token1.deployed(); 

        erc20Token2 = await new WETH__factory(owner).deploy();
        await erc20Token2.deployed(); 
        
        factory = await new UniswapV2Factory__factory(owner).deploy(owner.address);
        await factory.deployed(); 

        await erc20Token1.connect(owner).mint(owner.address, hundredTokens);
        await erc20Token2.connect(owner).mint(addr1.address, tenThousendTokens);
    });

    describe('Deployment', () => {
        // it('Should set right name', async () => {
        //     expect(await token.name()).to.equal("Metaverse Token");
        // });

        // it('Should set right symbol', async () => {
        //     expect(await token.symbol()).to.equal("MET");
        // }); 

        // it('Should set admin role for owner', async () => {
        //     expect(await token.hasRole(minterRole, owner.address)).to.equal(true);
        // });

        // it('Should set minter role for owner', async () => {
        //     expect(await token.hasRole(minterRole, bridge.address)).to.equal(true);
        // });

        // it('Should set right balance for owner address and addr1 address', async () => {
        //     expect(await token.balanceOf(owner.address)).to.equal(1);
        //     expect(await token.balanceOf(addr1.address)).to.equal(1);        
        // });
    });

    describe('Transactions', () => {
        it('createPair: should create pair for tokens', async () => { 
          //  console.log(await factory.connect(owner).createPair(erc20Token1.address, erc20Token2.address));    
            console.log(erc20Token1.address);
            console.log(erc20Token2.address);
            await expect(factory.connect(owner).createPair(erc20Token1.address, erc20Token2.address))
            .to.emit(factory,"PairCreated")
            .withArgs(erc20Token2.address, erc20Token1.address,"2",1);
            //.and
            // .to.emit(bridge, "SwapRedeemed")
            // .withArgs(addr1.address, addr1TokenId, 97, 31337, nonce)
        });


    });
});
