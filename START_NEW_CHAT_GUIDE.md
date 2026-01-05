# 新Chat启动指南

> **快速参考**: 在新chat中继续开发的简明指南

---

## 🚀 快速开始（3步）

### Step 1: 告诉AI阅读上下文（30秒）

```
请阅读 @PROJECT_CONTEXT_SUMMARY.md 了解项目完整状态，然后继续开发。
```

### Step 2: 选择工作方向（10秒）

**选项A**: 继续完成文档
```
继续完成Phase 3-4实施指南（DevOps与测试 + 数据分析与系统）
```

**选项B**: 开始实施开发
```
开始实施Phase 1-2的前端开发（31个页面 + Mock数据）
参考文档：
- @PHASE1_COMPLETE_GUIDE.md
- @PHASE2_COMPLETE_GUIDE.md
```

**选项C**: 混合方式
```
先完成Phase 3-4文档，然后开始Phase 1-4全量开发
```

### Step 3: 开始工作

AI会根据你的选择继续工作。

---

## 📋 项目当前状态（v2.12.1）

| 维度 | 状态 |
|------|------|
| **设计文档** | 100% ✅ |
| **Phase 1-2实施指南** | 100% ✅ |
| **Phase 3-4实施指南** | 0% 📋 |
| **前端页面** | 26%（19/74）⚠️ |
| **Mock数据** | 11%（4/36）⚠️ |

---

## 📚 核心文档（必读）

### 上下文文档
- **📄 `PROJECT_CONTEXT_SUMMARY.md`** - 完整项目上下文（本次创建）⭐

### 实施指南
- **📄 `PHASE1_COMPLETE_GUIDE.md`** - Phase 1实施指南（~1000行）⭐
- **📄 `PHASE2_COMPLETE_GUIDE.md`** - Phase 2实施指南（~900行）⭐
- **📄 `FRONTEND_IMPLEMENTATION_PLAN.md`** - 前端总体规划⭐

### 设计文档
- `Architecture/01-BUSINESS_ARCHITECTURE.md` - 业务架构
- `platform-rd-process/03-TRACEABILITY_AND_VALUE_NETWORK.md` - 追溯设计
- `prototype-design/07-INTEGRATED_PROTOTYPE_DESIGN.md` - 完整原型

---

## 🎯 推荐的下一步

### 最推荐：完成Phase 3-4文档 ✅

**理由**:
- 保持一致的文档驱动策略
- 完成所有74个页面的技术方案
- 便于统一规划开发工作

**预计时间**: 3-4小时

**产出**:
- Phase 3实施指南（12页面）
- Phase 4实施指南（8页面）
- 所有Mock数据结构设计

### 次推荐：开始Phase 1-2开发

**理由**:
- Phase 1-2文档已完成
- 可以立即开始开发
- 完成后有54个可用页面

**预计时间**: 12-16小时（团队并行）

**产出**:
- 31个Vue组件
- 10个Mock数据文件
- TypeScript类型文件
- Mock Service扩展

---

## 💡 在新Chat中的提示词模板

### 模板1: 继续完成文档

```
你好！我是智能驾驶研发价值流管理平台项目的开发者。

请先阅读 @PROJECT_CONTEXT_SUMMARY.md 了解项目完整状态。

当前状态：
- Phase 1-2实施指南已完成（31个页面）
- Phase 3-4实施指南待完成（20个页面）

请继续完成Phase 3-4的完整实施指南，包括：
1. Phase 3: DevOps与测试（12页面，48 SP）
   - Week 6-7: DevOps流水线（6页面）
   - Week 8: 测试管理（6页面）

2. Phase 4: 数据分析与系统（8页面，32 SP）
   - Week 9-10: 数据分析与系统（8页面）

参考文档：
- @PHASE1_COMPLETE_GUIDE.md
- @PHASE2_COMPLETE_GUIDE.md
- @FRONTEND_IMPLEMENTATION_PLAN.md

请保持与Phase 1-2相同的文档结构和质量标准。
```

### 模板2: 开始实施开发

