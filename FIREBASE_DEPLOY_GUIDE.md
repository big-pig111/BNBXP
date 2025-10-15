# Firebase Cloud Functions 部署完整指南

## 📋 部署前准备清单

- [ ] 已有 Firebase 项目（项目 ID: `chat-294cc`）
- [ ] 已有 BEP-20 代币合约地址（CA）
- [ ] 已有发款钱包私钥
- [ ] 发款钱包内有足够的代币和 BNB
- [ ] 已安装 Node.js（推荐 v18 或更高）

## 🚀 快速部署步骤

### 步骤 1: 安装 Firebase CLI

```bash
# 全局安装 Firebase CLI
npm install -g firebase-tools

# 验证安装
firebase --version
```

### 步骤 2: 登录 Firebase

```bash
# 登录 Google 账号
firebase login

# 验证登录状态
firebase projects:list
```

### 步骤 3: 初始化 Firebase（如果还未初始化）

```bash
# 在项目根目录执行
firebase init

# 选择：
# - Functions (使用空格键选择)
# - 使用现有项目: chat-294cc
# - 语言: JavaScript
# - ESLint: No（可选）
# - 安装依赖: Yes
```

**如果已经有 `functions/` 目录，跳过此步骤。**

### 步骤 4: 安装依赖

```bash
# 进入 functions 目录
cd functions

# 安装依赖
npm install

# 返回项目根目录
cd ..
```

### 步骤 5: 配置环境变量

**⚠️ 重要：将以下命令中的占位符替换为你的实际值！**

```bash
# 配置代币合约地址（替换为你的 CA）
firebase functions:config:set token.contract_address="0xYourTokenContractAddressHere"

# 配置发款钱包私钥（不要包含 0x 前缀）
firebase functions:config:set wallet.private_key="your_private_key_here_without_0x"

# 配置网络（false=主网，true=测试网）
firebase functions:config:set bsc.use_testnet="false"

# （可选）自定义 RPC 节点
firebase functions:config:set bsc.rpc_url="https://bsc-dataseed1.binance.org/"
```

### 步骤 6: 验证配置

```bash
# 查看所有配置
firebase functions:config:get

# 输出示例：
# {
#   "bsc": {
#     "rpc_url": "https://bsc-dataseed1.binance.org/",
#     "use_testnet": "false"
#   },
#   "token": {
#     "contract_address": "0x..."
#   },
#   "wallet": {
#     "private_key": "..."
#   }
# }
```

### 步骤 7: 更新 `functions/index.js` 读取配置

修改 `functions/index.js` 文件，从 Firebase Config 读取配置：

```javascript
// 在 index.js 顶部，配置区域修改为：

const config = functions.config();

// BSC 配置
const BSC_RPC_URL = config.bsc?.rpc_url || 'https://bsc-dataseed1.binance.org/';
const USE_TESTNET = config.bsc?.use_testnet === 'true' || false;

// 代币配置
const TOKEN_CONTRACT_ADDRESS = config.token?.contract_address || 'YOUR_TOKEN_CA_HERE';
const WALLET_PRIVATE_KEY = config.wallet?.private_key || 'YOUR_PRIVATE_KEY_HERE';
```

### 步骤 8: 部署到 Firebase

```bash
# 仅部署 Cloud Functions
firebase deploy --only functions

# 等待部署完成...
# ✔  Deploy complete!
```

### 步骤 9: 测试部署

#### 方法 1: 在浏览器控制台测试

打开 `snake.html`，在浏览器控制台输入：

```javascript
// 测试查询发款钱包状态
const getStatus = firebase.functions().httpsCallable('getWalletStatus');
getStatus().then(result => {
  console.log('✅ 钱包状态:', result.data);
}).catch(error => {
  console.error('❌ 错误:', error);
});
```

#### 方法 2: 测试代币转账（小心使用）

```javascript
// ⚠️ 警告：这会真实转账代币！
// 先在 Firebase 数据库设置测试账户积分
// users/YOUR_TEST_WALLET/score = 1

const claimToken = firebase.functions().httpsCallable('claimToken');
claimToken({ wallet: 'YOUR_TEST_WALLET_ADDRESS' }).then(result => {
  console.log('✅ 转账成功:', result.data);
  console.log('交易哈希:', result.data.tx);
  console.log('浏览器查看:', result.data.explorerUrl);
}).catch(error => {
  console.error('❌ 转账失败:', error);
});
```

## 🔍 监控与日志

### 查看实时日志

