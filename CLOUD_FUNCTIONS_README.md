# BNBXP Cloud Functions - BSC 代币兑换系统

## 📖 项目概述

这是 BNBXP 贪吃蛇游戏的后端代币兑换系统，基于 Firebase Cloud Functions 和 BSC (BNB Smart Chain) 区块链。

### 主要功能

- ✅ 游戏积分兑换为 BEP-20 代币
- ✅ 自动转账到用户钱包
- ✅ 90% 发给用户，10% 销毁到黑洞
- ✅ 交易记录存储
- ✅ 钱包状态查询
- ✅ 代币余额查询

### 技术栈

- **后端**: Firebase Cloud Functions (Node.js 18)
- **区块链**: BSC (BNB Smart Chain)
- **库**: ethers.js v6, firebase-admin
- **数据库**: Firebase Realtime Database

## 🚀 快速开始

### 方法一: 使用自动化脚本（推荐）

```batch
# Windows 用户
setup-firebase.bat
```

按照提示输入：
1. 代币合约地址 (CA)
2. 钱包私钥
3. 网络选择 (测试网/主网)

脚本会自动完成配置和部署。

### 方法二: 手动部署

详细步骤请查看: [FIREBASE_DEPLOY_GUIDE.md](FIREBASE_DEPLOY_GUIDE.md)

```bash
# 1. 安装 Firebase CLI
npm install -g firebase-tools

# 2. 登录
firebase login

# 3. 配置环境变量
firebase functions:config:set \
  token.contract_address="0xYourTokenCA" \
  wallet.private_key="your_private_key" \
  bsc.use_testnet="false"

# 4. 安装依赖
cd functions
npm install
cd ..

# 5. 部署
firebase deploy --only functions
```

## 📁 项目结构

```
bonkXP-main/
├── functions/                    # Cloud Functions 代码
│   ├── index.js                 # 主要函数实现
│   ├── package.json             # 依赖配置
│   ├── .gitignore              # Git 忽略文件
│   └── CONFIG.md               # 配置说明
│
├── firebase.json                # Firebase 项目配置
├── setup-firebase.bat          # 自动化部署脚本 (Windows)
│
├── FIREBASE_DEPLOY_GUIDE.md   # 部署完整指南
├── TESTING_GUIDE.md           # 测试指南
└── CLOUD_FUNCTIONS_README.md  # 本文件
```

## 🔧 配置说明

### 必需环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `token.contract_address` | BEP-20 代币合约地址 | `0x1234...5678` |
| `wallet.private_key` | 发款钱包私钥（不含0x） | `abcd...ef01` |
| `bsc.use_testnet` | 是否使用测试网 | `false` |
| `bsc.rpc_url` | BSC RPC 节点 | `https://bsc-dataseed1.binance.org/` |

详细配置说明: [functions/CONFIG.md](functions/CONFIG.md)

## 📡 Cloud Functions API

### 1. `claimToken`

**功能**: 将用户游戏积分兑换为代币并转账

**调用方式**:
```javascript
const claimToken = firebase.functions().httpsCallable('claimToken');
claimToken({ wallet: '0xUserWalletAddress' })
  .then(result => console.log(result.data))
  .catch(error => console.error(error));
```

**参数**:
```typescript
{
  wallet: string  // 用户 BSC 钱包地址 (0x...)
}
```

**返回值**:
```typescript
{
  success: boolean
  tx: string              // 交易哈希
  blockNumber: number     // 区块号
  amount: number          // 代币数量
  message: string         // 消息
  explorerUrl: string     // BSCScan 链接
}
```

**流程**:
1. 验证钱包地址格式
2. 从 Firebase 查询用户积分
3. 计算代币数量 (1积分 = 10代币)
4. 检查发款钱包余额
5. 执行转账到用户 (90%)
6. 执行转账到黑洞 (10%)
7. 记录交易到数据库
8. 清零用户积分

### 2. `getTokenBalance`

**功能**: 查询指定地址的代币余额

**调用方式**:
```javascript
const getBalance = firebase.functions().httpsCallable('getTokenBalance');
getBalance({ wallet: '0x...' })
  .then(result => console.log(result.data));
```

**返回值**:
```typescript
{
  success: boolean
  balance: string         // 格式化余额
  balanceRaw: string      // 原始余额
  symbol: string          // 代币符号
  decimals: number        // 精度
}
```

### 3. `getWalletStatus`

**功能**: 查询发款钱包状态（管理员用）

**调用方式**:
```javascript
const getStatus = firebase.functions().httpsCallable('getWalletStatus');
getStatus().then(result => console.log(result.data));
```

**返回值**:
```typescript
{
  success: boolean
  walletAddress: string    // 钱包地址
  bnbBalance: string       // BNB 余额
  tokenBalance: string     // 代币余额
  tokenSymbol: string      // 代币符号
  network: string          // 网络名称
  contractAddress: string  // 合约地址
}
```

## 💾 数据库结构

### `/users/{wallet}/`
```json
{
  "score": 100,
  "timestamp": 1234567890,
  "lastUpdated": 1234567890
}
```

