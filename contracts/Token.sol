// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;

contract Token {
   string public name = "Test Token";
   string public symbol = "TT";
   uint8 public decimal = 18;
   uint256 public totalSupply = 1000000 * (10 ** uint256(decimal));
   mapping(address => uint256) public balancOf;
   mapping(address => mapping(address => uint256)) public allowance;

   constructor() {
      balancOf[msg.sender] = totalSupply;
   }

   event Transfer(address indexed from, address indexed to, uint256 value);
   event Approval (address indexed owner, address indexed spender, uint256 value);

   function transfer (address to , uint256 value) public returns (bool success) {
      require(balancOf[msg.sender] >= value, "Insufficient balance.");
      balancOf[msg.sender] -= value;
      balancOf[to]  += value;
      emit Transfer(msg.sender, to, value);
      return true;
   }

   function approve(address spender,  uint256 value) public returns (bool success) {
      allowance[msg.sender][spender] = value;
      emit Approval(msg.sender, spender, value);
      return true;
   }

   function transferFrom (address from, address to, uint256 value) public returns (bool success) {
      require(value <= balancOf[from], "Insufficient balance.");
      require(value <= allowance[from][msg.sender], "Allowance exceeded.");

      balancOf[from] -= value;
      balancOf[to] += value;
      allowance[from][msg.sender] -= value;
      emit Transfer(from, to, value);
      return true;
   }

}

