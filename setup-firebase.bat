@echo off
chcp 65001 >nul
echo ========================================
echo     BNBXP Firebase Cloud Functions
echo          配置与部署工具
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js 已安装
node --version

REM 检查 Firebase CLI 是否安装
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [提示] 未检测到 Firebase CLI，正在安装...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo [错误] Firebase CLI 安装失败
        pause
        exit /b 1
    )
)

echo [✓] Firebase CLI 已安装
firebase --version

echo.
echo ========================================
echo          配置环境变量
echo ========================================
echo.
echo 请准备好以下信息：
echo 1. BEP-20 代币合约地址 (CA)
echo 2. 发款钱包私钥 (不要包含 0x 前缀)
echo 3. 是否使用测试网 (true/false)
echo.

set /p TOKEN_CA="请输入代币合约地址 (0x...): "
set /p WALLET_KEY="请输入钱包私钥 (64位十六进制): "
set /p USE_TESTNET="是否使用测试网? (true/false, 默认 false): "

if "%USE_TESTNET%"=="" set USE_TESTNET=false

echo.
echo ========================================
echo          确认配置信息
echo ========================================
echo.
echo 代币合约地址: %TOKEN_CA%
echo 钱包私钥: %WALLET_KEY:~0,8%...%WALLET_KEY:~-8% (已隐藏)
echo 使用测试网: %USE_TESTNET%
echo.
set /p CONFIRM="确认配置正确? (Y/N): "

if /i not "%CONFIRM%"=="Y" (
    echo 已取消配置
    pause
    exit /b 0
)

echo.
echo ========================================
echo       正在配置 Firebase...
echo ========================================
echo.

echo [1/4] 设置代币合约地址...
firebase functions:config:set token.contract_address="%TOKEN_CA%"

echo [2/4] 设置钱包私钥...
firebase functions:config:set wallet.private_key="%WALLET_KEY%"

echo [3/4] 设置网络环境...
firebase functions:config:set bsc.use_testnet="%USE_TESTNET%"

echo [4/4] 设置 RPC 节点...
firebase functions:config:set bsc.rpc_url="https://bsc-dataseed1.binance.org/"

echo.
echo [✓] 配置完成！
echo.

echo ========================================
echo       查看当前配置
echo ========================================
echo.
firebase functions:config:get

echo.
echo ========================================
echo       安装依赖包
echo ========================================
echo.
cd functions
npm install
cd ..

echo.
echo ========================================
echo       准备部署
echo ========================================
echo.
set /p DEPLOY_NOW="是否立即部署到 Firebase? (Y/N): "

if /i "%DEPLOY_NOW%"=="Y" (
    echo.
    echo 正在部署...
    firebase deploy --only functions
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo          部署成功！ 🎉
        echo ========================================
        echo.
        echo 接下来你可以：
        echo 1. 访问 https://console.firebase.google.com 查看函数状态
        echo 2. 在游戏中测试代币兑换功能
        echo 3. 使用 firebase functions:log 查看日志
        echo.
    ) else (
        echo.
        echo [错误] 部署失败，请检查错误信息
        echo.
    )
) else (
    echo.
    echo 配置已保存，稍后可以手动部署：
    echo   firebase deploy --only functions
    echo.
)

echo.
pause

