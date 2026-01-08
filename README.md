# 🚀 Domain Model Design - 领域模型设计平台

## 📋 项目简介

基于SAFe框架的汽车软件研发管理平台，支持PI Planning、迭代协同、需求管理、资产管理等全流程。

**技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Pinia

---

## 🏗️ 核心架构

### 设计理念
- **模块-团队责任绑定**: 通过模块明确团队责任
- **需求三层分解**: 用户需求 → 特性需求 → 模块需求
- **任务多类型支持**: 8种任务类型覆盖实际场景
- **自动工作分配**: 基于模块责任自动分配团队

### 核心流程
```
PI Planning → 工作项分配 → Sprint Planning → 任务拆分 → Sprint执行
```

---

## 📂 目录结构

```
domain-model-design/
├── README.md                    # 项目说明
├── QUICK_START_GUIDE.md        # 快速开始
├── Architecture/                # 架构设计文档
│   ├── 00-*.md                 # 业务架构、领域模型
│   ├── 01-07-*.md              # 功能架构设计
│   └── 08-*.md                 # 任务架构设计
├── platform-rd-process/        # 研发流程定义
├── biz-data/                   # 业务数据
│   ├── mock/                   # Mock数据
│   └── *.md                    # 数据设计文档
├── project-manage/             # 项目管理
├── product-backlog/            # 产品Backlog
├── prototype-design/           # 原型设计
└── frontend/                   # 前端代码
├── src/
    │   ├── views/              # 页面组件
    │   ├── types/              # TypeScript类型
    │   ├── stores/             # Pinia状态
    │   └── router/             # 路由配置
    └── public/
```

---

## 🚀 快速开始

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

服务器将启动在: `http://localhost:9080`

### 3. 默认账号
```
用户名: admin
密码: admin123
```

---

## 🎯 核心功能

### 1. PI Planning (程序增量规划)
- PI工作区管理
- 工作项分配
- 依赖和风险管理
- 团队容量规划

### 2. 迭代协同
- Sprint管理
- 任务看板
- 燃尽图
- 每日站会

### 3. 需求管理
- 用户需求
- 特性需求
- 模块需求
- 需求追溯

### 4. 资产管理
- 产品线管理
- 产品特性
- 软件模块
- 资产库

### 5. DevOps集成
- 构建管理
- 发布管理
- 版本管理

### 6. 测试管理
- 测试计划
- 测试用例
- 缺陷管理
- 测试覆盖率

---

## 📊 数据模型

### 核心实体
- **Team**: 团队（responsibleModules绑定）
- **Module**: 软件模块
- **ModuleRequirement**: 模块需求
- **WorkItem**: 工作项（统一需求/Bug/技术债）
- **Task**: 任务（8种类型）
- **Sprint**: 迭代
- **PIPlanning**: PI规划

### 关键关系链
```
Module ←→ Team (responsibleModules)
   ↓
WorkItem (moduleId → assignedTeamId)
   ↓
Task (teamId)
   ↓
Sprint (teamId)
```

---

## 📚 文档索引

### 架构设计
- [业务架构 V3](Architecture/BUSINESS_ARCHITECTURE_V3_REFACTORED.md)
- [领域模型](Architecture/00-DOMAIN_MODEL_DESIGN.md)
- [任务架构](Architecture/08-TASK_BASED_ARCHITECTURE_DESIGN.md)

### 数据设计
- [三域数据架构](biz-data/03-THREE_DOMAINS_DATA_ARCHITECTURE.md)
- [NOA V31业务数据](biz-data/02-NOA_V31_BUSINESS_DATA.md)

### 研发流程
- [PI Planning流程](platform-rd-process/PI_Planning_Process.md)
- [迭代协同流程](platform-rd-process/Sprint_Collaboration_Process.md)

---

## 🔧 技术栈

### 前端
- **框架**: Vue 3.4
- **语言**: TypeScript 5.0
- **构建**: Vite 5.0
- **UI库**: Element Plus 2.4
- **状态管理**: Pinia 2.1
- **路由**: Vue Router 4.2
- **可视化**: Cytoscape.js 3.26

### 开发工具
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky
- **包管理**: npm

---

## 📝 开发规范

### TypeScript类型定义
所有核心实体都有完整的TypeScript类型定义，位于 `frontend/src/types/`

### 组件命名
- 页面组件: PascalCase (如 `UserRequirements.vue`)
- 公共组件: PascalCase (如 `MainLayout.vue`)

### 路由命名
- 路由name: PascalCase (如 `UserRequirements`)
- 路由path: kebab-case (如 `/requirements/user`)

---

## 🐛 问题反馈

如遇问题，请查看:
1. [快速开始指南](QUICK_START_GUIDE.md)
2. [架构文档](Architecture/)
3. [数据设计文档](biz-data/)

---

## 📄 License

MIT License

---

**最后更新**: 2025年1月8日  
**版本**: V1.0
