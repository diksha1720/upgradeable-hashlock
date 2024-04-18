//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract HashLockV2{

    struct EscrowTx{
        bytes32 depositSecret;
        uint256 amount;
        bool isActive;
    }

    EscrowTx[] private allEscrows;
    event FundsDeposited(address indexed sender, uint256 indexed txIndex);

    struct Commitment{
            // uint256 escrowId;
            bytes32 commitHash;
            uint256 revealStartBlock;
            uint256 revealEndBlock;
            bool revealed;
        }

    // Commitment[] private userCommits;
    mapping(uint256 => Commitment) public userCommits;

    function deposit(bytes32 _secret) external payable{
        uint256 txIndex = allEscrows.length;
        allEscrows.push(EscrowTx({depositSecret : _secret, amount: msg.value,isActive: true }));
        emit FundsDeposited(msg.sender, txIndex);
    }

    function withdraw(string memory _password, uint256 _txIndex) internal {
        require(_txIndex < allEscrows.length, "Escrow doesn't exist");
        require(keccak256(abi.encodePacked(_password)) == allEscrows[_txIndex].depositSecret, "Invalid _password provided");
        require(allEscrows[_txIndex].isActive, "Escrow not active");
        require(userCommits[_txIndex].revealed, "user required to reveal the commit to accesss"); //changed the implementation of withdraw function in the upgraded contract
        allEscrows[_txIndex].isActive = false;
        (bool success, ) = (msg.sender).call{value : (allEscrows[_txIndex].amount)}("");
        require(success, "withdraw failed");
    }

    function commit(uint256 _txIndex, bytes32 _hash, uint _noOfBlocks) external{
        require(_txIndex < allEscrows.length, "Escrow doesn't exist");
        require(!userCommits[_txIndex].revealed, "commit already revealed");
        userCommits[_txIndex] = Commitment({ commitHash :_hash , revealStartBlock : block.number, revealEndBlock : block.number + _noOfBlocks,revealed : false });
    }

    function reveal(uint _txIndex, string memory _password, string memory _salt) external{
        require(_txIndex < allEscrows.length, "Escrow doesn't exist");
        Commitment memory currentCommit = userCommits[_txIndex];
        require(!currentCommit.revealed, "commit already revealed");
        require(block.number > currentCommit.revealStartBlock && block.number <= currentCommit.revealEndBlock, "reveal time exceeded");
        require(keccak256(abi.encodePacked(_password, _salt)) == currentCommit.commitHash, "hash not matching");
        userCommits[_txIndex].revealed = true;
        withdraw(_password, _txIndex);
    }


}