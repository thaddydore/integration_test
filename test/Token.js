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
	});
});
