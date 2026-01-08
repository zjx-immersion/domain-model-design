# 🚀 项目-产品关系改造设计 (v3 架构)

## 📋 目录说明

本目录包含**v3 架构中项目与产品关系的改造设计**，引入车型项目和领域项目概念，完善从项目到交付的端到端流程。

**Git 分支**: `feature/project-product-adjust`

---

## 📊 改造背景

### 当前问题

当前 v3 架构存在以下问题：

1. ❌ **缺少车型项目层级**: 无法管理整车级别的项目
2. ❌ **缺少领域项目层级**: 领域级版本规划无处承载
3. ❌ **产品与项目关系不清**: 项目管理和产品管理混淆
4. ❌ **版本规划位置不当**: 版本管理在产品资产下，而非项目下
5. ❌ **PI Planning 输入不明确**: 缺少项目 Backlog 概念

### 理想场景

```
车型项目成立（上游）
   ↓
智能驾驶领域项目启动
   ↓
产品版本规划
   ↓
PI Planning
   ↓
团队 Backlog
   ↓
迭代划分
```

---

## 📚 文档列表

### [01-CURRENT_STATE_ANALYSIS.md](01-CURRENT_STATE_ANALYSIS.md) ✅

**当前状态分析**

**内容**:
- 现有架构现状
- 存在的问题分析
- 用户理想场景描述
- 核心概念对比
- 缺失实体识别

**关键发现**:
- 缺少 VehicleProject 实体
- 缺少 DomainProject 实体
- 缺少 ProjectBacklog 实体
- 需要调整 Product-Project 关系

---

### [02-NEW_ENTITY_MODEL_DESIGN.md](02-NEW_ENTITY_MODEL_DESIGN.md) ✅

**新实体模型设计**

**内容**:
- 核心实体定义
  - VehicleProject (车型项目)
  - DomainProject (领域项目)
  - ProjectBacklog (项目待办)
  - TeamBacklog (团队待办)
- TypeScript 接口定义
- 关系模型设计
- 数据流设计
- 完整示例数据

**核心设计**:
```
VehicleProject (车型项目)
   ↓ has
DomainProject (领域项目)
   ↓ plans
ProjectVersion (版本规划)
   ↓ based on
PIPlanning (PI 规划)
   ↓ generates
ProjectBacklog (项目待办)
   ↓ feeds into
TeamBacklog (团队待办)
   ↓ executes in
Sprint → Task
```

---

### [03-REFACTORING_PLAN_AND_TASKS.md](03-REFACTORING_PLAN_AND_TASKS.md) ✅

**改造计划与关键任务拆分**

**内容**:
- 改造范围
- 7 个 Phase 的详细计划
- 29 个关键任务拆分
- 时间规划（13.5 天）
- 里程碑定义
- 风险和应对

**Phase 概览**:
- Phase 1: 数据模型设计 (1天) ✅
- Phase 2: TypeScript 类型 (1天)
- Phase 3: Mock 数据 (2天)
- Phase 4: 前端页面 (5天)
- Phase 5: 路由导航 (0.5天)
- Phase 6: 文档更新 (2天)
- Phase 7: 测试验证 (2天)

---

## 🎯 核心改进

### 新增实体

1. **VehicleProject** (车型项目)
   - 整车级别的项目管理
   - 跨领域协调
   - 车型交付目标

2. **DomainProject** (领域项目)
   - 技术领域的项目管理
   - 版本规划
   - PI Planning 归属

3. **ProjectBacklog** (项目待办)
   - PI Planning 输出
   - 团队工作项来源

4. **TeamBacklog** (团队待办)
   - 团队工作项池
   - Sprint 输入来源

### 关系调整

```
调整前:
Product → PI Planning → Sprint

调整后:
VehicleProject → DomainProject → ProjectVersion
                                     ↓
                              PI Planning
                                     ↓
                             ProjectBacklog
                                     ↓
                              TeamBacklog
                                     ↓
                                  Sprint
```

---

## 📊 改造范围

### 涉及层次

```
1. 数据模型层
   ├─ TypeScript 类型定义
   ├─ Mock 数据结构
   └─ 数据关系调整

2. 业务逻辑层
   ├─ 项目管理逻辑
   ├─ Backlog 管理逻辑
   └─ 工作项分配逻辑

3. 前端展示层
   ├─ 项目管理页面 (新增)
   ├─ Backlog 管理页面 (新增)
   └─ 现有页面调整

4. 文档层
   ├─ 架构设计文档更新
   ├─ 数据关系文档更新
   └─ 用户指南更新
```

---

## 🗺️ 实施路线图

### Week 1: 基础建设
- Day 1: ✅ 设计完成
- Day 2: TypeScript 类型定义
- Day 3-4: Mock 数据准备
- Day 5: 车型项目页面

### Week 2: 核心功能
- Day 6-8: 领域项目和 Backlog 页面
- Day 9: 路由和导航
- Day 10: 文档更新开始

### Week 3: 完善和测试
- Day 11-12: 文档更新完成
- Day 13-14: 测试和验证

**总耗时**: 13.5 天 (约 3 周)

---

## 📦 交付物清单

