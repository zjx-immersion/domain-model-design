# 术语调整说明

> **更新日期**: 2025-01-02  
> **调整范围**: 全部设计文档  
> **调整类型**: 需求层次命名优化

---

## 调整概述

根据需求工程最佳实践和领域模型的准确性，我们对三层需求体系中的R1层进行了重要调整：

### 核心变更

```
调整前: R1 - 系统需求层 (System Requirement Layer)
调整后: R1 - 用户需求层 (User Requirement Layer)
```

---

## 调整理由

### 1. 术语准确性

**系统需求 (System Requirement)** 在软件工程中通常指：
- 从技术系统视角定义的需求
- 已经过技术分析和分解的需求
- 系统级的功能性和非功能性规格说明

**用户需求 (User Requirement)** 更准确地描述了R1层的特征：
- 来自用户和干系人的原始需求表达
- 从业务价值和用户价值出发的需求
- 尚未进行技术分解的高层次需求

### 2. 符合需求工程标准

在标准的需求工程体系中，典型的需求层次为：

```
用户需求 (User Requirements)
    ↓ 分解
功能需求 (Functional Requirements)
    ↓ 分解
设计需求 (Design Requirements)
```

或者：

```
业务需求 (Business Requirements)
    ↓ 分解
用户需求 (User Requirements)
    ↓ 分解
系统需求 (System Requirements)
    ↓ 分解
软件需求 (Software Requirements)
```

我们的三层模型中：
- **R1: 用户需求** ≈ 业务需求 + 用户需求
- **R2: 特性需求** ≈ 系统需求（功能层面）
- **R3: 模块需求** ≈ 软件需求（实现层面）

### 3. 与上游系统对接更清晰

```
上游整车系统
├─ 整车需求 (Vehicle Requirements)
├─ 整车功能 (Vehicle Functions)
└─ 用户故事 (User Stories)
        ↓ 输入到平台
━━━━━━━━━━━━━━━━━━━━━━━━━
R1: 用户需求 (User Requirements)
    ↓ 平台内分解
R2: 特性需求 (Feature Requirements)
    ↓ 平台内分配
R3: 模块需求 (Module Requirements)
```

使用"用户需求"更能体现这是从上游用户视角接入的需求。

---

## 详细术语对照表

| 调整项 | 调整前 | 调整后 | 适用范围 |
|--------|--------|--------|---------|
| **层次命名（中文）** | 系统需求层 | 用户需求层 | 所有文档 |
| **层次命名（英文）** | System Requirement Layer | User Requirement Layer | 所有文档 |
| **实体类型（英文）** | SystemRequirement | UserRequirement | 代码、数据模型、API |
| **数据库表名** | system_requirements | user_requirements | 数据库设计 |
| **API路径** | /api/v1/requirements/system | /api/v1/requirements/user | API设计 |
| **图数据库节点** | SystemRequirement | UserRequirement | Neo4j模型 |
| **流程节点** | 创建系统需求 | 创建用户需求 | 流程图 |
| **功能模块** | 系统需求管理 | 用户需求管理 | 功能架构 |

---

## 涉及文档清单

以下文档已完成术语调整：

### ✅ 已更新文档

1. **07-PLATFORM_ARCHITECTURE_DESIGN.md** - 平台架构设计
   - 业务架构中的需求管理能力描述
   - 核心功能模块设计
   - 数据库模型设计
   - API设计
   - 流程图
   
2. **06-AVP_CASE_STUDY.md** - AVP案例研究
   - 需求实例数据
   - 需求流转流程
   - 需求追溯关系
   
3. **01-DOMAIN_MODEL_COMPARISON.md** - 领域模型对比
   - 三层需求体系描述
   - 需求层次定义
   - 关系矩阵

### 📝 待确认文档

以下文档可能也需要检查和更新：
- 02-DATA_RELATIONSHIP_ANALYSIS.md
- 其他相关设计文档

---

## 概念定义更新

### R1: 用户需求层 (User Requirement Layer)

#### 定义
从用户和干系人视角表达的原始需求，描述"需要什么"和"为什么需要"，而不涉及"如何实现"。

#### 来源
1. **整车需求分解**: 从整车产品管理系统输入的需求
2. **干系人需求**: 产品经理、市场人员、用户研究等提出的需求
3. **法规和标准**: 强制性的合规需求
4. **业务目标**: 公司战略和业务目标转化的需求

#### 特征
- **用户视角**: 从用户价值和业务价值出发
- **高层次**: 抽象程度高，不涉及技术实现细节
- **业务语言**: 使用业务术语而非技术术语
- **价值驱动**: 明确需求的商业价值和用户价值