### `/transactions/{txHash}/`
```json
{
  "wallet": "0x...",
  "score": 100,
  "tokenAmount": 1000,
  "txHash": "0x...",
  "blockNumber": 12345678,
  "timestamp": 1234567890,
  "status": "success",
  "network": "BSC_MAINNET"
}
```

### `/failedTransactions/{timestamp}_{wallet}/`
```json
{
  "wallet": "0x...",
  "score": 100,
  "tokenAmount": 1000,
  "error": "error message",
  "timestamp": 1234567890
}
```

### `/burnRecords/{timestamp}_{wallet}/`
```json
{
  "userWallet": "0x...",
  "burnAmount": 100,
  "burnScore": 10,
  "timestamp": 1234567890,
  "method": "RECORD_BURN",
  "reason": "CLOUD_FUNCTION_FAILED"
}
```

## 🧪 测试

详细测试指南: [TESTING_GUIDE.md](TESTING_GUIDE.md)

### 快速测试

```javascript
// 1. 查询钱包状态
const getStatus = firebase.functions().httpsCallable('getWalletStatus');
getStatus().then(console.log);

// 2. 查询代币余额
const getBalance = firebase.functions().httpsCallable('getTokenBalance');
getBalance({ wallet: '0x...' }).then(console.log);

// 3. 测试转账（需要先设置积分）
const claimToken = firebase.functions().httpsCallable('claimToken');
claimToken({ wallet: '0x...' }).then(console.log);
```

## 📊 监控与日志

### 查看实时日志

```bash
# 所有函数日志
firebase functions:log

# 特定函数日志
firebase functions:log --only claimToken

# 实时流式日志
firebase functions:log --only claimToken --lines 50
```

### Firebase 控制台

访问: https://console.firebase.google.com/

- **Functions**: 查看函数列表、调用次数、错误率
- **Realtime Database**: 查看交易记录
- **Logs**: 查看详细日志

### BSCScan 监控

- **测试网**: https://testnet.bscscan.com/
- **主网**: https://bscscan.com/

查看发款钱包的所有交易记录。

## 💰 费用说明

### Firebase Cloud Functions

**免费额度（每月）:**
- 调用次数: 200万次
- GB-秒: 40万
- CPU-秒: 20万

**预估费用（10,000次转账/月）:**
- ~$0.02/月（在免费额度内）

### BSC Gas 费用

**每笔转账:**
- Gas 消耗: ~50,000-100,000 Gas
- Gas Price: ~5 Gwei
- 费用: ~0.00025-0.0005 BNB

**10,000次转账:**
- 约 2.5-5 BNB
- 按当前价格约 $750-$1500

## 🔒 安全建议

1. **私钥管理**
   - ⚠️ 永远不要将私钥提交到 Git
   - 使用 Firebase 配置或环境变量
   - 定期轮换密钥

2. **钱包隔离**
   - 使用专门的发款钱包
   - 不要用个人主钱包
   - 只存放必要的资金

3. **余额监控**
   - 定期检查钱包余额
   - 设置低余额告警
   - 及时充值

4. **访问控制**
   - 考虑添加管理员验证
   - 限制单笔最大金额
   - 添加每日转账上限

5. **审计日志**
   - 保留所有交易记录
   - 定期审查异常交易
   - 备份重要数据

## 🐛 故障排查

### 常见问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Permission denied | 未升级 Firebase 计费方案 | 升级到 Blaze 方案 |
| CORS error | 前端配置错误 | 检查 Firebase 初始化 |
| Insufficient BNB | Gas 费不足 | 充值 BNB 到发款钱包 |
| Insufficient tokens | 代币余额不足 | 充值代币到发款钱包 |
| Network error | RPC 节点问题 | 更换 RPC 节点 |

详细故障排查: [FIREBASE_DEPLOY_GUIDE.md#故障排查](FIREBASE_DEPLOY_GUIDE.md#故障排查)

## 📚 相关文档

- [Firebase Cloud Functions 文档](https://firebase.google.com/docs/functions)
- [Ethers.js 文档](https://docs.ethers.org/)
- [BSC 开发文档](https://docs.bnbchain.org/)
- [BEP-20 代币标准](https://github.com/bnb-chain/BEPs/blob/master/BEP20.md)

## 🔄 更新日志

### v1.0.0 (2024-01-XX)
- ✅ 初始版本
- ✅ 支持 BSC 主网和测试网
- ✅ 实现积分兑换功能
- ✅ 90/10 分配机制
- ✅ 交易记录存储
- ✅ 钱包状态查询

## 📞 支持与反馈

如有问题或建议，请：

1. 检查文档: [FIREBASE_DEPLOY_GUIDE.md](FIREBASE_DEPLOY_GUIDE.md)
2. 查看测试指南: [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. 查看日志: `firebase functions:log`
4. 检查 Firebase 控制台

## 📄 许可证

本项目为 BNBXP 项目的一部分。

---

**准备好了吗？现在就开始部署吧！** 🚀

```batch
setup-firebase.bat
```

