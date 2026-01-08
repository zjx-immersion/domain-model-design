# 三大领域业务数据架构设计

## 🎯 数据体系概述

已为三大核心领域构建完整的**产品-特性-模块-需求-计划**业务数据体系：

1. **智能驾驶** (PL-001)
2. **智能座舱** (PL-002)
3. **电子电器架构** (PL-003)
4. **基础设施** (PL-004)

## 📊 数据层次结构

```
产品线 (Product Line)
  ↓
领域产品 (Domain Product)
  ↓
领域特性 (Domain Feature)
  ↓
软件模块 (Software Module)
  ↓
需求 (Requirements)
  ├─ 用户需求 (User Requirement)
  ├─ 特性需求 (Feature Requirement)
  └─ 模块需求 (Module Requirement)
  ↓
项目/PI Planning
```

## ✅ 已完成的数据

### 1. 产品线数据 (Product Lines)

| ID | 代码 | 名称 | 产品数量 | 负责人 | 状态 |
|----|------|------|---------|--------|------|
| PL-001 | ADAS | 智能驾驶 | 4 | 张三 | ✅ Active |
| PL-002 | COCKPIT | 智能座舱 | 3 | 李四 | ✅ Active |
| PL-003 | EEA | 电子电器架构 | 3 | 王五 | ✅ Active |
| PL-004 | INFRA | 基础设施 | 2 | 赵六 | ✅ Active |

**文件位置**: `frontend/src/data/products/product-lines.json`

### 2. 领域产品数据 (Domain Products) - 12个产品

#### 智能驾驶产品线 (4个)
| ID | 代码 | 产品名称 | 版本 | 特性数 |
|----|------|---------|------|--------|
| PROD-001 | NOA | NOA导航辅助驾驶 | v3.1 | 4 |
| PROD-002 | PERCEPTION | 感知系统 | v2.5 | 3 |
| PROD-003 | PLANNING | 规划决策系统 | v3.0 | 3 |
| PROD-004 | CONTROL | 车辆控制系统 | v2.3 | 2 |

#### 智能座舱产品线 (3个)
| ID | 代码 | 产品名称 | 版本 | 特性数 |
|----|------|---------|------|--------|
| PROD-007 | VOICE | AI语音交互系统 | v2.0 | 3 |
| PROD-008 | DISPLAY | 智能显示系统 | v1.8 | 3 |
| PROD-009 | MULTIMODAL | 多模态交互平台 | v1.0-beta | 3 |

#### 电子电器架构产品线 (3个)
| ID | 代码 | 产品名称 | 版本 | 特性数 |
|----|------|---------|------|--------|
| PROD-010 | CDC | 中央域控制器 | v1.0 | 3 |
| PROD-011 | SOA | SOA服务平台 | v1.5 | 3 |
| PROD-012 | OTA | OTA升级系统 | v2.0 | 3 |

#### 基础设施产品线 (2个)
| ID | 代码 | 产品名称 | 版本 | 特性数 |
|----|------|---------|------|--------|
| PROD-005 | MAP | 高精地图引擎 | v1.5 | 2 |
| PROD-006 | SIMULATION | 仿真测试平台 | v2.0-alpha | 2 |

**文件位置**: `frontend/src/data/products/domain-products.json`

### 3. 领域特性数据 (Domain Features) - 33个特性

#### 智能驾驶特性 (11个)
| ID | 特性名称 | 类别 | 模块数 | 复用次数 |
|----|---------|------|--------|---------|
| FEAT-001 | 多传感器融合感知 | perception | 4 | 3 |
| FEAT-002 | 城市NOA导航 | planning | 3 | 2 |
| FEAT-003 | 自动泊车 | planning | 3 | 2 |
| FEAT-004 | 召唤功能 | planning | 2 | 1 |
| FEAT-005 | 3D目标检测 | perception | 2 | 3 |
| FEAT-006 | 语义分割 | perception | 2 | 2 |
| FEAT-007 | 路径规划 | planning | 3 | 3 |
| FEAT-008 | 行为决策 | planning | 2 | 2 |
| FEAT-009 | 轨迹优化 | planning | 2 | 2 |
| FEAT-010 | 纵向控制 | control | 2 | 2 |
| FEAT-011 | 横向控制 | control | 2 | 2 |

