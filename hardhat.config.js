require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
        blockGasLimit: 10000000000000,
        allowUnlimitedContractSize: true,
        timeout: 10000000000000000000,
        accounts: {
            accountsBalance: "10000000000000000000000000",
            count: 20,
        },
    },
  
      sepolia: {
        url: process.env.SEPOLIA_URL,
        accounts: [process.env.PRIVATE_KEY ],
      }
},

};
