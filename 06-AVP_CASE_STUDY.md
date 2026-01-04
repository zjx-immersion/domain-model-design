# AVP自动泊车完整案例研究

> **文档版本**: v1.0  
> **创建时间**: 2026-01-02  
> **案例场景**: AVP自主代客泊车功能  
> **参考**: 用户提供的三层资产管理体系设计

---

## 📋 案例概述

### 业务场景

用户到达停车场入口，通过手机APP点击"开始泊车"，车辆自动驶入停车场，寻找车位并泊入。

### 涉及层级

- **产品层**: 智能驾驶旗舰版产品
- **功能层**: AVP自动泊车特性
- **模块层**: 感知、规划、控制模块

---

## 一、 产品层（Product Layer）实例建模

### 1.1 Product (产品)

```typescript
const product_ADAS_Premium = {
  // 基本信息
  id: "prod-adas-premium",
  name: "智能驾驶旗舰版",
  code: "ADAS-PREMIUM",
  version: "2.0.0",
  type: "SYS",  // 功能系统类
  domain: "intelligent-driving",
  
  // 生命周期
  lifecycle_stage: "Development",
  status: "developing",
  
  // 关联
  productLineId: "pl-ad",  // 智能驾驶产品线
  
  // ⭐ Feature BOM - 产品包含的特性清单
  featureBOM: [
    {
      featureId: "feat-acc",
      featureName: "自适应巡航控制",
      version: "2.0.0",
      isStandard: true,      // 标配
      isOptional: false
    },
    {
      featureId: "feat-lcc",
      featureName: "车道居中保持",
      version: "2.0.0",
      isStandard: true,      // 标配
      isOptional: false
    },
    {
      featureId: "feat-avp",
      featureName: "AVP自动泊车",
      version: "1.5.0",
      isStandard: false,     // 非标配
      isOptional: true,      // 可选配
      variantRules: "需要超声波雷达和环视摄像头硬件配置"
    },
    {
      featureId: "feat-aeb",
      featureName: "自动紧急制动",
      version: "2.0.0",
      isStandard: true,
      isOptional: false
    }
  ],
  
  // ⭐ Platform依赖
  platformIds: [
    "platform-orin-x",    // 硬件平台: NVIDIA Orin-X
    "platform-qnx",       // OS平台: QNX RTOS
    "platform-autosar"    // 软件框架: AUTOSAR CP
  ],
  
  // 模块列表
  moduleIds: [
    "mod-perception",
    "mod-planning",
    "mod-control",
    "mod-parking-perception",
    "mod-parking-planning"
  ],
  
  // 管理信息
  owner: "张明（产品经理）",
  createdAt: "2024-01-15",
  updatedAt: "2024-03-02"
};
```

**关键点**：
- ✅ `featureBOM` - 清晰定义产品包含哪些Feature
- ✅ `platformIds` - 明确平台依赖
- ✅ AVP作为**可选配特性**，体现产品线差异化

### 1.2 UserRequirement (用户需求)

```typescript
const UR_AVP_001 = {
  id: "UR-AVP-001",
  type: "UR-EXP",  // 体验型用户需求
  title: "一键自动泊车入位",
  description: `
    作为车主，我希望在电梯口下车后，车辆能自动停入地下车库，
    以节省停车时间和避免狭小车位泊车困难。
  `,
  
  // 业务价值
  value_score: 85,  // 价值评分 1-100
  priority: "high",
  
  // 关联
  productId: "prod-adas-premium",
  stakeholders: ["市场部", "用户体验部", "产品经理"],
  
  // 分解
  featureRequirements: [
    "FR-AVP-001",  // 车位检测识别
    "FR-AVP-002",  // 泊车路径规划
    "FR-AVP-003",  // 低速横纵向控制
    "FR-AVP-004",  // 机-车互联
    "FR-AVP-005"   // 安全监控
  ],
  
  // 验收标准（业务级别）
  acceptanceCriteria: [
    "用户在手机APP上可以看到车辆实时状态",
    "车辆能够自动找到车位并泊入",
    "泊车成功率 > 95%",
    "泊车时间 < 3分钟",
    "支持垂直、水平、斜列三种车位"
  ],
  
  createdAt: "2024-01-10",
  updatedAt: "2024-02-15"
};
```

