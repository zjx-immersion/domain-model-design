# 📋 当前状态分析 - 项目与产品关系

## 📅 分析日期
**2025-01-08**

---

## 🎯 分析目标

分析当前 v3 架构中**项目（Project）与产品（Product）的关系**，识别问题并提出改进方案。

---

## 📊 当前架构现状

### 现有模型关系

```
组织层（缺失明确定义）
   ↓
产品线 (ProductLine)
   ↓
产品 (Product)
   ↓
特性 (Feature)
   ↓
模块 (Module) ←→ 团队 (Team)
   ↓
PI Planning ← 工作项池
   ↓
Sprint → 任务
```

---

## ❌ 当前存在的问题

### 问题1: 缺少车型项目层级 🚗

**现状**:
- 没有明确的"车型项目"概念
- 车型级别的协调和规划无法体现

**影响**:
- 无法管理整车级别的项目
- 跨领域协调困难
- 车型交付目标不清晰

**实际场景**:
```
某车型项目（如：2025款智驾车型）
   ├─ 智能驾驶项目
   ├─ 智能座舱项目
   ├─ 电子电器项目
   └─ 其他系统项目
```

---

### 问题2: 缺少领域项目层级 🎯

**现状**:
- 直接从产品到 PI Planning
- 缺少"领域项目"（如智能驾驶项目）的概念

**影响**:
- 领域级别的版本规划无处承载
- 跨产品的协调和集成困难
- 无法体现领域项目的生命周期

**实际场景**:
```
智能驾驶领域项目
   ├─ NOA 产品
   ├─ 泊车产品
   └─ 召唤产品
   
每个领域项目有自己的：
   • 版本规划
   • PI Planning
   • 团队组织
   • 交付里程碑
```

---

### 问题3: 产品与项目关系不清晰 🔗

**现状**:
- 产品 (Product) 是资产管理概念
- 没有明确的项目 (Project) 概念
- PI Planning 直接与产品线关联

**影响**:
- 项目管理和产品管理混淆
- 无法管理临时性的项目活动
- 跨产品的集成项目无法管理

---

### 问题4: 版本规划位置不当 📦

**现状**:
- 版本管理在产品资产下
- 缺少项目级别的版本规划

**影响**:
- 无法做领域级别的版本规划
- 产品版本和项目交付脱节
- PI Planning 的版本目标不清晰

---

### 问题5: PI Planning 输入不明确 📥

**现状**:
- PI Planning 直接从特性需求开始
- 没有明确的项目 Backlog 概念

**影响**:
- 需求来源不清晰
- 项目优先级无法体现
- 团队 Backlog 输入不规范

---

## 🎯 用户描述的理想场景

### 完整流程

```
1️⃣ 车型项目成立（上游）
   例：2025款智驾车型项目
   
   ↓
   
2️⃣ 智能驾驶领域项目启动
   例：智能驾驶 V3.1 项目
   - 明确要做哪些产品
   - 明确版本目标
   
   ↓
   
3️⃣ 产品版本规划
   基于项目目标，规划产品版本：
   - NOA V3.1
   - 泊车 V2.0
   - 召唤 V1.5
   
   ↓
   
4️⃣ PI Planning
   基于版本规划，进行 PI Planning：
   - 将特性需求分解到 PI
   - 将模块需求分配给团队
   - 形成 PI 目标
   
   ↓
   
5️⃣ 团队 Backlog
   PI Planning 结果输入到团队 Backlog：
   - 按团队组织
   - 按模块组织
   - 形成工作项池
   
   ↓
   
6️⃣ 迭代划分
   团队从 Backlog 拉取工作项到 Sprint：
   - Sprint Planning
   - 任务拆分
   - 迭代执行
```

---

## 📊 关键概念对比

### 当前 vs 理想

| 概念 | 当前状态 | 理想状态 |
|------|----------|----------|
| **车型项目** | ❌ 不存在 | ✅ VehicleProject 实体 |
| **领域项目** | ❌ 不存在 | ✅ DomainProject 实体 |
| **产品** | ✅ 资产概念 | ✅ 保持不变 |
| **版本规划** | ⚠️ 在产品下 | ✅ 在项目下 |
| **PI Planning** | ⚠️ 独立 | ✅ 归属项目 |
| **团队 Backlog** | ❌ 不明确 | ✅ ProjectBacklog 实体 |
| **迭代** | ✅ Sprint | ✅ 保持不变 |

---

## 🏗️ 核心问题总结

### 缺失的实体

1. **VehicleProject** (车型项目)
2. **DomainProject** (领域项目)
3. **ProjectBacklog** (项目待办)
4. **ProjectVersion** (项目版本)

### 需要调整的关系

1. **Product → Project** 关系
2. **Project → PI Planning** 关系
3. **PI Planning → Team Backlog** 关系
4. **Version → Project** 关系

---

## 📈 层级关系梳理

### 理想的层级关系

```
🏢 组织层
   ├─ Company (公司)
   ├─ BusinessUnit (事业部)
   └─ Department (部门)
      └─ Team (团队)

🚗 车型项目层
   VehicleProject (车型项目)
      例：2025款智驾车型
      
      ↓ has
      
🎯 领域项目层
   DomainProject (领域项目)
      例：智能驾驶 V3.1 项目
      
      ↓ includes
      
📦 产品层（资产）
   ProductLine → Product → Feature → Module
   
   ↓ plans
   
📋 项目规划层
   ProjectVersion (项目版本规划)
      ↓ based on
   PI Planning (程序增量规划)
      ↓ generates
   ProjectBacklog (项目待办)
      ↓ feeds into
   TeamBacklog (团队待办)
   
   ↓ executes in
   
🔄 执行层
   Sprint → Task
```

---

## 🔍 需要回答的关键问题

### Q1: 项目与产品是什么关系？
**答**: 
- 项目是临时性的、有目标的活动
- 产品是长期性的、持续演进的资产
- **一个项目可以包含多个产品的版本开发**
- **一个产品可以在多个项目中演进**

### Q2: 车型项目和领域项目是什么关系？
**答**:
- 车型项目是整车级别的项目
- 领域项目是某个技术领域的项目
- **车型项目包含多个领域项目**
- **领域项目为车型项目交付**

### Q3: PI Planning 归属谁？
**答**:
- **PI Planning 归属于领域项目**
- 一个领域项目有多个 PI
- 一个 PI 对应一个时间盒（如 10-12 周）

### Q4: 版本规划在哪里？
**答**:
- **版本规划在领域项目层面**
- 一个领域项目规划多个产品版本
- 产品版本作为 PI Planning 的目标

### Q5: 团队 Backlog 如何形成？
**答**:
- PI Planning 产生工作项
- **工作项进入 ProjectBacklog**
- **团队从 ProjectBacklog 拉取到 TeamBacklog**
- Sprint Planning 从 TeamBacklog 拉取到 Sprint

---

## 📝 下一步行动

1. ✅ 完成当前状态分析
2. ⏭️ 设计新的实体模型
3. ⏭️ 设计关系模型
4. ⏭️ 设计数据流程
5. ⏭️ 制定迁移计划
6. ⏭️ 拆分实施任务

---

## 🔗 相关文档

- **当前领域模型**: `Architecture/v2/02-domain/DOMAIN_MODEL_DESIGN.md`
- **当前任务架构**: `Architecture/v2/04-task/TASK_BASED_ARCHITECTURE.md`
- **当前业务架构**: `Architecture/v2/01-business/BUSINESS_ARCHITECTURE_V3.md`

---

**分析完成时间**: 2025-01-08  
**下一步**: 设计新的实体模型

