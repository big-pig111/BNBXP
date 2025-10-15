# Cloud Functions 配置说明

## 环境变量配置

### 方法一：Firebase 控制台配置（推荐用于生产环境）

```bash
# 1. 安装 Firebase CLI
npm install -g firebase-tools

# 2. 登录 Firebase
firebase login

# 3. 设置环境变量
firebase functions:config:set \
  bsc.rpc_url="https://bsc-dataseed1.binance.org/" \
  bsc.use_testnet="false" \
  token.contract_address="0xYourTokenContractAddressHere" \
  wallet.private_key="your_private_key_here_without_0x_prefix"

# 4. 查看配置
firebase functions:config:get

# 5. 部署
firebase deploy --only functions
```

### 方法二：.env 文件配置（仅用于本地测试）

在 `functions/` 目录下创建 `.env` 文件：

```env
BSC_RPC_URL=https://bsc-dataseed1.binance.org/
USE_TESTNET=false
TOKEN_CONTRACT_ADDRESS=0xYourTokenContractAddressHere
WALLET_PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

⚠️ **重要：** `.env` 文件包含敏感信息，不要提交到 Git！

## 配置项说明

### BSC_RPC_URL
- **说明**: BSC 网络的 RPC 节点地址
- **主网默认**: `https://bsc-dataseed1.binance.org/`
- **测试网**: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- **备用节点**:
  - `https://bsc-dataseed2.binance.org/`
  - `https://bsc-dataseed3.binance.org/`
  - `https://bsc-dataseed4.binance.org/`

### USE_TESTNET
- **说明**: 是否使用测试网
- **值**: `true` (测试网) 或 `false` (主网)
- **建议**: 先在测试网测试，确认无误后再部署主网

### TOKEN_CONTRACT_ADDRESS
- **说明**: BEP-20 代币合约地址
- **格式**: `0x` 开头的 40 位十六进制地址
- **示例**: `0x1234567890123456789012345678901234567890`
- **获取方式**: 
  - 从 BscScan 复制代币合约地址
  - 或从代币部署记录中获取

### WALLET_PRIVATE_KEY
- **说明**: 发款钱包的私钥
- **格式**: 64 位十六进制字符串（**不要**包含 `0x` 前缀）
- **示例**: `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`
- **安全提示**:
  - ⚠️ 私钥泄露将导致钱包内所有资产丢失！
  - 不要分享私钥给任何人
  - 不要提交到 Git 仓库
  - 建议使用专门的发款钱包，只存放必要的代币

## 钱包准备

### 发款钱包需要：

1. **足够的代币余额**
   - 用于发放给用户
   - 建议保持充足的余额

2. **足够的 BNB**
   - 用于支付 Gas 费
   - 每笔转账约需要 0.0001-0.0005 BNB
   - 建议至少保持 0.1 BNB

### 检查钱包余额

部署后可以调用 `getWalletStatus` 函数检查钱包状态：

```javascript
// 在浏览器控制台或前端代码中
const getStatus = firebase.functions().httpsCallable('getWalletStatus');
getStatus().then(result => {
  console.log('钱包地址:', result.data.walletAddress);
  console.log('BNB 余额:', result.data.bnbBalance);
  console.log('代币余额:', result.data.tokenBalance);
  console.log('代币符号:', result.data.tokenSymbol);
});
```

## 测试网测试步骤

1. **获取测试网 BNB**
   - 访问: https://testnet.binance.org/faucet-smart
   - 输入钱包地址领取测试 BNB

2. **部署测试代币（如果还没有）**
   - 或使用现有的测试网代币

3. **配置测试网环境**
   ```bash
   firebase functions:config:set bsc.use_testnet="true"
   ```

4. **部署并测试**
   ```bash
   firebase deploy --only functions
   ```

5. **在测试网验证交易**
   - 访问: https://testnet.bscscan.com/

## 常见问题

### Q: 如何获取钱包私钥？
**A**: 
- **MetaMask**: 账户详情 → 导出私钥
- **Trust Wallet**: 设置 → 显示恢复短语 → 导入到 MetaMask 导出私钥
- ⚠️ 导出私钥时确保周围无人，且设备安全

### Q: Gas 费用是多少？
**A**: 
- 每笔 BEP-20 转账约 50,000-100,000 Gas
- 当前 Gas Price 约 5 Gwei
- 每笔约 0.00025-0.0005 BNB（约 $0.1-0.2）

### Q: 如何更换代币合约？
**A**:
```bash
firebase functions:config:set token.contract_address="新的合约地址"
firebase deploy --only functions
```

### Q: 私钥泄露了怎么办？
**A**:
1. 立即将钱包内所有资产转移到新钱包
2. 更新 Cloud Functions 配置为新钱包私钥
3. 废弃旧钱包

## 安全建议

1. **使用专用发款钱包**
   - 不要用个人主钱包
   - 只存放必要的代币和 BNB

2. **定期检查余额**
   - 设置告警机制
   - 余额过低时及时充值

3. **监控交易记录**
   - 定期检查 Firebase 中的交易记录
   - 异常交易及时调查

4. **限制权限**
   - 考虑添加管理员验证
   - 限制单笔最大转账金额
   - 添加每日转账限额

5. **备份配置**
   - 保存配置信息的加密备份
   - 多人团队时使用密钥管理工具

