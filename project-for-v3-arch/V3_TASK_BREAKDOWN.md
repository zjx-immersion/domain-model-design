# V3架构实施任务拆分

> **文档版本**: v1.0  
> **创建日期**: 2026-01-11  
> **目的**: 详细的任务拆分和工作指引

---

## 📋 任务总览

### 总体统计

```
总任务数: 35个
总工作量: 193小时 ≈ 24个工作日（3-4周）

P0任务: 16个, 82小时 ≈ 10工作日（2周）
P1任务: 13个, 63小时 ≈ 8工作日（1.5周）
P2任务: 6个, 48小时 ≈ 6工作日（1周）
```

### 按阶段分布

| 阶段 | 任务数 | 工作量 | 完成标准 |
|------|--------|--------|---------|
| Phase 1: 数据完善 | 6 | 18h | 数据验证100% |
| Phase 2: 核心页面 | 15 | 73h | 页面功能完整 |
| Phase 3: 追溯可视化 | 5 | 34h | 追溯链路可见 |
| Phase 4: 集成验证 | 4 | 20h | 验证通过 |
| Phase 5: 优化提升 | 5 | 48h | 用户体验优良 |

---

## Phase 1: 数据完善与补充

### 任务 D1.1: 重构Project Backlog数据 ⭐⭐⭐⭐⭐

**优先级**: P0  
**工作量**: 4小时  
**负责人**: 数据工程师

**目标**: 重构Project Backlog数据，使其完整关联FR/MR、PI Planning、Sprint

**当前问题**:
- Project Backlog数据存在，但与实际需求脱节
- 缺少FR（Feature Requirement）数据
- MR（Module Requirement）关联不完整
- 与PI Planning的关联不清晰

**任务详情**:

1. **分析现有数据结构**（30分钟）
   ```bash
   # 查看现有Project Backlog
   cat biz-data/mock/backlog/project-backlogs.json
   
   # 查看关联的PI Planning
   cat biz-data/mock/project/pi-details.json
   
   # 查看Feature Requirements
   cat biz-data/mock/requirement/feature-requirements.json
   
   # 查看Module Requirements
   cat biz-data/mock/requirement/module-requirements.json
   ```

2. **设计新的数据结构**（1小时）
   ```typescript
   interface ProjectBacklog {
     id: string;                          // "PB-PI-2025-Q1"
     name: string;                        // "2025 Q1 PI Planning - 项目待办"
     description: string;
     piPlanningId: string;                // 关联PI Planning
     piName: string;
     domainProjectIds: string[];          // 关联领域项目
     
     // FR列表（新增）
     featureRequirements: {
       id: string;                        // "FR-PARK-001"
       title: string;
       priority: string;                  // "p0" | "p1" | "p2"
       status: string;                    // "backlog" | "in_sprint" | "done"
       relatedFeatureAssetId?: string;    // 关联Feature资产
       storyPoints: number;
       assignedSprintId?: string;         // 已分配到哪个Sprint
     }[];
     
     // MR列表
     moduleRequirements: {
       id: string;                        // "MR-PARK-PER-001"
       title: string;
       priority: string;
       status: string;
       moduleId: string;                  // 关联Module
       assignedTeamId: string;            // 自动分配的Team
       storyPoints: number;
       assignedSprintId?: string;
       parentFeatureRequirementId: string; // 父FR
     }[];
     
     // 统计信息
     statistics: {
       totalFRs: number;
       totalMRs: number;
       totalStoryPoints: number;
       assignedStoryPoints: number;
       remainingStoryPoints: number;
       frByStatus: Record<string, number>;
       mrByStatus: Record<string, number>;
     };
     
     // Sprint分配
     sprintAllocation: {
       sprintId: string;
       sprintName: string;
       frIds: string[];
       mrIds: string[];
       totalSP: number;
     }[];
   }
   ```

