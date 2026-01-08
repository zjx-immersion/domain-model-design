#!/bin/bash

# GitHub 推送脚本
# 使用方法: ./PUSH_TO_GITHUB.sh <your-github-username>

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "╔════════════════════════════════════════════════════════╗"
echo "║                                                        ║"
echo "║     🚀 推送到 GitHub                                   ║"
echo "║                                                        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# 检查参数
if [ -z "$1" ]; then
    print_error "请提供您的 GitHub 用户名"
    echo ""
    echo "使用方法:"
    echo "  ./PUSH_TO_GITHUB.sh <your-github-username>"
    echo ""
    echo "示例:"
    echo "  ./PUSH_TO_GITHUB.sh jxzhong"
    echo ""
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="domain-model-design"
REMOTE_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

print_info "GitHub 用户名: $GITHUB_USERNAME"
print_info "仓库名称: $REPO_NAME"
print_info "远程地址: $REMOTE_URL"
echo ""

# 检查是否已配置远程仓库
if git remote | grep -q "^origin$"; then
    print_info "检测到已存在 origin 远程仓库"
    CURRENT_URL=$(git remote get-url origin)
    echo "  当前地址: $CURRENT_URL"
    
    if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
        read -p "是否更新为新地址? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git remote set-url origin "$REMOTE_URL"
            print_success "远程仓库地址已更新"
        fi
    fi
else
    print_info "添加远程仓库..."
    git remote add origin "$REMOTE_URL"
    print_success "远程仓库已添加"
fi

echo ""
print_info "准备推送到 GitHub..."
echo ""
echo "⚠️  请确保您已在 GitHub 上创建了仓库: $REPO_NAME"
echo "   如果还没创建，请访问: https://github.com/new"
echo ""
read -p "按 Enter 继续推送，或 Ctrl+C 取消..."

print_info "推送中..."
git push -u origin main

echo ""
print_success "✅ 推送完成！"
echo ""
echo "🌐 访问您的仓库:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""

