# AVP自动泊车案例可视化图

> **文档版本**: v1.0  
> **创建时间**: 2026-01-02  
> **对应文档**: 06-AVP_CASE_STUDY.md  
> **案例场景**: AVP自主代客泊车功能

---

## 📊 目录

1. [AVP三层分解结构图](#一-avp三层分解结构图)
2. [AVP完整追溯链](#二-avp完整追溯链)
3. [AVP部署架构图](#三-avp部署架构图)
4. [AVP数据流图](#四-avp数据流图)
5. [软硬件解耦示例](#五-软硬件解耦示例)
6. [资产复用场景](#六-资产复用场景)

---

## 一、 AVP三层分解结构图

### 1.1 产品层到功能层到模块层的完整分解

```mermaid
graph TB
    subgraph 产品层
        P[智能驾驶旗舰版<br/>ADAS-PREMIUM<br/>v2.0.0]
        UR[用户需求<br/>UR-AVP-001<br/>一键自动泊车]
        
        P -.包含.-> BOM1[FeatureBOM<br/>ACC v2.0<br/>标配]
        P -.包含.-> BOM2[FeatureBOM<br/>LCC v2.0<br/>标配]
        P -.包含.-> BOM3[FeatureBOM<br/>AVP v1.5<br/>可选配]
        P -.包含.-> BOM4[FeatureBOM<br/>AEB v2.0<br/>标配]
    end
    
    subgraph 功能层
        F[Feature资产<br/>AVP自动泊车<br/>v1.5.0<br/>复杂度: High]
        
        UR -.分解.-> FR1[FR-AVP-001<br/>车位检测识别]
        UR -.分解.-> FR2[FR-AVP-002<br/>泊车路径规划]
        UR -.分解.-> FR3[FR-AVP-003<br/>低速控制]
        UR -.分解.-> FR4[FR-AVP-004<br/>机-车互联]
        
        BOM3 -.引用.-> F
        FR1 -.关联.-> F
        FR2 -.关联.-> F
        FR3 -.关联.-> F
        FR4 -.关联.-> F
        
        F -.依赖.-> FD1[Feature<br/>高精地图]
        F -.依赖.-> FD2[Feature<br/>超声波雷达]
        F -.依赖.-> FD3[Feature<br/>环视摄像头]
    end
    
    subgraph 模块层
        M1[泊车感知模块<br/>PARK-PER<br/>v1.5.0]
        M2[泊车规划模块<br/>PARK-PLAN<br/>v1.5.0]
        M3[泊车控制模块<br/>PARK-CTRL<br/>v1.5.0]
        M4[HMI模块<br/>显示界面]
        M5[T-BOX模块<br/>通信]
        
        FR1 -.分解.-> MR1[MR-AVP-PER-001<br/>超声波检测]
        FR1 -.分解.-> MR2[MR-AVP-PER-002<br/>视觉识别]
        FR2 -.分解.-> MR3[MR-AVP-PLAN-001<br/>全局路径搜索]
        FR2 -.分解.-> MR4[MR-AVP-PLAN-002<br/>轨迹优化]
        
        F -.实现于.-> M1
        F -.实现于.-> M2
        F -.实现于.-> M3
        F -.实现于.-> M4
        F -.实现于.-> M5
        
        MR1 -.实现于.-> M1
        MR2 -.实现于.-> M1
        MR3 -.实现于.-> M2
        MR4 -.实现于.-> M2
    end
    
    subgraph 硬件平台层
        HW1[地平线征程6M<br/>BPU<br/>5 TOPS AI<br/>256MB]
        HW2[NVIDIA Orin-X<br/>ARM CPU<br/>30 TOPS AI<br/>512MB]
        HW3[英飞凌Aurix TC397<br/>底盘域控<br/>ASIL-D<br/>2MB RAM]
        
        M1 -.部署于.-> HW1
        M2 -.部署于.-> HW2
        M3 -.部署于.-> HW3
    end
    
    style P fill:#e1f5ff
    style UR fill:#e1f5ff
    style F fill:#fff4e6
    style FR1 fill:#fff4e6
    style FR2 fill:#fff4e6
    style M1 fill:#f3e5f5
    style M2 fill:#f3e5f5
    style M3 fill:#f3e5f5
    style HW1 fill:#e8f5e9
    style HW2 fill:#e8f5e9
    style HW3 fill:#e8f5e9
```

---

## 二、 AVP完整追溯链

### 2.1 从用户需求到代码提交的追溯链

```mermaid
graph TD
    UR[用户需求 UR-AVP-001<br/>一键自动泊车<br/>价值评分: 85<br/>优先级: High]
    
    UR --> FR1[特性需求 FR-AVP-001<br/>车位检测识别<br/>准确率 ≥ 95%<br/>检测范围 ≥ 50m]
    UR --> FR2[特性需求 FR-AVP-002<br/>泊车路径规划<br/>延迟 ≤ 1s<br/>支持3段式泊车]
    UR --> FR3[特性需求 FR-AVP-003<br/>低速横纵向控制<br/>控制频率 50Hz]
    
    FR1 --> MR1[模块需求 MR-AVP-PER-001<br/>超声波车位检测<br/>3 Story Points]
    FR1 --> MR2[模块需求 MR-AVP-PER-002<br/>视觉车位线识别<br/>5 Story Points]
    FR1 --> MR3[模块需求 MR-AVP-PER-003<br/>多传感器融合<br/>5 Story Points]
    
    FR2 --> MR4[模块需求 MR-AVP-PLAN-001<br/>全局路径搜索 A*<br/>8 Story Points]
    FR2 --> MR5[模块需求 MR-AVP-PLAN-002<br/>轨迹优化<br/>5 Story Points]
    FR2 --> MR6[模块需求 MR-AVP-PLAN-003<br/>碰撞检测<br/>3 Story Points]
    
    MR1 --> T1[Task: 实现超声波数据处理]
    MR2 --> T2[Task: 实现车位线检测算法]
    MR4 --> T3[Task: 实现A*算法]
    MR5 --> T4[Task: 实现五次多项式平滑]
    
    T1 --> C1[Commit: feat超声波检测<br/>SHA: a1b2c3d]
    T2 --> C2[Commit: feat车位线识别<br/>SHA: e4f5g6h]
    T3 --> C3[Commit: feat A*路径搜索<br/>SHA: i7j8k9l]
    T4 --> C4[Commit: feat轨迹平滑<br/>SHA: m0n1o2p]
    
    MR1 -.验证.-> TC1[TestCase<br/>TC-AVP-PER-001<br/>HIL测试]
    MR2 -.验证.-> TC2[TestCase<br/>TC-AVP-PER-002<br/>单元测试]
    MR4 -.验证.-> TC3[TestCase<br/>TC-AVP-PLAN-001<br/>算法测试]
    
    style UR fill:#e1f5ff
    style FR1 fill:#fff4e6
    style FR2 fill:#fff4e6
    style FR3 fill:#fff4e6
    style MR1 fill:#f3e5f5
    style MR2 fill:#f3e5f5
    style MR4 fill:#f3e5f5
    style T1 fill:#ffe0b2
    style T2 fill:#ffe0b2
    style C1 fill:#c8e6c9
    style C2 fill:#c8e6c9
```

### 2.2 需求与资产的关联关系

```mermaid
graph LR
    subgraph 需求层
        UR[UR-AVP-001<br/>用户需求]
        FR1[FR-AVP-001<br/>特性需求]
        FR2[FR-AVP-002<br/>特性需求]
        MR1[MR-AVP-PER-001<br/>模块需求]
        MR2[MR-AVP-PLAN-001<br/>模块需求]
    end
    
    subgraph 资产层
        P[Product<br/>智驾旗舰版]
        F[Feature<br/>AVP v1.5]
        M1[Module<br/>泊车感知]
        M2[Module<br/>泊车规划]
    end
    
    UR -.关联.-> P
    UR --> FR1
    UR --> FR2
    
    FR1 -.关联.-> F
    FR2 -.关联.-> F
    
    FR1 --> MR1
    FR2 --> MR2
    
    MR1 -.关联.-> M1
    MR2 -.关联.-> M2
    
    P -.包含.-> F
    F -.实现于.-> M1
    F -.实现于.-> M2
    
    style UR fill:#e1f5ff
    style FR1 fill:#fff4e6
    style MR1 fill:#f3e5f5
    style P fill:#e1f5ff,stroke:#0277bd,stroke-width:3px
    style F fill:#fff4e6,stroke:#f57c00,stroke-width:3px
    style M1 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
```

---

## 三、 AVP部署架构图

### 3.1 模块在硬件平台上的部署

```mermaid
graph TB
    subgraph 手机端
        APP[手机APP<br/>用户界面]
    end
    
    subgraph 车载系统
        subgraph 地平线征程6M平台
            direction TB
            M1[泊车感知模块<br/>PARK-PER v1.5.0<br/>─────────────<br/>语言: C++<br/>框架: ROS2<br/>─────────────<br/>内存: 256MB<br/>算力: 5 TOPS]
            S1[超声波雷达<br/>12个传感器]
            S2[环视摄像头<br/>4个鱼眼]
            
            S1 --> M1
            S2 --> M1
        end
        
        subgraph NVIDIA Orin-X平台
            direction TB
            M2[泊车规划模块<br/>PARK-PLAN v1.5.0<br/>─────────────<br/>语言: C++<br/>框架: AUTOSAR AP<br/>─────────────<br/>内存: 512MB<br/>算力: 10 TOPS<br/>─────────────<br/>算法:<br/>• A* 全局路径搜索<br/>• Hybrid A*<br/>• 五次多项式平滑<br/>• DWA避障]
        end
        
        subgraph 英飞凌Aurix TC397平台
            direction TB
            M3[泊车控制模块<br/>PARK-CTRL v1.5.0<br/>─────────────<br/>语言: C<br/>框架: Classic AUTOSAR<br/>─────────────<br/>内存: 2MB RAM<br/>安全等级: ASIL-D<br/>─────────────<br/>接口:<br/>• CAN FD<br/>• LIN]
            A1[执行器<br/>EPS 电动转向]
            A2[执行器<br/>ESP 制动]
            A3[执行器<br/>EPB 驻车]
            
            M3 --> A1
            M3 --> A2
            M3 --> A3
        end
        
        subgraph T-BOX模块
            M4[T-BOX<br/>车云通信]
        end
    end
    
    APP <--> M4
    M4 --> M1
    M4 --> M2
    M1 -->|感知结果| M2
    M2 -->|控制指令| M3
    
    style M1 fill:#bbdefb
    style M2 fill:#c5e1a5
    style M3 fill:#ffccbc
    style APP fill:#f3e5f5
```

### 3.2 平台技术栈对比

```mermaid
graph TB
    subgraph 平台对比
        direction LR
        
        P1[地平线征程6M<br/>─────────────<br/>CPU: ARM<br/>AI: BPU 5 TOPS<br/>内存: 256MB<br/>OS: Linux<br/>框架: ROS2<br/>─────────────<br/>用途: AI感知]
        
        P2[NVIDIA Orin-X<br/>─────────────<br/>CPU: ARM Cortex-A78<br/>AI: 30 TOPS<br/>内存: 512MB<br/>OS: QNX RTOS<br/>框架: AUTOSAR AP<br/>─────────────<br/>用途: 复杂规划]
        
        P3[英飞凌Aurix TC397<br/>─────────────<br/>CPU: TriCore<br/>内存: 2MB RAM<br/>Flash: 8MB<br/>OS: 无OS/AUTOSAR<br/>框架: Classic AUTOSAR<br/>─────────────<br/>用途: 实时控制<br/>安全: ASIL-D]
    end
    
    style P1 fill:#e3f2fd
    style P2 fill:#f1f8e9
    style P3 fill:#fce4ec
```

---

## 四、 AVP数据流图

### 4.1 运行时数据流

```mermaid
sequenceDiagram
    participant APP as 手机APP
    participant TBOX as T-BOX模块
    participant PER as 泊车感知模块<br/>(征程6M)
    participant PLAN as 泊车规划模块<br/>(Orin-X)
    participant CTRL as 泊车控制模块<br/>(Aurix TC397)
    participant ACT as 执行器<br/>(EPS/ESP/EPB)
    
    APP->>TBOX: 1. 用户点击"开始泊车"
    TBOX->>PER: 2. 激活泊车功能
    TBOX->>PLAN: 2. 激活泊车功能
    
    Note over PER: 启动传感器数据采集
    PER->>PER: 3. 读取超声波雷达
    PER->>PER: 3. 读取环视摄像头
    PER->>PER: 4. 检测车位 (50m范围)
    
    PER->>PLAN: 5. 发送车位列表<br/>[位置, 类型, 占用状态]
    
    Note over PLAN: 路径规划
    PLAN->>PLAN: 6. A*全局路径搜索
    PLAN->>PLAN: 7. Hybrid A*轨迹规划
    PLAN->>PLAN: 8. 五次多项式平滑
    
    PLAN->>CTRL: 9. 发送控制指令<br/>[转向角, 油门, 刹车]
    
    Note over CTRL: 执行控制 (50Hz频率)
    CTRL->>ACT: 10. CAN信号<br/>EPS: 转向角度
    CTRL->>ACT: 10. CAN信号<br/>ESP: 油门/刹车
    CTRL->>ACT: 10. CAN信号<br/>EPB: 驻车制动
    
    ACT-->>CTRL: 11. 反馈执行状态
    CTRL-->>PLAN: 12. 反馈车辆状态
    PLAN-->>PER: 13. 请求持续感知
    
    loop 持续泊车过程 (直到完成)
        PER->>PLAN: 实时障碍物信息
        PLAN->>PLAN: 动态避障 (DWA)
        PLAN->>CTRL: 更新控制指令
        CTRL->>ACT: 执行控制
    end
    
    CTRL->>TBOX: 14. 泊车完成
    TBOX->>APP: 15. 推送完成通知
```

### 4.2 模块间接口定义

```mermaid
graph LR
    subgraph 泊车感知模块
        OUT1[输出接口<br/>─────────────<br/>parking_slots<br/>类型: ParkingSlotArray<br/>Topic: /perception/parking_slots<br/>─────────────<br/>obstacles<br/>类型: ObstacleArray<br/>Topic: /perception/obstacles]
    end
    
    subgraph 泊车规划模块
        IN1[输入接口<br/>─────────────<br/>parking_slots<br/>obstacles<br/>vehicle_state]
        OUT2[输出接口<br/>─────────────<br/>planned_path<br/>control_commands]
    end
    
    subgraph 泊车控制模块
        IN2[输入接口<br/>─────────────<br/>control_commands<br/>协议: CAN<br/>ID: 0x200]
        OUT3[输出接口<br/>─────────────<br/>eps_command: 0x301<br/>esp_command: 0x302<br/>epb_command: 0x303]
    end
    
    OUT1 -->|ROS2 Topic| IN1
    OUT2 -->|CAN消息| IN2
    
    style OUT1 fill:#e1f5ff
    style IN1 fill:#fff4e6
    style OUT2 fill:#fff4e6
    style IN2 fill:#f3e5f5
    style OUT3 fill:#f3e5f5
```

---

## 五、 软硬件解耦示例

### 5.1 平台迁移场景：从Orin-X到Thor

```mermaid
graph TB
    subgraph 当前架构 Orin-X
        direction TB
        F1[Feature: AVP v1.5]
        M1_OLD[Module: 泊车规划<br/>─────────────<br/>deploy_target: Orin_X_CPU<br/>platformId: platform-orin-x<br/>─────────────<br/>CPU: ARM Cortex-A78<br/>内存: 512MB<br/>算力: 10 TOPS]
        P1_OLD[Platform: Orin-X<br/>─────────────<br/>架构: ARM64<br/>OS: QNX RTOS<br/>算力: 30 TOPS]
        
        F1 -.实现于.-> M1_OLD
        M1_OLD -.部署于.-> P1_OLD
    end
    
    subgraph 迁移后架构 Thor
        direction TB
        F2[Feature: AVP v1.5<br/>✅ 无需修改]
        M1_NEW[Module: 泊车规划<br/>─────────────<br/>deploy_target: Thor_CPU<br/>platformId: platform-thor<br/>─────────────<br/>CPU: NVIDIA Thor ARM<br/>内存: 512MB<br/>算力: 20 TOPS]
        P1_NEW[Platform: Thor<br/>─────────────<br/>架构: ARM64<br/>OS: QNX RTOS<br/>算力: 2000 TOPS]
        
        F2 -.实现于.-> M1_NEW
        M1_NEW -.部署于.-> P1_NEW
    end
    
    M1_OLD -.升级.-> M1_NEW
    
    style F1 fill:#fff4e6
    style F2 fill:#c8e6c9
    style M1_OLD fill:#ffccbc
    style M1_NEW fill:#c8e6c9
```

### 5.2 解耦的优势

```mermaid
graph TD
    A[软硬件解耦设计]
    
    A --> B1[逻辑层<br/>Feature层<br/>─────────────<br/>定义功能做什么<br/>AVP自动泊车]
    A --> B2[实现层<br/>Module层<br/>─────────────<br/>定义怎么做<br/>感知、规划、控制]
    A --> B3[物理层<br/>Platform层<br/>─────────────<br/>定义在哪做<br/>J6M、Orin-X、Aurix]
    
    B1 --> C1[✅ 稳定性<br/>Feature需求不变]
    B2 --> C2[✅ 可移植性<br/>Module可适配新平台]
    B3 --> C3[✅ 可替换性<br/>Platform可升级]
    
    C1 --> D[价值]
    C2 --> D
    C3 --> D
    
    D --> E1[降低技术风险]
    D --> E2[支持渐进式升级]
    D --> E3[延长软件生命周期]
    
    style A fill:#e3f2fd
    style B1 fill:#fff4e6
    style B2 fill:#f3e5f5
    style B3 fill:#e8f5e9
    style D fill:#fff9c4
    style E1 fill:#c8e6c9
    style E2 fill:#c8e6c9
    style E3 fill:#c8e6c9
```

---

## 六、 资产复用场景

### 6.1 跨产品Feature复用

```mermaid
graph TB
    subgraph Feature资产库
        F_AVP[Feature: AVP<br/>v1.5.0<br/>─────────────<br/>模块:<br/>• 泊车感知<br/>• 泊车规划<br/>• 泊车控制]
        F_ACC[Feature: ACC<br/>v2.0.0]
        F_LCC[Feature: LCC<br/>v2.0.0]
    end
    
    subgraph 产品A 旗舰版
        PA[智驾旗舰版<br/>ADAS-PREMIUM]
        PA_BOM1[FeatureBOM<br/>ACC v2.0<br/>标配]
        PA_BOM2[FeatureBOM<br/>LCC v2.0<br/>标配]
        PA_BOM3[FeatureBOM<br/>AVP v1.5<br/>可选配]
        
        PA --> PA_BOM1
        PA --> PA_BOM2
        PA --> PA_BOM3
        
        PA_BOM1 -.引用.-> F_ACC
        PA_BOM2 -.引用.-> F_LCC
        PA_BOM3 -.引用.-> F_AVP
    end
    
    subgraph 产品B 标准版
        PB[智驾标准版<br/>ADAS-STANDARD]
        PB_BOM1[FeatureBOM<br/>ACC v2.0<br/>标配]
        PB_BOM2[FeatureBOM<br/>LCC v2.0<br/>标配]
        
        PB --> PB_BOM1
        PB --> PB_BOM2
        
        PB_BOM1 -.引用.-> F_ACC
        PB_BOM2 -.引用.-> F_LCC
    end
    
    subgraph 产品C 经济版
        PC[智驾经济版<br/>ADAS-ECO]
        PC_BOM1[FeatureBOM<br/>ACC v1.0<br/>标配]
        
        PC --> PC_BOM1
    end
    
    style F_AVP fill:#fff4e6,stroke:#f57c00,stroke-width:3px
    style F_ACC fill:#fff4e6,stroke:#f57c00,stroke-width:3px
    style F_LCC fill:#fff4e6,stroke:#f57c00,stroke-width:3px
    style PA fill:#e1f5ff
    style PB fill:#e1f5ff
    style PC fill:#e1f5ff
```

### 6.2 模块在多个Feature间共享

```mermaid
graph LR
    subgraph 模块资产
        M_CTRL[控制模块<br/>CHASSIS-CTRL<br/>─────────────<br/>部署: Aurix TC397<br/>安全等级: ASIL-D<br/>─────────────<br/>职责:<br/>• 横纵向控制<br/>• 线控底盘<br/>• 安全监控]
    end
    
    subgraph Feature使用方
        F1[Feature: AVP<br/>自动泊车<br/>─────────────<br/>使用:<br/>低速控制]
        F2[Feature: ACC<br/>自适应巡航<br/>─────────────<br/>使用:<br/>纵向控制]
        F3[Feature: LCC<br/>车道居中<br/>─────────────<br/>使用:<br/>横向控制]
        F4[Feature: AEB<br/>紧急制动<br/>─────────────<br/>使用:<br/>紧急制动]
    end
    
    M_CTRL -.支持.-> F1
    M_CTRL -.支持.-> F2
    M_CTRL -.支持.-> F3
    M_CTRL -.支持.-> F4
    
    style M_CTRL fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    style F1 fill:#fff4e6
    style F2 fill:#fff4e6
    style F3 fill:#fff4e6
    style F4 fill:#fff4e6
```

### 6.3 复用的价值分析

```mermaid
graph TD
    A[资产复用]
    
    A --> B1[Feature级复用<br/>─────────────<br/>AVP特性在多个产品复用<br/>降低开发成本]
    A --> B2[Module级复用<br/>─────────────<br/>控制模块支持多个特性<br/>提高质量一致性]
    A --> B3[Platform级复用<br/>─────────────<br/>硬件平台跨产品使用<br/>降低硬件成本]
    
    B1 --> C1[成本节省]
    B2 --> C2[质量保证]
    B3 --> C3[规模效应]
    
    C1 --> D[业务价值]
    C2 --> D
    C3 --> D
    
    D --> E1[缩短上市时间<br/>Time-to-Market]
    D --> E2[提高毛利率<br/>Profit Margin]
    D --> E3[增强竞争力<br/>Competitiveness]
    
    style A fill:#e3f2fd
    style B1 fill:#fff4e6
    style B2 fill:#f3e5f5
    style B3 fill:#e8f5e9
    style C1 fill:#fff9c4
    style C2 fill:#fff9c4
    style C3 fill:#fff9c4
    style D fill:#ffccbc
    style E1 fill:#c8e6c9
    style E2 fill:#c8e6c9
    style E3 fill:#c8e6c9
```

---

## 七、 AVP配置管理

### 7.1 基于硬件配置的Feature启用

```mermaid
graph TD
    Start([车辆启动]) --> Check{检查硬件配置}
    
    Check -->|检查传感器| S1{环视摄像头?}
    S1 -->|是| S2{超声波雷达?}
    S1 -->|否| Disable1[无法启用AVP<br/>缺少环视摄像头]
    
    S2 -->|是| S3{高精地图?}
    S2 -->|否| Disable2[无法启用AVP<br/>缺少超声波雷达]
    
    S3 -->|是| Check2{检查软件Feature}
    S3 -->|否| Disable3[无法启用AVP<br/>缺少高精地图]
    
    Check2 -->|检查BOM| BOM{Product包含AVP?}
    BOM -->|是| License{用户已购买?}
    BOM -->|否| Disable4[产品不支持AVP]
    
    License -->|是| Enable[✅ 启用AVP功能<br/>加载泊车模块]
    License -->|否| OTA[提示用户OTA购买<br/>或访问商城]
    
    Enable --> Run[AVP功能运行]
    OTA -.购买后.-> Enable
    
    style Start fill:#e3f2fd
    style Enable fill:#c8e6c9
    style Run fill:#c8e6c9
    style Disable1 fill:#ffccbc
    style Disable2 fill:#ffccbc
    style Disable3 fill:#ffccbc
    style Disable4 fill:#ffccbc
    style OTA fill:#fff9c4
```

### 7.2 产品配置矩阵

```mermaid
graph TB
    subgraph 产品配置矩阵
        direction LR
        
        Matrix["
        ╔═══════════════════╦═════════╦═════════╦═════════╗
        ║     Feature       ║ 旗舰版  ║ 标准版  ║ 经济版  ║
        ╠═══════════════════╬═════════╬═════════╬═════════╣
        ║ ACC (v2.0)        ║   ✅    ║   ✅    ║   ❌    ║
        ║ LCC (v2.0)        ║   ✅    ║   ✅    ║   ❌    ║
        ║ AVP (v1.5)        ║   🔧    ║   ❌    ║   ❌    ║
        ║ AEB (v2.0)        ║   ✅    ║   ✅    ║   ✅    ║
        ║ BSD (v1.0)        ║   ✅    ║   🔧    ║   ❌    ║
        ╚═══════════════════╩═════════╩═════════╩═════════╝
        
        ✅ = 标配 (Standard)
        🔧 = 可选配 (Optional)
        ❌ = 不支持 (Not Available)
        "]
    end
    
    Matrix --> Value["
    配置管理价值：
    ✓ 差异化产品定位
    ✓ 灵活的销售策略
    ✓ OTA升级解锁
    ✓ 降低库存成本
    "]
    
    style Matrix fill:#f5f5f5
    style Value fill:#e8f5e9
```

---

## 八、 关键技术细节

### 8.1 AVP算法流程

```mermaid
graph TB
    Start([开始泊车]) --> Input[输入数据<br/>─────────────<br/>• 超声波数据 12路<br/>• 环视图像 4路<br/>• 车辆状态 CAN]
    
    Input --> Perception[感知处理<br/>─────────────<br/>1. 图像预处理<br/>2. 车位线检测<br/>3. 障碍物检测<br/>4. 多传感器融合]
    
    Perception --> Slots{检测到车位?}
    Slots -->|否| Wait[继续搜索]
    Wait --> Perception
    
    Slots -->|是| Select[车位选择<br/>─────────────<br/>评估标准:<br/>• 车位尺寸 >2.4m<br/>• 距离近优先<br/>• 无障碍物]
    
    Select --> Planning[路径规划<br/>─────────────<br/>1. A*全局路径<br/>2. Hybrid A*轨迹<br/>3. 五次多项式平滑<br/>4. 碰撞检测]
    
    Planning --> Check{路径可行?}
    Check -->|否| Select
    
    Check -->|是| Control[执行控制<br/>─────────────<br/>• 频率: 50Hz<br/>• 最大速度: 5km/h<br/>• 转向角限制: ±30°]
    
    Control --> Monitor{监控状态}
    Monitor -->|检测到障碍物| Replan[动态重规划<br/>DWA避障]
    Replan --> Control
    
    Monitor -->|泊车完成| Finish([泊车成功<br/>挂P档、拉手刹])
    Monitor -->|超时/失败| Fail([泊车失败<br/>请求人工接管])
    
    style Start fill:#e3f2fd
    style Perception fill:#e1f5ff
    style Planning fill:#fff4e6
    style Control fill:#f3e5f5
    style Finish fill:#c8e6c9
    style Fail fill:#ffccbc
```

---

## 九、 总结

### 9.1 AVP案例覆盖的关键概念

```mermaid
mindmap
    root((AVP案例<br/>核心概念))
        产品层
            Product定义
            FeatureBOM
                标配Feature
                可选Feature
            Platform依赖
                硬件平台
                软件平台
        功能层
            Feature资产
                独立版本
                可复用
            Feature依赖
                高精地图
                传感器
            Feature→Module映射
        模块层
            Module技术栈
                语言框架
                编译工具
            部署目标
                征程6M
                Orin-X
                Aurix TC397
            硬件依赖
                CPU内存
                算力要求
        追溯链
            UR→FR→MR
            MR→Task→Commit
            MR→TestCase
        解耦设计
            逻辑物理分离
            平台可替换
            模块可复用
```

### 9.2 与当前实现的核心差距（可视化视角）

```mermaid
graph LR
    subgraph AVP案例设计
        A1[✅ Feature作为独立资产]
        A2[✅ FeatureBOM清晰]
        A3[✅ Module部署信息详细]
        A4[✅ Platform管理完整]
        A5[✅ 追溯链完整]
    end
    
    subgraph 当前实现
        B1[❌ Feature概念混淆]
        B2[❌ 无FeatureBOM]
        B3[❌ Module缺部署信息]
        B4[❌ Platform缺失]
        B5[✅ 追溯链完整]
    end
    
    A1 -.严重差距.-> B1
    A2 -.严重差距.-> B2
    A3 -.严重差距.-> B3
    A4 -.严重差距.-> B4
    A5 -.无差距.-> B5
    
    style A1 fill:#c8e6c9
    style A2 fill:#c8e6c9
    style A3 fill:#c8e6c9
    style A4 fill:#c8e6c9
    style A5 fill:#c8e6c9
    style B1 fill:#ffccbc
    style B2 fill:#ffccbc
    style B3 fill:#ffccbc
    style B4 fill:#ffccbc
    style B5 fill:#c8e6c9
```

### 9.3 AVP案例的价值

1. **产品线工程** - 通过FeatureBOM实现差异化配置（旗舰版有AVP，标准版无）
2. **软硬件解耦** - 通过deploy_target实现平台迁移（Orin-X → Thor）
3. **模块复用** - 控制模块同时支持AVP、ACC、LCC
4. **完整追溯** - 从用户需求"一键泊车"到代码提交SHA的全链路
5. **配置管理** - 基于硬件配置动态启用Feature，支持OTA解锁

---

**相关文档**:
- [06-AVP_CASE_STUDY.md](./06-AVP_CASE_STUDY.md) - AVP案例详细文字描述
- [01-DOMAIN_MODEL_COMPARISON-visualization.md](./01-DOMAIN_MODEL_COMPARISON-visualization.md) - 领域模型对比可视化
- [05-IMPROVEMENT_PLAN.md](./05-IMPROVEMENT_PLAN.md) - 详细改进方案