**用户价值**：
- 节省时间 - 用户不用自己找车位和泊车
- 提升体验 - 避免狭小车位泊车困难
- 差异化卖点 - 高端车型专属功能

---

## 二、 功能层（Function Layer）实例建模

### 2.1 Feature (特性资产)

```typescript
const feature_AVP = {
  // 基本信息
  id: "feat-avp",
  name: "AVP自主代客泊车",
  code: "AVP",
  version: "1.5.0",
  
  // 分类
  type: "Functional",  // 功能型特性
  domain: "intelligent-driving",
  
  // 复杂度
  complexity: "High",  // 涉及感知、规划、控制多个领域
  
  // 配置属性
  is_standard: false,  // 非标配
  is_optional: true,   // 可选配
  
  // ⭐ 依赖的其他Feature
  dependencies: [
    "feat-hd-map",       // 依赖高精地图特性
    "feat-ultrasonic",   // 依赖超声波雷达特性
    "feat-surround-view" // 依赖环视摄像头特性
  ],
  
  conflicts: [],  // 无冲突特性
  
  // ⭐ 实现映射 - Feature由哪些Module实现
  modules: [
    "mod-parking-perception",  // 泊车感知模块
    "mod-parking-planning",    // 泊车规划模块
    "mod-parking-control",     // 泊车控制模块（可能与通用控制模块共用）
    "mod-hmi",                 // HMI模块（显示泊车界面）
    "mod-telematics"           // T-BOX模块（手机APP通信）
  ],
  
  // 逻辑架构
  logicalComponents: [
    "lc-parking-perception",   // 泊车感知逻辑组件
    "lc-parking-planner",      // 泊车规划逻辑组件
    "lc-parking-controller",   // 泊车控制逻辑组件
    "lc-parking-ui"            // 泊车UI逻辑组件
  ],
  
  // 性能指标
  performanceMetrics: {
    detection_range: "50m",          // 检测范围
    detection_accuracy: "95%",       // 检测准确率
    planning_latency: "100ms",       // 规划延迟
    control_frequency: "50Hz",       // 控制频率
    parking_success_rate: "98%"      // 泊车成功率
  },
  
  // 元数据
  owner: "陈刚（特性负责人）",
  status: "Active",
  createdAt: "2023-06-01",
  updatedAt: "2024-02-15",
  
  // 版本历史
  versionHistory: [
    { version: "1.0.0", date: "2023-06-01", changes: "初始版本，支持垂直车位" },
    { version: "1.2.0", date: "2023-09-01", changes: "新增水平车位支持" },
    { version: "1.5.0", date: "2024-02-15", changes: "新增斜列车位支持，优化路径规划" }
  ]
};
```

**关键点**：
- ✅ Feature作为**独立资产**，有自己的版本演进
- ✅ Feature明确了**依赖关系**（依赖高精地图、超声波雷达）
- ✅ Feature明确了**实现映射**（由5个模块实现）
- ✅ 支持跨产品**复用**

### 2.2 FeatureRequirement (特性需求/系统需求)

#### FR-AVP-001: 车位检测识别

