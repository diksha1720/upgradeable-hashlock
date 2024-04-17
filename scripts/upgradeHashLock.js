const { ethers, upgrades } = require('hardhat');

async function main () {
  const HashLockV2 = await ethers.getContractFactory('HashLockV2');
  console.log('Upgrading HashLock...');
  await upgrades.upgradeProxy('0x362aC1482cD24F884ce071828790Bf0ea7ac29C0', HashLockV2);
  console.log('HashLock upgraded');
}

main();