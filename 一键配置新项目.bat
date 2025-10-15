@echo off
chcp 65001 >nul
color 0A
echo.
echo ========================================
echo      BNBXP 新项目一键配置脚本
echo      项目ID: big-pig-38efe
echo ========================================
echo.
echo 本脚本将自动完成以下操作：
echo.
echo [1] 检查并安装 Firebase CLI
echo [2] 登录 Firebase
echo [3] 切换到新项目 big-pig-38efe
echo [4] 配置 Cloud Functions 环境变量 (主网)
echo [5] 安装依赖
echo [6] 部署 Cloud Functions
echo.
echo ⚠️  注意：
echo - 需要有 big-pig-38efe 项目的访问权限
echo - 项目需要已启用 Firestore、Realtime Database
echo - 需要升级到 Blaze 方案才能部署 Functions
echo - 将使用主网配置 (真实资金!)
echo.
set /p CONTINUE="是否继续? (Y/N): "
if /i not "%CONTINUE%"=="Y" (
    echo.
    echo 已取消
    pause
    exit /b 0
)

echo.
echo ========================================
echo [1/6] 检查 Firebase CLI...
echo ========================================
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Firebase CLI 未安装，正在安装...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo.
        echo [错误] Firebase CLI 安装失败
        echo 请手动运行: npm install -g firebase-tools
        pause
        exit /b 1
    )
)
echo [✓] Firebase CLI 已安装
firebase --version
echo.

echo ========================================
echo [2/6] 登录 Firebase...
echo ========================================
firebase login --reauth
if %errorlevel% neq 0 (
    echo.
    echo [错误] Firebase 登录失败
    pause
    exit /b 1
)
echo [✓] 登录成功
echo.

echo ========================================
echo [3/6] 切换到新项目...
echo ========================================
firebase use big-pig-38efe
if %errorlevel% neq 0 (
    echo.
    echo [错误] 项目切换失败
    echo.
    echo 可能的原因：
    echo 1. 没有该项目的访问权限
    echo 2. 项目ID不存在
    echo.
    echo 请先在 Firebase 控制台确认项目访问权限：
    echo https://console.firebase.google.com/project/big-pig-38efe
    pause
    exit /b 1
)
echo [✓] 项目切换成功
echo.

echo ========================================
echo [4/6] 配置 Cloud Functions 环境变量...
echo ========================================
echo.
echo 将配置以下信息：
echo - 代币合约: 0x83dfb0f9a8059b3dd274b3f4d68da93520fc4444
echo - 网络: BSC 主网
echo - 钱包私钥: 已加密
echo.

echo [4.1] 设置代币合约地址...
firebase functions:config:set token.contract_address="0x83dfb0f9a8059b3dd274b3f4d68da93520fc4444"

echo [4.2] 设置钱包私钥...
firebase functions:config:set wallet.private_key="2159c1bcc01193026d313f98a11276f7ed2efe12fba8a0484272b922aaefd47d"

echo [4.3] 设置为主网模式...
firebase functions:config:set bsc.use_testnet="false"

echo [4.4] 设置 RPC 节点...
firebase functions:config:set bsc.rpc_url="https://bsc-dataseed1.binance.org/"

echo.
echo [✓] 环境变量配置完成
echo.

echo ========================================
echo       验证配置
echo ========================================
firebase functions:config:get
echo.

echo ========================================
echo [5/6] 安装依赖...
echo ========================================
cd functions
if not exist package.json (
    echo [错误] functions/package.json 不存在
    echo 请确保 functions 目录结构完整
    cd ..
    pause
    exit /b 1
)
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [错误] 依赖安装失败
    cd ..
    pause
    exit /b 1
)
cd ..
echo [✓] 依赖安装完成
echo.

echo ========================================
echo [6/6] 部署到 Firebase...
echo ========================================
echo.
echo ⚠️  重要提醒：
echo - 部署后将在 BSC 主网上运行
echo - 确保钱包有足够的 BNB (Gas) 和代币
echo - 首次部署需要升级到 Blaze 方案
echo.
set /p DEPLOY="确认立即部署? (Y/N): "
if /i not "%DEPLOY%"=="Y" (
    echo.
    echo 配置已保存，但未部署
    echo 稍后可手动部署: firebase deploy --only functions
    pause
    exit /b 0
)

firebase deploy --only functions

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo          🎉 部署成功！ 🎉
    echo ========================================
    echo.
    echo 接下来请：
    echo.
    echo 1. 获取钱包地址：
    echo    node 获取主网钱包地址.js
    echo.
    echo 2. 充值钱包：
    echo    - 至少 0.1 BNB (Gas 费)
    echo    - 足够的代币 (奖励发放)
    echo.
    echo 3. 验证余额：
    echo    https://bscscan.com
    echo.
    echo 4. 测试功能：
    echo    - 打开 index.html
    echo    - 测试聊天室
    echo    - 测试游戏
    echo    - 测试代币兑换
    echo.
    echo 5. 查看 Functions 日志：
    echo    firebase functions:log
    echo.
    echo 6. 查看 Functions 控制台：
    echo    https://console.firebase.google.com/project/big-pig-38efe/functions
    echo.
) else (
    echo.
    echo ========================================
    echo          ❌ 部署失败
    echo ========================================
    echo.
    echo 常见错误及解决方案：
    echo.
    echo 1. 403 错误 - 计费问题
    echo    → 需要升级到 Blaze 方案
    echo    → 访问: https://console.firebase.google.com/project/big-pig-38efe/overview
    echo    → 点击左下角 "升级" 按钮
    echo.
    echo 2. 权限错误
    echo    → 确保有项目的 Owner 或 Editor 权限
    echo.
    echo 3. API 未启用
    echo    → 访问: https://console.cloud.google.com/apis/library?project=big-pig-38efe
    echo    → 启用 Cloud Functions API 和 Cloud Build API
    echo.
    echo 4. 其他错误
    echo    → 查看上方的错误信息
    echo    → 运行: firebase functions:log
    echo.
)

echo.
echo ========================================
echo       配置流程结束
echo ========================================
echo.
echo 详细文档：
echo - 新项目配置指南.md
echo - FIREBASE_DEPLOY_GUIDE.md
echo - TESTING_GUIDE.md
echo.
pause

