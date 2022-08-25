const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Proxy for deposit contract', () => {
    let deployer;
    let depositContract;


    beforeEach('Deploy contracts', async () => {
        // load signers
        [deployer, ...user] = await ethers.getSigners();

        const depositContractFactory = await ethers.getContractFactory('CallDeposit');
        depositContract = await depositContractFactory.deploy();
        await depositContract.deployed();
    });

    it('Should check the constructor parameters', async () => {
        // TODO
    });

});