const { ethers, upgrades } = require('hardhat');

async function main () {
  const HashLockV2 = await ethers.getContractFactory('HashLockV2');
  console.log('Upgrading HashLock...');
  await upgrades.upgradeProxy('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', HashLockV2);
  console.log('HashLock upgraded');
}

main();