# 测试指南 - BSC 代币兑换系统

## 📝 测试前准备

### 1. 获取测试网资源

#### BSC 测试网 BNB 水龙头
- **官方水龙头**: https://testnet.bnbchain.org/faucet-smart
- **备用水龙头**: https://testnet.binance.org/faucet-smart
- 每次可领取: 0.1-0.5 tBNB
- 冷却时间: 24小时

#### 部署测试代币（可选）

如果你还没有测试网代币，可以部署一个简单的 BEP-20 代币：

1. 访问 Remix IDE: https://remix.ethereum.org/
2. 创建新文件 `TestToken.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    constructor() ERC20("Test BNBXP Token", "tBNBXP") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
```

3. 编译合约
4. 连接 MetaMask (BSC 测试网)
5. 部署合约
6. 复制合约地址作为 TOKEN_CONTRACT_ADDRESS

### 2. 配置测试环境

```bash
# 设置为测试网模式
firebase functions:config:set bsc.use_testnet="true"

# 设置测试网代币合约地址
firebase functions:config:set token.contract_address="0xYourTestTokenAddress"

# 设置测试钱包私钥
firebase functions:config:set wallet.private_key="your_test_wallet_private_key"

# 部署
firebase deploy --only functions
```

## 🧪 测试用例

### 测试 1: 查询钱包状态

**目的**: 验证 Cloud Function 能正确连接 BSC 网络并读取钱包信息

```javascript
// 在浏览器控制台执行
const getStatus = firebase.functions().httpsCallable('getWalletStatus');

getStatus().then(result => {
    console.log('测试结果:', result.data);
    console.log('✅ 钱包地址:', result.data.walletAddress);
    console.log('✅ BNB 余额:', result.data.bnbBalance, 'BNB');
    console.log('✅ 代币余额:', result.data.tokenBalance, result.data.tokenSymbol);
    console.log('✅ 网络:', result.data.network);
}).catch(error => {
    console.error('❌ 测试失败:', error);
});
```

**预期结果:**
```json
{
  "success": true,
  "walletAddress": "0x...",
  "bnbBalance": "0.5",
  "tokenBalance": "100000",
  "tokenSymbol": "tBNBXP",
  "network": "BSC Testnet",
  "contractAddress": "0x..."
}
```

### 测试 2: 查询代币余额

**目的**: 验证能正确读取任意地址的代币余额

```javascript
const getBalance = firebase.functions().httpsCallable('getTokenBalance');

getBalance({ 
    wallet: '0xYourTestWalletAddress' 
}).then(result => {
    console.log('测试结果:', result.data);
    console.log('✅ 余额:', result.data.balance, result.data.symbol);
}).catch(error => {
    console.error('❌ 测试失败:', error);
});
```

### 测试 3: 小额代币转账

**目的**: 验证完整的转账流程

**步骤:**

1. **在 Firebase 数据库设置测试积分**
   ```javascript
   // 访问 Firebase 控制台
   // Realtime Database → users/YOUR_TEST_WALLET/score = 1
   ```

2. **执行转账**
   ```javascript
   const claimToken = firebase.functions().httpsCallable('claimToken');
   
   claimToken({ 
       wallet: '0xYourTestWalletAddress' 
   }).then(result => {
       console.log('✅ 转账成功!');
       console.log('交易哈希:', result.data.tx);
       console.log('区块号:', result.data.blockNumber);
       console.log('转账数量:', result.data.amount, '代币');
       console.log('浏览器查看:', result.data.explorerUrl);
       
       // 在 BSCScan 测试网查看交易
       window.open(result.data.explorerUrl, '_blank');
   }).catch(error => {
       console.error('❌ 转账失败:', error);
       console.error('错误详情:', error.message);
   });
   ```

3. **验证结果**
   - 检查 Firebase 数据库 `transactions/` 节点是否有记录
   - 在 https://testnet.bscscan.com/ 查看交易
   - 检查接收地址代币余额是否增加

### 测试 4: 游戏完整流程测试

**步骤:**

1. **开始游戏**
   - 打开 `snake.html`
   - 输入测试钱包地址
   - 选择房间开始游戏

2. **获得积分**
   - 玩游戏吃食物获得积分
   - 或直接在 Firebase 数据库设置积分

3. **查看积分**
   ```javascript
   // 点击 "Claim Rewards" 按钮
   // 输入钱包地址
   // 点击 "Check Points"
   ```

4. **兑换代币**
   ```javascript
   // 点击 "Claim Tokens"
   // 等待转账完成
   // 查看成功弹窗
   ```

5. **验证**
   - 检查积分是否清零
   - 检查代币余额是否增加
   - 检查交易记录

### 测试 5: 边界情况测试

#### 5.1 积分为 0 时兑换
```javascript
// 设置积分为 0
// 尝试兑换，应该失败
const claimToken = firebase.functions().httpsCallable('claimToken');
claimToken({ wallet: '0x...' })
    .then(r => console.log('不应该成功'))
    .catch(e => console.log('✅ 正确拒绝:', e.message));
```

#### 5.2 无效钱包地址
```javascript
claimToken({ wallet: 'invalid_address' })
    .catch(e => console.log('✅ 正确拒绝无效地址:', e.message));
```

