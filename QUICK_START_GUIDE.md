# 🚀 快速开始指南

## 📋 目录

1. [系统概述](#系统概述)
2. [环境准备](#环境准备)
3. [快速启动](#快速启动)
4. [核心功能](#核心功能)
5. [常见场景](#常见场景)
6. [常见问题](#常见问题)

---

## 📖 系统概述

本系统是一个**智能汽车研发管理平台**，支持从项目规划到迭代交付的完整研发价值流。

### 核心功能模块

```
📦 项目管理
  ├─ 车型项目管理
  └─ 领域项目管理

📦 资产管理
  ├─ 产品线管理
  ├─ 产品管理
  ├─ 特性管理
  └─ 模块管理

📦 需求管理
  ├─ 用户需求
  ├─ 特性需求
  └─ 模块需求

📦 PI Planning
  ├─ PI 工作区
  └─ PI 列表

📦 Backlog 管理
  ├─ 项目待办
  └─ 团队待办

📦 Sprint 管理
  ├─ Sprint 列表
  └─ Sprint 详情

📦 版本管理
  ├─ 版本列表
  └─ 特性包管理
```

---

## 🛠️ 环境准备

### 必需软件

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **Git**: >= 2.30.0

### 检查环境

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 Git 版本
git --version
```

---

## 🚀 快速启动

### 方法 1: 使用一键启动脚本（推荐）

#### macOS/Linux:
```bash
chmod +x start.sh
./start.sh
```

#### Windows:
```cmd
start.bat
```

---

### 方法 2: 手动启动

#### 步骤 1: 克隆代码
```bash
git clone https://github.com/zjx-immersion/domain-model-design.git
cd domain-model-design
```

#### 步骤 2: 安装依赖
```bash
cd frontend
npm install
```

#### 步骤 3: 启动开发服务器
```bash
npm run dev
```

#### 步骤 4: 访问系统
打开浏览器访问: **http://localhost:9080**

---

## 🔑 登录系统

### 默认账号

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 管理员 | admin | admin123 | 全部功能 |
| 产品经理 | pm | pm123 | 产品和需求管理 |
| 开发人员 | dev | dev123 | 开发功能 |

---

## 🎯 核心功能

### 1. 项目管理

#### 车型项目管理

**访问路径**: 导航栏 → 项目管理 → 车型项目

**功能说明**:
- 创建和管理车型项目
- 查看项目进度和统计
- 关联领域项目
- 管理项目目标和里程碑

**操作步骤**:
1. 点击"新建车型项目"
2. 填写项目基本信息
3. 设置项目负责人和时间
4. 添加项目目标
5. 保存并创建

---

#### 领域项目管理

**访问路径**: 导航栏 → 项目管理 → 领域项目

**功能说明**:
- 创建技术领域项目（智能驾驶、智能座舱、电子电器）
- 规划产品版本
- 创建 PI Planning
- 管理团队和产品

**操作步骤**:
1. 点击"新建领域项目"
2. 选择技术领域
3. 关联车型项目
4. 设置项目团队
5. 规划版本和 PI

---

### 2. PI Planning

**访问路径**: 导航栏 → PI Planning

**核心流程**:

```
1. 创建 PI Planning
   ↓
2. 定义 PI 目标
   ↓
3. 关联特性包
   ↓
4. 团队容量规划
   ↓
5. 风险识别
   ↓
6. 置信度投票
   ↓
7. 生成 ProjectBacklog
```

**关键操作**:
- 在 PI 工作区查看项目信息（所属领域项目、车型项目）
- 拖拽特性到 PI Objectives
- 评估团队容量
- 记录风险和依赖
- 进行置信度投票

---

### 3. Backlog 管理

#### ProjectBacklog

**访问路径**: 导航栏 → Backlog管理 → 项目待办

**功能说明**:
- 查看 PI Planning 生成的工作项
- 按模块、团队筛选
- 分配工作项到 TeamBacklog

**操作流程**:
```
PI Planning 结束
  ↓
自动生成 ProjectBacklog
  ↓
筛选和排序工作项
  ↓
分配给团队
```

---

#### TeamBacklog

**访问路径**: 导航栏 → Backlog管理 → 团队待办

**功能说明**:
- 管理团队级工作项
- 调整优先级
- 拉取工作项到 Sprint

**操作流程**:
```
从 ProjectBacklog 拉取工作项
  ↓
团队评审和评估
  ↓
调整优先级
  ↓
Sprint Planning 拉取到 Sprint
```

---

### 4. Sprint 管理

**访问路径**: 导航栏 → Sprint 管理 → Sprint 列表

**功能说明**:
- 创建 Sprint
- 查看 Sprint 详情
- 追溯到 TeamBacklog（新功能）
- 跟踪 Sprint 进度

**Sprint 详情页新增**:
- **来源Backlog**: 显示工作项来源的 TeamBacklog，可点击跳转

---

### 5. 版本管理

**访问路径**: 导航栏 → 资产管理 → 版本管理

**功能说明**:
- 管理产品版本
- 规划版本特性
- 跟踪版本进度
- 版本发布管理

---

### 6. 特性包管理

**访问路径**: 导航栏 → 资产管理 → 特性包管理

**功能说明**:
- 定义特性基线
- 管理特性包配置
- 关联到 PI Planning
- 跟踪特性状态

---

## 📱 常见场景

### 场景 1: 新车型项目启动

```
1. 创建车型项目
   路径: 项目管理 → 车型项目 → 新建
   
2. 创建领域项目
   路径: 项目管理 → 领域项目 → 新建
   关联到车型项目
   
3. 规划产品版本
   路径: 领域项目详情 → 版本规划
   
4. 创建 PI Planning
   路径: PI Planning → 新建
   关联到领域项目
```

---

### 场景 2: PI Planning 到 Sprint 执行

```
1. 进行 PI Planning
   路径: PI Planning → PI 工作区
   • 查看项目信息（车型项目、领域项目）
   • 定义 PI 目标
   • 关联特性包
   • 评估容量
   
2. 查看 ProjectBacklog
   路径: Backlog管理 → 项目待办
   • 查看工作项列表
   • 分配给团队
   
3. 管理 TeamBacklog
   路径: Backlog管理 → 团队待办
   • 调整优先级
   • 评估工作量
   
4. Sprint Planning
   路径: Sprint 管理 → 新建 Sprint
   • 从 TeamBacklog 拉取工作项
   • 制定 Sprint 目标
   
5. Sprint 执行
   路径: Sprint 详情
   • 查看来源 Backlog（新增）
   • 跟踪进度
   • 每日站会
```

---

### 场景 3: 追溯数据关系

#### 从 PI Planning 追溯到项目

```
PI Planning 页面
  ↓ 点击项目信息卡片
领域项目详情
  ↓ 点击车型项目链接
车型项目详情
```

#### 从 Sprint 追溯到 Backlog

```
Sprint 详情页
  ↓ 点击"来源Backlog"链接
TeamBacklog 页面
  ↓ 查看来源信息
ProjectBacklog 页面
  ↓ 查看 PI Planning
PI Planning 详情
```

---

## ❓ 常见问题

### Q1: 如何修改启动端口？

**A**: 编辑 `frontend/vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 9080, // 修改为你想要的端口
  },
})
```

---

### Q2: 如何添加新的测试数据？

**A**: 编辑对应的 Mock 数据文件:
- 车型项目: `biz-data/mock/project/vehicle-projects.json`
- 领域项目: `biz-data/mock/project/domain-projects.json`
- ProjectBacklog: `biz-data/mock/backlog/project-backlogs.json`
- TeamBacklog: `biz-data/mock/backlog/team-backlogs.json`

---

### Q3: 页面加载失败怎么办？

**A**: 按以下步骤排查:
1. 检查控制台错误信息
2. 确认 Mock 数据文件存在
3. 检查路由配置是否正确
4. 清除浏览器缓存后重新加载
5. 重启开发服务器

---

### Q4: 如何查看项目的完整数据流？

**A**: 完整数据流追溯路径:

```
车型项目
  ↓ (关联)
领域项目
  ↓ (规划)
产品版本
  ↓ (基于)
PI Planning
  ↓ (生成)
ProjectBacklog
  ↓ (分配)
TeamBacklog
  ↓ (拉取)
Sprint
  ↓ (执行)
任务完成
```

**操作方式**:
1. 从车型项目列表开始
2. 点击项目详情
3. 查看关联的领域项目
4. 点击领域项目，查看 PI Planning 列表
5. 进入 PI Planning 详情
6. 查看生成的 ProjectBacklog
7. 查看分配的 TeamBacklog
8. 查看 Sprint 列表
9. 进入 Sprint 详情，查看"来源Backlog"

---

### Q5: 如何添加新的导航菜单？

**A**: 编辑 `frontend/src/components/Layout/MainLayout.vue`:

```vue
<el-menu-item index="/your-path">
  <el-icon><YourIcon /></el-icon>
  <span>菜单名称</span>
</el-menu-item>
```

同时在 `frontend/src/router/index.ts` 添加对应路由。

---

## 📚 进阶学习

### 架构文档

- [业务架构设计](./Architecture/v2/01-business/BUSINESS_ARCHITECTURE_V3.md)
- [领域模型设计](./Architecture/v2/02-domain/DOMAIN_MODEL_DESIGN.md)
- [项目管理设计](./Architecture/v2/08-project/PROJECT_MANAGEMENT_DESIGN.md)
- [数据关系分析](./Architecture/v2/05-data/DATA_RELATIONSHIP_ANALYSIS.md)

---

### 实施文档

- [M2-M3-M4 实施总结](./project-for-v3-arch/M2-M3-M4_IMPLEMENTATION_SUMMARY.md)
- [系统集成验证](./project-for-v3-arch/INTEGRATION_VERIFICATION.md)
- [P0-P1 优化完成](./project-for-v3-arch/P0_P1_OPTIMIZATION_COMPLETE.md)

---

## 🆘 获取帮助

### 技术支持

- **Issue 报告**: [GitHub Issues](https://github.com/zjx-immersion/domain-model-design/issues)
- **文档中心**: `./Architecture/` 目录
- **开发指南**: `./project-for-v3-arch/` 目录

---

### 联系方式

- **项目负责人**: 架构团队
- **技术支持**: 开发团队

---

## 🎉 开始使用

现在你已经准备好了！

1. ✅ 启动系统: `./start.sh` 或 `npm run dev`
2. ✅ 访问: `http://localhost:9080`
3. ✅ 登录: 使用默认账号 `admin/admin123`
4. ✅ 探索: 从项目管理开始，体验完整流程

祝你使用愉快！🚀

---

**文档版本**: v1.0  
**更新日期**: 2025-01-08  
**维护团队**: 架构团队