3. **生成数据**（2小时）
   ```typescript
   // 创建脚本: scripts/generate-project-backlog.ts
   
   // 步骤1: 加载现有数据
   const piPlannings = loadJSON('biz-data/mock/project/pi-details.json');
   const featureRequirements = loadJSON('biz-data/mock/requirement/feature-requirements.json');
   const moduleRequirements = loadJSON('biz-data/mock/requirement/module-requirements.json');
   const sprints = loadJSON('biz-data/mock/sprint/sprints.json');
   
   // 步骤2: 为每个PI Planning创建Project Backlog
   const projectBacklogs = piPlannings.map(pi => {
     // 筛选属于这个PI的FR（基于productId和时间范围）
     const piFRs = featureRequirements.filter(fr => 
       fr.productId === pi.productId && 
       isInPIPeriod(fr.createdAt, pi.startDate, pi.endDate)
     );
     
     // 筛选属于这些FR的MR
     const piMRs = moduleRequirements.filter(mr =>
       piFRs.some(fr => fr.id === mr.parentFeatureRequirementId)
     );
     
     // 分配到Sprint（前70%的FR/MR分配到Sprint）
     const assignedFRs = assignToSprints(piFRs, sprints, 0.7);
     const assignedMRs = assignToSprints(piMRs, sprints, 0.7);
     
     return {
       id: `PB-${pi.id}`,
       name: `${pi.name} - 项目待办`,
       piPlanningId: pi.id,
       featureRequirements: assignedFRs,
       moduleRequirements: assignedMRs,
       statistics: calculateStatistics(assignedFRs, assignedMRs),
       sprintAllocation: groupBySprint(assignedFRs, assignedMRs, sprints)
     };
   });
   
   // 步骤3: 保存数据
   saveJSON('biz-data/mock/backlog/project-backlogs.json', projectBacklogs);
   ```

4. **数据验证**（30分钟）
   ```typescript
   // 验证脚本: scripts/validate-project-backlog.ts
   
   function validateProjectBacklog(backlog: ProjectBacklog) {
     // 验证1: PI Planning存在
     assert(piPlannings.some(pi => pi.id === backlog.piPlanningId));
     
     // 验证2: FR数量 >= 10
     assert(backlog.featureRequirements.length >= 10);
     
     // 验证3: MR数量 >= 30
     assert(backlog.moduleRequirements.length >= 30);
     
     // 验证4: 所有FR的relatedFeatureAssetId有效
     backlog.featureRequirements.forEach(fr => {
       if (fr.relatedFeatureAssetId) {
         assert(features.some(f => f.id === fr.relatedFeatureAssetId));
       }
     });
     
     // 验证5: 所有MR的moduleId有效
     backlog.moduleRequirements.forEach(mr => {
       assert(modules.some(m => m.id === mr.moduleId));
     });
     
     // 验证6: 统计数据正确
     assert(backlog.statistics.totalFRs === backlog.featureRequirements.length);
     assert(backlog.statistics.totalMRs === backlog.moduleRequirements.length);
   }
   ```

**交付物**:
- ✅ `biz-data/mock/backlog/project-backlogs.json` (更新)
- ✅ `scripts/generate-project-backlog.ts` (新建)
- ✅ `scripts/validate-project-backlog.ts` (新建)
- ✅ 数据验证报告

**验收标准**:
- [ ] 每个PI Planning有对应的Project Backlog
- [ ] 每个Project Backlog包含10+ FR
- [ ] 每个Project Backlog包含30+ MR
- [ ] 70%的FR/MR已分配到Sprint
- [ ] 所有关联ID有效
- [ ] 统计数据准确

---

### 任务 D1.2: 重构Team Backlog数据 ⭐⭐⭐⭐⭐

**优先级**: P0  
**工作量**: 4小时  
**负责人**: 数据工程师

**目标**: 重构Team Backlog数据，使其完整关联MR/Task、Team、Sprint

**当前问题**:
- Team Backlog数据存在，但与实际团队脱节
- 缺少MR到Task的拆分
- 与Team的关联不完整
- Sprint分配不清晰

**任务详情**:

