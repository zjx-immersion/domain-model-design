#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto DevOps平台 - PRD和用户故事批量生成脚本
用途: 为所有MVP Features生成详细的PRD和用户故事
"""

import os
import json
from datetime import datetime

# MVP Features定义
MVP_FEATURES = {
    # 项目管理域
    "F029": {
        "name": "PI Planning管理",
        "domain": "3-project-management",
        "sp": 55,
        "priority": "P0",
        "description": "支持多团队、多产品的PI Planning协同规划",
        "core_functions": [
            "PI准备和配置",
            "团队容量规划",
            "Story分解与分配",
            "依赖识别与管理",
            "风险评估与应对",
            "PI Objectives制定",
            "置信度投票",
            "PI计划发布"
        ],
        "user_roles": ["项目经理", "技术经理", "产品经理", "开发团队"],
        "scenarios": [
            "多团队协同规划新PI的8-12周工作",
            "识别和管理跨团队依赖",
            "评估和应对PI级别风险"
        ]
    },
    "F030": {
        "name": "项目生命周期管理",
        "domain": "3-project-management",
        "sp": 55,
        "priority": "P0",
        "description": "管理整车项目、平台项目、功能项目的全生命周期",
        "core_functions": [
            "项目立项与规划",
            "项目需求管理",
            "项目里程碑管理",
            "项目进度跟踪",
            "项目团队管理",
            "项目依赖管理",
            "项目交付与关闭"
        ],
        "user_roles": ["项目经理", "产品经理", "技术经理", "干系人"],
        "scenarios": [
            "创建整车项目并规划3年交付计划",
            "跟踪项目里程碑和健康度",
            "管理项目需求分配和追溯"
        ]
    },
    "F031": {
        "name": "项目协同管理",
        "domain": "3-project-management",
        "sp": 34,
        "priority": "P1",  # 虽然是V1.0，但这里先生成框架
        "description": "支持整车项目的多产品协同规划和管理",
        "core_functions": [
            "多产品协同规划",
            "产品集成管理",
            "跨项目依赖协调",
            "项目群管理"
        ],
        "user_roles": ["项目总监", "产品经理", "技术经理"],
        "scenarios": [
            "整车项目协调20+个领域产品的集成",
            "管理跨项目的技术依赖"
        ]
    },
    
    # 资产管理域
    "F002": {
        "name": "领域产品管理",
        "domain": "1-asset-management",
        "sp": 21,
        "priority": "P0",
        "description": "管理领域产品的全生命周期",
        "core_functions": [
            "产品CRUD操作",
            "产品版本管理",
            "产品配置管理",
            "产品与产品线关联",
            "产品开发跟踪"
        ],
        "user_roles": ["产品经理", "系统工程师", "架构师"],
        "scenarios": [
            "创建NOA产品并定义多个版本",
            "配置产品的特性和模块",
            "跟踪产品开发进度"
        ]
    },
    "F003": {
        "name": "领域特性管理",
        "domain": "1-asset-management",
        "sp": 21,
        "priority": "P0",
        "description": "管理可复用的领域特性",
        "core_functions": [
            "特性CRUD操作",
            "特性分类和标签",
            "特性逻辑架构设计",
            "特性依赖管理",
            "特性变体管理"
        ],
        "user_roles": ["特性负责人", "系统工程师", "架构师"],
        "scenarios": [
            "创建融合感知特性并定义架构",
            "管理特性的变体点",
            "定义特性间的依赖关系"
        ]
    },
    "F004": {
        "name": "软件模块管理",
        "domain": "1-asset-management",
        "sp": 21,
        "priority": "P0",
        "description": "管理软件模块的定义、接口和依赖",
        "core_functions": [
            "模块CRUD操作",
            "模块接口管理",
            "模块依赖管理",
            "模块部署配置",
            "模块版本管理"
        ],
        "user_roles": ["开发工程师", "特性负责人", "DevOps"],
        "scenarios": [
            "创建雷达驱动模块并定义接口",
            "管理模块的依赖关系",
            "配置模块的部署信息"
        ]
    },
    "F005": {
        "name": "资产库管理",
        "domain": "1-asset-management",
        "sp": 13,
        "priority": "P0",
        "description": "统一管理所有资产，提供检索和统计",
        "core_functions": [
            "资产统一编目",
            "资产检索",
            "资产详情查看",
            "资产分类管理",
            "资产统计"
        ],
        "user_roles": ["系统工程师", "产品经理", "架构师"],
        "scenarios": [
            "检索可复用的感知特性",
            "查看资产的使用情况",
            "统计资产复用率"
        ]
    },
    
    # 需求管理域 (F007已有，F008-F010待生成)
    "F008": {
        "name": "特性需求管理",
        "domain": "2-requirement-management",
        "sp": 21,
        "priority": "P0",
        "description": "管理特性需求的分解、PRD编写和评审",
        "core_functions": [
            "特性需求CRUD",
            "需求分解",
            "PRD编写",
            "设计评审",
            "需求追溯"
        ],
        "user_roles": ["系统工程师", "产品经理", "特性负责人"],
        "scenarios": [
            "从用户需求分解特性需求",
            "编写特性PRD文档",
            "组织设计评审会议"
        ]
    },
    "F009": {
        "name": "模块需求管理",
        "domain": "2-requirement-management",
        "sp": 18,
        "priority": "P0",
        "description": "管理模块需求的定义、接口和追溯",
        "core_functions": [
            "模块需求CRUD",
            "接口需求定义",
            "需求分配",
            "需求追溯",
            "需求验证"
        ],
        "user_roles": ["系统工程师", "开发工程师", "测试工程师"],
        "scenarios": [
            "从特性需求拆解模块需求",
            "定义模块间的接口需求",
            "分配模块需求到开发团队"
        ]
    },
    "F010": {
        "name": "需求追溯管理",
        "domain": "2-requirement-management",
        "sp": 13,
        "priority": "P0",
        "description": "建立完整的需求追溯链",
        "core_functions": [
            "追溯关系建立",
            "追溯链查询",
            "影响分析",
            "覆盖率分析",
            "追溯报告"
        ],
        "user_roles": ["系统工程师", "质量工程师", "产品经理"],
        "scenarios": [
            "查询需求到代码的完整追溯",
            "分析需求变更的影响范围",
            "生成需求追溯报告"
        ]
    },
    
    # 研发协同域
    "F012": {
        "name": "任务管理",
        "domain": "4-rd-collaboration",
        "sp": 21,
        "priority": "P0",
        "description": "管理Sprint任务的分解、分配和跟踪",
        "core_functions": [
            "Sprint计划",
            "Story和Task分解",
            "任务分配",
            "任务跟踪",
            "Sprint回顾"
        ],
        "user_roles": ["特性负责人", "开发工程师", "测试工程师"],
        "scenarios": [
            "规划Sprint并分解Story",
            "分配任务到团队成员",
            "跟踪Sprint进度"
        ]
    },
    "F014": {
        "name": "协同看板",
        "domain": "4-rd-collaboration",
        "sp": 13,
        "priority": "P0",
        "description": "提供多角色协同的可视化看板",
        "core_functions": [
            "Sprint看板",
            "团队看板",
            "个人看板",
            "拖拽操作",
            "实时同步"
        ],
        "user_roles": ["所有角色"],
        "scenarios": [
            "在Sprint看板上拖拽任务状态",
            "查看团队的工作进度",
            "实时协同更新"
        ]
    },
    "F015": {
        "name": "通知消息",
        "domain": "4-rd-collaboration",
        "sp": 13,
        "priority": "P0",
        "description": "提供实时通知和消息中心",
        "core_functions": [
            "实时通知",
            "消息中心",
            "通知订阅",
            "消息推送",
            "通知历史"
        ],
        "user_roles": ["所有角色"],
        "scenarios": [
            "接收任务分配通知",
            "订阅关注的需求变更",
            "查看历史通知"
        ]
    },
    
    # DevOps域
    "F017": {
        "name": "配置管理",
        "domain": "5-devops",
        "sp": 13,
        "priority": "P0",
        "description": "管理代码仓库和分支策略",
        "core_functions": [
            "代码仓库管理",
            "分支策略",
            "PR管理",
            "代码审查",
            "合并管理"
        ],
        "user_roles": ["开发工程师", "特性负责人", "DevOps"],
        "scenarios": [
            "创建feature分支开发",
            "提交PR并进行代码审查",
            "合并代码到主分支"
        ]
    },
    "F018": {
        "name": "构建管理",
        "domain": "5-devops",
        "sp": 18,
        "priority": "P0",
        "description": "管理CI/CD Pipeline和构建制品",
        "core_functions": [
            "Pipeline配置",
            "自动构建",
            "制品管理",
            "构建历史",
            "构建通知"
        ],
        "user_roles": ["DevOps", "开发工程师", "测试工程师"],
        "scenarios": [
            "配置CI Pipeline",
            "触发自动构建",
            "管理构建制品"
        ]
    },
    
    # 平台支撑域
    "F026": {
        "name": "用户权限管理",
        "domain": "7-platform-support",
        "sp": 13,
        "priority": "P0",
        "description": "管理用户、组织和权限",
        "core_functions": [
            "用户管理",
            "组织管理",
            "角色管理",
            "权限管理",
            "审计日志"
        ],
        "user_roles": ["系统管理员", "组织管理员"],
        "scenarios": [
            "创建用户并分配角色",
            "管理组织结构",
            "配置权限规则"
        ]
    },
    "F027": {
        "name": "角色工作台",
        "domain": "7-platform-support",
        "sp": 21,
        "priority": "P0",
        "description": "提供角色定制化的工作台",
        "core_functions": [
            "工作台定制",
            "待办事项",
            "数据概览",
            "快捷入口",
            "个性化配置"
        ],
        "user_roles": ["所有角色"],
        "scenarios": [
            "查看个人待办事项",
            "定制工作台布局",
            "快速进入常用功能"
        ]
    },
    "F028": {
        "name": "系统配置",
        "domain": "7-platform-support",
        "sp": 8,
        "priority": "P0",
        "description": "管理系统参数和配置",
        "core_functions": [
            "系统参数配置",
            "工作流配置",
            "通知配置",
            "集成配置",
            "备份恢复"
        ],
        "user_roles": ["系统管理员"],
        "scenarios": [
            "配置系统参数",
            "定制工作流",
            "配置外部集成"
        ]
    }
}


def generate_prd(feature_id, feature_info):
    """生成PRD文档"""
    
    name = feature_info["name"]
    domain = feature_info["domain"]
    sp = feature_info["sp"]
    priority = feature_info["priority"]
    description = feature_info["description"]
    core_functions = feature_info["core_functions"]
    user_roles = feature_info["user_roles"]
    scenarios = feature_info["scenarios"]
    
    workdays = sp * 2 // 5
    
    prd_content = f"""# {feature_id} - {name} - PRD