```typescript
const FR_AVP_001 = {
  id: "FR-AVP-001",
  title: "车位检测识别",
  level: "feature",
  description: "系统需要利用超声波雷达和环视摄像头，实时检测停车场内的可用车位，支持垂直、水平、斜列三种车位类型。",
  
  // 关联
  parentURId: "UR-AVP-001",
  relatedFeatureId: "feat-avp",  // ⭐ 关联到Feature资产
  
  // 验收标准（系统级别）
  acceptance_criteria: [
    {
      id: "AC-001",
      type: "Given-When-Then",
      content: `
        Given: 车辆在停车场内以5km/h速度行驶
        When: 旁边有一个空闲的垂直车位（宽度>2.4m，深度>5.0m）
        Then: 系统应在3秒内检测到该车位并标记为可用
      `
    },
    {
      id: "AC-002",
      type: "Performance",
      content: "车位检测准确率 ≥ 95%"
    },
    {
      id: "AC-003",
      type: "Performance",
      content: "检测范围 ≥ 50米"
    }
  ],
  
  // ⭐ 分解到模块需求
  moduleRequirements: [
    "MR-AVP-PER-001",  // 超声波车位检测
    "MR-AVP-PER-002",  // 视觉车位线识别
    "MR-AVP-PER-003"   // 多传感器融合
  ],
  
  // 性能指标（详细）
  performance: {
    latency: 100,         // 延迟要求（ms）
    accuracy: 95,         // 准确率要求（%）
    detection_range: 50   // 检测范围（米）
  },
  
  status: "testing",
  priority: "critical",
  owner: "张强（感知算法工程师）",
  createdAt: "2024-01-12",
  updatedAt: "2024-02-16"
};
```

#### FR-AVP-002: 泊车路径规划

```typescript
const FR_AVP_002 = {
  id: "FR-AVP-002",
  title: "泊车路径规划",
  level: "feature",
  description: "系统需要根据车辆当前位置和目标车位，规划一条无碰撞的泊车轨迹，支持多段式泊车。",
  
  parentURId: "UR-AVP-001",
  relatedFeatureId: "feat-avp",
  
  acceptance_criteria: [
    {
      id: "AC-004",
      content: `
        Given: 检测到可用车位
        When: 用户确认开始泊车
        Then: 系统应在1秒内生成泊车路径，且路径与障碍物距离 ≥ 20cm
      `
    },
    {
      id: "AC-005",
      content: "支持最多3段式泊车（前进-倒车-前进）"
    }
  ],
  
  moduleRequirements: [
    "MR-AVP-PLAN-001",  // 全局路径搜索
    "MR-AVP-PLAN-002",  // 轨迹优化
    "MR-AVP-PLAN-003"   // 碰撞检测
  ],
  
  performance: {
    latency: 1000,        // 路径生成延迟（ms）
    smoothness: 0.1       // 路径平滑度
  },
  
  status: "testing",
  priority: "critical",
  owner: "周明（规划算法工程师）",
  createdAt: "2024-01-12",
  updatedAt: "2024-02-16"
};
```

---

## 三、 模块层（Module Layer）实例建模与物理部署

### 3.1 模块A: 泊车感知模块 (Parking Perception Module)

```typescript
const module_ParkingPerception = {
  // 基本信息
  id: "mod-parking-perception",
  name: "泊车感知模块",
  code: "PARK-PER",
  version: "1.5.0",
  
  // ⭐ 技术栈
  tech_stack: {
    language: "C++",
    framework: "ROS2",
    compiler: "GCC 11.2",
    buildSystem: "CMake 3.20"
  },
  
  // ⭐ 部署信息
  deploy_target: "Horizon_J6M_BPU",  // 地平线征程6M的BPU（AI加速单元）
  deploy_location: "/opt/adas/parking/perception",
  platformId: "platform-j6m",
  
  // ⭐ 硬件依赖
  hardware_requirements: {
    cpu: "征程6M BPU",
    memory: "256MB",
    computePower: "5 TOPS",
    sensors: [
      "4x 鱼眼摄像头（环视）",
      "12x 超声波雷达"
    ]
  },
  
  // 软件依赖
  software_dependencies: [
    "libopencv 4.5.0",
    "libeigen 3.3",
    "ros2-foxy"
  ],
  
  // ⭐ 支持的Feature
  featureIds: [
    "feat-avp"  // 主要支持AVP特性
  ],
  
  // 代码仓库
  repository_url: "git@github.com:company/parking-perception.git",
  repository_branch: "main",
  
  // 职责
  responsibilities: [
    "接收环视摄像头和超声波雷达数据",
    "检测车位线和障碍物",
    "生成车位列表（位置、类型、占用状态）",
    "发布感知结果到规划模块"
  ],
  
  // 接口
  interfaces: {
    inputs: [
      { name: "camera_raw", type: "sensor_msgs/Image", topic: "/camera/raw" },
      { name: "ultrasonic_raw", type: "sensor_msgs/Range", topic: "/ultrasonic/raw" }
    ],
    outputs: [
      { name: "parking_slots", type: "perception_msgs/ParkingSlotArray", topic: "/perception/parking_slots" },
      { name: "obstacles", type: "perception_msgs/ObstacleArray", topic: "/perception/obstacles" }
    ]
  },
  
  // 管理信息
  owner: "张强",
  team: "感知算法团队",
  status: "active",
  
  // 统计
  requirementCount: 3,  // 关联3个MR
  testCaseCount: 28,
  
  createdAt: "2023-06-01",
  updatedAt: "2024-02-15"
};
```

