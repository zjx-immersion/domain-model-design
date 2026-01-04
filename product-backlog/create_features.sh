#!/bin/bash

# Auto DevOps平台 - Feature文档批量创建脚本
# 用途: 为所有features创建标准化的目录结构和模板文档
# 使用: bash create_features.sh

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Auto DevOps Platform${NC}"
echo -e "${BLUE}Feature文档批量创建脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 基础目录
BASE_DIR="features"

# 定义所有features
# 格式: "功能域目录:Feature ID:Feature名称:优先级:Story Points"

declare -a FEATURES=(
    # 1. 资产管理域
    "1-asset-management:F001:产品线管理:V1.0:21"
    "1-asset-management:F002:领域产品管理:MVP:21"
    "1-asset-management:F003:领域特性管理:MVP:21"
    "1-asset-management:F004:软件模块管理:MVP:21"
    "1-asset-management:F005:资产库管理:MVP:13"
    "1-asset-management:F006:资产复用分析:V2.0:13"
    
    # 2. 需求管理域
    "2-requirement-management:F007:用户需求管理:MVP:24"
    "2-requirement-management:F008:特性需求管理:MVP:21"
    "2-requirement-management:F009:模块需求管理:MVP:18"
    "2-requirement-management:F010:需求追溯管理:MVP:13"
    "2-requirement-management:F011:需求变更管理:V1.0:13"
    
    # 3. 项目管理域 (已创建，跳过)
    # "3-project-management:F029:PI Planning管理:MVP:55"
    # "3-project-management:F030:项目生命周期管理:MVP:55"
    "3-project-management:F031:项目协同管理:V1.0:34"
    
    # 4. 研发协同域
    "4-rd-collaboration:F012:任务管理:MVP:21"
    "4-rd-collaboration:F013:评审管理:V1.0:18"
    "4-rd-collaboration:F014:协同看板:MVP:13"
    "4-rd-collaboration:F015:通知消息:MVP:13"
    "4-rd-collaboration:F016:知识库:V2.0:21"
    
    # 5. DevOps域
    "5-devops:F017:配置管理:MVP:13"
    "5-devops:F018:构建管理:MVP:18"
    "5-devops:F019:测试管理:V1.0:21"
    "5-devops:F020:发布管理:V1.0:18"
    "5-devops:F021:监控运维:V2.0:21"
    
    # 6. 数据分析域
    "6-data-analytics:F022:效能分析:V1.0:13"
    "6-data-analytics:F023:质量分析:V1.0:13"
    "6-data-analytics:F024:复用分析:V1.0:13"
    "6-data-analytics:F025:成本分析:V2.0:13"
    "6-data-analytics:F032:趋势预测:V2.0:13"
    
    # 7. 平台支撑域
    "7-platform-support:F026:用户权限管理:MVP:13"
    "7-platform-support:F027:角色工作台:MVP:21"
    "7-platform-support:F028:系统配置:MVP:8"
    "7-platform-support:F033:审计日志:V2.0:8"
)

