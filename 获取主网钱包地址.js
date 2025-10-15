// 获取主网钱包地址和状态
// 使用方法: node 获取主网钱包地址.js

const { ethers } = require('ethers');

const privateKey = '2159c1bcc01193026d313f98a11276f7ed2efe12fba8a0484272b922aaefd47d';
const tokenCA = '0x83dfb0f9a8059b3dd274b3f4d68da93520fc4444';

// 创建钱包
const wallet = new ethers.Wallet(privateKey);

console.log('========================================');
console.log('     BSC 主网钱包信息');
console.log('========================================');
console.log('');
console.log('📍 钱包地址:', wallet.address);
console.log('');
console.log('========================================');
console.log('     配置信息');
console.log('========================================');
console.log('');
console.log('🪙 代币合约 (CA):', tokenCA);
console.log('🌐 网络: BSC 主网');
console.log('');
console.log('========================================');
console.log('     下一步操作');
console.log('========================================');
console.log('');
console.log('1. 检查钱包余额:');
console.log('   访问: https://bscscan.com/address/' + wallet.address);
console.log('');
console.log('2. 确认钱包内有:');
console.log('   - 足够的代币 (用于发放)');
console.log('   - 至少 0.1 BNB (用于 Gas 费)');
console.log('');
console.log('3. 如果余额不足，请充值:');
console.log('   钱包地址: ' + wallet.address);
console.log('');
console.log('4. 准备好后运行: 主网配置命令.bat');
console.log('');
console.log('========================================');