#### 内容要素
```typescript
interface UserRequirement {
  id: string;
  title: string;
  
  // 需求来源
  source: {
    sourceType: "VehicleRequirement" | "StakeholderNeed" | "Regulation" | "BusinessGoal";
    sourceId: string;
    stakeholder: string;
  };
  
  // 需求内容（用户视角）
  description: string;           // 需求描述
  userStory: string;             // 用户故事："作为...我希望...以便..."
  businessValue: string;         // 商业价值
  userValue: string;             // 用户价值
  
  // 验收标准（业务层面）
  acceptanceCriteria: {
    criterion: string;           // 验收标准
    verificationMethod: string;  // 验证方法
  }[];
  
  // 分解关系
  decomposedTo: string[];        // 分解为哪些特性需求
  
  // 目标资产
  targetProduct: string;         // 目标领域产品
}
```

#### 示例
```yaml
用户需求示例:
  ID: UR-NOA-001
  标题: "高速公路需要自动驾驶能力"
  
  用户故事: |
    作为驾驶员
    我希望在高速公路上实现自动驾驶
    以便在长途驾驶中减轻疲劳，提升安全性
  
  业务价值: |
    - 提升产品竞争力
    - 实现差异化卖点
    - 满足L2+级市场需求
  
  用户价值: |
    - 减轻长途驾驶疲劳
    - 提升驾驶安全性
    - 提供便利的出行体验
  
  验收标准:
    - 系统能在60-120km/h速度范围内自动驾驶
    - 驾驶员只需监督系统运行
    - 系统应能自动完成车道保持、跟车、变道等操作
```

---

## R1层与R2层的区别

| 维度 | R1: 用户需求 | R2: 特性需求 |
|------|-------------|-------------|
| **视角** | 用户/业务视角 | 技术/实现视角 |
| **语言** | 业务语言 | 技术语言 |
| **抽象层次** | 高层次、抽象 | 中等层次、具体 |
| **关注点** | 做什么、为什么 | 怎么做 |
| **来源** | 外部输入 | 内部分解 |
| **对应资产** | 领域产品 | 领域特性 |
| **示例** | "需要自动驾驶能力" | "实现高速公路自动变道功能" |

---

## 影响范围分析

### 1. 数据模型影响
- ✅ 数据库表名已更新
- ✅ 字段关系已调整
- ✅ 外键引用已更新

### 2. API接口影响
- ✅ API路径已更新: `/api/v1/requirements/user`
- ✅ 请求响应类型已更新
- ✅ API文档需同步更新

### 3. 前端界面影响
- 需要更新界面文案
- 需要更新表单标签
- 需要更新菜单项

### 4. 业务流程影响
- ✅ 流程图已更新
- ✅ 流程节点命名已调整
- 工作流配置需同步更新

### 5. 集成接口影响
- 与上游整车系统的接口文档需要同步
- 需求导入功能的映射关系需要更新

---

## 实施建议

### 1. 代码实施
```bash
# 数据库迁移
ALTER TABLE system_requirements RENAME TO user_requirements;

# 更新外键引用
ALTER TABLE feature_requirements 
  DROP CONSTRAINT feature_requirements_derived_from_fkey,
  ADD CONSTRAINT feature_requirements_derived_from_fkey 
    FOREIGN KEY (derived_from) REFERENCES user_requirements(id);

# 更新索引
ALTER INDEX idx_sys_req_status RENAME TO idx_user_req_status;
```

### 2. 代码重构
- 重命名类: `SystemRequirement` → `UserRequirement`
- 重命名API路由: `/system` → `/user`
- 更新ORM映射
- 更新GraphQL schema

### 3. 文档同步
- ✅ 设计文档已更新
- API文档需同步
- 用户手册需更新
- 培训材料需更新

### 4. 团队沟通
- 通知所有研发人员
- 更新术语表
- 举办培训会议
- 更新Confluence文档

---

## 总结

这次术语调整是基于以下考虑：

1. **准确性**: 使用"用户需求"更准确地反映R1层的本质特征
2. **标准化**: 符合需求工程的标准术语体系
3. **一致性**: 与上下游系统的术语保持一致
4. **清晰性**: 更清晰地区分不同层次需求的职责边界

这个调整不会改变需求管理的核心逻辑和流程，只是使术语更加规范和易于理解。

---

**更新记录**:
- 2025-01-02: 完成全部设计文档的术语统一调整
- 涉及文档: 07, 06, 01 号设计文档
- 调整项: 系统需求 → 用户需求

**维护者**: Auto DevOps平台架构组  
**联系方式**: devops-platform@company.com