**关键点**：
- ✅ `deploy_target` - 明确部署在**地平线征程6M的BPU**上
- ✅ `hardware_requirements` - 明确硬件需求（BPU、256MB内存、5 TOPS算力）
- ✅ `featureIds` - 明确支持AVP特性
- ✅ `tech_stack` - 明确技术栈（C++、ROS2）

### 3.2 模块B: 泊车规划模块 (Parking Planning Module)

```typescript
const module_ParkingPlanning = {
  id: "mod-parking-planning",
  name: "泊车规划模块",
  code: "PARK-PLAN",
  version: "1.5.0",
  
  // ⭐ 技术栈
  tech_stack: {
    language: "C++",
    framework: "AUTOSAR Adaptive",
    compiler: "GCC 11.2"
  },
  
  // ⭐ 部署信息
  deploy_target: "Orin_X_CPU",  // NVIDIA Orin-X的CPU（复杂规划算法）
  deploy_location: "/opt/adas/parking/planning",
  platformId: "platform-orin-x",
  
  // ⭐ 硬件依赖
  hardware_requirements: {
    cpu: "NVIDIA Orin-X (ARM Cortex-A78)",
    memory: "512MB",
    computePower: "10 TOPS"
  },
  
  // ⭐ 支持的Feature
  featureIds: [
    "feat-avp"
  ],
  
  repository_url: "git@github.com:company/parking-planning.git",
  
  // 职责
  responsibilities: [
    "接收感知模块的车位信息",
    "规划从当前位置到目标车位的轨迹",
    "实时避障和轨迹重规划",
    "发布控制指令到控制模块"
  ],
  
  // 算法
  algorithms: [
    "A*全局路径搜索",
    "Hybrid A*轨迹规划",
    "五次多项式轨迹平滑",
    "动态窗口避障（DWA）"
  ],
  
  // 接口
  interfaces: {
    inputs: [
      { name: "parking_slots", topic: "/perception/parking_slots" },
      { name: "obstacles", topic: "/perception/obstacles" },
      { name: "vehicle_state", topic: "/vehicle/state" }
    ],
    outputs: [
      { name: "planned_path", topic: "/planning/path" },
      { name: "control_commands", topic: "/planning/control_commands" }
    ]
  },
  
  owner: "周明",
  team: "规划算法团队",
  status: "active",
  
  requirementCount: 3,
  testCaseCount: 22,
  
  createdAt: "2023-06-01",
  updatedAt: "2024-02-15"
};
```

**关键点**：
- ✅ `deploy_target` - 部署在**NVIDIA Orin-X的CPU**上（复杂规划算法需要更强算力）
- ✅ 与感知模块**部署在不同硬件**上，体现软硬件解耦

### 3.3 模块C: 泊车控制模块 (Parking Control Module)

