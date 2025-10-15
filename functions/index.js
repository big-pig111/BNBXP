const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ethers } = require('ethers');

// 初始化 Firebase Admin
admin.initializeApp();

// ==================== 配置区域 ====================
// 🔐 重要：从 Firebase Config 读取配置

// 获取 Firebase Config
const config = functions.config();

// BSC 配置
const BSC_RPC_URL = config.bsc?.rpc_url || process.env.BSC_RPC_URL || 'https://bsc-dataseed1.binance.org/';
const BSC_TESTNET_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

// 代币配置
const TOKEN_CONTRACT_ADDRESS = config.token?.contract_address || process.env.TOKEN_CONTRACT_ADDRESS || 'YOUR_TOKEN_CA_HERE';
const WALLET_PRIVATE_KEY = config.wallet?.private_key || process.env.WALLET_PRIVATE_KEY || 'YOUR_PRIVATE_KEY_HERE';

// 是否使用测试网
const USE_TESTNET = (config.bsc?.use_testnet || process.env.USE_TESTNET) === 'true' || false;

// ==================== BEP-20 标准 ABI ====================
// 只包含需要的函数
const BEP20_ABI = [
  // 转账函数
  'function transfer(address to, uint256 amount) returns (bool)',
  // 查询余额
  'function balanceOf(address account) view returns (uint256)',
  // 查询精度
  'function decimals() view returns (uint8)',
  // 查询代币名称
  'function name() view returns (string)',
  // 查询代币符号
  'function symbol() view returns (string)'
];

// ==================== 主要函数：代币领取 ====================
exports.claimToken = functions.region('us-central1').https.onCall(async (data, context) => {
  console.log('=== 开始处理代币领取请求 ===');
  console.log('请求数据:', data);
  
  try {
    // 1. 验证输入参数
    const { wallet } = data;
    
    if (!wallet) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing wallet address'
      );
    }
    
    // 验证钱包地址格式
    if (!ethers.isAddress(wallet)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid BSC wallet address format'
      );
    }
    
    console.log(`接收地址: ${wallet}`);
    
    // 2. 从 Firebase 获取用户积分
    const db = admin.database();
    const userRef = db.ref(`users/${wallet}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();
    
    if (!userData || !userData.score) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'No points available for this wallet'
      );
    }
    
    const score = userData.score;
    console.log(`用户积分: ${score}`);
    
    if (score <= 0) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Insufficient points to claim tokens'
      );
    }
    
    // 3. 计算代币数量（1积分 = 10代币）
    const tokenAmount = score * 10;
    console.log(`需要发放代币数量: ${tokenAmount}`);
    
    // 4. 检查配置
    if (TOKEN_CONTRACT_ADDRESS === 'YOUR_TOKEN_CA_HERE' || 
        WALLET_PRIVATE_KEY === 'YOUR_PRIVATE_KEY_HERE') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Cloud Function not configured. Please set TOKEN_CONTRACT_ADDRESS and WALLET_PRIVATE_KEY'
      );
    }
    
    // 5. 连接 BSC 网络
    const rpcUrl = USE_TESTNET ? BSC_TESTNET_RPC_URL : BSC_RPC_URL;
    console.log(`连接到 BSC 网络: ${USE_TESTNET ? '测试网' : '主网'}`);
    console.log(`RPC URL: ${rpcUrl}`);
    
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // 验证网络连接
    try {
      const network = await provider.getNetwork();
      console.log(`已连接到网络 Chain ID: ${network.chainId}`);
    } catch (error) {
      console.error('网络连接失败:', error);
      throw new functions.https.HttpsError(
        'unavailable',
        'Failed to connect to BSC network'
      );
    }
    
    // 6. 创建钱包实例
    let signer;
    try {
      signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
      console.log(`发送钱包地址: ${signer.address}`);
    } catch (error) {
      console.error('钱包创建失败:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Invalid wallet configuration'
      );
    }
    
    // 7. 创建代币合约实例
    let tokenContract;
    try {
      tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        BEP20_ABI,
        signer
      );
      
      // 获取代币信息
      const tokenName = await tokenContract.name();
      const tokenSymbol = await tokenContract.symbol();
      const tokenDecimals = await tokenContract.decimals();
      
      console.log(`代币信息: ${tokenName} (${tokenSymbol}), Decimals: ${tokenDecimals}`);
      
      // 8. 检查发送钱包余额
      const senderBalance = await tokenContract.balanceOf(signer.address);
      const senderBalanceFormatted = ethers.formatUnits(senderBalance, tokenDecimals);
      console.log(`发送钱包代币余额: ${senderBalanceFormatted} ${tokenSymbol}`);
      
      // 计算需要发送的代币数量（考虑精度）
      const amountToSend = ethers.parseUnits(tokenAmount.toString(), tokenDecimals);
      
      if (senderBalance < amountToSend) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          `Insufficient token balance. Need ${ethers.formatUnits(amountToSend, tokenDecimals)} but only have ${senderBalanceFormatted}`
        );
      }
      
      // 9. 检查 BNB 余额（用于支付 Gas）
      const bnbBalance = await provider.getBalance(signer.address);
      const bnbBalanceFormatted = ethers.formatEther(bnbBalance);
      console.log(`发送钱包 BNB 余额: ${bnbBalanceFormatted} BNB`);
      
      if (bnbBalance < ethers.parseEther('0.001')) {
        throw new functions.https.HttpsError(
          'resource-exhausted',
          'Insufficient BNB for gas fees'
        );
      }
      
      // 10. 执行代币转账
      console.log(`准备转账 ${ethers.formatUnits(amountToSend, tokenDecimals)} ${tokenSymbol} 到 ${wallet}`);
      
      const tx = await tokenContract.transfer(wallet, amountToSend);
      console.log(`交易已发送，交易哈希: ${tx.hash}`);
      console.log(`等待交易确认...`);
      
      // 等待交易确认（1个区块确认）
      const receipt = await tx.wait(1);
      console.log(`交易已确认，区块号: ${receipt.blockNumber}`);
      console.log(`Gas 使用: ${receipt.gasUsed.toString()}`);
      
      // 11. 记录交易到数据库
      const transactionRecord = {
        wallet: wallet,
        score: score,
        tokenAmount: tokenAmount,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        timestamp: Date.now(),
        status: 'success',
        network: USE_TESTNET ? 'BSC_TESTNET' : 'BSC_MAINNET'
      };
      
      await db.ref(`transactions/${tx.hash}`).set(transactionRecord);
      console.log('交易记录已保存到数据库');
      
      // 12. 返回成功结果
      return {
        success: true,
        tx: tx.hash,
        blockNumber: receipt.blockNumber,
        amount: tokenAmount,
        message: `Successfully sent ${tokenAmount} tokens to ${wallet}`,
        explorerUrl: USE_TESTNET 
          ? `https://testnet.bscscan.com/tx/${tx.hash}`
          : `https://bscscan.com/tx/${tx.hash}`
      };
      
    } catch (error) {
      console.error('代币转账失败:', error);
      
      // 记录失败的交易
      await db.ref(`failedTransactions/${Date.now()}_${wallet}`).set({
        wallet: wallet,
        score: score,
        tokenAmount: tokenAmount,
        error: error.message,
        timestamp: Date.now()
      });
      
      throw new functions.https.HttpsError(
        'internal',
        `Token transfer failed: ${error.message}`
      );
    }
    
  } catch (error) {
    console.error('处理请求时发生错误:', error);
    
    // 如果是已知的 HttpsError，直接抛出
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // 其他未知错误
    throw new functions.https.HttpsError(
      'internal',
      `An error occurred: ${error.message}`
    );
  }
});

