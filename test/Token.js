const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Integration Test: Token and AnotherContract', async function () {
	let Token, token, AnotherContract, anotherContract, user, owner;

	beforeEach(async function () {
		[owner, user] = await ethers.getSigners();

		Token = await ethers.getContractFactory('Token');
		token = await Token.deploy();
		await token.waitForDeployment();

		AnotherContract = await ethers.getContractFactory('AnotherContract');
		anotherContract = await AnotherContract.deploy(await token.getAddress());
		await anotherContract.waitForDeployment();
	});

	it('should tranfer tokens to AnotherContract', async function () {
		expect(await token.balanceOf(owner.address)).to.equals(ethers.parseEther('1000000'));
		expect(await token.balanceOf(await anotherContract.getAddress())).to.equals(0);

		await token.approve(await anotherContract.getAddress(), ethers.parseEther('100'));
		await anotherContract.receiveTokens(ethers.parseEther('100'));

		expect(await token.balanceOf(owner.address)).to.be.equal(ethers.parseEther('999900'));
		expect(await token.balanceOf(await anotherContract.getAddress())).to.be.equal(ethers.parseEther('100'));
	});

	it("should fail if the user doesn't have enough token", async function () {
		await expect(anotherContract.connect(user).receiveTokens(ethers.parseEther('100'))).to.be.revertedWith(
			'Insufficient balance in sender.'
		);
	});

	it('should return correct balance of AnotherContract', async function () {
		await token.approve(await anotherContract.getAddress(), ethers.parseEther('200'));
		await anotherContract.receiveTokens(ethers.parseEther('200'));

		const contractBalance = await anotherContract.getContractTokenBalance();
		expect(contractBalance).to.equal(ethers.parseEther('200'));
	});
});
