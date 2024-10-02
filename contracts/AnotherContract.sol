// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;

import "./Token.sol";

contract  AnotherContract {
   Token public token;

   constructor(address _tokenAddress) {
      token = Token(_tokenAddress);
   }

   function receiveTokens(uint256 amount) public {
      require(token.balanceOf(msg.sender) >= amount, "Insufficient balance in sender.");
      require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed.");
   }

   function getContractTokenBalance() public view returns (uint256) {
      return token.balanceOf(address(this));
   }
}