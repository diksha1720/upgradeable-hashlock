const { ethers, upgrades } = require('hardhat');

async function main () {
    const HashLock = await ethers.getContractFactory('HashLock');
    console.log('Deploying HashLock...');
    const hashLock = await upgrades.deployProxy(HashLock);
    await hashLock.waitForDeployment();
    console.log('HashLock deployed to:', await hashLock.getAddress());
}

main();