1. **设计新的数据结构**（1小时）
   ```typescript
   interface TeamBacklog {
     id: string;                          // "TB-TEAM-001-Q1"
     name: string;                        // "感知团队 - 2025 Q1 待办"
     teamId: string;                      // 关联Team
     teamName: string;
     piPlanningId: string;                // 关联PI Planning
     projectBacklogId: string;            // 关联Project Backlog
     
     // MR列表（分配给这个团队的）
     moduleRequirements: {
       id: string;                        // "MR-PARK-PER-001"
       title: string;
       priority: string;
       status: string;                    // "backlog" | "in_progress" | "done"
       moduleId: string;
       storyPoints: number;
       assignedSprintId?: string;
       
       // MR拆分的Task
       tasks: {
         id: string;                      // "TASK-PARK-001"
         title: string;
         type: string;                    // "task" | "technical_task" | "test_task"
         assignee: string;                // 具体开发人员
         storyPoints: number;
         status: string;
         assignedSprintId?: string;
       }[];
     }[];
     
     // 统计信息
     statistics: {
       totalMRs: number;
       totalTasks: number;
       totalStoryPoints: number;
       assignedStoryPoints: number;
       teamCapacity: number;               // 团队容量（SP/Sprint）
       remainingCapacity: number;
       utilizationRate: number;            // 利用率
     };
     
     // Sprint分配
     sprintAllocation: {
       sprintId: string;
       sprintName: string;
       mrIds: string[];
       taskIds: string[];
       totalSP: number;
       teamCapacity: number;
       utilizationRate: number;
     }[];
   }
   ```

2. **生成数据**（2.5小时）
   ```typescript
   // 创建脚本: scripts/generate-team-backlog.ts
   
   // 步骤1: 加载数据
   const teams = loadJSON('biz-data/mock/teams.json');
   const projectBacklogs = loadJSON('biz-data/mock/backlog/project-backlogs.json');
   const modules = loadJSON('biz-data/mock/asset/modules.json');
   const sprints = loadJSON('biz-data/mock/sprint/sprints.json');
   
   // 步骤2: 为每个Team创建Team Backlog
   const teamBacklogs = teams.map(team => {
     // 找到这个团队负责的Module
     const teamModules = modules.filter(m => m.responsibleTeamId === team.id);
     
     // 找到这些Module的MR
     const teamMRs = projectBacklogs.flatMap(pb =>
       pb.moduleRequirements.filter(mr =>
         teamModules.some(m => m.id === mr.moduleId)
       )
     );
     
     // 为每个MR生成Task
     const mrsWithTasks = teamMRs.map(mr => ({
       ...mr,
       tasks: generateTasksForMR(mr, team.members)
     }));
     
     // 分配到Sprint
     const assignedMRs = assignMRsToSprints(mrsWithTasks, sprints, team.capacity);
     
     return {
       id: `TB-${team.id}-Q1`,
       name: `${team.name} - 2025 Q1 待办`,
       teamId: team.id,
       teamName: team.name,
       moduleRequirements: assignedMRs,
       statistics: calculateTeamStatistics(assignedMRs, team.capacity),
       sprintAllocation: groupBySprintForTeam(assignedMRs, sprints, team.capacity)
     };
   });
   
   // 步骤3: 保存数据
   saveJSON('biz-data/mock/backlog/team-backlogs.json', teamBacklogs);
   ```

3. **Task生成逻辑**（示例）
   ```typescript
   function generateTasksForMR(mr: ModuleRequirement, teamMembers: TeamMember[]): Task[] {
     const tasks: Task[] = [];
     
     // 根据MR的storyPoints决定拆分多少Task
     const taskCount = Math.ceil(mr.storyPoints / 3); // 平均每个Task 3 SP
     
     for (let i = 0; i < taskCount; i++) {
       const taskType = i === 0 ? 'task' : 
                        i === taskCount - 1 ? 'test_task' : 
                        'technical_task';
       
       tasks.push({
         id: `${mr.id}-TASK-${i + 1}`,
         title: `${mr.title} - ${getTaskTypeName(taskType)}`,
         type: taskType,
         assignee: assignToMember(teamMembers, taskType),
         storyPoints: Math.min(3, mr.storyPoints - i * 3),
         status: 'backlog',
         assignedSprintId: mr.assignedSprintId
       });
     }
     
     return tasks;
   }
   ```

4. **数据验证**（30分钟）

**交付物**:
- ✅ `biz-data/mock/backlog/team-backlogs.json` (更新)
- ✅ `scripts/generate-team-backlog.ts` (新建)
- ✅ 数据验证报告

**验收标准**:
- [ ] 每个Team有对应的Team Backlog
- [ ] 每个Team Backlog包含20+ MR
- [ ] 每个MR拆分为2-5个Task
- [ ] Task总数50+
- [ ] 团队容量利用率60-90%
- [ ] 所有关联ID有效

---

