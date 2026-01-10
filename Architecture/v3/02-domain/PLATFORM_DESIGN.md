# Platform平台设计

> **文档版本**: v1.0  
> **创建日期**: 2026-01-10  
> **目的**: 定义Platform（平台）实体的完整设计，实现软硬件解耦

---

## 一、概述

### 1.1 什么是Platform

**Platform（平台）** 是硬件平台或软件平台的抽象，支持模块的部署和运行。

**核心理念**:
- ✅ 软硬件解耦
- ✅ 支持多平台部署
- ✅ 平台依赖管理
- ✅ 平台升级影响分析

### 1.2 Platform分类

```
Platform
├── 硬件平台 (Hardware Platform)
│   ├── 芯片平台 (Chip/SoC)
│   │   ├── NVIDIA Orin-X
│   │   ├── Horizon Journe J6M
│   │   └── Qualcomm SA8295
│   └── ECU平台
│       ├── 域控制器
│       └── 功能ECU
│
└── 软件平台 (Software Platform)
    ├── 操作系统 (OS)
    │   ├── QNX 7.1
    │   ├── Linux 5.10
    │   └── Android Automotive
    ├── 中间件 (Middleware)
    │   ├── AUTOSAR CP/AP
    │   ├── ROS2
    │   └── DDS
    └── 开发平台 (Development)
        ├── 工具链
        └── SDK
```

---

## 二、Platform实体设计

### 2.1 数据模型

```typescript
/**
 * Platform平台实体
 */
interface Platform {
  // ========== 基本信息 ==========
  id: string;                // PLT-ORIN-X
  code: string;              // ORIN-X
  name: string;              // NVIDIA Orin-X
  nameEn?: string;           // NVIDIA Orin-X
  version: string;           // 1.0
  description: string;       // 平台描述
  
  // ========== 分类 ==========
  type: PlatformType;        // Hardware | Software | Development
  category: PlatformCategory; // Chip | OS | Middleware | Framework
  
  // ========== 硬件平台（type=Hardware） ==========
  hardwareSpecs?: {
    architecture: string;    // ARM64 | x86_64
    cpu: string;             // 12-core ARM Cortex-A78AE
    gpu?: string;            // 2048-core Ampere GPU
    npu?: string;            // DLA×2 + PVA×2
    computePower: string;    // 254 TOPS
    memory: string;          // 32GB LPDDR5
    storage: string;         // 64GB eMMC
    interfaces?: string[];   // PCIe, Ethernet, CAN, ...
  };
  
  // ========== 软件平台（type=Software） ==========
  softwareSpecs?: {
    os: string;              // QNX | Linux | Android
    osVersion: string;       // 7.1
    kernel?: string;         // Linux 5.10
    runtime?: string;        // Python 3.9, Java 11
    libraries?: string[];    // 支持的库
  };
  
  // ========== 兼容性 ==========
  compatibility: {
    supportedPlatforms?: string[];  // 兼容的其他Platform
    requiredPlatforms?: string[];   // 依赖的Platform
  };
  
  // ========== 使用情况 ==========
  products: string[];        // 使用此Platform的产品ID
  modules: string[];         // 部署在此Platform的模块ID
  
  // ========== 供应商 ==========
  vendor: string;            // NVIDIA | QNX | Qualcomm | ...
  vendorContact?: string;    // 供应商联系方式
  supportContact?: string;   // 技术支持联系方式
  
  // ========== 状态 ==========
  status: PlatformStatus;    // Active | Deprecated | EOL
  eolDate?: Date;            // End of Life日期
  
  // ========== 成本 ==========
  unitCost?: number;         // 单位成本（元）
  licenseCost?: number;      // 许可成本（元/年）
  
  // ========== 性能指标 ==========
  benchmarks?: {
    [key: string]: number;   // 性能指标
  };
  
  // ========== 元数据 ==========
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// ========== 枚举类型 ==========

enum PlatformType {
  Hardware = 'hardware',
  Software = 'software',
  Development = 'development'
}

enum PlatformCategory {
  // 硬件
  Chip = 'chip',
  SoC = 'soc',
  ECU = 'ecu',
  // 软件
  OS = 'os',
  Middleware = 'middleware',
  Framework = 'framework',
  // 开发
  IDE = 'ide',
  Toolchain = 'toolchain',
  SDK = 'sdk'
}

enum PlatformStatus {
  Active = 'active',
  Deprecated = 'deprecated',
  EOL = 'eol'
}
```

### 2.2 Module部署信息扩展

```typescript
/**
 * Module部署信息
 */
interface ModuleDeployment {
  // ========== 目标平台 ==========
  targetPlatformId: string;      // 主目标Platform
  compatiblePlatformIds?: string[];  // 兼容的Platform
  
  // ========== 技术栈 ==========
  techStack: {
    language: string;            // C++ | Python | Rust
    languageVersion: string;     // C++17
    framework?: string;          // ROS2 | AUTOSAR
    frameworkVersion?: string;   // ROS2 Foxy
    buildSystem: string;         // CMake | Bazel
    dependencies?: string[];     // 依赖库
  };
  
  // ========== 部署位置 ==========
  deployLocation: string;        // /opt/adas/perception
  executableName?: string;       // perception_node
  configPath?: string;           // /etc/adas/perception.conf
  
  // ========== 硬件需求 ==========
  hardwareRequirements: {
    cpu: string;                 // ARM Cortex-A78
    minMemory: string;           // 512MB
    recommendedMemory: string;   // 1GB
    minStorage: string;          // 100MB
    computePower?: string;       // 10 TOPS
    gpuRequired?: boolean;       // 是否需要GPU
    sensors?: string[];          // 需要的传感器
  };
  
  // ========== 性能指标 ==========
  performanceProfile: {
    cpuUsage?: string;           // <30%
    memoryUsage?: string;        // <500MB
    gpuUsage?: string;           // <20%
    latency?: string;            // <100ms
    throughput?: string;         // 30fps
  };
  
  // ========== 运行时 ==========
  runtime: {
    processType: 'daemon' | 'service' | 'application';
    startupMode: 'auto' | 'manual';
    priority?: number;           // 优先级
    dependencies?: string[];     // 依赖的其他进程/服务
  };
}

/**
 * 扩展Module实体
 */
interface Module {
  // ... 原有属性 ...
  
  // ========== 部署信息 ==========
  deployment: ModuleDeployment;
}
```

