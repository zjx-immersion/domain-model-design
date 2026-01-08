# 📦 迁移指南

## 📋 目录

1. [迁移概述](#迁移概述)
2. [架构变更](#架构变更)
3. [数据模型变更](#数据模型变更)
4. [迁移步骤](#迁移步骤)
5. [影响分析](#影响分析)
6. [回滚方案](#回滚方案)

---

## 🎯 迁移概述

本迁移指南描述了从**旧架构 (v1)** 到**新架构 (v2)** 的升级路径，核心变更是引入**项目管理体系**。

### 迁移目标

1. ✅ 引入车型项目和领域项目概念
2. ✅ 完善项目-产品关系
3. ✅ 建立完整的数据流（车型项目 → Sprint）
4. ✅ 增强数据追溯能力
5. ✅ 保持向后兼容

---

## 📐 架构变更

### v1 架构 (旧)

```
Product (产品)
  ↓
Feature (特性)
  ↓
Module (模块)
  ↓
PI Planning
  ↓
Sprint
```

**问题**:
- ❌ 缺少项目管理层
- ❌ 产品与 PI Planning 关系不清晰
- ❌ 无法支撑多车型项目
- ❌ 团队职责划分不明确

---

### v2 架构 (新)

```
VehicleProject (车型项目)
  ↓
DomainProject (领域项目)
  ├─ Product (产品)
  ├─ Team (团队)
  └─ PI Planning
       ↓
     ProjectBacklog
       ↓
     TeamBacklog
       ↓
     Sprint
```

**改进**:
- ✅ 清晰的项目层级
- ✅ 明确的职责划分
- ✅ 完整的数据流
- ✅ 更好的追溯性

---

## 🔄 数据模型变更

### 新增实体

#### 1. VehicleProject (车型项目)
```typescript
interface VehicleProject {
  id: string
  code: string
  name: string
  description: string
  status: ProjectStatus
  priority: ProjectPriority
  startDate: string
  endDate: string
  ownerId: string
  associatedDomainProjects: string[]
  objectives: ProjectObjective[]
  // ... 其他字段
}
```

**作用**: 顶层项目，对应一个车型开发项目

---

#### 2. DomainProject (领域项目)
```typescript
interface DomainProject {
  id: string
  code: string
  name: string
  domain: string // "智能驾驶" | "智能座舱" | "电子电器"
  vehicleProjectId: string
  associatedProducts: string[]
  teamIds: string[]
  piPlanningIds: string[]
  projectVersions: ProjectVersion[]
  // ... 其他字段
}
```

**作用**: 技术领域项目，连接车型项目和产品

---

#### 3. ProjectBacklog (项目待办)
```typescript
interface ProjectBacklog {
  id: string
  projectId: string // DomainProject ID
  name: string
  piPlanningId: string
  items: BacklogItem[]
  // ... 其他字段
}
```

**作用**: PI Planning 生成的工作项集合

---

#### 4. TeamBacklog (团队待办)
```typescript
interface TeamBacklog {
  id: string
  teamId: string
  projectId: string // DomainProject ID
  projectBacklogId: string
  capacity: number
  items: BacklogItem[]
  // ... 其他字段
}
```

**作用**: 团队级工作项队列

---

### 修改的实体

#### PI Planning
**新增字段**:
```typescript
interface PIPlanning {
  // ... 原有字段
  domainProjectId: string // 新增：所属领域项目
}
```

---

#### Product
**新增字段**:
```typescript
interface Product {
  // ... 原有字段
  domainProjectIds: string[] // 新增：关联的领域项目
}
```

---

#### Sprint
**新增字段**:
```typescript
interface Sprint {
  // ... 原有字段
  teamBacklogId: string // 新增：来源 TeamBacklog
}
```

---

## 🚀 迁移步骤

### Phase 1: 数据备份 (必须)

#### 步骤 1.1: 备份当前数据
```bash
# 备份 Mock 数据
cd biz-data/mock
tar -czf backup_$(date +%Y%m%d).tar.gz .
mv backup_*.tar.gz ../../backups/
```

#### 步骤 1.2: 备份数据库 (如果使用)
```bash
# PostgreSQL 示例
pg_dump -U username -d dbname > backup_$(date +%Y%m%d).sql
```

---

### Phase 2: 代码迁移

#### 步骤 2.1: 切换分支
```bash
# 从 main 分支创建迁移分支
git checkout main
git pull origin main
git checkout -b feature/migrate-to-v2

# 或者直接使用已有分支
git checkout feature/project-product-adjust
git pull origin feature/project-product-adjust
```

#### 步骤 2.2: 安装依赖
```bash
cd frontend
npm install
```

#### 步骤 2.3: 运行数据迁移脚本 (如需要)
```bash
# 如果有数据迁移脚本
npm run migrate
```

---

### Phase 3: 数据迁移

#### 步骤 3.1: 创建车型项目数据

**现有产品映射到车型项目**:
```javascript
// 示例映射规则
const vehicleProjectMapping = {
  // 现有产品归属到对应车型项目
  'prod-001': 'vp-001', // 智能驾驶产品 → 2025款车型项目
  'prod-002': 'vp-001',
  'prod-003': 'vp-001',
  // ...
}
```

**手动创建** `vehicle-projects.json`:
```json
{
  "data": [
    {
      "id": "vp-001",
      "code": "VP-2025-001",
      "name": "2025款智能驾驶车型项目",
      "status": "in_progress",
      // ... 其他字段
    }
  ]
}
```

---

#### 步骤 3.2: 创建领域项目数据

**按技术领域分组**:
```javascript
// 智能驾驶领域
const adDomainProject = {
  id: 'dp-001',
  name: '智能驾驶V3.1项目',
  domain: '智能驾驶',
  vehicleProjectId: 'vp-001',
  associatedProducts: ['prod-001', 'prod-002'],
  // ...
}
```

---

#### 步骤 3.3: 更新 PI Planning 数据

**添加 domainProjectId**:
```json
{
  "id": "pi-001",
  "name": "PI 2025-Q1",
  "domainProjectId": "dp-001", // 新增
  // ... 其他字段
}
```

---

#### 步骤 3.4: 创建 Backlog 数据

**根据 PI Planning 生成**:
```json
{
  "id": "pb-001",
  "projectId": "dp-001",
  "piPlanningId": "pi-001",
  "items": [
    // 从 PI Planning 的 features 生成 BacklogItem
  ]
}
```

---

### Phase 4: 路由和导航更新

#### 步骤 4.1: 更新路由配置

**已自动完成**，新路由已添加:
- `/projects/vehicle` - 车型项目列表
- `/projects/vehicle/:id` - 车型项目详情
- `/projects/domain` - 领域项目列表
- `/projects/domain/:id` - 领域项目详情
- `/backlog/project/:id` - 项目待办
- `/backlog/team/:id` - 团队待办

#### 步骤 4.2: 更新导航菜单

**已自动完成**，新菜单项已添加:
- 项目管理 → 车型项目
- 项目管理 → 领域项目
- Backlog管理 → 项目待办
- Backlog管理 → 团队待办

---

### Phase 5: 功能测试

#### 步骤 5.1: 启动系统
```bash
cd frontend
npm run dev
```

#### 步骤 5.2: 功能测试清单

##### ✅ 项目管理测试
- [ ] 访问车型项目列表
- [ ] 查看车型项目详情
- [ ] 访问领域项目列表
- [ ] 查看领域项目详情
- [ ] 验证项目间的关联关系

##### ✅ PI Planning 集成测试
- [ ] 访问 PI Planning 页面
- [ ] 验证项目信息卡片显示
- [ ] 点击项目链接跳转
- [ ] 验证数据加载正确

##### ✅ Sprint 集成测试
- [ ] 访问 Sprint 详情页
- [ ] 验证"来源Backlog"字段显示
- [ ] 点击 Backlog 链接跳转
- [ ] 验证数据追溯正确

##### ✅ Backlog 测试
- [ ] 访问 ProjectBacklog 页面
- [ ] 访问 TeamBacklog 页面
- [ ] 验证数据加载
- [ ] 验证与 PI Planning 关联

---

### Phase 6: 部署

#### 步骤 6.1: 构建生产版本
```bash
cd frontend
npm run build
```

#### 步骤 6.2: 部署到环境
```bash
# 根据你的部署方式
# 示例: 使用 Docker
docker build -t domain-model-design:v2 .
docker run -p 9080:80 domain-model-design:v2
```

---

## 📊 影响分析

### 前端影响

#### 破坏性变更: ❌ 无

**原因**: 新架构完全向后兼容
- 旧路由保留并继续工作
- 旧组件未被删除
- 数据结构向后兼容

---

#### 新增功能: ✅

1. **项目管理页面**:
   - VehicleProjectList
   - VehicleProjectDetail
   - DomainProjectList
   - DomainProjectDetail

2. **Backlog 管理页面**:
   - ProjectBacklog
   - TeamBacklog

3. **增强的页面**:
   - PI Planning 页面（项目信息卡片）
   - Sprint 详情页（Backlog 链接）

---

### 数据影响

#### 新增数据文件:
- `biz-data/mock/project/vehicle-projects.json`
- `biz-data/mock/project/domain-projects.json`
- `biz-data/mock/backlog/project-backlogs.json`
- `biz-data/mock/backlog/team-backlogs.json`

#### 修改的数据文件:
- `data/projects/pi-plannings.json` (添加 domainProjectId)
- `biz-data/mock/products/*.json` (添加 domainProjectIds)

---

### 用户影响

#### 无影响的用户:
- 只使用旧功能的用户
- 不需要项目管理的用户

#### 受益的用户:
- 需要项目管理的用户
- 需要多车型项目管理的用户
- 需要完整数据追溯的用户

---

## 🔧 兼容性策略

### 旧功能保留

1. **旧路由保留**:
   - `/projects/list` - 项目列表（旧）
   - `/projects/:id` - 项目详情（旧）

2. **旧组件保留**:
   - `Project/List.vue`
   - `Project/Detail.vue`

3. **数据兼容**:
   - 旧数据结构继续支持
   - 新字段为可选字段

---

### 渐进式迁移

**建议策略**:
```
Phase 1 (Week 1-2):
  - 仅使用新路由查看数据
  - 验证数据正确性
  - 熟悉新功能

Phase 2 (Week 3-4):
  - 开始在新架构中创建项目
  - 与旧数据并行运行

Phase 3 (Week 5-6):
  - 逐步迁移旧项目到新架构
  - 更新工作流程

Phase 4 (Week 7+):
  - 完全迁移到新架构
  - 弃用旧路由（可选）
```

---

## 🔙 回滚方案

### 场景 1: 发现严重 Bug

#### 紧急回滚步骤:
```bash
# 1. 切换回 main 分支
git checkout main

# 2. 恢复备份数据
cd biz-data/mock
tar -xzf ../../backups/backup_YYYYMMDD.tar.gz

# 3. 重启服务
cd frontend
npm run dev
```

---

### 场景 2: 功能不符合预期

#### 回退到旧功能:
- 使用旧路由 `/projects/list` 而不是新路由
- 数据未被修改，可以无缝回退

---

### 场景 3: 数据丢失

#### 恢复数据:
```bash
# 从备份恢复
cp -r backups/backup_YYYYMMDD/* biz-data/mock/

# 或从 Git 恢复
git checkout HEAD~1 -- biz-data/mock/
```

---

## ✅ 迁移检查清单

### 迁移前检查

- [ ] 完整备份当前数据
- [ ] 记录当前系统版本
- [ ] 通知所有用户迁移计划
- [ ] 准备回滚方案
- [ ] 确认测试环境可用

---

### 迁移中检查

- [ ] 验证新代码编译通过
- [ ] 验证所有依赖安装成功
- [ ] 运行数据迁移脚本
- [ ] 验证新数据文件创建成功
- [ ] 运行测试用例

---

### 迁移后验证

- [ ] 访问所有新页面
- [ ] 验证数据显示正确
- [ ] 测试所有链接跳转
- [ ] 验证数据追溯链
- [ ] 性能测试
- [ ] 用户验收测试

---

## 📋 常见问题

### Q1: 迁移后旧数据会丢失吗？

**A**: 不会。新架构完全向后兼容，旧数据继续保留并可用。

---

### Q2: 必须立即使用新功能吗？

**A**: 不必须。你可以继续使用旧功能，逐步过渡到新架构。

---

### Q3: 如果迁移失败怎么办？

**A**: 按照回滚方案恢复到旧版本，不会有数据丢失。

---

### Q4: 迁移需要多长时间？

**A**: 
- 技术迁移: 1-2 小时（代码和数据）
- 功能测试: 2-4 小时
- 用户培训: 1-2 天
- 完全迁移: 4-6 周（渐进式）

---

### Q5: 是否需要停机维护？

**A**: 不需要。新旧架构可以并行运行，零停机迁移。

---

## 🎯 迁移成功标准

### 技术标准

- ✅ 所有页面可正常访问
- ✅ 数据加载正确
- ✅ 链接跳转正常
- ✅ 无 JavaScript 错误
- ✅ 性能无明显下降

---

### 业务标准

- ✅ 用户可以创建车型项目
- ✅ 用户可以创建领域项目
- ✅ 项目-产品关系清晰
- ✅ PI Planning 显示项目信息
- ✅ Sprint 可以追溯到 Backlog
- ✅ 完整数据流可追溯

---

## 📞 支持联系

### 技术支持

- **技术问题**: 开发团队
- **数据问题**: 数据团队
- **业务问题**: 产品团队

### 紧急联系

- **紧急回滚**: 运维团队
- **数据恢复**: DBA团队

---

## 📚 参考资料

1. [项目管理设计文档](./Architecture/v2/08-project/PROJECT_MANAGEMENT_DESIGN.md)
2. [系统集成验证报告](./project-for-v3-arch/INTEGRATION_VERIFICATION.md)
3. [快速开始指南](./QUICK_START_GUIDE.md)
4. [架构重构计划](./project-for-v3-arch/RESTRUCTURE_PLAN.md)

---

**迁移指南版本**: v1.0  
**更新日期**: 2025-01-08  
**维护团队**: 架构团队  
**状态**: ✅ 完成

