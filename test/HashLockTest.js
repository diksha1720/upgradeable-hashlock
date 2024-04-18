const { expect } = require("chai");
const { ethers, upgrades  } = require("hardhat");
const web3 = require('web3')

describe("Contract Version 1 test", function () {

  it("Users should be able to deposit and withdraw funds by passing the correct secret", async function () {

    const secret = 'ABCDE12345'

    const HashLock = await ethers.getContractFactory("HashLock");

    const[owner, account1, account2] = await ethers.getSigners()

    const contract = await upgrades.deployProxy(HashLock);

    await contract.waitForDeployment();

    //account1 makes the deposit
    await contract.connect(account1).deposit(web3.utils.soliditySha3(
      {t: 'string', v: secret},
    ), {value: "100000000000000000"})

    //account2 withdraws the deposit
    await contract.connect(account1).withdraw(secret, 0)
    
   
  });
});


describe("Contract Version 2 test", function () {

  let oldContract, upgradedContract, owner, account1, account2

  beforeEach(async function () {

    [owner, account1, account2] = await ethers.getSigners()

    const HashLock = await ethers.getContractFactory("HashLock");
    const HashLockV2 = await ethers.getContractFactory("HashLockV2");

    oldContract = await upgrades.deployProxy(HashLock);

    await oldContract.waitForDeployment();

    upgradedContract = await upgrades.upgradeProxy(oldContract, HashLockV2);

  });

  it("In upgraded version user should be able to deposit using secret", async function () {

    const secret = 'ABCDE12345'
    const depositValue = "1000000000000000000"

    //account1 makes the deposit
    await upgradedContract.connect(account1).deposit(web3.utils.soliditySha3(
      {t: 'string', v: secret},
    ), {value: depositValue})

    expect(await ethers.provider.getBalance(upgradedContract.getAddress())).to.be.eq(depositValue)



  });

  it("In upgraded version user should be able to commit the secret before revealing and withdrawing", async function () {

    const secret = 'ABCDE12345'
    const salt = "hello"
    const depositValue = "1000000000000000000"


     //account1 makes the deposit
     await upgradedContract.connect(account1).deposit(web3.utils.soliditySha3(
      {t: 'string', v: secret},
    ), {value: depositValue})


    expect(await ethers.provider.getBalance(upgradedContract.getAddress())).to.be.eq(depositValue)

    //account2 makes the commit
    await upgradedContract.connect(account2).commit(0, web3.utils.soliditySha3(
      {t: 'string', v: secret},{t: 'string', v: salt}), 3)

  });

  it("In upgraded version user should be able to commit then reveal the secret and withdraw", async function () {

    const secret = 'ABCDE12345'
    const salt = "hello"
    const depositValue = "1000000000000000000"


     //account1 makes the deposit
     await upgradedContract.connect(account1).deposit(web3.utils.soliditySha3(
      {t: 'string', v: secret},
    ), {value: depositValue})

    expect(await ethers.provider.getBalance(upgradedContract.getAddress())).to.be.eq(depositValue)

    
    //account2 makes the commit
    await upgradedContract.connect(account2).commit(0, web3.utils.soliditySha3(
      {t: 'string', v: secret},{t: 'string', v: salt}), 3)

      await upgradedContract.connect(account2).reveal(0, secret, salt)

    expect(await ethers.provider.getBalance(upgradedContract.getAddress())).to.be.eq("0")

    });



  });



