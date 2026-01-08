# 📊 业务数据集

## 📋 说明

本目录包含领域模型设计平台的**完整业务数据**，覆盖智能驾驶、智能座舱、电子电器架构三大领域。

---

## 📄 数据架构文档

### [03-THREE_DOMAINS_DATA_ARCHITECTURE.md](03-THREE_DOMAINS_DATA_ARCHITECTURE.md)

**内容**:
- 三域数据架构设计
- 产品线-产品-特性-模块四层架构
- 数据关系和追溯链
- 业务数据规范

---

## 🗂️ Mock 数据结构

```
mock/
├── asset/                    # 资产数据
│   ├── features.json         # 特性数据
│   ├── features-extended.json
│   ├── modules.json          # 模块数据
│   ├── modules-extended.json
│   ├── product-lines.json    # 产品线数据
│   └── relationships.json    # 关系数据
│
├── requirement/              # 需求数据
│   ├── user-requirements.json
│   ├── feature-requirements.json
│   ├── module-requirements.json
│   ├── traceability.json
│   └── ...
│
├── project/                  # 项目数据
│   ├── pi-details.json
│   ├── team-planning.json
│   ├── dependencies.json
│   └── risks.json
│
├── sprint/                   # 迭代数据
│   ├── sprint-details.json
│   ├── tasks.json
│   ├── commits.json
│   └── ...
│
├── release/                  # 版本发布
│   ├── releases.json
│   └── baselines.json
│
├── devops/                   # DevOps
│   ├── builds.json
│   ├── releases.json
│   └── ...
│
├── test/                     # 测试数据
│   ├── test-plans.json
│   ├── test-cases.json
│   ├── defects.json
│   └── ...
│
├── analytics/                # 分析数据
│   ├── value-stream.json
│   ├── quality.json
│   └── ...
│
└── ...
```

---

## 🎯 三大领域数据

### 1. 智能驾驶领域 (Intelligent Driving)

**产品线**: 智能驾驶产品线

**产品**:
- NOA (高速/城区领航辅助驾驶)
- 智能泊车系统
- 智能召唤系统

**特性**:
- 融合感知
- 决策规划
- 车辆控制
- 高精地图
- V2X 通信

**模块**: 81+ 个软件模块

**需求**: 40+ 个模块需求

---

### 2. 智能座舱领域 (Intelligent Cockpit)

**产品线**: 智能座舱产品线

**产品**:
- 智能语音助手
- 3D仪表系统
- 手势控制系统

**特性**:
- 语音识别
- 语音合成
- 3D显示引擎
- 手势识别

**模块**: 相关软件模块

**需求**: 相关需求

---

### 3. 电子电器架构 (Electrical Architecture)

**产品线**: 电子电器架构产品线

**产品**:
- 域控制器
- 中央网关
- 车载以太网

**特性**:
- 通信协议
- 电源管理
- 网络拓扑

**模块**: 相关软件模块

**需求**: 相关需求

---

## 📊 数据统计

- **产品线**: 3 条
- **产品**: 9 个
- **特性**: 40+ 个
- **模块**: 100+ 个
- **需求**: 100+ 个
- **Mock 数据文件**: 50+ 个

---

## 🔗 数据关联

### 四层资产架构
```
产品线 (Product Line)
   ↓ has
产品 (Product)
   ↓ has
特性 (Feature)
   ↓ has
模块 (Module)
```

### 需求分解
```
用户需求 (User Requirement)
   ↓ satisfy
特性需求 (Feature Requirement)
   ↓ decompose
模块需求 (Module Requirement)
   ↓ split
任务 (Task)
```

### 追溯链
```
用户需求 → 特性需求 → 模块需求 → 工作项 → 任务 → Sprint → 提交 → 构建 → 测试 → 发布
```

---

## 🔧 使用方式

### 前端使用
```typescript
// 导入数据
import featuresData from '@/biz-data/mock/asset/features.json'
import modulesData from '@/biz-data/mock/asset/modules.json'

// 使用数据
const features = featuresData.data
const modules = modulesData.data
```

### 数据格式
所有 Mock 数据统一格式：
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "pageSize": 50
  }
}
```

---

## 📝 数据说明

### 特性数据 (features.json)
```json
{
  "id": "FT-AD-001",
  "name": "融合感知",
  "productId": "PROD-AD-NOA",
  "moduleIds": ["MOD-001", "MOD-002"],
  "requirementCount": 5
}
```

### 模块数据 (modules.json)
```json
{
  "id": "MOD-001",
  "name": "摄像头感知模块",
  "featureId": "FT-AD-001",
  "responsibleTeam": "TEAM-001",
  "requirementCount": 3
}
```

---

## 🔗 相关文档

- **三域数据架构**: [03-THREE_DOMAINS_DATA_ARCHITECTURE.md](03-THREE_DOMAINS_DATA_ARCHITECTURE.md)
- **数据关系分析**: [../DATA_RELATIONSHIP_ANALYSIS.md](../DATA_RELATIONSHIP_ANALYSIS.md)
- **领域模型**: [../../02-domain/DOMAIN_MODEL_DESIGN.md](../../02-domain/DOMAIN_MODEL_DESIGN.md)

---

**最后更新**: 2025-01-08  
**数据版本**: v1.0