#### 5.3 发款钱包余额不足
```javascript
// 将发款钱包代币转出，只保留少量
// 设置高额积分
// 尝试兑换，应该失败并提示余额不足
```

#### 5.4 Gas 费不足
```javascript
// 将发款钱包 BNB 转出，只保留极少量
// 尝试转账，应该失败并提示 BNB 不足
```

## 📊 测试结果检查清单

### Cloud Function 层面
- [ ] `getWalletStatus` 返回正确的钱包信息
- [ ] `getTokenBalance` 能查询任意地址余额
- [ ] `claimToken` 成功执行转账
- [ ] 日志中没有错误信息
- [ ] 交易记录保存到 Firebase 数据库

### 区块链层面
- [ ] 交易在 BSCScan 上可查
- [ ] 交易状态为 Success
- [ ] Gas 费用合理（< 0.001 BNB）
- [ ] 代币实际到账
- [ ] From 地址是发款钱包
- [ ] To 地址是用户钱包

### 前端层面
- [ ] 积分查询显示正确
- [ ] 兑换按钮可点击
- [ ] 加载状态正确显示
- [ ] 成功弹窗显示交易哈希
- [ ] 可以点击链接跳转 BSCScan
- [ ] 兑换后积分清零

### 安全层面
- [ ] 私钥未暴露在日志中
- [ ] 环境变量配置正确
- [ ] 只有有积分的用户能兑换
- [ ] 兑换后积分确实清零
- [ ] 不能重复兑换

## 🐛 常见问题与解决方案

### 问题 1: "Cloud Function not configured"

**原因**: 环境变量未设置

**解决**:
```bash
firebase functions:config:get
# 检查是否缺少配置

firebase functions:config:set token.contract_address="0x..."
firebase deploy --only functions
```

### 问题 2: "Failed to connect to BSC network"

**原因**: RPC 节点连接失败

**解决**:
```bash
# 更换 RPC 节点
firebase functions:config:set bsc.rpc_url="https://bsc-dataseed2.binance.org/"
firebase deploy --only functions
```

### 问题 3: "Insufficient BNB for gas fees"

**原因**: 发款钱包 BNB 不足

**解决**:
- 测试网: 从水龙头领取 tBNB
- 主网: 向发款钱包转入 BNB

### 问题 4: "Insufficient token balance"

**原因**: 发款钱包代币不足

**解决**:
- 向发款钱包转入更多代币
- 或减少测试积分

### 问题 5: 交易一直 pending

**原因**: Gas Price 设置过低或网络拥堵

**解决**:
- 等待几分钟
- 在 ethers.js 中可以设置更高的 Gas Price（修改 `index.js`）

## 📈 性能测试

### 测试并发转账

```javascript
// 创建 10 个测试账户，每个 1 积分
// 同时发起兑换请求

const wallets = [
    '0x...1',
    '0x...2',
    // ... 共 10 个
];

const promises = wallets.map(wallet => {
    return firebase.functions().httpsCallable('claimToken')({ wallet });
});

Promise.all(promises)
    .then(results => {
        console.log('✅ 所有转账成功');
        results.forEach((r, i) => {
            console.log(`钱包 ${i}: ${r.data.tx}`);
        });
    })
    .catch(error => {
        console.error('❌ 部分转账失败', error);
    });
```

### 监控 Gas 费用

```javascript
// 记录多笔交易的 Gas 费用
const gasUsed = [];

// 执行 10 笔转账
// 记录每笔的 gasUsed
// 计算平均值

console.log('平均 Gas 消耗:', 
    gasUsed.reduce((a,b) => a+b, 0) / gasUsed.length
);
```

## ✅ 测试完成后

### 切换到主网

```bash
# 1. 备份测试网配置
firebase functions:config:get > testnet-config-backup.json

# 2. 设置主网环境
firebase functions:config:set bsc.use_testnet="false"
firebase functions:config:set token.contract_address="0xMainnetTokenCA"
firebase functions:config:set wallet.private_key="mainnet_wallet_key"

# 3. 部署到主网
firebase deploy --only functions

# 4. 小额测试（建议先测试 1 积分）
```

### 清理测试数据

```javascript
// 删除测试交易记录
// Firebase 控制台 → Realtime Database → transactions → 删除测试数据
```

## 📝 测试报告模板

```
测试日期: 2024-XX-XX
测试环境: BSC 测试网
测试人员: XXX

=== 功能测试 ===
[ ] 钱包状态查询: 通过/失败
[ ] 代币余额查询: 通过/失败
[ ] 小额转账 (1积分): 通过/失败
[ ] 大额转账 (100积分): 通过/失败
[ ] 游戏完整流程: 通过/失败

=== 边界测试 ===
[ ] 零积分兑换: 通过/失败
[ ] 无效地址: 通过/失败
[ ] 余额不足: 通过/失败

=== 性能测试 ===
平均响应时间: XXX 秒
平均 Gas 费用: XXX BNB
并发处理能力: XX 笔/分钟

=== 发现的问题 ===
1. 
2. 

=== 建议 ===
1. 
2. 

测试结论: 通过/需要修复
```

**祝测试顺利！** 🧪✨

