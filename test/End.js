const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('End-to-End Test: Token and AnotherContract', function () {
	let Token, token, AnotherContract, anotherContract, owner, user1, user2;

	before(async function () {
		[owner, user1, user2] = await ethers.getSigners();

		Token = await ethers.getContractFactory('Token');
		token = await Token.deploy();
		await token.waitForDeployment();

		AnotherContract = await ethers.getContractFactory('AnotherContract');
		anotherContract = await AnotherContract.deploy(await token.getAddress());
		await anotherContract.waitForDeployment();
	});

	it('Owner should tranfer token to AnotherContract', async function () {
		const ownerInitialBalance = await token.balanceOf(owner.address);
		expect(ownerInitialBalance).to.be.equal(ethers.parseEther('1000000'));

		await token.approve(await anotherContract.getAddress(), ethers.parseEther('100'));
		await anotherContract.receiveTokens(ethers.parseEther('100'));

		const ownerBalanceAfter = await token.balanceOf(owner.address);
		const contractBalance = await token.balanceOf(await anotherContract.getAddress());

		expect(ownerBalanceAfter).to.equal(ethers.parseEther('999900'));
		expect(contractBalance).to.equal(ethers.parseEther('100'));
	});

	it('User1 should fail to transfer token without enough balance', async function () {
		await expect(anotherContract.connect(user1).receiveTokens(ethers.parseEther('100'))).to.be.revertedWith(
			'Insufficient balance in sender.'
		);
	});

	it('User2 transfers token after receiving from the Owner', async function () {
		await token.transfer(user2.address, ethers.parseEther('500'));

		await token.connect(user2).approve(await anotherContract.getAddress(), ethers.parseEther('200'));

		await anotherContract.connect(user2).receiveTokens(ethers.parseEther('200'));

		const user2Balance = await token.balanceOf(user2.address);
		const anotherContractBalance = await token.balanceOf(await anotherContract.getAddress());

		expect(user2Balance).to.equal(ethers.parseEther('300'));
		expect(anotherContractBalance).to.equal(ethers.parseEther('300'));
	});

	it('AnotherContract should report correct token balance', async function () {
		const balance = await anotherContract.getContractTokenBalance();
		expect(balance).to.equal(ethers.parseEther('300'));
	});
});