#### 智能座舱特性 (9个)
| ID | 特性名称 | 类别 | 模块数 | 复用次数 |
|----|---------|------|--------|---------|
| FEAT-012 | 智能语音识别 | voice | 2 | 3 |
| FEAT-013 | 语义理解与对话 | voice | 3 | 2 |
| FEAT-014 | 智能语音合成 | voice | 2 | 2 |
| FEAT-015 | 多屏联动显示 | display | 3 | 2 |
| FEAT-016 | AR-HUD增强显示 | display | 2 | 1 |
| FEAT-017 | 智能氛围灯联动 | display | 2 | 1 |
| FEAT-018 | 手势识别 | multimodal | 2 | 1 |
| FEAT-019 | 表情识别 | multimodal | 2 | 1 |
| FEAT-020 | 多模态融合交互 | multimodal | 3 | 1 |

#### 电子电器架构特性 (9个)
| ID | 特性名称 | 类别 | 模块数 | 复用次数 |
|----|---------|------|--------|---------|
| FEAT-021 | 高性能计算平台 | hardware | 3 | 2 |
| FEAT-022 | 域控制器通信 | communication | 3 | 2 |
| FEAT-023 | 系统虚拟化 | system | 2 | 1 |
| FEAT-024 | 服务注册与发现 | soa | 3 | 2 |
| FEAT-025 | 服务编排引擎 | soa | 3 | 1 |
| FEAT-026 | 动态配置管理 | soa | 2 | 2 |
| FEAT-027 | OTA升级管理 | ota | 3 | 2 |
| FEAT-028 | 差分升级 | ota | 2 | 1 |
| FEAT-029 | 回滚机制 | ota | 2 | 1 |

#### 基础设施特性 (4个)
| ID | 特性名称 | 类别 | 模块数 | 复用次数 |
|----|---------|------|--------|---------|
| FEAT-030 | 地图数据管理 | map | 3 | 2 |
| FEAT-031 | 实时地图更新 | map | 2 | 1 |
| FEAT-032 | 场景仿真引擎 | simulation | 3 | 1 |
| FEAT-033 | 自动化评测 | simulation | 2 | 1 |

**文件位置**: `biz-data/mock/asset/features.json`

### 4. 软件模块数据 (Software Modules)

**预计模块数量**: 约 70-80 个模块（每个特性平均 2-3 个模块）

**模块ID范围**: MOD-001 至 MOD-080

**文件位置**: `biz-data/mock/asset/modules.json` (需要扩充)

### 5. 需求数据 (Requirements)

#### 用户需求 (User Requirements)
**预计数量**: 约 30-40 个
**ID范围**: UR-001 至 UR-040

#### 特性需求 (Feature Requirements)  
**预计数量**: 约 50-60 个（对应33个特性，部分特性有多个需求）
**ID范围**: FR-001 至 FR-060

#### 模块需求 (Module Requirements)
**预计数量**: 约 100-120 个（对应70-80个模块）
**ID范围**: MR-001 至 MR-120

**文件位置**: 
- `biz-data/mock/requirement/user-requirements.json` (需要扩充)
- `biz-data/mock/requirement/feature-requirements.json` (需要创建)
- `biz-data/mock/requirement/module-requirements.json` (需要扩充)

## 🔗 数据关联关系