```typescript
const module_ParkingControl = {
  id: "mod-parking-control",
  name: "泊车控制模块",
  code: "PARK-CTRL",
  version: "1.5.0",
  
  // ⭐ 技术栈
  tech_stack: {
    language: "C",
    framework: "Classic AUTOSAR",
    compiler: "GCC 10.2"
  },
  
  // ⭐ 部署信息
  deploy_target: "Infineon_Aurix_TC397",  // 英飞凌Aurix TC397（底盘域控制器）
  deploy_location: "Flash",
  platformId: "platform-aurix",
  
  // ⭐ 硬件依赖
  hardware_requirements: {
    cpu: "Infineon TriCore TC397",
    memory: "2MB RAM",
    flash: "8MB",
    interfaces: [
      "CAN FD (控制指令)",
      "LIN (执行器通信)"
    ]
  },
  
  // ⭐ 支持的Feature
  featureIds: [
    "feat-avp",
    "feat-acc",  // 同时支持ACC
    "feat-lcc"   // 同时支持LCC
  ],
  
  repository_url: "git@github.com:company/chassis-control.git",
  
  // 职责
  responsibilities: [
    "接收规划模块的控制指令",
    "执行横纵向控制",
    "发送CAN信号给执行器（EPS、ESP、EPB）",
    "监控安全状态"
  ],
  
  // 接口
  interfaces: {
    inputs: [
      { name: "control_commands", protocol: "CAN", canId: "0x200" }
    ],
    outputs: [
      { name: "eps_command", protocol: "CAN", canId: "0x301", description: "转向指令" },
      { name: "esp_command", protocol: "CAN", canId: "0x302", description: "油门刹车指令" },
      { name: "epb_command", protocol: "CAN", canId: "0x303", description: "驻车制动" }
    ]
  },
  
  // 安全等级
  safetyLevel: "ASIL-D",  // ISO26262 ASIL-D
  
  owner: "赵磊",
  team: "控制算法团队",
  status: "active",
  
  requirementCount: 5,
  testCaseCount: 45,
  
  createdAt: "2022-01-01",
  updatedAt: "2024-02-15"
};
```

**关键点**：
- ✅ `deploy_target` - 部署在**英飞凌Aurix TC397**底盘域控制器上
- ✅ `tech_stack` - 使用**Classic AUTOSAR**框架（实时性要求高）
- ✅ `safetyLevel` - **ASIL-D**安全等级
- ✅ 支持**多个Feature**（AVP、ACC、LCC共用控制模块）

---

## 四、 数据实例联动（JSON示例）

### 4.1 完整追溯链数据