### 任务 D1.3: 补充需求-资产关联数据 ⭐⭐⭐⭐⭐

**优先级**: P0  
**工作量**: 3小时  
**负责人**: 数据工程师

**目标**: 在UR/FR/MR中补充与Product/Feature/Module的关联关系

**当前问题**:
- UR缺少productId字段
- FR缺少relatedFeatureAssetId字段
- MR缺少moduleId字段
- 无法体现需求与资产的关联

**任务详情**:

1. **更新User Requirements**（1小时）
   ```typescript
   // 脚本: scripts/update-ur-product-link.ts
   
   const userRequirements = loadJSON('biz-data/mock/requirement/user-requirements.json');
   const products = loadJSON('biz-data/mock/asset/products.json');
   
   // 为每个UR分配productId
   const updatedURs = userRequirements.map(ur => {
     // 根据UR的domain匹配Product
     const matchedProduct = products.find(p => 
       p.domain === ur.domain || 
       p.name.includes(ur.title.split(' ')[0])
     );
     
     return {
       ...ur,
       productId: matchedProduct?.id || products[0].id, // 默认分配第一个产品
       relatedProductAssetId: matchedProduct?.id
     };
   });
   
   saveJSON('biz-data/mock/requirement/user-requirements.json', updatedURs);
   ```

2. **更新Feature Requirements**（1小时）
   ```typescript
   // 脚本: scripts/update-fr-feature-link.ts
   
   const featureRequirements = loadJSON('biz-data/mock/requirement/feature-requirements.json');
   const features = loadJSON('biz-data/mock/feature/features.json');
   const userRequirements = loadJSON('biz-data/mock/requirement/user-requirements.json');
   
   // 为每个FR分配relatedFeatureAssetId
   const updatedFRs = featureRequirements.map(fr => {
     // 根据FR的title匹配Feature
     const matchedFeature = features.find(f =>
       f.name.includes(fr.title.split(' ')[0]) ||
       f.domain === fr.domain
     );
     
     // 找到父UR
     const parentUR = userRequirements.find(ur =>
       ur.childFeatureRequirements?.includes(fr.id)
     );
     
     return {
       ...fr,
       productId: parentUR?.productId || products[0].id,
       relatedFeatureAssetId: matchedFeature?.id,  // 可以为null（新Feature）
       parentUserRequirementId: parentUR?.id
     };
   });
   
   saveJSON('biz-data/mock/requirement/feature-requirements.json', updatedFRs);
   ```

3. **更新Module Requirements**（1小时）
   ```typescript
   // 脚本: scripts/update-mr-module-link.ts
   
   const moduleRequirements = loadJSON('biz-data/mock/requirement/module-requirements.json');
   const modules = loadJSON('biz-data/mock/asset/modules.json');
   const featureRequirements = loadJSON('biz-data/mock/requirement/feature-requirements.json');
   
   // 为每个MR分配moduleId
   const updatedMRs = moduleRequirements.map(mr => {
     // 根据MR的title匹配Module
     const matchedModule = modules.find(m =>
       m.name.includes(mr.title.split(' ')[0]) ||
       m.domain === mr.domain
     );
     
     // 找到父FR
     const parentFR = featureRequirements.find(fr =>
       fr.childModuleRequirements?.includes(mr.id)
     );
     
     // 自动分配Team（基于Module）
     const assignedTeam = matchedModule?.responsibleTeamId;
     
     return {
       ...mr,
       moduleId: matchedModule?.id || modules[0].id,
       assignedTeamId: assignedTeam,
       parentFeatureRequirementId: parentFR?.id
     };
   });
   
   saveJSON('biz-data/mock/requirement/module-requirements.json', updatedMRs);
   ```

**交付物**:
- ✅ 更新的 `user-requirements.json`
- ✅ 更新的 `feature-requirements.json`
- ✅ 更新的 `module-requirements.json`
- ✅ 3个更新脚本

**验收标准**:
- [ ] 100% UR有productId
- [ ] 70%+ FR有relatedFeatureAssetId
- [ ] 100% MR有moduleId
- [ ] 100% MR有assignedTeamId
- [ ] 所有关联ID有效

---

### 任务 D1.4-D1.6: 数据优化（P1任务）

**D1.4: 补充Feature复用关系数据**（2小时，P1）
- 更新features.json的products字段
- 更新reuseCount字段
- 确保与FR的关联一致

