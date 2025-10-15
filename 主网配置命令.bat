@echo off
chcp 65001 >nul
echo ========================================
echo     BNBXP Firebase 主网配置脚本
echo ========================================
echo.

echo [警告] 这是主网配置，将使用真实资金！
echo.
echo 代币合约地址: 0x83dfb0f9a8059b3dd274b3f4d68da93520fc4444
echo 钱包私钥: 2159c1bc...efd47d (已隐藏)
echo 网络: BSC 主网 (MAINNET)
echo.
echo 请确保：
echo 1. 钱包内有足够的代币余额
echo 2. 钱包内有至少 0.1 BNB 用于 Gas 费
echo 3. 已在测试网充分测试
echo.

set /p CONFIRM="[重要] 确认使用主网配置? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo ========================================
echo       正在配置 Firebase 主网...
echo ========================================
echo.

echo [1/5] 检查 Firebase CLI...
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo 正在安装 Firebase CLI...
    npm install -g firebase-tools
)

echo [2/5] 登录 Firebase...
firebase login

echo [3/5] 设置代币合约地址...
firebase functions:config:set token.contract_address="0x83dfb0f9a8059b3dd274b3f4d68da93520fc4444"

echo [4/5] 设置钱包私钥...
firebase functions:config:set wallet.private_key="2159c1bcc01193026d313f98a11276f7ed2efe12fba8a0484272b922aaefd47d"

echo [5/5] 设置为主网模式...
firebase functions:config:set bsc.use_testnet="false"
firebase functions:config:set bsc.rpc_url="https://bsc-dataseed1.binance.org/"

echo.
echo [✓] 主网配置完成！
echo.

echo ========================================
echo       查看配置
echo ========================================
firebase functions:config:get

echo.
echo ========================================
echo       安装依赖
echo ========================================
cd functions
call npm install
cd ..

echo.
echo ========================================
echo       部署到 Firebase
echo ========================================
echo.
echo [重要提醒] 部署后将在 BSC 主网上运行！
echo.
set /p DEPLOY="确认立即部署到主网? (Y/N): "
if /i "%DEPLOY%"=="Y" (
    firebase deploy --only functions
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo          主网部署成功！ 🎉
        echo ========================================
        echo.
        echo 接下来请：
        echo 1. 运行 node 获取主网钱包地址.js 获取钱包地址
        echo 2. 确认钱包有足够的代币和 BNB
        echo 3. 小额测试（建议先测试 1 积分）
        echo 4. 查看交易: https://bscscan.com
        echo.
    )
) else (
    echo.
    echo 配置已保存，稍后可手动部署：
    echo   firebase deploy --only functions
    echo.
)

pause