```json
{
  "traceability_chain_AVP": {
    "user_requirement": {
      "id": "UR-AVP-001",
      "content": "一键自动泊车",
      "source": "用户调研",
      "value_score": 85
    },
    "product": {
      "id": "prod-adas-premium",
      "name": "智能驾驶旗舰版",
      "feature_bom": [
        {
          "featureId": "feat-avp",
          "version": "1.5.0",
          "isStandard": false,
          "isOptional": true
        }
      ]
    },
    "feature_asset": {
      "id": "feat-avp",
      "name": "AVP自动泊车",
      "version": "1.5.0",
      "complexity": "High",
      "dependencies": [
        "feat-hd-map",
        "feat-ultrasonic"
      ],
      "modules": [
        "mod-parking-perception",
        "mod-parking-planning",
        "mod-parking-control"
      ]
    },
    "decomposed_feature_requirements": [
      {
        "id": "FR-AVP-001",
        "name": "车位检测识别",
        "relatedFeatureId": "feat-avp",
        "module_requirements": [
          "MR-AVP-PER-001",
          "MR-AVP-PER-002",
          "MR-AVP-PER-003"
        ]
      },
      {
        "id": "FR-AVP-002",
        "name": "泊车路径规划",
        "relatedFeatureId": "feat-avp",
        "module_requirements": [
          "MR-AVP-PLAN-001",
          "MR-AVP-PLAN-002",
          "MR-AVP-PLAN-003"
        ]
      }
    ],
    "allocated_modules": [
      {
        "id": "mod-parking-perception",
        "name": "泊车感知模块",
        "version": "1.5.0",
        "deploy_target": "Horizon_J6M_BPU",
        "tech_stack": "C++ / ROS2",
        "hardware": {
          "platform": "地平线征程6M",
          "cpu": "BPU",
          "memory": "256MB",
          "computePower": "5 TOPS"
        },
        "requirements": [
          {
            "id": "MR-AVP-PER-001",
            "description": "超声波车位检测",
            "verification": "TC-AVP-PER-001 (HIL测试)"
          }
        ]
      },
      {
        "id": "mod-parking-planning",
        "name": "泊车规划模块",
        "deploy_target": "Orin_X_CPU",
        "tech_stack": "C++ / AUTOSAR Adaptive",
        "hardware": {
          "platform": "NVIDIA Orin-X",
          "cpu": "ARM Cortex-A78",
          "memory": "512MB"
        },
        "algorithms": [
          "A*全局路径搜索",
          "Hybrid A*轨迹规划"
        ],
        "requirements": [
          {
            "id": "MR-AVP-PLAN-001",
            "description": "全局路径搜索",
            "algorithm": "A* with Dubins curve"
          }
        ]
      },
      {
        "id": "mod-parking-control",
        "name": "泊车控制模块",
        "deploy_target": "Infineon_Aurix_TC397",
        "tech_stack": "C / Classic AUTOSAR",
        "hardware": {
          "platform": "英飞凌Aurix TC397",
          "cpu": "TriCore TC397",
          "memory": "2MB RAM",
          "safetyLevel": "ASIL-D"
        },
        "requirements": [
          {
            "id": "MR-AVP-CTRL-001",
            "description": "低速横纵向控制",
            "performance": "控制频率 50Hz"
          }
        ]
      }
    ]
  }
}
```

---

## 五、 软硬件解耦设计

### 5.1 部署架构图

```
┌─────────────────────────────────────────────────────────┐
│                     智能驾驶旗舰版产品                      │
│                  (prod-adas-premium)                    │
└─────────────────────────────────────────────────────────┘
                          │
                          │ contains (Feature BOM)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   AVP自动泊车特性                          │
│                    (feat-avp v1.5.0)                    │
└─────────────────────────────────────────────────────────┘
                          │
                          │ implemented by (modules)
                          ▼
        ┌─────────────────┴─────────────────┬─────────────┐
        │                                   │             │
        ▼                                   ▼             ▼
┌──────────────────┐          ┌──────────────────┐  ┌──────────────────┐
│   泊车感知模块   │          │   泊车规划模块   │  │   泊车控制模块   │
│ (mod-parking-    │          │ (mod-parking-    │  │ (mod-parking-    │
│  perception)     │          │  planning)       │  │  control)        │
└──────────────────┘          └──────────────────┘  └──────────────────┘
        │                              │                      │
        │ deploys on                   │ deploys on           │ deploys on
        ▼                              ▼                      ▼
┌──────────────────┐          ┌──────────────────┐  ┌──────────────────┐
│  地平线征程6M    │          │  NVIDIA Orin-X   │  │英飞凌Aurix TC397 │
│   (BPU芯片)      │          │    (ARM CPU)     │  │  (底盘域控)      │
│  - 5 TOPS AI     │          │  - 30 TOPS AI    │  │  - ASIL-D        │
│  - 256MB内存     │          │  - 512MB内存     │  │  - 2MB RAM       │
└──────────────────┘          └──────────────────┘  └──────────────────┘
        │                              │                      │
        │ based on                     │ based on             │ based on
        ▼                              ▼                      ▼
┌──────────────────┐          ┌──────────────────┐  ┌──────────────────┐
│ Platform: J6M    │          │ Platform: Orin-X │  │ Platform: Aurix  │
│  - Linux         │          │  - QNX RTOS      │  │  - Classic       │
│  - ROS2框架      │          │  - AUTOSAR AP    │  │    AUTOSAR       │
└──────────────────┘          └──────────────────┘  └──────────────────┘
```

