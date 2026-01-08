# 📋 Architecture 目录重构计划

## 🎯 目标

将 Architecture/ 目录重构为版本化管理：
- **v1/**: 历史版本设计 (v1 & v2)
- **v2/**: 最新版本设计 (v3 架构)

---

## 📊 文件分类

### v1/ - 历史版本设计

#### 业务架构 v1 & v2
- `01-BUSINESS_ARCHITECTURE.md` (22K) - v1 业务架构
- `00-BUSINESS_ARCHITECTURE_V2.md` (53K) - v2 业务架构
- `BUSINESS_ARCHITECTURE_V2_SUMMARY.md` (15K) - v2 总结

#### 早期设计
- `03-USER_STORY_MAPPING.md` (18K) - 用户故事映射

---

### v2/ - 最新版本设计 (v3 架构)

#### 1️⃣ 业务架构设计
- `BUSINESS_ARCHITECTURE_V3_REFACTORED.md` (42K) - v3 业务架构 ⭐
- `BUSINESS_ARCHITECTURE_DIAGRAM.md` (34K) - 业务架构图 ⭐

#### 2️⃣ 领域模型设计
- `00-DOMAIN_MODEL_DESIGN.md` (24K) - 领域模型设计 ⭐
- `00-DOMAIN_MODEL_DESIGN-visualization.md` (18K) - 领域模型可视化 ⭐
- `00-DOMAIN_MODEL_SUMMARY.md` (5K) - 领域模型总结

#### 3️⃣ 功能架构设计
- `02-FUNCTIONAL_ARCHITECTURE.md` (20K) - 功能架构 ⭐

#### 4️⃣ 任务架构设计
- `08-TASK_BASED_ARCHITECTURE_DESIGN.md` (22K) - 任务架构 ⭐

#### 5️⃣ 数据架构
- `00-DATA_RELATIONSHIP_ANALYSIS.md` (33K) - 数据关系分析
- `business-data/` - 业务数据集 (从 biz-data 整理)

#### 6️⃣ 术语定义
- `00-TERMINOLOGY_UPDATE.md` (8.4K) - 术语更新

#### 7️⃣ 专项设计
- `04-END_TO_END_COLLABORATION.md` (58K) - 端到端协作
- `05-PLATFORM_ARCHITECTURE_DESIGN.md` (69K) - 平台架构
- `06-PRODUCT_FEATURE_MANAGEMENT_DESIGN.md` (16K) - 产品特性管理
- `07-VERSION_AND_BASELINE_MANAGEMENT_DESIGN.md` (26K) - 版本基线管理

---

## 🗂️ 目标目录结构

```
Architecture/
├── README.md                          # 总览和索引
│
├── v1/                                # 历史版本 (v1 & v2)
│   ├── README.md
│   ├── 01-BUSINESS_ARCHITECTURE.md
│   ├── 00-BUSINESS_ARCHITECTURE_V2.md
│   ├── BUSINESS_ARCHITECTURE_V2_SUMMARY.md
│   └── 03-USER_STORY_MAPPING.md
│
└── v2/                                # 最新版本 (v3 架构)
    ├── README.md                      # v2 版本说明
    │
    ├── 01-business/                   # 业务架构
    │   ├── BUSINESS_ARCHITECTURE_V3.md
    │   └── BUSINESS_ARCHITECTURE_DIAGRAM.md
    │
    ├── 02-domain/                     # 领域模型
    │   ├── DOMAIN_MODEL_DESIGN.md
    │   ├── DOMAIN_MODEL_VISUALIZATION.md
    │   └── DOMAIN_MODEL_SUMMARY.md
    │
    ├── 03-functional/                 # 功能架构
    │   └── FUNCTIONAL_ARCHITECTURE.md
    │
    ├── 04-task/                       # 任务架构
    │   └── TASK_BASED_ARCHITECTURE.md
    │
    ├── 05-data/                       # 数据架构
    │   ├── DATA_RELATIONSHIP_ANALYSIS.md
    │   └── business-data/             # 业务数据集
    │       ├── intelligent-driving/
    │       ├── intelligent-cockpit/
    │       └── electrical-architecture/
    │
    ├── 06-terminology/                # 术语定义
    │   └── TERMINOLOGY.md
    │
    └── 07-specialized/                # 专项设计
        ├── END_TO_END_COLLABORATION.md
        ├── PLATFORM_ARCHITECTURE.md
        ├── PRODUCT_FEATURE_MANAGEMENT.md
        └── VERSION_BASELINE_MANAGEMENT.md
```

---

## ✅ 执行步骤

1. 创建 v1/ 和 v2/ 目录
2. 移动历史版本文档到 v1/
3. 在 v2/ 中创建分类子目录
4. 移动并重命名最新版本文档到 v2/
5. 从 biz-data/ 整理业务数据到 v2/05-data/business-data/
6. 创建各目录的 README.md
7. 更新根目录 README.md

---

**准备执行...**

