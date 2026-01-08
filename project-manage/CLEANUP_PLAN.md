# 📋 根目录清理计划

## 🎯 清理目标
只保留最终的方案设计、数据设计、进展状态，删除过程性文档和问题修复记录。

---

## 📊 文件分类分析

### ✅ 核心设计文档 - 需要整合到对应目录

#### 1. 架构设计 → Architecture/
- `CURRENT_ARCHITECTURE_REVIEW.md` - 当前架构全面Review
- `DOMAIN_MODEL_REDESIGN.md` - 领域模型重新设计（需求与任务架构）
- `ARCHITECTURE_VISUAL_SUMMARY.md` - 架构可视化总结
- `RELEASE_DATA_RELATIONSHIPS.md` - 发布数据关系设计

**整合方案**: 合并为 `Architecture/08-ARCHITECTURE_REVIEW_AND_REDESIGN.md`

#### 2. 业务数据设计 → biz-data/
- `THREE_DOMAINS_DATA_ARCHITECTURE.md` - 三域数据架构

**整合方案**: 移动到 `biz-data/03-THREE_DOMAINS_DATA_ARCHITECTURE.md`

#### 3. 前端架构分析 → Architecture/
- `FRONTEND_PAGE_RELATIONSHIP_ANALYSIS.md` - 前端页面关系分析

**整合方案**: 整合到 `Architecture/09-FRONTEND_ARCHITECTURE.md`

---

### ❌ 过程性文档 - 需要删除

#### 完成报告类（17个）
- ALL_PHASES_SUMMARY.md
- COMPLETE_FIX_SUMMARY.md
- COMPLETE_IMPLEMENTATION_REPORT.md
- DATA_EXPANSION_QUICK_VIEW.md
- DATA_EXPANSION_SUMMARY.md
- DEVOPS_TEST_MODULES_COMPLETION_REPORT.md
- EXECUTION_PROGRESS_REPORT.md
- FINAL_COMPLETION_SUMMARY.md
- FINAL_EXECUTION_REPORT.md
- FINAL_WORK_COMPLETION_REPORT.md
- PROJECT_FINAL_COMPLETE_REPORT.md
- QUICK_DATA_COMPLETION_SUMMARY.md
- RELEASE_DATA_COMPLETION_SUMMARY.md
- SYSTEM_COMPLETION_STATISTICS.md
- THREE_DOMAINS_DATA_COMPLETION_REPORT.md
- VALUE_STREAM_COMPLETION_REPORT.md
- REFACTORING_COMPLETE_SUMMARY.md

#### 问题修复记录类（12个）
- DATA_LOADING_FIXES_REPORT.md
- ISSUE_DIAGNOSIS_AND_FIX.md
- NAVIGATION_STYLE_BEFORE_AFTER.md
- NAVIGATION_STYLE_UPDATE.md
- PATH_AND_ROUTE_FIX.md
- PI_PLANNING_LAYOUT_UPDATE.md
- PRODUCT_DATA_FIX_REPORT.md
- RELEASE_DATA_FIX_SUMMARY.md
- SASS_WARNINGS_FIX.md
- UI_FIX_QUICK_SUMMARY.md
- UI_ISSUES_FIX_REPORT.md
- TRACEABILITY_ENHANCEMENT_REPORT.md

#### 测试指南类（5个）
- QUICK_TEST_GUIDE.md
- RELEASE_FEATURE_TEST_GUIDE.md
- UI_ACCEPTANCE_TEST_GUIDE.md
- VALUE_STREAM_TEST_GUIDE.md
- FRONTEND_STARTUP_SUCCESS_REPORT.md

#### 功能实现总结类（8个）
- LOGIN_PAGE_UPDATE.md
- MODULE_REQUIREMENT_TRACEABILITY_GUIDE.md
- PRODUCT_FEATURE_IMPLEMENTATION_SUMMARY.md
- PRODUCT_FEATURE_MANAGEMENT_GUIDE.md
- PRODUCT_FEATURE_QA.md
- REQUIREMENT_UPDATE_SUMMARY.md
- VERSION_BASELINE_IMPLEMENTATION_COMPLETE.md
- VERSION_BASELINE_SUMMARY.md

#### 临时计划和状态类（7个）
- ARCHITECTURE_REFACTORING_PLAN.md
- IMPLEMENTATION_PLAN.md
- KEY_TASKS_ROADMAP.md
- VERSION_BASELINE_ENTRY_POINTS.md
- VERSION_BASELINE_IMPLEMENTATION_PLAN.md
- VERSION_BASELINE_STATUS_REPORT.md
- DOCUMENTATION_UPDATE_AND_CLEANUP_REPORT.md

