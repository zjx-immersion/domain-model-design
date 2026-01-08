# 🏗️ Architecture - 架构设计文档

## 📋 目录说明

本目录包含领域模型设计平台的**完整架构设计文档**，采用版本化管理。

---

## 🗂️ 目录结构

```
Architecture/
├── README.md                 # 本文档
├── v1/                       # 历史版本设计 (v1 & v2)
└── v2/                       # 最新版本设计 (v3 架构) ⭐
    ├── 01-business/          # 业务架构设计图
    ├── 02-domain/            # 领域模型设计图
    ├── 03-functional/        # 功能架构设计
    ├── 04-task/              # 任务架构设计
    ├── 05-data/              # 数据架构和业务数据集
    ├── 06-terminology/       # 术语定义
    └── 07-specialized/       # 专项设计
```

---

## 🚀 快速导航

### ⭐ 当前最新版本 (v3)

**查看详情**: [v2/README.md](v2/README.md)

#### 核心设计文档

1. **业务架构设计图** ⭐
   - [v2/01-business/BUSINESS_ARCHITECTURE_V3.md](v2/01-business/BUSINESS_ARCHITECTURE_V3.md)
   - [v2/01-business/BUSINESS_ARCHITECTURE_DIAGRAM.md](v2/01-business/BUSINESS_ARCHITECTURE_DIAGRAM.md)

2. **领域模型设计图** ⭐
   - [v2/02-domain/DOMAIN_MODEL_DESIGN.md](v2/02-domain/DOMAIN_MODEL_DESIGN.md)
   - [v2/02-domain/DOMAIN_MODEL_VISUALIZATION.md](v2/02-domain/DOMAIN_MODEL_VISUALIZATION.md)

3. **功能架构设计** ⭐
   - [v2/03-functional/FUNCTIONAL_ARCHITECTURE.md](v2/03-functional/FUNCTIONAL_ARCHITECTURE.md)

4. **任务架构设计** ⭐
   - [v2/04-task/TASK_BASED_ARCHITECTURE.md](v2/04-task/TASK_BASED_ARCHITECTURE.md)

5. **业务数据集** ⭐
   - [v2/05-data/business-data/](v2/05-data/business-data/)
   - 三域数据：智能驾驶、智能座舱、电子电器
   - 50+ Mock 数据文件

---

### 📚 历史版本 (v1 & v2)

**查看详情**: [v1/README.md](v1/README.md)

用于参考和对比历史设计演进。

---

## 🎯 核心设计理念 (v3)

### 1. 模块-团队责任绑定 ⭐

```
Module ←→ Team (responsibleModules)
   ↓
WorkItem (moduleId → assignedTeamId)
   ↓
Task (teamId)
   ↓
Sprint (teamId)
```

**说明**: 通过模块明确团队责任，实现自动化工作分配。

---

### 2. 三层需求分解 ⭐

```
L1: 用户需求 (User Requirement)
    - 来自客户/市场的业务需求
       ↓ 分解 (satisfy)
L2: 特性需求 (Feature Requirement)
    - 产品特性级需求
       ↓ 分解 (decompose)
L3: 模块需求 (Module Requirement)
    - 软件模块级需求
       ↓ 拆分 (split)
任务 (Tasks - 8种类型)
```

**说明**: 清晰的需求层级和端到端追溯。

---

### 3. 8种任务类型 ⭐

1. **需求任务** (Requirement Task) - 实现模块需求
2. **用户故事** (User Story) - 用户视角功能点
3. **缺陷修复** (Bug) - 缺陷/问题修复
4. **技术任务** (Technical Task) - 重构、优化
5. **风险任务** (Risk Task) - 风险应对
6. **测试任务** (Test Task) - 测试工作
7. **文档任务** (Documentation) - 文档编写
8. **子任务** (Subtask) - 任务拆分

**说明**: 覆盖实际研发场景的所有工作类型。

---

## 📊 架构演进历史

### v1 → v2 → v3

