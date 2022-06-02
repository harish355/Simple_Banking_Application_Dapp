// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <8.10.0;

contract SimpleBanking {
    mapping(address => uint256) balanceOf;

    event ErrorMsg(address _buyer, uint256 _value, string err);

    function getBalance() public view returns (uint256) {
        return balanceOf[msg.sender];
    }

    modifier ValidateWithdraw(uint256 amount) {
        require(balanceOf[msg.sender] >= amount);
        emit ErrorMsg(msg.sender, amount, "Do not have Enough Balance");
        _;
    }

    function deposit(uint256 _amount) external payable {
        balanceOf[msg.sender] += _amount;
    }

    function withdraw(uint256 amount)
        external
        payable
        ValidateWithdraw(amount)
    {
        balanceOf[msg.sender] -= amount;
        address payable addr1 = msg.sender;
        addr1.transfer(amount);
    }
}