#### 其他说明文档（5个）
- F010_BACKEND_API_ANALYSIS.md
- FULL_SYSTEM_ANALYSIS_REPORT.md
- PROJECT_CONTEXT_SUMMARY.md
- REFACTORING_FINAL_REPORT.md
- RESTART_INSTRUCTIONS.md

#### 快速参考（可合并）
- QUICK_START_GUIDE.md → 保留，简化
- QUICK_START_RELEASE_DATA.md → 删除，内容合并到QUICK_START_GUIDE
- USER_GUIDE.md → 删除，内容合并到README

---

### ⚠️ 脚本文件
- `fix-sass-imports.sh` - 删除（一次性修复脚本）

---

### ✅ 保留文件
- `README.md` - 项目主文档（需要更新）
- `QUICK_START_GUIDE.md` - 快速开始指南（需要简化）

---

## 🗂️ 整理后的目录结构

```
domain-model-design/
├── README.md                          ✅ 项目总览
├── QUICK_START_GUIDE.md              ✅ 快速开始
├── Architecture/                      ✅ 架构设计（长期保持）
│   ├── README.md
│   ├── 00-*.md                        (现有文件)
│   ├── 08-ARCHITECTURE_REVIEW_AND_REDESIGN.md  ⭐ 新增
│   └── 09-FRONTEND_ARCHITECTURE.md    ⭐ 新增
├── platform-rd-process/              ✅ 研发流程（长期保持）
├── biz-data/                         ✅ 业务数据（长期保持）
│   ├── mock/
│   ├── README.md
│   ├── 01-AVP_CASE_STUDY.md
│   ├── 02-NOA_V31_BUSINESS_DATA.md
│   └── 03-THREE_DOMAINS_DATA_ARCHITECTURE.md  ⭐ 新增
├── project-manage/                   ✅ 项目管理（状态更新）
├── product-backlog/                  ✅ 产品Backlog（状态更新）
├── prototype-design/                 ✅ 原型设计（UI设计）
├── frontend/                         ✅ 前端代码
├── design-reports/                   ⚠️ 评估是否保留
└── works_progress_docs/              ❌ 删除整个目录
```

---

## 📝 执行步骤

### Step 1: 整合核心设计文档
1. 创建 `Architecture/08-ARCHITECTURE_REVIEW_AND_REDESIGN.md`
   - 整合: CURRENT_ARCHITECTURE_REVIEW.md
   - 整合: DOMAIN_MODEL_REDESIGN.md
   - 整合: ARCHITECTURE_VISUAL_SUMMARY.md
   - 整合: RELEASE_DATA_RELATIONSHIPS.md

2. 创建 `Architecture/09-FRONTEND_ARCHITECTURE.md`
   - 整合: FRONTEND_PAGE_RELATIONSHIP_ANALYSIS.md

3. 移动 `THREE_DOMAINS_DATA_ARCHITECTURE.md` → `biz-data/03-THREE_DOMAINS_DATA_ARCHITECTURE.md`

### Step 2: 简化用户文档
1. 更新 `README.md` - 精简为项目概述
2. 简化 `QUICK_START_GUIDE.md` - 只保留启动步骤

### Step 3: 删除过程性文档（54个文件）
- 批量删除所有 *_REPORT.md
- 批量删除所有 *_SUMMARY.md (除了README中引用的)
- 批量删除所有 *_FIX*.md
- 批量删除所有 *_UPDATE.md
- 批量删除所有 *_GUIDE.md (除了QUICK_START_GUIDE)
- 批量删除所有 *_PLAN.md
- 批量删除 fix-sass-imports.sh

### Step 4: 删除临时目录
- 删除 `works_progress_docs/` 整个目录
- 评估 `design-reports/` 是否需要保留

---

## ✅ 清理后效果

### 根目录文件（仅保留2个）
```
├── README.md
└── QUICK_START_GUIDE.md
```

### 设计文档（分类存放）
```
Architecture/        - 架构设计（17个文件）
platform-rd-process/ - 研发流程（5个文件）
biz-data/           - 业务数据（3个文件 + mock数据）
project-manage/     - 项目管理（5个文件）
product-backlog/    - 产品Backlog（按需组织）
prototype-design/   - 原型设计（8个文件）
```

---

## 📊 统计

### 删除文件统计
- 过程性文档: ~54个
- 临时脚本: 1个
- 临时目录: 1个 (works_progress_docs/)
- **总计删除**: ~56个文件/目录

### 保留文件统计
- 核心架构设计: 2个新增到Architecture/
- 业务数据设计: 1个移动到biz-data/
- 用户文档: 2个（精简）
- 代码和数据: 保持不变

---

## ⏰ 执行时间估算
- 文档整合: 30分钟
- 文件删除: 10分钟
- 验证和测试: 10分钟
- **总计**: 约50分钟

---

**是否开始执行清理计划？**

