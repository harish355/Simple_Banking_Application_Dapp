// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleBanking {
    address private Creator_address;

    mapping(address => uint256) balanceOf;

    event ErrorMsg(address _buyer, uint256 _value, string err);

    function getBalance() public view returns (uint256) {
        return balanceOf[msg.sender];
    }

    modifier ValidateWithdraw(uint256 amount) {
        require(balanceOf[msg.sender] > amount);
        emit ErrorMsg(msg.sender, 1, "Do not have Enough Balance");
        _;
    }

    constructor() public {
        Creator_address = msg.sender;
        balanceOf[Creator_address] = 32719999;
    }

    function deposit(uint256 _amount) external payable {
        balanceOf[msg.sender] += _amount;
    }

    function withdraw(uint256 amount) external ValidateWithdraw(amount) {
        balanceOf[msg.sender] -= amount;
    }
}