# 创建feature目录和模板文档
create_feature() {
    local domain=$1
    local feature_id=$2
    local feature_name=$3
    local priority=$4
    local sp=$5
    
    local feature_dir="$BASE_DIR/$domain/$feature_id-$feature_name"
    
    # 如果目录已存在，跳过
    if [ -d "$feature_dir" ]; then
        echo -e "${GREEN}跳过: $feature_id-$feature_name (已存在)${NC}"
        return
    fi
    
    # 创建目录
    mkdir -p "$feature_dir"
    echo -e "${GREEN}创建: $feature_id-$feature_name${NC}"
    
    # 创建README.md
    cat > "$feature_dir/README.md" <<EOF
# $feature_id - $feature_name

> **Feature ID**: $feature_id  
> **Feature Name**: $feature_name  
> **优先级**: $priority  
> **Story Points**: $sp SP  
> **预估工作量**: $(($sp * 2 / 5))人天  
> **负责团队**: 待定

---

## 📋 Feature概述

### 背景

> TODO: 描述功能背景、为什么需要这个功能

### 目标

> TODO: 列出3-5个核心目标，使用 ✅ 标记

1. ✅ 目标1
2. ✅ 目标2
3. ✅ 目标3

### 用户价值

**角色1**:
- 价值点1
- 价值点2

**角色2**:
- 价值点1
- 价值点2

---

## 🎯 核心功能

### 1. 功能模块1

**功能描述**: 简要描述

**子功能**:
- 1.1 子功能1
- 1.2 子功能2
- 1.3 子功能3

**页面**:
- \`/path/to/page1\` - 页面说明
- \`/path/to/page2\` - 页面说明

---

### 2. 功能模块2

**功能描述**: 简要描述

**子功能**:
- 2.1 子功能1
- 2.2 子功能2

**页面**:
- \`/path/to/page3\` - 页面说明

---

## 📊 验收标准

### 功能验收

- [ ] 功能点1
- [ ] 功能点2
- [ ] 功能点3

### 非功能验收

**性能**:
- 列表加载 < 2秒
- 详情页加载 < 1秒

**可用性**:
- 支持xxx功能
- 支持xxx操作

---

## 🔗 文档导航

- [PRD文档](./PRD.md) - 详细产品需求文档（待创建）
- [用户故事](./USER_STORIES.md) - 完整用户故事列表（待创建）
- [数据模型](./DATA_MODEL.md) - 数据模型设计（可选）
- [API设计](./API_DESIGN.md) - API设计（可选）

---

## 📈 实施计划

### Phase 1: 基础功能

**交付**:
- ✅ 功能1
- ✅ 功能2

**Story Points**: TODO SP

---

## 🎯 关键指标

### 业务指标
- 指标1 ≥ 目标值
- 指标2 ≤ 目标值

### 使用指标
- 指标3
- 指标4

---

## 📝 变更历史

- **v1.0** (2025-01-03): 初始版本

---

**维护团队**: 待定  
**最后更新**: 2025-01-03
EOF

    # 创建PRD.md占位文件
    cat > "$feature_dir/PRD.md" <<EOF
# $feature_id - $feature_name - PRD

> **文档版本**: v1.0  
> **创建日期**: 2025-01-03  
> **状态**: 待编写

---

## 📋 目录

1. [特性概述](#一特性概述)
2. [用户画像与场景](#二用户画像与场景)
3. [功能需求](#三功能需求)
4. [非功能需求](#四非功能需求)
5. [用户故事](#五用户故事)
6. [设计原型](#六设计原型)
7. [技术方案](#七技术方案)
8. [实施计划](#八实施计划)

---

## 一、特性概述

### 1.1 背景

> TODO: 详细描述特性背景

### 1.2 目标

> TODO: 详细说明特性目标

### 1.3 范围

**包含范围**:
- TODO: 列出包含的功能

**不包含范围**:
- TODO: 列出不包含的功能

---

## 二、用户画像与场景

### 2.1 主要用户

> TODO: 描述主要用户角色

### 2.2 典型场景

> TODO: 描述3-5个典型使用场景

---

## 三、功能需求

> TODO: 详细描述所有功能需求

---

## 四、非功能需求

### 4.1 性能需求

> TODO: 性能指标

### 4.2 安全需求

> TODO: 安全要求

### 4.3 可用性需求

> TODO: 可用性要求

---

## 五、用户故事

详见 [USER_STORIES.md](./USER_STORIES.md)

---

## 六、设计原型

> TODO: UI原型设计

---

## 七、技术方案

### 7.1 数据模型

> TODO: 数据模型设计

### 7.2 API设计

> TODO: API接口设计

### 7.3 前端组件

> TODO: 前端组件设计

---

## 八、实施计划

> TODO: 详细的实施计划

---

**文档状态**: 待编写  
**最后更新**: 2025-01-03
EOF

    # 创建USER_STORIES.md占位文件
    cat > "$feature_dir/USER_STORIES.md" <<EOF
# $feature_id - $feature_name - 用户故事

> **文档版本**: v1.0  
> **创建日期**: 2025-01-03  
> **状态**: 待编写

---

## 📋 用户故事列表

### Story 1: [故事标题]

**作为** [角色]  
**我想要** [功能]  
**以便** [价值]

**验收条件**:
- [ ] AC1: 验收条件1
- [ ] AC2: 验收条件2
- [ ] AC3: 验收条件3

**Story Points**: TODO SP  
**优先级**: P0/P1/P2  
**Sprint**: TODO

---

### Story 2: [故事标题]

**作为** [角色]  
**我想要** [功能]  
**以便** [价值]

**验收条件**:
- [ ] AC1: 验收条件1
- [ ] AC2: 验收条件2

**Story Points**: TODO SP  
**优先级**: P0/P1/P2  
**Sprint**: TODO

---

## 📊 Story统计

| 优先级 | Story数量 | Story Points | 说明 |
|-------|---------|--------------|------|
| P0 | TODO | TODO SP | 必须完成 |
| P1 | TODO | TODO SP | 应该完成 |
| P2 | TODO | TODO SP | 可以完成 |
| **总计** | **TODO** | **$sp SP** | - |

---

**文档状态**: 待编写  
**最后更新**: 2025-01-03
EOF
}

# 主循环
echo -e "${BLUE}开始创建Feature目录和模板文档...${NC}"
echo ""

CREATED_COUNT=0
SKIPPED_COUNT=0

for feature in "${FEATURES[@]}"; do
    IFS=':' read -r domain id name priority sp <<< "$feature"
    create_feature "$domain" "$id" "$name" "$priority" "$sp"
    
    if [ -d "$BASE_DIR/$domain/$id-$name" ]; then
        if [ -f "$BASE_DIR/$domain/$id-$name/README.md" ]; then
            ((CREATED_COUNT++))
        else
            ((SKIPPED_COUNT++))
        fi
    fi
done

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}完成!${NC}"
echo -e "${GREEN}创建: $CREATED_COUNT 个features${NC}"
echo -e "${GREEN}跳过: $SKIPPED_COUNT 个features (已存在)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}下一步:${NC}"
echo "1. 进入各feature目录，完善README.md"
echo "2. 编写完整的PRD.md文档"
echo "3. 拆解USER_STORIES.md用户故事"
echo "4. 根据需要创建DATA_MODEL.md、API_DESIGN.md等文档"
echo ""
echo -e "${BLUE}快速开始:${NC}"
echo "cd $BASE_DIR/1-asset-management/F002-领域产品管理"
echo "vim README.md"
echo ""