**D1.5: 完善追溯关系数据**（3小时，P1）
- 更新traceability.json
- 补充UR→FR→MR→Task→Commit完整链路
- 确保双向追溯数据完整

**D1.6: 补充Module部署信息**（2小时，P1）
- 更新modules.json添加deployment字段
- 关联targetPlatformId
- 添加compatiblePlatformIds

---

## Phase 2: 核心页面实现

### 任务 P2.1.1: Feature列表页面 ⭐⭐⭐⭐⭐

**优先级**: P0  
**工作量**: 6小时  
**负责人**: 前端工程师

**目标**: 实现Feature资产列表页面，支持筛选、排序、搜索

**页面路径**: `/assets/features`  
**组件路径**: `frontend/src/views/Asset/Features.vue`

**功能需求**:

1. **数据展示**（表格）
   - 列: 编号 | 名称 | 版本 | 领域 | 类别 | 复用次数 | 状态 | 操作
   - 复用次数: 高亮显示（>=5为绿色，3-4为黄色，<3为灰色）
   - 状态: Tag显示（active/deprecated/planning）

2. **筛选功能**
   - 领域筛选: ADAS/IVI/Platform/Chassis
   - 类别筛选: 感知/规划/控制/HMI/中间件
   - 复用次数筛选: 高复用(>=5) / 中复用(3-4) / 低复用(<3)
   - 状态筛选: 激活/已废弃/规划中

3. **搜索功能**
   - 支持Feature名称/编号搜索
   - 实时搜索

4. **排序功能**
   - 复用次数排序（默认降序）
   - 创建时间排序
   - 版本号排序

5. **操作**
   - 查看详情: 跳转到Feature详情页
   - 复用分析: 打开复用分析对话框
   - 编辑/删除（可选）

**技术实现**:

