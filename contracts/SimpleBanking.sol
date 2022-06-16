// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <8.10.0;

contract SimpleBanking {
    mapping(address => uint256) balanceOf;


    function getBalance() public view returns (uint256) {
        return balanceOf[msg.sender];
    }

    modifier ValidateWithdraw(uint256 amount) {
        require(balanceOf[msg.sender] >= amount);
        _;
    }

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) external ValidateWithdraw(amount) {
        address addr1 = msg.sender;
        address payable addr2=payable(addr1);
        addr2.transfer(amount);
        balanceOf[msg.sender] -= amount;
    }

    function transfer(uint256 amount, address to) external ValidateWithdraw(amount){
        address addr1=to;
        address payable addr2=payable(addr1);
        addr2.transfer(amount);
        balanceOf[msg.sender] -= amount;
    }
}
