const { expect, assert } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("Fund Me", async () => {
	let fundMe, deployer, mockV3Aggregator;
	const value = ethers.utils.parseEther("1");

	beforeEach(async () => {
		deployer = (await getNamedAccounts()).deployer;
		await deployments.fixture();
		fundMe = await ethers.getContract("FundMe", deployer);
		mockV3Aggregator = await ethers.getContract(
			"MockV3Aggregator",
			deployer
		);
	});

	describe("constructor", async () => {
		it("sets the price feed address correctly", async () => {
			const priceFeedAddress = await fundMe.getPriceFeed();
			assert.equal(priceFeedAddress, mockV3Aggregator.address);
		});

		it("sets the deployer as owner", async () => {
			const owner = await fundMe.getOwner();
			assert.equal(owner, deployer);
		});
	});

	describe("fund", async () => {
		it("fails when funded less than minimum ETH", async () => {
			await expect(fundMe.fund()).to.be.revertedWith(
				"You need to spend more ETH!"
			);
		});

		it("updates funders array when funded enough ETH", async () => {
			await fundMe.fund({ value });
			const funder = await fundMe.getFunder(0);
			assert.equal(funder, deployer);
		});

		it("updates funders mapping when funded enough ETH", async () => {
			await fundMe.fund({ value });
			const funderValue = await fundMe.getAddressToAmountFunded(deployer);
			assert.equal(value.toString(), funderValue.toString());
		});
	});

	describe("withdraw", async () => {
		beforeEach(async () => {
			await fundMe.fund({ value });
		});

		it("withdraws ETH from a single funder", async () => {
			const initialFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const initialDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);

			const txnResponse = await fundMe.withdraw();
			const txnReceipt = await txnResponse.wait(1);

			const { gasUsed, effectiveGasPrice } = txnReceipt;
			const gasCost = gasUsed.mul(effectiveGasPrice);

			const currentFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const currentDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);

			assert.equal(currentFundMeBalance.toString(), "0");
			assert.equal(
				initialFundMeBalance.add(initialDeployerBalance).toString(),
				currentDeployerBalance.add(gasCost).toString()
			);
		});

		it("withdraws ETH from multiple funders", async () => {
			const accounts = await ethers.getSigners();

			/* fund with multiple accounts */

			for (let i = 1; i < accounts.length; ++i) {
				const connectedFundMe = await fundMe.connect(accounts[i]);
				await connectedFundMe.fund({ value });
			}

			const initialFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const initialDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);

			const txnResponse = await fundMe.withdraw();
			const txnReceipt = await txnResponse.wait(1);

			const { gasUsed, effectiveGasPrice } = txnReceipt;
			const gasCost = gasUsed.mul(effectiveGasPrice);

			const currentFundMeBalance = await fundMe.provider.getBalance(
				fundMe.address
			);
			const currentDeployerBalance = await fundMe.provider.getBalance(
				deployer
			);

			assert.equal(currentFundMeBalance.toString(), "0");
			assert.equal(
				initialFundMeBalance.add(initialDeployerBalance).toString(),
				currentDeployerBalance.add(gasCost).toString()
			);

			/* check if funders array and amount mapping has been resetted or not */

			await expect(fundMe.getFunder(0)).to.be.reverted;

			for (let i = 1; i < accounts.length; ++i)
				assert.equal(
					(
						await fundMe.getAddressToAmountFunded(accounts[i].address)
					).toString(),
					"0"
				);
		});

		it("only allows owner to withdraw", async () => {
			const accounts = await ethers.getSigners();
			const connectedFundMe = await fundMe.connect(accounts[1]);
			await expect(connectedFundMe.withdraw()).to.be.revertedWith('FundMe__NotOwner');
		});
	});
});