```bash
# 查看所有函数日志
firebase functions:log

# 只查看最近的日志
firebase functions:log --only claimToken

# 实时流式日志
firebase functions:log --only claimToken --lines 50
```

### Firebase 控制台查看

1. 访问: https://console.firebase.google.com/
2. 选择项目: `chat-294cc`
3. 左侧菜单 → Functions
4. 查看函数列表、调用次数、错误等

## 📊 数据库结构

Cloud Functions 会在 Firebase Realtime Database 中创建以下数据：

```
/transactions/
  /{txHash}/
    - wallet: "0x..."
    - score: 100
    - tokenAmount: 1000
    - txHash: "0x..."
    - blockNumber: 12345678
    - timestamp: 1234567890
    - status: "success"
    - network: "BSC_MAINNET"

/failedTransactions/
  /{timestamp}_{wallet}/
    - wallet: "0x..."
    - score: 100
    - tokenAmount: 1000
    - error: "error message"
    - timestamp: 1234567890
```

## 🔧 故障排查

### 问题 1: 部署失败 - "Permission denied"

**解决方法：**
```bash
# 升级 Firebase 计费方案（需要绑定信用卡）
# Cloud Functions 需要 Blaze (按量付费) 方案
# 访问: https://console.firebase.google.com/ → 左下角 "升级"
```

### 问题 2: 函数调用失败 - "CORS error"

**解决方法：**
确保前端 Firebase 配置正确，使用同一个项目。

### 问题 3: 转账失败 - "Insufficient BNB"

**解决方法：**
```bash
# 1. 检查钱包余额
const getStatus = firebase.functions().httpsCallable('getWalletStatus');
getStatus().then(r => console.log(r.data));

# 2. 向发款钱包充值 BNB（建议至少 0.1 BNB）
```

### 问题 4: 转账失败 - "Insufficient token balance"

**解决方法：**
向发款钱包充值代币。

### 问题 5: 环境变量未生效

**解决方法：**
```bash
# 重新设置配置
firebase functions:config:set token.contract_address="0x..."

# 删除旧配置
firebase functions:config:unset somekey

# 重新部署
firebase deploy --only functions
```

## 💰 费用估算

### Firebase Cloud Functions 费用（Blaze 方案）

**免费额度（每月）：**
- 调用次数: 200 万次
- GB-秒: 40 万
- CPU-秒: 20 万
- 出站流量: 5GB

**超出免费额度后：**
- 每百万次调用: $0.40
- 每 GB-秒: $0.0000025
- 每 CPU-秒: $0.00001

**示例计算（每月 10,000 次转账）：**
- 调用费用: ~$0.00（在免费额度内）
- 计算费用: ~$0.02
- **总计: ~$0.02/月**

### BSC Gas 费用

- 每笔转账: 约 0.00025-0.0005 BNB
- 10,000 次转账: 约 2.5-5 BNB
- **按当前 BNB 价格计算**

## 🔄 更新与维护

### 更新代币合约地址

```bash
firebase functions:config:set token.contract_address="0xNewContractAddress"
firebase deploy --only functions
```

### 更换发款钱包

```bash
# 1. 转移旧钱包资产到新钱包
# 2. 更新配置
firebase functions:config:set wallet.private_key="new_private_key"
firebase deploy --only functions
```

### 更新函数代码

```bash
# 1. 修改 functions/index.js
# 2. 重新部署
firebase deploy --only functions

# 或只部署特定函数
firebase deploy --only functions:claimToken
```

## 📚 相关文档

- [Firebase Cloud Functions 文档](https://firebase.google.com/docs/functions)
- [Ethers.js 文档](https://docs.ethers.org/)
- [BSC 文档](https://docs.bnbchain.org/)
- [BscScan API](https://bscscan.com/apis)

## 🆘 获取帮助

如果遇到问题：

1. **查看日志**
   ```bash
   firebase functions:log
   ```

2. **检查 Firebase 控制台**
   - https://console.firebase.google.com/

3. **验证配置**
   ```bash
   firebase functions:config:get
   ```

4. **测试网络连接**
   ```bash
   curl https://bsc-dataseed1.binance.org/
   ```

## ✅ 部署完成检查清单

- [ ] Cloud Functions 部署成功
- [ ] 配置已正确设置
- [ ] 发款钱包余额充足（代币 + BNB）
- [ ] 测试转账成功
- [ ] 日志显示正常
- [ ] 前端可以正常调用函数
- [ ] 交易记录保存到数据库
- [ ] BscScan 可以查看交易

**恭喜！你的 BSC 代币兑换系统已成功部署！** 🎉