### 代码交付物
- [x] TypeScript 类型定义 (4 个文件)
- [x] Mock 数据 (5 个文件)
- [x] 前端页面组件 (10+ 个)
- [x] 路由配置更新
- [x] 导航菜单更新

### 文档交付物
- [x] 当前状态分析 ✅
- [x] 新实体模型设计 ✅
- [x] 改造计划与任务拆分 ✅
- [x] 架构文档更新
- [x] 数据关系文档更新
- [x] 用户指南更新
- [x] 迁移指南

### 数据交付物
- [x] 车型项目数据 (3-5 个)
- [x] 领域项目数据 (8-10 个)
- [x] 项目版本数据 (15-20 个)
- [x] Project Backlog 数据
- [x] Team Backlog 数据

---

## 🎯 关键任务

### 优先级 P0 (Critical)

1. **TypeScript 类型定义**
   - VehicleProject, DomainProject 接口
   - ProjectBacklog, TeamBacklog 接口
   - 估时: 1 天

2. **Mock 数据准备**
   - 车型项目、领域项目数据
   - Backlog 数据
   - 估时: 2 天

3. **核心页面实现**
   - DomainProjectDetail 页面
   - ProjectBacklog 页面
   - TeamBacklog 页面
   - 估时: 6 天

4. **测试验证**
   - 数据流测试
   - 集成测试
   - 估时: 2 天

---

## 📅 里程碑

| 里程碑 | 日期 | 交付物 | 状态 |
|--------|------|--------|------|
| M1: 设计完成 | Day 1 | 设计文档 | ✅ 完成 |
| M2: 类型定义完成 | Day 2 | TypeScript 类型 | ⏳ 待完成 |
| M3: Mock 数据完成 | Day 4 | Mock 数据 | ⏳ 待完成 |
| M4: 核心页面完成 | Day 10 | 页面组件 | ⏳ 待完成 |
| M5: 集成完成 | Day 11 | 路由导航 | ⏳ 待完成 |
| M6: 文档完成 | Day 13 | 文档 | ⏳ 待完成 |
| M7: 测试完成 | Day 14 | 测试报告 | ⏳ 待完成 |

---

## 🚦 当前状态

**Phase 1**: ✅ 完成  
**当前**: 设计文档已完成，待开始实施

**下一步**: 
1. Review 设计文档
2. 开始 Phase 2: TypeScript 类型定义
3. 准备 Mock 数据

---

## 📖 阅读顺序（推荐）

### 快速了解 (15分钟)
1. 本 README
2. [01-CURRENT_STATE_ANALYSIS.md](01-CURRENT_STATE_ANALYSIS.md) - 问题分析

### 深入理解 (1小时)
1. [02-NEW_ENTITY_MODEL_DESIGN.md](02-NEW_ENTITY_MODEL_DESIGN.md) - 实体模型
2. [03-REFACTORING_PLAN_AND_TASKS.md](03-REFACTORING_PLAN_AND_TASKS.md) - 实施计划

### 开始实施
按照 Phase 2-7 的任务清单逐步执行

---

## 🔗 相关资源

### 项目文档
- **Architecture v2**: `../Architecture/v2/`
- **当前业务架构**: `../Architecture/v2/01-business/BUSINESS_ARCHITECTURE_V3.md`
- **当前领域模型**: `../Architecture/v2/02-domain/DOMAIN_MODEL_DESIGN.md`
- **当前任务架构**: `../Architecture/v2/04-task/TASK_BASED_ARCHITECTURE.md`

### GitHub
- **仓库**: https://github.com/zjx-immersion/domain-model-design
- **分支**: `feature/project-product-adjust`

---

## 💡 设计原则

1. **保持向下兼容**: 现有产品资产管理保持不变
2. **渐进式改进**: 不影响现有功能
3. **数据完整性**: 确保数据关系正确
4. **用户体验**: 流程更清晰，操作更便捷
5. **可扩展性**: 易于后续扩展

---

## ❓ 常见问题

### Q1: 为什么需要车型项目？
**A**: 车型项目是整车级别的项目，涉及多个技术领域的协调和集成，是实际汽车行业的真实需求。

### Q2: 领域项目和产品是什么关系？
**A**: 领域项目是临时性的、有目标的活动，一个领域项目可以包含多个产品的版本开发。产品是长期性的资产。

### Q3: PI Planning 归属谁？
**A**: PI Planning 归属于领域项目，一个领域项目有多个 PI。

### Q4: ProjectBacklog 和 TeamBacklog 有什么区别？
**A**: ProjectBacklog 是 PI Planning 的输出，包含所有工作项。TeamBacklog 是团队从 ProjectBacklog 拉取的工作项，是团队的工作池。

### Q5: 这次改造会影响现有功能吗？
**A**: 不会。改造是增量式的，现有产品资产管理、Sprint 执行等功能保持不变，只是增加了项目管理层。

---

## 📞 联系方式

如有问题或建议，请：
1. 查看详细设计文档
2. 提交 Issue 到 GitHub
3. 联系项目负责人

---

**创建时间**: 2025-01-08  
**Git 分支**: `feature/project-product-adjust`  
**状态**: 📋 设计完成，待开始实施  
**预计完成**: 2025-01-31