**解耦优势**：

1. **逻辑与物理分离**
   - Feature层定义"做什么"（AVP功能）
   - Module层定义"怎么做"（感知、规划、控制）
   - 物理层定义"在哪做"（J6M、Orin-X、Aurix）

2. **平台可替换**
   - 如果未来升级到Thor平台，只需修改Module的deploy_target
   - Feature层和需求层不受影响

3. **模块可复用**
   - `mod-parking-control`同时支持AVP、ACC、LCC
   - 多个Feature共享同一个控制模块

---

## 六、 关键设计亮点

### 6.1 资产复用性设计

**场景**: 开发"智驾标准版"产品

```typescript
// 标准版产品 - 复用部分Feature
const product_ADAS_Standard = {
  id: "prod-adas-std",
  name: "智能驾驶标准版",
  featureBOM: [
    {
      featureId: "feat-acc",      // 复用ACC特性
      version: "2.0.0",
      isStandard: true
    },
    {
      featureId: "feat-lcc",      // 复用LCC特性
      version: "2.0.0",
      isStandard: true
    }
    // 不包含AVP特性（节省成本）
  ],
  // 复用相同的模块
  moduleIds: [
    "mod-perception",   // 复用感知模块
    "mod-planning",     // 复用规划模块
    "mod-control"       // 复用控制模块
  ]
};
```

**价值**：
- ✅ Feature作为资产，在不同产品间复用
- ✅ 模块在多个Feature间共享
- ✅ 降低开发成本，提高质量一致性

### 6.2 平台迁移设计

**场景**: 从Orin-X迁移到Thor平台

```typescript
// 步骤1: 定义新平台
const platform_Thor = {
  id: "platform-thor",
  name: "NVIDIA Thor",
  type: "hardware",
  specs: {
    arch: "ARM64",
    computePower: "2000 TOPS"
  }
};

// 步骤2: 更新模块部署目标
const module_ParkingPlanning_Thor = {
  ...module_ParkingPlanning,
  deploy_target: "Thor_CPU",
  platformId: "platform-thor",
  hardware_requirements: {
    cpu: "NVIDIA Thor ARM CPU",
    memory: "512MB",
    computePower: "20 TOPS"
  }
};

// 步骤3: Feature层和需求层无需修改 ✅
// Feature "AVP" 仍然由相同的模块实现，只是部署目标变了
```

**价值**：
- ✅ 软硬件解耦，硬件升级不影响上层
- ✅ 支持渐进式迁移（部分模块先迁移）
- ✅ 降低技术风险

### 6.3 配置管理设计

**场景**: 根据硬件配置启用Feature

```typescript
// 检查硬件配置决定是否启用Feature
function checkFeatureCompatibility(vehicle: Vehicle) {
  const avpFeature = features.find(f => f.id === "feat-avp");
  
  // 检查依赖
  const hasSurroundView = vehicle.sensors.includes("surround_view_camera");
  const hasUltrasonic = vehicle.sensors.includes("ultrasonic_radar");
  const hasHDMap = vehicle.features.includes("feat-hd-map");
  
  if (hasSurroundView && hasUltrasonic && hasHDMap) {
    return {
      compatible: true,
      message: "可以启用AVP功能"
    };
  } else {
    return {
      compatible: false,
      message: "缺少必需的硬件配置",
      missing: [
        !hasSurroundView && "环视摄像头",
        !hasUltrasonic && "超声波雷达",
        !hasHDMap && "高精地图"
      ].filter(Boolean)
    };
  }
}
```

**价值**：
- ✅ 支持基于硬件配置的动态特性启用
- ✅ 支持OTA升级解锁新功能
- ✅ 支持差异化产品配置

---