```vue
<template>
  <div class="features-list page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>🎯 Feature资产管理</h2>
      <p class="page-description">管理可复用的Feature资产，支持跨产品复用</p>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">新建Feature</el-button>
        <el-button :icon="Download">导出</el-button>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索Feature名称或编号..."
        :prefix-icon="Search"
        clearable
        style="width: 300px"
      />
      <el-select v-model="filterDomain" placeholder="领域" clearable>
        <el-option label="全部领域" value="" />
        <el-option label="ADAS" value="ADAS" />
        <el-option label="IVI" value="IVI" />
        <el-option label="Platform" value="Platform" />
      </el-select>
      <el-select v-model="filterReuseLevel" placeholder="复用程度" clearable>
        <el-option label="全部" value="" />
        <el-option label="高复用(>=5)" value="high" />
        <el-option label="中复用(3-4)" value="medium" />
        <el-option label="低复用(<3)" value="low" />
      </el-select>
      <el-select v-model="filterStatus" placeholder="状态" clearable>
        <el-option label="全部状态" value="" />
        <el-option label="激活" value="active" />
        <el-option label="已废弃" value="deprecated" />
      </el-select>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card>
        <el-statistic title="Feature总数" :value="statistics.total" />
      </el-card>
      <el-card>
        <el-statistic title="高复用Feature" :value="statistics.highReuse" />
      </el-card>
      <el-card>
        <el-statistic title="平均复用次数" :value="statistics.avgReuse" :precision="1" />
      </el-card>
      <el-card>
        <el-statistic title="总复用收益" :value="statistics.totalSavings" suffix="万元" />
      </el-card>
    </div>

    <!-- Feature表格 -->
    <el-table
      :data="filteredFeatures"
      stripe
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="id" label="编号" width="150" />
      <el-table-column prop="name" label="名称" width="200" />
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="domain" label="领域" width="120">
        <template #default="{ row }">
          <el-tag :type="getDomainTagType(row.domain)">{{ row.domain }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="类别" width="120" />
      <el-table-column prop="reuseCount" label="复用次数" width="120" sortable>
        <template #default="{ row }">
          <el-tag :type="getReuseTagType(row.reuseCount)" effect="dark">
            {{ row.reuseCount }} 次
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="products" label="使用产品" width="200">
        <template #default="{ row }">
          <el-tooltip :content="row.products.join(', ')">
            <span>{{ row.products.length }} 个产品</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row.id)">详情</el-button>
          <el-button link type="success" @click="viewReuseAnalysis(row.id)">复用分析</el-button>
          <el-button link type="warning" @click="editFeature(row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="filteredFeatures.length"
      layout="total, sizes, prev, pager, next, jumper"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import featuresData from '@/biz-data/mock/feature/features.json';

const router = useRouter();

// 数据
const features = ref(featuresData);
const searchText = ref('');
const filterDomain = ref('');
const filterReuseLevel = ref('');
const filterStatus = ref('');
const currentPage = ref(1);
const pageSize = ref(20);

// 筛选后的Feature列表
const filteredFeatures = computed(() => {
  let result = features.value;

  // 搜索
  if (searchText.value) {
    result = result.filter(f =>
      f.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      f.id.toLowerCase().includes(searchText.value.toLowerCase())
    );
  }

  // 领域筛选
  if (filterDomain.value) {
    result = result.filter(f => f.domain === filterDomain.value);
  }

  // 复用程度筛选
  if (filterReuseLevel.value) {
    result = result.filter(f => {
      if (filterReuseLevel.value === 'high') return f.reuseCount >= 5;
      if (filterReuseLevel.value === 'medium') return f.reuseCount >= 3 && f.reuseCount < 5;
      if (filterReuseLevel.value === 'low') return f.reuseCount < 3;
      return true;
    });
  }

  // 状态筛选
  if (filterStatus.value) {
    result = result.filter(f => f.status === filterStatus.value);
  }

  return result;
});

// 统计信息
const statistics = computed(() => {
  const total = features.value.length;
  const highReuse = features.value.filter(f => f.reuseCount >= 5).length;
  const avgReuse = features.value.reduce((sum, f) => sum + f.reuseCount, 0) / total;
  const totalSavings = features.value.reduce((sum, f) => {
    // 假设每次复用节省80万（开发成本的93.75%）
    return sum + (f.reuseCount - 1) * 80;
  }, 0);

  return { total, highReuse, avgReuse, totalSavings };
});

// 辅助函数
function getReuseTagType(count: number) {
  if (count >= 5) return 'success';
  if (count >= 3) return 'warning';
  return 'info';
}

function getDomainTagType(domain: string) {
  const map: Record<string, string> = {
    'ADAS': 'primary',
    'IVI': 'success',
    'Platform': 'warning'
  };
  return map[domain] || 'info';
}

function getStatusTagType(status: string) {
  const map: Record<string, string> = {
    'active': 'success',
    'deprecated': 'danger',
    'planning': 'info'
  };
  return map[status] || 'info';
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    'active': '激活',
    'deprecated': '已废弃',
    'planning': '规划中'
  };
  return map[status] || status;
}

function viewDetail(id: string) {
  router.push(`/assets/features/${id}`);
}

function viewReuseAnalysis(id: string) {
  // 打开复用分析对话框
  console.log('View reuse analysis for', id);
}

function editFeature(id: string) {
  console.log('Edit feature', id);
}
</script>

<style scoped lang="scss">
.features-list {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
}
</style>
```

**交付物**:
- ✅ `frontend/src/views/Asset/Features.vue`
- ✅ 路由配置更新
- ✅ 导航菜单更新

**验收标准**:
- [ ] Feature列表正确显示20个Feature
- [ ] 筛选功能正常工作
- [ ] 搜索功能正常工作
- [ ] 排序功能正常工作
- [ ] 统计卡片数据正确
- [ ] 复用次数颜色编码正确
- [ ] 点击详情跳转正确

---

### 任务 P2.1.2: Feature详情页面 ⭐⭐⭐⭐⭐

**优先级**: P0  
**工作量**: 6小时  
**负责人**: 前端工程师

**目标**: 实现Feature资产详情页面，展示完整的Feature信息

**页面路径**: `/assets/features/:id`  
**组件路径**: `frontend/src/views/Asset/FeatureDetail.vue`

**功能需求**:

1. **基本信息**
   - 编号、名称、版本、描述
   - 领域、类别、状态
   - 创建时间、更新时间

2. **复用信息**（重点）
   - 复用次数（大号显示）
   - 被哪些产品使用（列表）
   - 复用收益计算（节省成本）

3. **实现信息**
   - 包含哪些Module（3-5个）
   - Module关系图（可视化）

