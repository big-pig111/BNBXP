@echo off
chcp 65001 >nul
echo ========================================
echo     切换到新的 Firebase 项目
echo     项目ID: big-pig-38efe
echo ========================================
echo.

echo [1/2] 检查 Firebase CLI...
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未安装 Firebase CLI
    echo 请先运行: npm install -g firebase-tools
    pause
    exit /b 1
)

echo [✓] Firebase CLI 已安装
echo.

echo [2/2] 设置活动项目为 big-pig-38efe...
firebase use big-pig-38efe

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo          项目切换成功！ ✓
    echo ========================================
    echo.
    echo 当前活动项目: big-pig-38efe
    echo.
    echo 接下来你需要：
    echo 1. 在 Firebase 控制台启用以下服务：
    echo    - Realtime Database
    echo    - Firestore
    echo    - Cloud Functions (需要升级到 Blaze 方案)
    echo.
    echo 2. 配置数据库规则 (参考旧项目)
    echo.
    echo 3. 运行配置脚本配置代币和钱包：
    echo    - 主网配置命令.bat (主网配置)
    echo    - 你的配置命令.bat (测试网配置)
    echo.
) else (
    echo.
    echo [错误] 项目切换失败
    echo.
    echo 可能的原因：
    echo 1. 未登录 Firebase (运行: firebase login)
    echo 2. 没有该项目的访问权限
    echo 3. 项目ID不存在
    echo.
)

pause

