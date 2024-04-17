//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract HashLock{

    struct EscrowTx{
        bytes32 depositSecret;
        uint256 amount;
        bool isActive;
    }

    EscrowTx[] private allEscrows;
    
    mapping(address => uint256) public allBalances;
    event FundsDeposited(address indexed sender, uint256 indexed txIndex);

    function deposit(bytes32 _secret) external payable{
        uint256 txIndex = allEscrows.length;
        allEscrows.push(EscrowTx({depositSecret : _secret, amount: msg.value,isActive: true }));
        emit FundsDeposited(msg.sender, txIndex);
    }

    function withdraw(string memory _password, uint256 _txIndex) public {
        require(_txIndex < allEscrows.length, "Escrow doesn't exist");
        require(keccak256(abi.encodePacked(_password)) == allEscrows[_txIndex].depositSecret, "Invalid _password provided");
        require(allEscrows[_txIndex].isActive, "Escrow not active");
        allEscrows[_txIndex].isActive = false;
        (bool success, ) = (msg.sender).call{value : (allEscrows[_txIndex].amount)}("");
        require(success, "withdraw failed");
    }

}