```
你好！我是智能驾驶研发价值流管理平台项目的开发者。

请先阅读 @PROJECT_CONTEXT_SUMMARY.md 了解项目完整状态。

当前状态：
- Phase 1-2实施指南已完成（100%）
- 需要创建31个实际的Vue组件和10个Mock数据文件

请开始Phase 1-2的实际开发，包括：
1. 创建15个Phase 1页面（资产与需求管理）
2. 创建16个Phase 2页面（项目与协同管理）
3. 创建所有Mock数据文件
4. 创建TypeScript类型文件
5. 扩展Mock Service
6. 更新路由配置

参考文档：
- @PHASE1_COMPLETE_GUIDE.md
- @PHASE2_COMPLETE_GUIDE.md

请严格按照实施指南中的代码模板创建文件。
```

### 模板3: 混合策略

```
你好！我是智能驾驶研发价值流管理平台项目的开发者。

请先阅读 @PROJECT_CONTEXT_SUMMARY.md 了解项目完整状态。

请采用混合策略：
1. 先完成Phase 3-4实施指南（3-4小时）
2. 然后开始Phase 1-4全量开发（20-25小时）

这样我们将拥有：
- 所有74个页面的完整技术方案
- 所有36个Mock数据的完整设计
- 可以统一规划和并行开发

参考文档：
- @PHASE1_COMPLETE_GUIDE.md
- @PHASE2_COMPLETE_GUIDE.md
- @FRONTEND_IMPLEMENTATION_PLAN.md

请开始第1步：完成Phase 3-4实施指南。
```

---

## 🔧 团队协作模式

### 多人并行开发（推荐）

**团队分工**:
```
开发者A: Phase 1资产管理（7页面）
开发者B: Phase 1需求管理（8页面）
开发者C: Phase 2 PI Planning（5页面）
开发者D: Phase 2 Sprint协同（11页面）
```

**协作流程**:
```
1. 所有人阅读实施指南
2. 分配任务模块
3. 并行开发（3-4天）
4. 代码Review
5. 集成测试
```

**预计时间**: 3-4天（4人并行）

---

## ⚠️ 注意事项

### 1. 代码模板位置
所有代码模板都在Phase 1-2实施指南中，**不是实际文件**，需要手动创建。

### 2. Mock数据结构
所有Mock数据结构都在实施指南中有完整JSON示例，需要创建实际JSON文件。

### 3. 前端目录结构
```
frontend/src/
├── views/          # 页面组件（创建在这里）
├── types/          # TypeScript类型（创建在这里）
├── services/       # Mock Service（扩展这里）
└── router/         # 路由配置（更新这里）
```

### 4. Mock数据目录结构
```
biz-data/mock/
├── asset/          # ✅ 已完成（4个文件）
├── requirement/    # 📋 待创建
├── project/        # 📋 待创建
├── sprint/         # 📋 待创建
├── devops/         # 📋 待创建
├── test/           # 📋 待创建
├── analytics/      # 📋 待创建
└── system/         # 📋 待创建
```

---

## 📊 进度跟踪

### Phase 1: 资产与需求管理
- [ ] Week 1: 资产管理（7页面）
- [ ] Week 2: 需求管理（8页面）
- [ ] Mock数据（8个文件，4个已完成）
- [ ] TypeScript类型（asset.ts, requirement.ts）

### Phase 2: 项目与协同管理
- [ ] Week 3: PI Planning深化（5页面）
- [ ] Week 4-5: Sprint协同（11页面）
- [ ] Mock数据（10个文件）
- [ ] TypeScript类型（project.ts扩展, sprint.ts）

### Phase 3: DevOps与测试
- [ ] 文档未完成
- [ ] 开发未开始

### Phase 4: 数据分析与系统
- [ ] 文档未完成
- [ ] 开发未开始

---

## 🎉 最后

**准备就绪！** 🚀

选择一个方向，复制对应的提示词模板，在新chat中开始工作吧！

---

**📄 配套文档**: `PROJECT_CONTEXT_SUMMARY.md`  
**📅 创建日期**: 2025-01-05  
**🏷️ 版本**: v2.12.1  
**✅ 状态**: 新chat启动指南完成


