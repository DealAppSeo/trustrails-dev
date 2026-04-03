const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
async function run() {
  const address = "0xdf6b8215D193b11B4903d223729c3CF7A6de271d"; 
  const balance = await provider.getBalance(address);
  console.log('Balance for deployer is:', ethers.formatEther(balance));
}
run();
