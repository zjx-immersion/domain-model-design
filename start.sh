#!/bin/bash

# 领域模型设计平台 - 一键启动脚本
# Domain Model Design Platform - Quick Start Script

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印欢迎信息
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║     🚀 领域模型设计平台 - 一键启动脚本                 ║"
echo "║     Domain Model Design Platform                       ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 检查 Node.js 是否安装
print_info "检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装！"
    echo "请访问 https://nodejs.org/ 下载安装 Node.js (>= 16.0)"
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js 已安装: $NODE_VERSION"

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    print_error "npm 未安装！"
    exit 1
fi

NPM_VERSION=$(npm -v)
print_success "npm 已安装: $NPM_VERSION"

# 进入前端目录
print_info "进入前端目录..."
cd frontend

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    print_warning "检测到未安装依赖，开始安装..."
    npm install
    print_success "依赖安装完成！"
else
    print_info "依赖已安装，跳过安装步骤"
fi

# 检查端口 9080 是否被占用
print_info "检查端口 9080 是否可用..."
if lsof -Pi :9080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    print_warning "端口 9080 已被占用"
    print_info "尝试终止占用该端口的进程..."
    lsof -ti:9080 | xargs kill -9 2>/dev/null || true
    sleep 2
    print_success "端口已释放"
fi

# 启动开发服务器
echo ""
print_success "✅ 环境检查完成，准备启动服务器..."
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║  🌐 服务器地址: http://localhost:9080                  ║"
echo "║  👤 默认账号: admin / admin123                         ║"
echo "║                                                        ║"
echo "║  按 Ctrl+C 停止服务器                                  ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 启动开发服务器
print_info "启动开发服务器..."
npm run dev

