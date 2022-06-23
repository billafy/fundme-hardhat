const { expect, assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
	? describe.skip
	: describe("Fund Me", async () => {
			let fundMe, deployer;
			const value = ethers.utils.parseEther("1");

			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", deployer);
			});
	  });