// ==================== 辅助函数：查询代币余额 ====================
exports.getTokenBalance = functions.region('us-central1').https.onCall(async (data, context) => {
  console.log('=== 查询代币余额 ===');
  
  try {
    const { wallet } = data;
    
    if (!wallet || !ethers.isAddress(wallet)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid wallet address'
      );
    }
    
    // 连接网络
    const rpcUrl = USE_TESTNET ? BSC_TESTNET_RPC_URL : BSC_RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // 创建合约实例（只读）
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      BEP20_ABI,
      provider
    );
    
    // 查询余额
    const balance = await tokenContract.balanceOf(wallet);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    
    const balanceFormatted = ethers.formatUnits(balance, decimals);
    
    return {
      success: true,
      balance: balanceFormatted,
      balanceRaw: balance.toString(),
      symbol: symbol,
      decimals: decimals
    };
    
  } catch (error) {
    console.error('查询余额失败:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to get balance: ${error.message}`
    );
  }
});

// ==================== 辅助函数：获取发送钱包状态 ====================
exports.getWalletStatus = functions.region('us-central1').https.onCall(async (data, context) => {
  console.log('=== 查询发送钱包状态 ===');
  
  try {
    // 简单的管理员验证（可选）
    // if (!context.auth || !context.auth.token.admin) {
    //   throw new functions.https.HttpsError('permission-denied', 'Admin only');
    // }
    
    const rpcUrl = USE_TESTNET ? BSC_TESTNET_RPC_URL : BSC_RPC_URL;
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
    
    // 获取 BNB 余额
    const bnbBalance = await provider.getBalance(signer.address);
    
    // 获取代币余额
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      BEP20_ABI,
      provider
    );
    
    const tokenBalance = await tokenContract.balanceOf(signer.address);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    
    return {
      success: true,
      walletAddress: signer.address,
      bnbBalance: ethers.formatEther(bnbBalance),
      tokenBalance: ethers.formatUnits(tokenBalance, decimals),
      tokenSymbol: symbol,
      network: USE_TESTNET ? 'BSC Testnet' : 'BSC Mainnet',
      contractAddress: TOKEN_CONTRACT_ADDRESS
    };
    
  } catch (error) {
    console.error('查询钱包状态失败:', error);
    throw new functions.https.HttpsError(
      'internal',
      `Failed to get wallet status: ${error.message}`
    );
  }
});