4. **依赖关系**
   - 依赖哪些Feature
   - 被哪些Feature依赖
   - 冲突检测

5. **性能指标**
   - 延迟、吞吐量、准确率等

6. **成本信息**
   - 开发成本、许可成本、维护成本

7. **关联需求**
   - 关联的FR列表（10+）
   - 点击跳转到FR详情

8. **版本历史**
   - 历史版本列表
   - 版本对比

**页面布局**:

```
┌─────────────────────────────────────────────────────────────┐
│  Feature详情                                   [编辑] [删除] │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │  复用次数       │  │  使用产品       │  │  复用收益    ││
│  │  ⭐ 5次         │  │  🚗 5个产品     │  │  💰 320万元  ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
├─────────────────────────────────────────────────────────────┤
│  基本信息                                                    │
│  编号: FEAT-AVP-001                                         │
│  名称: AVP自动泊车                                          │
│  版本: v1.5.0                                               │
│  ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  使用产品（5个）                                            │
│  • ADAS旗舰版                                               │
│  • ADAS高配版                                               │
│  • ...                                                      │
├─────────────────────────────────────────────────────────────┤
│  实现模块（3个）                                            │
│  • MOD-PARK-PER-001 - 泊车感知模块                          │
│  • MOD-PARK-PLAN-001 - 泊车规划模块                         │
│  • MOD-PARK-CTRL-001 - 泊车控制模块                         │
│                                                             │
│  [Module关系图]                                             │
├─────────────────────────────────────────────────────────────┤
│  关联需求（10个FR）                                         │
│  • FR-PARK-001 - 自动寻找车位（ADAS旗舰版）                 │
│  • FR-HIGH-AVP - 高配版AVP功能（ADAS高配版）                │
│  • ...                                                      │
├─────────────────────────────────────────────────────────────┤
│  依赖关系                                                    │
│  依赖: FEAT-LOC-001（定位Feature）                          │
│  被依赖: 无                                                  │
└─────────────────────────────────────────────────────────────┘
```

**技术实现**: （代码略，类似Feature列表页）

**交付物**:
- ✅ `frontend/src/views/Asset/FeatureDetail.vue`
- ✅ 路由配置更新

**验收标准**:
- [ ] 基本信息完整显示
- [ ] 复用信息正确计算
- [ ] 使用产品列表正确
- [ ] 实现模块列表正确
- [ ] 关联需求列表正确
- [ ] 复用收益计算正确

---

### 任务 P2.1.3-P2.1.4: Feature复用分析和Module关系图（略）

### 任务 P2.2.1-P2.2.2: Platform管理页面（P1，略）

### 任务 P2.3.1-P2.3.4: 需求管理增强（P0，略）

### 任务 P2.4.1-P2.4.3: 代办管理重构（P0，略）

---

## Phase 3-5: 后续阶段（略）

详细任务拆分见主文档。

---

## 附录：工具脚本

### A1. 数据生成脚本模板

```typescript
// scripts/utils/data-generator.ts

import fs from 'fs';
import path from 'path';

export function loadJSON<T>(filePath: string): T {
  const fullPath = path.join(__dirname, '../../', filePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content);
}

export function saveJSON<T>(filePath: string, data: T): void {
  const fullPath = path.join(__dirname, '../../', filePath);
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ Saved: ${filePath}`);
}

export function generateId(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(3, '0')}`;
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

### A2. 数据验证脚本模板

```typescript
// scripts/utils/data-validator.ts

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`❌ Validation failed: ${message}`);
  }
}

export function validateIds<T extends { id: string }>(
  items: T[],
  prefix: string
): void {
  items.forEach(item => {
    assert(item.id.startsWith(prefix), `ID ${item.id} should start with ${prefix}`);
  });
}

export function validateReferences<T extends { id: string }>(
  items: any[],
  field: string,
  referenceItems: T[]
): void {
  const referenceIds = new Set(referenceItems.map(r => r.id));
  
  items.forEach(item => {
    const refId = item[field];
    if (refId) {
      assert(referenceIds.has(refId), `Invalid reference: ${field}=${refId} in ${item.id}`);
    }
  });
}
```

---

**文档版本**: v1.0  
**创建日期**: 2026-01-11  
**维护团队**: V3架构实施团队  
**状态**: ✅ 待评审