| 维度 | v1 | v2 | v3 (当前) |
|------|----|----|-----------|
| **业务架构** | 基础模块 | 功能完善 | SAFe 企业级框架 ✅ |
| **需求管理** | 用户故事 | 层级划分 | 三层分解 + 追溯 ✅ |
| **任务管理** | 单一类型 | 简单分类 | 8种任务类型 ✅ |
| **团队协作** | 手动分配 | 简单绑定 | 模块-团队绑定 ✅ |
| **数据模型** | 基础实体 | 关系定义 | 完整追溯链 ✅ |
| **自动化** | 无 | 部分 | 智能自动分配 ✅ |

---

## 📖 推荐阅读顺序

### 🎯 快速了解（30分钟）

1. [v2/README.md](v2/README.md) - v2 版本总览
2. [v2/01-business/BUSINESS_ARCHITECTURE_V3.md](v2/01-business/BUSINESS_ARCHITECTURE_V3.md) - 业务架构
3. [v2/02-domain/DOMAIN_MODEL_SUMMARY.md](v2/02-domain/DOMAIN_MODEL_SUMMARY.md) - 领域模型总结

### 🔍 深入理解（2小时）

1. **业务架构** → [v2/01-business/](v2/01-business/)
2. **领域模型** → [v2/02-domain/](v2/02-domain/)
3. **任务架构** → [v2/04-task/](v2/04-task/)
4. **功能架构** → [v2/03-functional/](v2/03-functional/)
5. **数据架构** → [v2/05-data/](v2/05-data/)

### 📚 全面掌握（1天）

按照目录顺序阅读 v2/ 下所有文档，并对比 v1/ 历史版本。

---

## 📈 文档统计

### 当前版本 (v3)
- **核心架构文档**: 4 篇
- **领域模型文档**: 3 篇
- **专项设计文档**: 4 篇
- **数据设计文档**: 2 篇
- **业务数据集**: 50+ JSON 文件
- **总计**: 18 篇架构文档

### 历史版本 (v1 & v2)
- **归档文档**: 4 篇
- **总大小**: ~110KB

---

## 🔗 相关资源

### 项目文档
- **项目根目录**: [../README.md](../README.md)
- **快速开始**: [../QUICK_START_GUIDE.md](../QUICK_START_GUIDE.md)
- **研发流程**: [../platform-rd-process/](../platform-rd-process/)
- **业务数据**: [../biz-data/](../biz-data/)

### 在线资源
- **GitHub 仓库**: https://github.com/zjx-immersion/domain-model-design
- **项目 Tag**: v1.0.0

---

## 💡 如何贡献

### 更新架构文档

1. **小修改**: 直接更新 v2/ 对应文档
2. **大重构**: 
   - 创建新版本目录 v3/
   - 将当前 v2/ 归档
   - 更新本 README

### 文档规范

- **命名**: 使用有意义的文件名
- **格式**: Markdown 格式
- **图表**: 使用 Mermaid 或 ASCII art
- **索引**: 及时更新各级 README

---

## ❓ 常见问题

### Q1: 如何找到最新的业务架构设计图？
**A**: [v2/01-business/BUSINESS_ARCHITECTURE_V3.md](v2/01-business/BUSINESS_ARCHITECTURE_V3.md)

### Q2: 如何找到领域模型设计图？
**A**: [v2/02-domain/DOMAIN_MODEL_DESIGN.md](v2/02-domain/DOMAIN_MODEL_DESIGN.md)

### Q3: 业务数据集在哪里？
**A**: [v2/05-data/business-data/](v2/05-data/business-data/)

### Q4: 历史版本文档在哪里？
**A**: [v1/](v1/) 目录

### Q5: 如何理解模块-团队绑定？
**A**: 查看 [v2/04-task/TASK_BASED_ARCHITECTURE.md](v2/04-task/TASK_BASED_ARCHITECTURE.md)

---

## 📝 更新日志

### 2025-01-08 - v3 架构重构
- ✅ 创建版本化目录结构 (v1/ & v2/)
- ✅ 整理历史版本到 v1/
- ✅ 组织最新版本到 v2/
- ✅ 创建完整的目录索引
- ✅ 添加业务数据集到 v2/05-data/

### 历史版本
- 2024-XX-XX - v2 架构设计
- 2024-XX-XX - v1 初始架构

---

**当前版本**: v3.0  
**状态**: ✅ 最新版本  
**最后更新**: 2025-01-08  

**🎯 开始探索**: [v2/README.md](v2/README.md) ⭐