---

## 三、Platform关系设计

### 3.1 Module → Platform (M:1)

```typescript
const modulePerception: Module = {
  id: "MOD-PER-CAM-001",
  name: "摄像头感知模块",
  deployment: {
    targetPlatformId: "PLT-ORIN-X",
    compatiblePlatformIds: ["PLT-J6M"],
    techStack: {
      language: "C++",
      languageVersion: "C++17",
      framework: "ROS2",
      frameworkVersion: "Foxy",
      buildSystem: "CMake"
    },
    hardwareRequirements: {
      cpu: "ARM Cortex-A78",
      minMemory: "512MB",
      recommendedMemory: "1GB",
      computePower: "50 TOPS"
    }
  }
};
```

### 3.2 Product → Platform (M:N)

```typescript
const productAdasFlag: Product = {
  id: "PROD-ADAS-FLAG",
  name: "ADAS旗舰版",
  platformIds: ["PLT-ORIN-X", "PLT-QNX-7.1"]  // 依赖的平台
};
```

### 3.3 Feature → Platform (M:N)

```typescript
const featureAVP: Feature = {
  id: "FEAT-AVP-001",
  name: "AVP自动泊车",
  platformRequirements: ["PLT-ORIN-X"]  // 需要的平台
};
```

---

## 四、典型场景

### 4.1 场景1: 平台迁移评估

**问题**: "模块A能否从Orin-X迁移到J6M？"

```typescript
function canMigrateModule(
  moduleId: string, 
  targetPlatformId: string
): MigrationAnalysis {
  const module = getModule(moduleId);
  const currentPlatform = getPlatform(module.deployment.targetPlatformId);
  const targetPlatform = getPlatform(targetPlatformId);
  
  const issues: string[] = [];
  
  // 1. 检查兼容平台列表
  if (module.deployment.compatiblePlatformIds?.includes(targetPlatformId)) {
    return { feasible: true, effort: 'low' };
  }
  
  // 2. 检查算力
  const requiredTOPS = parseFloat(module.deployment.hardwareRequirements.computePower);
  const targetTOPS = parseFloat(targetPlatform.hardwareSpecs.computePower);
  if (requiredTOPS > targetTOPS) {
    issues.push(`算力不足: 需要${requiredTOPS}TOPS, 目标${targetTOPS}TOPS`);
  }
  
  // 3. 检查架构
  if (currentPlatform.hardwareSpecs.architecture !== targetPlatform.hardwareSpecs.architecture) {
    issues.push(`架构不同: ${currentPlatform.hardwareSpecs.architecture} → ${targetPlatform.hardwareSpecs.architecture}`);
  }
  
  // 4. 检查传感器
  // ... 传感器检查逻辑
  
  return {
    feasible: issues.length === 0,
    issues,
    effort: issues.length === 0 ? 'medium' : 'high',
    estimatedDays: issues.length * 5
  };
}
```

### 4.2 场景2: 平台升级影响分析

**问题**: "QNX从7.0升级到7.1会影响哪些模块？"

```typescript
function analyzePlatformUpgrade(platformId: string, newVersion: string) {
  const platform = getPlatform(platformId);
  const affectedModules = getModulesByPlatform(platformId);
  
  return {
    platformName: platform.name,
    currentVersion: platform.version,
    targetVersion: newVersion,
    affectedModules: affectedModules.length,
    affectedModuleDetails: affectedModules.map(m => ({
      id: m.id,
      name: m.name,
      ownerTeam: m.ownerTeam,
      riskLevel: assessUpgradeRisk(m, newVersion)
    })),
    affectedProducts: getUniqueProducts(affectedModules),
    recommendedActions: [
      "回归测试所有受影响模块",
      "验证接口兼容性",
      "更新文档和配置"
    ]
  };
}
```

---

## 五、数据示例

详见 `biz-data/mock/platform/platforms.json`

---

## 六、实施计划

### Day 1-2: 模型设计
- [ ] Platform实体设计
- [ ] ModuleDeployment设计
- [ ] 更新Architecture/v3文档

### Day 3-4: 数据准备
- [ ] 创建 `biz-data/mock/platform/platforms.json`（10+ Platform）
- [ ] 扩展 `biz-data/mock/modules.json`（添加deployment）

### Day 5: 页面实现
- [ ] Platform管理页面
- [ ] Module详情页展示部署信息

---

## 七、验收标准

- [ ] 10+ Platform数据（覆盖主流芯片和OS）
- [ ] 每个Module有完整的部署信息
- [ ] Platform管理页面可用
- [ ] 可以查询"模块部署在哪个平台"
- [ ] 可以分析"平台升级影响"
- [ ] 可以评估"模块迁移可行性"

---

**文档版本**: v1.0  
**状态**: ✅ 设计完成，待实施

