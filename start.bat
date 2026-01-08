@echo off
chcp 65001 >nul
REM 领域模型设计平台 - Windows 一键启动脚本
REM Domain Model Design Platform - Quick Start Script for Windows

setlocal EnableDelayedExpansion

echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║     🚀 领域模型设计平台 - 一键启动脚本                 ║
echo ║     Domain Model Design Platform                       ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM 检查 Node.js 是否安装
echo [INFO] 检查 Node.js 环境...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js 未安装！
    echo 请访问 https://nodejs.org/ 下载安装 Node.js ^(^>= 16.0^)
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js 已安装: %NODE_VERSION%

REM 检查 npm 是否安装
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm 未安装！
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [SUCCESS] npm 已安装: %NPM_VERSION%

REM 进入前端目录
echo [INFO] 进入前端目录...
cd frontend

REM 检查 node_modules 是否存在
if not exist "node_modules\" (
    echo [WARNING] 检测到未安装依赖，开始安装...
    call npm install
    echo [SUCCESS] 依赖安装完成！
) else (
    echo [INFO] 依赖已安装，跳过安装步骤
)

REM 检查端口 9080 是否被占用
echo [INFO] 检查端口 9080 是否可用...
netstat -ano | findstr ":9080" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] 端口 9080 已被占用
    echo [INFO] 请手动关闭占用该端口的程序，或修改 vite.config.ts 中的端口配置
)

REM 启动开发服务器
echo.
echo [SUCCESS] ✅ 环境检查完成，准备启动服务器...
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║  🌐 服务器地址: http://localhost:9080                  ║
echo ║  👤 默认账号: admin / admin123                         ║
echo ║                                                        ║
echo ║  按 Ctrl+C 停止服务器                                  ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo [INFO] 启动开发服务器...
npm run dev

pause

