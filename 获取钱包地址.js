// 运行这个脚本获取钱包地址
// 使用方法: node 获取钱包地址.js

const { ethers } = require('ethers');

const privateKey = '2159c1bcc01193026d313f98a11276f7ed2efe12fba8a0484272b922aaefd47d';

const wallet = new ethers.Wallet(privateKey);

console.log('========================================');
console.log('     你的测试钱包信息');
console.log('========================================');
console.log('');
console.log('钱包地址:', wallet.address);
console.log('');
console.log('接下来请：');
console.log('1. 访问 https://testnet.binance.org/faucet-smart');
console.log('2. 输入钱包地址:', wallet.address);
console.log('3. 领取测试网 BNB（用于 Gas 费）');
console.log('4. 向钱包转入测试代币（如果还没有）');
console.log('');
console.log('========================================');

