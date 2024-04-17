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
  
    polygonMumbai: {
        url: process.env.POLYGON_MUMBAI_URL,
        accounts: [process.env.ACCOUNT_KEY , process.env.ACCOUNT1_KEY , process.env.ACCOUNT2_KEY , process.env.ACCOUNT3_KEY , process.env.ACCOUNT4_KEY],
      }
},

};