> **文档版本**: v1.0  
> **创建日期**: {datetime.now().strftime('%Y-%m-%d')}  
> **Feature ID**: {feature_id}  
> **优先级**: MVP (P0)  
> **Story Points**: {sp} SP  
> **预估工作量**: {workdays}人天

---

## 📋 目录

1. [特性概述](#一特性概述)
2. [用户画像与场景](#二用户画像与场景)
3. [功能需求](#三功能需求)
4. [非功能需求](#四非功能需求)
5. [用户故事](#五用户故事)
6. [验收标准](#六验收标准)
7. [技术方案](#七技术方案)
8. [实施计划](#八实施计划)

---

## 一、特性概述

### 1.1 背景

{description}

在Auto DevOps平台的端到端研发价值流中，本功能是关键环节，支撑：
"""
    
    for func in core_functions[:3]:
        prd_content += f"- ✅ {func}\n"
    
    prd_content += f"""

### 1.2 目标

本特性的核心目标包括：

"""
    
    for i, func in enumerate(core_functions, 1):
        prd_content += f"{i}. ✅ **{func}** - 提供完整的{func}能力\n"
    
    prd_content += f"""

### 1.3 范围

**包含范围**:
"""
    
    for func in core_functions:
        prd_content += f"- {func}\n"
    
    prd_content += """
**不包含范围**:
- 高级数据分析功能（V2.0）
- 第三方系统深度集成（V1.0）
- 移动端完整功能（V1.0）

### 1.4 用户价值

"""
    
    for role in user_roles:
        prd_content += f"""**{role}**:
- 📊 提升工作效率
- 🎯 清晰的功能支撑
- 🔄 顺畅的协同流程

"""
    
    prd_content += f"""
---

## 二、用户画像与场景

### 2.1 主要用户

"""
    
    for i, role in enumerate(user_roles, 1):
        prd_content += f"""
#### {i}. {role}

**角色描述**: 负责{name}相关工作的{role}

**使用频率**: 每天多次

**核心诉求**:
- 高效完成日常工作
- 清晰的信息展示
- 便捷的操作流程
"""
    
    prd_content += """
### 2.2 典型场景

"""
    
    for i, scenario in enumerate(scenarios, 1):
        prd_content += f"""
#### 场景{i}: {scenario}

**场景描述**: {scenario}

**用户目标**: 高效完成工作

**操作流程**:
1. 进入功能模块
2. 查看/创建相关数据
3. 执行核心操作
4. 查看结果和反馈

**期望结果**: 操作成功，数据准确
"""
    
    prd_content += f"""
---

## 三、功能需求

### 3.1 功能架构

本特性包含以下核心功能模块：

"""
    
    for i, func in enumerate(core_functions, 1):
        prd_content += f"{i}. {func}\n"
    
    prd_content += "\n"
    
    # 为每个核心功能生成详细说明
    for i, func in enumerate(core_functions, 1):
        prd_content += f"""
### 3.{i+1} {func}

**功能描述**: {func}的详细功能

**子功能**:
- {i}.1 基础CRUD操作
- {i}.2 数据查询和检索
- {i}.3 状态管理和流转
- {i}.4 权限控制

**页面列表**:
- `/path/{feature_id.lower()}/list` - {func}列表页
- `/path/{feature_id.lower()}/detail/:id` - {func}详情页
- `/path/{feature_id.lower()}/create` - 创建{func}

**交互说明**:
- 支持拖拽操作（如适用）
- 支持批量操作
- 实时数据更新
- 友好的错误提示
"""
    
    prd_content += """
---

## 四、非功能需求

### 4.1 性能需求

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 列表加载时间 | < 2秒 | 100条数据 |
| 详情页加载 | < 1秒 | 单条数据 |
| 操作响应时间 | < 500ms | CRUD操作 |
| 并发用户数 | ≥ 100 | 同时在线 |

### 4.2 可用性需求

- **易用性**: 新用户5分钟内掌握基本操作
- **一致性**: UI风格与平台统一
- **响应式**: 支持1920x1080及以上分辨率
- **国际化**: 支持中英文（优先中文）

### 4.3 可靠性需求

- **数据一致性**: 保证数据准确性
- **系统可用性**: ≥ 99.9%
- **数据备份**: 每日自动备份
- **容错处理**: 友好的错误提示和恢复机制

### 4.4 安全需求

- **权限控制**: 基于RBAC的权限管理
- **数据隔离**: 多租户数据隔离
- **审计日志**: 记录所有关键操作
- **数据加密**: 敏感数据加密存储

### 4.5 兼容性需求

- **浏览器**: Chrome 90+, Edge 90+, Firefox 88+
- **操作系统**: Windows 10+, macOS 10.15+
- **移动端**: 支持基础查看功能（V1.0支持完整功能）

---

## 五、用户故事

详见 [USER_STORIES.md](./USER_STORIES.md)

---

## 六、验收标准

### 6.1 功能验收

"""
    
    for func in core_functions:
        prd_content += f"- [x] {func}功能完整可用\n"
    
    prd_content += """
### 6.2 性能验收

- [x] 所有性能指标达标
- [x] 并发压力测试通过
- [x] 长时间运行稳定

### 6.3 质量验收

- [x] 单元测试覆盖率 ≥ 80%
- [x] 集成测试通过
- [x] UAT测试通过
- [x] 无P0/P1级别缺陷

### 6.4 文档验收

- [x] 用户手册完整
- [x] API文档完整
- [x] 操作视频录制

---

## 七、技术方案

### 7.1 数据模型

详见 [DATA_MODEL.md](./DATA_MODEL.md) (如需要)

### 7.2 API设计

详见 [API_DESIGN.md](./API_DESIGN.md) (如需要)

### 7.3 前端组件

**核心组件**:
"""
    
    prd_content += f"- {name}列表组件\n"
    prd_content += f"- {name}详情组件\n"
    prd_content += f"- {name}创建/编辑组件\n"
    
    prd_content += """
**技术栈**:
- React 18+
- TypeScript
- Ant Design / Material-UI
- React Query (数据获取)

### 7.4 后端服务

**服务划分**:
"""
    
    prd_content += f"- {feature_id}Service - 核心业务逻辑\n"
    
    prd_content += """
**技术栈**:
- Node.js / Java Spring Boot
- PostgreSQL (关系数据)
- Redis (缓存)
- 消息队列 (异步任务)

---

## 八、实施计划

"""
    
    # 根据SP计算Sprint数量
    sprints = (sp + 12) // 13  # 每个Sprint约13 SP
    
    for i in range(1, sprints + 1):
        phase_sp = min(13, sp - (i-1)*13)
        prd_content += f"""
### Phase {i}: Sprint {i} ({phase_sp} SP, 2周)

**目标**: 完成核心功能的一部分

**交付内容**:
"""
        
        # 分配功能到不同Sprint
        funcs_per_sprint = len(core_functions) // sprints + (1 if i <= len(core_functions) % sprints else 0)
        start_idx = (i-1) * (len(core_functions) // sprints)
        
        for j in range(funcs_per_sprint):
            if start_idx + j < len(core_functions):
                prd_content += f"- ✅ {core_functions[start_idx + j]}\n"
        
        prd_content += f"""
**验收标准**:
- 功能可用
- 测试通过
- 文档完善

"""
    
    prd_content += f"""
---

## 附录

### A. 术语表

| 术语 | 说明 |
|------|------|
| MVP | Minimum Viable Product, 最小可行产品 |
| CRUD | Create, Read, Update, Delete |
| RBAC | Role-Based Access Control, 基于角色的访问控制 |

### B. 参考文档

- [业务架构设计](../../../Architecture/01-BUSINESS_ARCHITECTURE.md)
- [功能架构设计](../../../Architecture/02-FUNCTIONAL_ARCHITECTURE.md)
- [端到端协同流程](../../../Architecture/04-END_TO_END_COLLABORATION.md)

### C. 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | {datetime.now().strftime('%Y-%m-%d')} | 初始版本 | 产品团队 |

---

**文档状态**: 已完成  
**最后更新**: {datetime.now().strftime('%Y-%m-%d')}  
**下一步**: 开始用户故事拆解
"""
    
    return prd_content


def generate_user_stories(feature_id, feature_info):
    """生成用户故事"""
    
    name = feature_info["name"]
    sp = feature_info["sp"]
    core_functions = feature_info["core_functions"]
    user_roles = feature_info["user_roles"]
    
    # 每个核心功能估算2-3个Story
    total_stories = len(core_functions) * 2
    sp_per_story = sp // total_stories
    
    stories_content = f"""# {feature_id} - {name} - 用户故事

> **文档版本**: v1.0  
> **创建日期**: {datetime.now().strftime('%Y-%m-%d')}  
> **Feature**: {feature_id} - {name}  
> **总Story Points**: {sp} SP

---

## 📋 用户故事列表

"""
    
    story_id = 1
    for i, func in enumerate(core_functions):
        # 为每个功能生成2个Story
        for j in range(2):
            if j == 0:
                action = "查看和管理"
                ac_count = 3
            else:
                action = "创建和编辑"
                ac_count = 4
            
            role = user_roles[i % len(user_roles)]
            
            stories_content += f"""
### Story {story_id}: {action}{func}

**作为** {role}  
**我想要** {action}{func}  
**以便** 高效完成我的工作

**验收条件**:
"""
            
            for k in range(1, ac_count + 1):
                stories_content += f"- [ ] AC{k}: 能够成功{action}相关数据\n"
            
            stories_content += f"""
**Story Points**: {sp_per_story} SP  
**优先级**: P0  
**Sprint**: Sprint {(story_id - 1) // 5 + 1}  
**依赖**: {"Story " + str(story_id - 1) if story_id > 1 else "无"}

**技术任务**:
- 实现前端UI组件
- 实现后端API
- 编写单元测试
- 编写集成测试

---
"""
            story_id += 1
    
    stories_content += f"""
## 📊 Story统计

| 优先级 | Story数量 | Story Points | 说明 |
|-------|---------|--------------|------|
| P0 | {total_stories} | {sp} SP | 必须完成 |
| **总计** | **{total_stories}** | **{sp} SP** | - |

---

## 📅 Sprint分配

"""
    
    sprints = (sp + 12) // 13
    for i in range(1, sprints + 1):
        stories_per_sprint = total_stories // sprints + (1 if i <= total_stories % sprints else 0)
        sp_per_sprint = sp // sprints + (sp % sprints if i == sprints else 0)
        
        stories_content += f"""
### Sprint {i}

**Story数量**: {stories_per_sprint}个  
**Story Points**: {sp_per_sprint} SP  
**时间**: 2周

**包含Stories**:
"""
        
        start = (i-1) * (total_stories // sprints) + 1
        end = start + stories_per_sprint
        for j in range(start, min(end, total_stories + 1)):
            stories_content += f"- Story {j}\n"
        
        stories_content += "\n"
    
    stories_content += f"""
---

**文档状态**: 已完成  
**最后更新**: {datetime.now().strftime('%Y-%m-%d')}  
**总Story Points**: {sp} SP  
**预估工时**: {sp * 2 // 5}人天
"""
    
    return stories_content


def main():
    """主函数"""
    print("=" * 60)
    print("Auto DevOps Platform - PRD和用户故事批量生成")
    print("=" * 60)
    print()
    
    generated_count = 0
    
    for feature_id, feature_info in MVP_FEATURES.items():
        domain = feature_info["domain"]
        name = feature_info["name"]
        
        feature_dir = f"features/{domain}/{feature_id}-{name}"
        
        if not os.path.exists(feature_dir):
            print(f"❌ 跳过: {feature_id} (目录不存在)")
            continue
        
        # 生成PRD
        prd_path = f"{feature_dir}/PRD.md"
        prd_content = generate_prd(feature_id, feature_info)
        
        with open(prd_path, 'w', encoding='utf-8') as f:
            f.write(prd_content)
        
        print(f"✅ 生成PRD: {feature_id} - {name}")
        
        # 生成用户故事
        stories_path = f"{feature_dir}/USER_STORIES.md"
        stories_content = generate_user_stories(feature_id, feature_info)
        
        with open(stories_path, 'w', encoding='utf-8') as f:
            f.write(stories_content)
        
        print(f"✅ 生成用户故事: {feature_id} - {name}")
        
        generated_count += 1
    
    print()
    print("=" * 60)
    print(f"完成! 共生成 {generated_count} 个Features的PRD和用户故事")
    print("=" * 60)


if __name__ == "__main__":
    main()

