#!/bin/bash

# Auto DevOps平台 - MVP完成度验证脚本
# 用途: 验证所有MVP Features的PRD和用户故事是否完整

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Auto DevOps Platform${NC}"
echo -e "${BLUE}MVP完成度验证${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# MVP Features列表
declare -a MVP_FEATURES=(
    "3-project-management:F029:PI Planning管理"
    "3-project-management:F030:项目生命周期管理"
    "1-asset-management:F002:领域产品管理"
    "1-asset-management:F003:领域特性管理"
    "1-asset-management:F004:软件模块管理"
    "1-asset-management:F005:资产库管理"
    "2-requirement-management:F008:特性需求管理"
    "2-requirement-management:F009:模块需求管理"
    "2-requirement-management:F010:需求追溯管理"
    "4-rd-collaboration:F012:任务管理"
    "4-rd-collaboration:F014:协同看板"
    "4-rd-collaboration:F015:通知消息"
    "5-devops:F017:配置管理"
    "5-devops:F018:构建管理"
    "7-platform-support:F026:用户权限管理"
    "7-platform-support:F027:角色工作台"
    "7-platform-support:F028:系统配置"
)

# 统计变量
TOTAL_FEATURES=0
PRD_COMPLETE=0
STORIES_COMPLETE=0
PRD_SIZE_TOTAL=0

echo -e "${BLUE}检查MVP Features完成度...${NC}"
echo ""

for feature in "${MVP_FEATURES[@]}"; do
    IFS=':' read -r domain id name <<< "$feature"
    
    feature_dir="features/$domain/$id-$name"
    ((TOTAL_FEATURES++))
    
    # 检查PRD
    if [ -f "$feature_dir/PRD.md" ]; then
        prd_size=$(wc -c < "$feature_dir/PRD.md")
        PRD_SIZE_TOTAL=$((PRD_SIZE_TOTAL + prd_size))
        
        if [ $prd_size -gt 5000 ]; then
            ((PRD_COMPLETE++))
            echo -e "${GREEN}✅ $id - $name: PRD完成 ($(($prd_size / 1024))KB)${NC}"
        else
            echo -e "${RED}❌ $id - $name: PRD过小 ($(($prd_size / 1024))KB)${NC}"
        fi
    else
        echo -e "${RED}❌ $id - $name: PRD缺失${NC}"
    fi
    
    # 检查用户故事
    if [ -f "$feature_dir/USER_STORIES.md" ]; then
        stories_size=$(wc -c < "$feature_dir/USER_STORIES.md")
        
        if [ $stories_size -gt 2000 ]; then
            ((STORIES_COMPLETE++))
        fi
    fi
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}验证结果${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "总Features: $TOTAL_FEATURES"
echo -e "PRD完成: $PRD_COMPLETE / $TOTAL_FEATURES"
echo -e "用户故事完成: $STORIES_COMPLETE / $TOTAL_FEATURES"
echo -e "PRD总大小: $((PRD_SIZE_TOTAL / 1024))KB"
echo -e "平均PRD大小: $((PRD_SIZE_TOTAL / TOTAL_FEATURES / 1024))KB"
echo ""

if [ $PRD_COMPLETE -eq $TOTAL_FEATURES ] && [ $STORIES_COMPLETE -eq $TOTAL_FEATURES ]; then
    echo -e "${GREEN}🎉 恭喜！所有MVP Features PRD和用户故事已完成！${NC}"
    echo -e "${GREEN}✅ MVP准备就绪，可以进入开发阶段！${NC}"
    exit 0
else
    echo -e "${RED}⚠️  还有未完成的Features${NC}"
    exit 1
fi

