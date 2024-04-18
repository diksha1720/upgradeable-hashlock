const { ethers, upgrades } = require('hardhat');

async function main () {
  const HashLockV2 = await ethers.getContractFactory('HashLockV2');
  console.log('Upgrading HashLock...');
  await upgrades.upgradeProxy('0xc5147309E732A0C90Cd20847aF740541144237aE', HashLockV2);
  console.log('HashLock upgraded');
}

main();