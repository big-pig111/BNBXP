@echo off
chcp 65001 >nul
echo ========================================
echo     BNBXP Firebase 配置脚本
echo     （已预填你的配置信息）
echo ========================================
echo.

echo 代币合约地址: 0x83dfb0f9a8059b3dd274b3f4d68da93520fc4444
echo 钱包私钥: 2159c1bc...efd47d (已隐藏)
echo 网络: BSC 测试网
echo.

set /p CONFIRM="确认使用以上配置? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

echo.
echo ========================================
echo       正在配置 Firebase...
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

echo [5/5] 设置为测试网模式...
firebase functions:config:set bsc.use_testnet="true"
firebase functions:config:set bsc.rpc_url="https://data-seed-prebsc-1-s1.binance.org:8545/"

echo.
echo [✓] 配置完成！
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
set /p DEPLOY="是否立即部署? (Y/N): "
if /i "%DEPLOY%"=="Y" (
    firebase deploy --only functions
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo          部署成功！ 🎉
        echo ========================================
        echo.
        echo 接下来请：
        echo 1. 获取测试网 BNB: https://testnet.binance.org/faucet-smart
        echo 2. 钱包地址可通过测试获取
        echo 3. 参考 TESTING_GUIDE.md 进行测试
        echo.
    )
)

pause