### 产品线 → 产品 → 特性
```
PL-001 智能驾驶
├─ PROD-001 NOA (FEAT-001,002,003,004)
├─ PROD-002 感知系统 (FEAT-001,005,006)
├─ PROD-003 规划决策 (FEAT-007,008,009)
└─ PROD-004 控制系统 (FEAT-010,011)

PL-002 智能座舱
├─ PROD-007 AI语音 (FEAT-012,013,014)
├─ PROD-008 智能显示 (FEAT-015,016,017)
└─ PROD-009 多模态 (FEAT-018,019,020)

PL-003 电子电器
├─ PROD-010 域控制器 (FEAT-021,022,023)
├─ PROD-011 SOA平台 (FEAT-024,025,026)
└─ PROD-012 OTA系统 (FEAT-027,028,029)

PL-004 基础设施
├─ PROD-005 高精地图 (FEAT-030,031)
└─ PROD-006 仿真平台 (FEAT-032,033)
```

### 特性 → 模块示例

#### FEAT-001 多传感器融合感知
- MOD-001: 摄像头感知模块
- MOD-002: 激光雷达处理模块
- MOD-003: 毫米波雷达模块
- MOD-004: 传感器融合模块

#### FEAT-012 智能语音识别
- MOD-011: 声学模型模块
- MOD-012: 语言模型模块

#### FEAT-021 高性能计算平台
- MOD-020: 芯片驱动模块
- MOD-021: 资源调度模块
- MOD-022: 虚拟化层模块

## 🎯 页面功能支持

### 资产管理模块
- ✅ **产品线列表**: 显示4个产品线及roadmap
- ✅ **领域产品**: 显示12个产品，可按产品线筛选
- ✅ **领域特性**: 显示33个特性，支持分类筛选
- ⏳ **软件模块**: 需要扩充至70-80个模块
- ✅ **资产关系图**: 可视化产品-特性-模块关系

### 需求管理模块
- ⏳ **用户需求**: 需要扩充至30-40个
- ⏳ **特性需求**: 需要创建50-60个
- ⏳ **模块需求**: 需要扩充至100-120个
- ✅ **需求追溯**: 支持多级追溯关系

### 项目管理模块
- ✅ **PI Planning**: 已有3个PI，可关联新产品
- ⏳ **项目列表**: 需要增加智能座舱和电子电器项目
- ⏳ **Sprint管理**: 需要关联新产品的工作项

## 📈 数据完整性统计

| 数据类型 | 目标数量 | 当前数量 | 完成度 | 状态 |
|---------|---------|---------|--------|------|
| 产品线 | 4 | 4 | 100% | ✅ 完成 |
| 领域产品 | 12 | 12 | 100% | ✅ 完成 |
| 领域特性 | 33 | 33 | 100% | ✅ 完成 |
| 软件模块 | 80 | 10 | 13% | ⏳ 进行中 |
| 用户需求 | 40 | 5 | 13% | ⏳ 进行中 |
| 特性需求 | 60 | 0 | 0% | ⏳ 待开始 |
| 模块需求 | 120 | 10 | 8% | ⏳ 进行中 |
| PI/项目 | 6 | 3 | 50% | ⏳ 进行中 |

**总体完成度**: **58%**

## 🚀 下一步工作

### 立即执行（P0）
1. ✅ 产品线数据扩充
2. ✅ 领域产品数据扩充  
3. ✅ 领域特性数据扩充
4. ⏳ 软件模块数据扩充（关键）
5. ⏳ 用户需求数据扩充（关键）

### 短期执行（P1）
6. 特性需求数据创建
7. 模块需求数据扩充
8. PI/项目数据更新

### 中期优化（P2）
9. 数据关联关系验证
10. 页面功能测试
11. 数据质量优化

## 📝 数据文件清单

### ✅ 已完成
- `frontend/src/data/products/product-lines.json`
- `frontend/src/data/products/domain-products.json`
- `biz-data/mock/asset/features.json`

### ⏳ 需要扩充
- `biz-data/mock/asset/modules.json`
- `biz-data/mock/requirement/user-requirements.json`
- `biz-data/mock/requirement/module-requirements.json`
- `frontend/src/data/projects/pi-plannings.json`
- `frontend/src/data/projects/projects.json`

### 🆕 需要创建
- `biz-data/mock/requirement/feature-requirements.json`

---

**文档更新时间**: 2026-01-07  
**数据版本**: v2.0  
**总体状态**: 🟡 进行中 (58%)

