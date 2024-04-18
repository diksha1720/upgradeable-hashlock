const { ethers, upgrades } = require('hardhat');

async function main () {
  const HashLockV2 = await ethers.getContractFactory('HashLockV2');
  console.log('Upgrading HashLock...');
  await upgrades.upgradeProxy('0x69Ba37863a5C2219BE9E4C2344cc26EeF416d657', HashLockV2);
  console.log('HashLock upgraded');
}

main();