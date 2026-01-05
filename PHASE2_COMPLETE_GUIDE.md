# Phase 2 完整实施指南

> **目标**: 完成Phase 2所有16个页面和Mock数据  
> **时间**: 2025-01-20 ~ 2025-02-07（3周）  
> **内容**: 项目与协同管理

---

## 📋 Phase 2 内容总览

### Week 3: PI Planning深化（5页面，20 SP）

| # | 页面 | 路由 | SP | 说明 |
|---|------|------|----|----|
| 1 | PI Planning详情 | `/pi-planning/detail/:id` | 5 | PI详细信息 |
| 2 | 团队规划 | `/pi-planning/team-planning/:piId` | 5 | 团队容量规划 |
| 3 | 依赖管理 | `/pi-planning/dependencies/:piId` | 4 | 依赖网络图 |
| 4 | 风险管理 | `/pi-planning/risks/:piId` | 3 | 风险热力图 |
| 5 | PI报告 | `/pi-planning/report/:piId` | 3 | PI报告生成 |

### Week 4-5: Sprint协同（11页面，44 SP）

| # | 页面 | 路由 | SP | 说明 |
|---|------|------|----|----|
| 6 | Sprint详情 | `/sprint/detail/:id` | 4 | Sprint详细信息 |
| 7 | Sprint看板 | `/sprint/board/:id` | 5 | Kanban看板 |
| 8 | Sprint计划 | `/sprint/planning/:id` | 4 | Sprint规划 |
| 9 | Sprint回顾 | `/sprint/retrospective/:id` | 3 | 回顾会议 |
| 10 | Story列表 | `/sprint/stories` | 3 | Story列表 |
| 11 | Story详情 | `/sprint/story-detail/:id` | 5 | Story详情+Task |
| 12 | Task列表 | `/sprint/tasks` | 3 | Task列表 |
| 13 | Task详情 | `/sprint/task-detail/:id` | 4 | Task详情 |
| 14 | 代码提交列表 | `/sprint/commits` | 3 | Commit历史 |
| 15 | PR列表 | `/sprint/pull-requests` | 3 | PR管理 |
| 16 | 评审管理 | `/sprint/reviews` | 7 | 评审流程 |

**总计**: 16页面，64 SP

---

## 📦 Mock数据完整方案

### 1. PI Planning Mock数据

由于前端已有project/pi-plannings.json，我们扩展现有数据结构：

#### biz-data/mock/project/pi-details.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "PI Planning详情Mock数据"
  },
  "data": [
    {
      "id": "PI-2025-Q1",
      "name": "2025 Q1 PI Planning",
      "startDate": "2025-01-13",
      "endDate": "2025-03-28",
      "status": "in_progress",
      "iteration": 6,
      "iterationLength": 2,
      "teams": ["TEAM-Perception", "TEAM-Planning", "TEAM-Control"],
      "objectives": [
        {
          "id": "OBJ-PI-Q1-1",
          "name": "完成NOA v3.1核心功能",
          "businessValue": 8,
          "uncommittedObjective": false,
          "team": "TEAM-Perception",
          "storyPoints": 78,
          "status": "in_progress",
          "progress": 0.65
        },
        {
          "id": "OBJ-PI-Q1-2",
          "name": "路径规划算法优化",
          "businessValue": 5,
          "uncommittedObjective": true,
          "team": "TEAM-Planning",
          "storyPoints": 55,
          "status": "in_progress",
          "progress": 0.45
        }
      ],
      "metrics": {
        "totalStoryPoints": 210,
        "completedStoryPoints": 120,
        "predictability": 0.85,
        "velocity": 35
      },
      "participants": ["USER-001", "USER-101", "USER-102", "USER-103"],
      "createdAt": "2024-12-15T00:00:00Z",
      "updatedAt": "2025-01-05T10:00:00Z"
    }
  ]
}
```

#### biz-data/mock/project/team-planning.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "团队规划Mock数据"
  },
  "data": [
    {
      "id": "TEAM-Perception",
      "piId": "PI-2025-Q1",
      "name": "感知团队",
      "members": [
        {"id": "USER-101", "name": "赵工程师", "role": "Tech Lead", "capacity": 8},
        {"id": "USER-201", "name": "李开发", "role": "Developer", "capacity": 8},
        {"id": "USER-202", "name": "王开发", "role": "Developer", "capacity": 7},
        {"id": "USER-203", "name": "张开发", "role": "Developer", "capacity": 8}
      ],
      "totalCapacity": 31,
      "allocatedCapacity": 28,
      "objectives": ["OBJ-PI-Q1-1"],
      "totalStoryPoints": 78,
      "velocityHistory": [35, 38, 42, 40, 38],
      "predictedVelocity": 39,
      "confidence": 0.85
    }
  ]
}
```

#### biz-data/mock/project/dependencies.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "依赖关系Mock数据"
  },
  "nodes": [
    {"id": "TEAM-Perception", "type": "team", "name": "感知团队"},
    {"id": "TEAM-Planning", "type": "team", "name": "规划团队"},
    {"id": "TEAM-Control", "type": "team", "name": "控制团队"}
  ],
  "edges": [
    {
      "id": "DEP-001",
      "source": "TEAM-Planning",
      "target": "TEAM-Perception",
      "type": "depends_on",
      "description": "路径规划依赖融合感知输出",
      "status": "resolved",
      "resolvedDate": "2025-01-08",
      "impact": "high"
    },
    {
      "id": "DEP-002",
      "source": "TEAM-Control",
      "target": "TEAM-Planning",
      "type": "depends_on",
      "description": "车辆控制依赖路径规划输出",
      "status": "in_progress",
      "impact": "high"
    }
  ]
}
```

#### biz-data/mock/project/risks.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "风险管理Mock数据"
  },
  "data": [
    {
      "id": "RISK-001",
      "piId": "PI-2025-Q1",
      "title": "激光雷达供应延迟",
      "description": "激光雷达硬件可能延迟2周到货",
      "category": "technical",
      "probability": "medium",
      "impact": "high",
      "status": "accepted",
      "owner": "USER-101",
      "mitigation": "优先使用模拟器完成算法开发",
      "createdAt": "2024-12-20T00:00:00Z",
      "updatedAt": "2025-01-03T00:00:00Z"
    },
    {
      "id": "RISK-002",
      "piId": "PI-2025-Q1",
      "title": "团队成员请假",
      "description": "核心开发人员春节期间请假",
      "category": "resource",
      "probability": "high",
      "impact": "medium",
      "status": "mitigated",
      "owner": "USER-001",
      "mitigation": "提前完成关键任务，安排备份人员",
      "createdAt": "2024-12-25T00:00:00Z",
      "updatedAt": "2025-01-04T00:00:00Z"
    }
  ]
}
```

### 2. Sprint Mock数据

#### biz-data/mock/sprint/sprints.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "Sprint Mock数据"
  },
  "data": [
    {
      "id": "SPRINT-001",
      "name": "Sprint 1",
      "piId": "PI-2025-Q1",
      "iteration": 1,
      "startDate": "2025-01-13",
      "endDate": "2025-01-24",
      "status": "completed",
      "goal": "完成雷达检测模块优化",
      "team": "TEAM-Perception",
      "capacity": 39,
      "committed": 35,
      "completed": 32,
      "stories": ["US-101", "US-102", "US-103"],
      "velocity": 32,
      "completionRate": 0.91,
      "createdAt": "2025-01-10T00:00:00Z",
      "updatedAt": "2025-01-24T00:00:00Z"
    },
    {
      "id": "SPRINT-002",
      "name": "Sprint 2",
      "piId": "PI-2025-Q1",
      "iteration": 2,
      "startDate": "2025-01-27",
      "endDate": "2025-02-07",
      "status": "in_progress",
      "goal": "完成视觉检测模块优化",
      "team": "TEAM-Perception",
      "capacity": 39,
      "committed": 38,
      "completed": 20,
      "stories": ["US-104", "US-105", "US-106"],
      "velocity": null,
      "completionRate": 0.53,
      "createdAt": "2025-01-25T00:00:00Z",
      "updatedAt": "2025-02-05T00:00:00Z"
    }
  ]
}
```

#### biz-data/mock/sprint/stories.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "User Story Mock数据"
  },
  "data": [
    {
      "id": "US-101",
      "title": "优化雷达检测算法",
      "description": "提升雷达目标检测精度和处理速度",
      "sprintId": "SPRINT-001",
      "requirementId": "MR-001",
      "storyPoints": 8,
      "priority": "P0",
      "status": "completed",
      "assignee": "USER-201",
      "tasks": ["TASK-101-1", "TASK-101-2", "TASK-101-3"],
      "acceptanceCriteria": [
        "检测精度提升至95%以上",
        "处理延迟降低至50ms以内",
        "通过所有单元测试"
      ],
      "completedDate": "2025-01-22T00:00:00Z",
      "createdAt": "2025-01-10T00:00:00Z"
    },
    {
      "id": "US-102",
      "title": "雷达数据融合优化",
      "description": "优化多雷达数据融合算法",
      "sprintId": "SPRINT-001",
      "requirementId": "MR-002",
      "storyPoints": 13,
      "priority": "P0",
      "status": "completed",
      "assignee": "USER-203",
      "tasks": ["TASK-102-1", "TASK-102-2"],
      "acceptanceCriteria": [
        "融合算法性能提升30%",
        "支持5个雷达同时融合",
        "代码覆盖率达到80%"
      ],
      "completedDate": "2025-01-23T00:00:00Z",
      "createdAt": "2025-01-10T00:00:00Z"
    }
  ]
}
```

#### biz-data/mock/sprint/tasks.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "Task Mock数据"
  },
  "data": [
    {
      "id": "TASK-101-1",
      "title": "算法设计评审",
      "storyId": "US-101",
      "type": "design",
      "status": "completed",
      "assignee": "USER-201",
      "estimatedHours": 4,
      "actualHours": 3.5,
      "description": "设计优化算法方案并评审",
      "completedDate": "2025-01-14T00:00:00Z",
      "createdAt": "2025-01-13T00:00:00Z"
    },
    {
      "id": "TASK-101-2",
      "title": "代码实现",
      "storyId": "US-101",
      "type": "development",
      "status": "completed",
      "assignee": "USER-201",
      "estimatedHours": 16,
      "actualHours": 18,
      "description": "实现雷达检测算法优化",
      "commits": ["abc123", "def456"],
      "pullRequest": "PR-125",
      "completedDate": "2025-01-20T00:00:00Z",
      "createdAt": "2025-01-15T00:00:00Z"
    },
    {
      "id": "TASK-101-3",
      "title": "测试验证",
      "storyId": "US-101",
      "type": "testing",
      "status": "completed",
      "assignee": "USER-301",
      "estimatedHours": 8,
      "actualHours": 8,
      "description": "编写测试用例并验证",
      "testCases": ["TC-001", "TC-002"],
      "completedDate": "2025-01-22T00:00:00Z",
      "createdAt": "2025-01-21T00:00:00Z"
    }
  ]
}
```

#### biz-data/mock/sprint/commits.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "Commit Mock数据"
  },
  "data": [
    {
      "id": "abc123",
      "taskId": "TASK-101-2",
      "storyId": "US-101",
      "message": "feat: 优化雷达检测算法",
      "author": "USER-201",
      "authorName": "李开发",
      "timestamp": "2025-01-18T10:30:00Z",
      "repo": "perception/radar",
      "branch": "feature/radar-optimization",
      "filesChanged": 5,
      "insertions": 234,
      "deletions": 89,
      "buildStatus": "success"
    },
    {
      "id": "def456",
      "taskId": "TASK-101-2",
      "storyId": "US-101",
      "message": "test: 添加雷达检测单元测试",
      "author": "USER-201",
      "authorName": "李开发",
      "timestamp": "2025-01-19T14:20:00Z",
      "repo": "perception/radar",
      "branch": "feature/radar-optimization",
      "filesChanged": 3,
      "insertions": 156,
      "deletions": 12,
      "buildStatus": "success"
    }
  ]
}
```

#### biz-data/mock/sprint/pull-requests.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "Pull Request Mock数据"
  },
  "data": [
    {
      "id": "PR-125",
      "taskId": "TASK-101-2",
      "storyId": "US-101",
      "title": "优化雷达检测算法",
      "description": "提升检测精度和性能",
      "author": "USER-201",
      "authorName": "李开发",
      "sourceBranch": "feature/radar-optimization",
      "targetBranch": "develop",
      "status": "merged",
      "createdAt": "2025-01-20T09:00:00Z",
      "mergedAt": "2025-01-20T15:30:00Z",
      "reviewer": "USER-101",
      "reviewerName": "赵工程师",
      "commits": ["abc123", "def456"],
      "comments": 3,
      "approvals": 1,
      "changesRequested": 0
    }
  ]
}
```

#### biz-data/mock/sprint/reviews.json
```json
{
  "metadata": {
    "version": "1.0",
    "lastUpdate": "2025-01-05T14:00:00Z",
    "description": "评审Mock数据"
  },
  "data": [
    {
      "id": "REV-001",
      "type": "code_review",
      "title": "雷达检测算法代码评审",
      "pullRequestId": "PR-125",
      "storyId": "US-101",
      "status": "approved",
      "reviewer": "USER-101",
      "reviewerName": "赵工程师",
      "author": "USER-201",
      "authorName": "李开发",
      "comments": [
        {
          "id": "C-001",
          "content": "算法逻辑清晰，代码质量好",
          "type": "comment",
          "timestamp": "2025-01-20T10:00:00Z"
        },
        {
          "id": "C-002",
          "content": "建议添加更多边界条件测试",
          "type": "suggestion",
          "timestamp": "2025-01-20T10:15:00Z",
          "resolved": true
        }
      ],
      "createdAt": "2025-01-20T09:30:00Z",
      "completedAt": "2025-01-20T15:00:00Z"
    }
  ]
}
```

---

## 🎨 页面组件代码模板

### PI Planning页面（5个）

#### 1. PIPlanning/Detail.vue

```vue
<template>
  <div class="pi-planning-detail-page">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600">{{ piDetail?.name }}</span>
      </template>
      <template #extra>
        <el-tag :type="getStatusType(piDetail?.status)">
          {{ piDetail?.status }}
        </el-tag>
      </template>
    </el-page-header>

    <!-- 基本信息 -->
    <el-card class="mt-4">
      <template #header>基本信息</template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="PI名称">
          {{ piDetail?.name }}
        </el-descriptions-item>
        <el-descriptions-item label="开始日期">
          {{ piDetail?.startDate }}
        </el-descriptions-item>
        <el-descriptions-item label="结束日期">
          {{ piDetail?.endDate }}
        </el-descriptions-item>
        <el-descriptions-item label="迭代数">
          {{ piDetail?.iteration }}
        </el-descriptions-item>
        <el-descriptions-item label="迭代长度">
          {{ piDetail?.iterationLength }}周
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(piDetail?.status)">
            {{ piDetail?.status }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- PI Objectives -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>PI Objectives</span>
          <el-button type="primary" size="small">添加Objective</el-button>
        </div>
      </template>
      <el-table :data="piDetail?.objectives">
        <el-table-column prop="name" label="Objective名称" />
        <el-table-column prop="team" label="团队" width="150" />
        <el-table-column prop="businessValue" label="业务价值" width="100" align="center">
          <template #default="{ row }">
            <el-rate v-model="row.businessValue" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="storyPoints" label="Story Points" width="120" align="center" />
        <el-table-column prop="progress" label="进度" width="150">
          <template #default="{ row }">
            <el-progress :percentage="Math.round(row.progress * 100)" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 关键指标 -->
    <el-row :gutter="20" class="mt-4">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总Story Points" :value="piDetail?.metrics?.totalStoryPoints" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="已完成SP" :value="piDetail?.metrics?.completedStoryPoints" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="预测性" :value="piDetail?.metrics?.predictability" :precision="2" suffix="%" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="平均速率" :value="piDetail?.metrics?.velocity" suffix="SP/迭代" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速链接 -->
    <el-card class="mt-4">
      <template #header>快速链接</template>
      <el-space>
        <el-button @click="goToTeamPlanning">团队规划</el-button>
        <el-button @click="goToDependencies">依赖管理</el-button>
        <el-button @click="goToRisks">风险管理</el-button>
        <el-button @click="goToReport">生成报告</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const piDetail = ref(null);

onMounted(async () => {
  const piId = route.params.id as string;
  const response = await fetch('/mock/project/pi-details.json');
  const result = await response.json();
  piDetail.value = result.data.find((pi: any) => pi.id === piId);
});

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'in_progress': 'primary',
    'completed': 'success',
    'planned': 'info',
  };
  return map[status] || 'info';
};

const goBack = () => router.back();
const goToTeamPlanning = () => router.push(`/pi-planning/team-planning/${route.params.id}`);
const goToDependencies = () => router.push(`/pi-planning/dependencies/${route.params.id}`);
const goToRisks = () => router.push(`/pi-planning/risks/${route.params.id}`);
const goToReport = () => router.push(`/pi-planning/report/${route.params.id}`);
</script>
```

### Sprint页面（11个）

#### 示例：Sprint/Detail.vue

```vue
<template>
  <div class="sprint-detail-page">
    <el-page-header @back="goBack">
      <template #content>
        <span class="text-large font-600">{{ sprint?.name }}</span>
      </template>
      <template #extra>
        <el-tag :type="getStatusType(sprint?.status)">
          {{ sprint?.status }}
        </el-tag>
      </template>
    </el-page-header>

    <!-- Sprint信息 -->
    <el-card class="mt-4">
      <template #header>Sprint信息</template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="Sprint名称">{{ sprint?.name }}</el-descriptions-item>
        <el-descriptions-item label="迭代">{{ sprint?.iteration }}</el-descriptions-item>
        <el-descriptions-item label="团队">{{ sprint?.team }}</el-descriptions-item>
        <el-descriptions-item label="开始日期">{{ sprint?.startDate }}</el-descriptions-item>
        <el-descriptions-item label="结束日期">{{ sprint?.endDate }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(sprint?.status)">{{ sprint?.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Sprint目标" :span="3">
          {{ sprint?.goal }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 燃尽图 -->
    <el-card class="mt-4">
      <template #header>燃尽图</template>
      <div ref="burndownChartRef" style="height: 300px"></div>
    </el-card>

    <!-- Stories列表 -->
    <el-card class="mt-4">
      <template #header>
        <div class="card-header">
          <span>User Stories</span>
          <el-button type="primary" size="small">添加Story</el-button>
        </div>
      </template>
      <el-table :data="stories">
        <el-table-column prop="title" label="Story标题" />
        <el-table-column prop="storyPoints" label="SP" width="80" align="center" />
        <el-table-column prop="assignee" label="负责人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button link @click="viewStory(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 快速链接 -->
    <el-card class="mt-4">
      <template #header>快速操作</template>
      <el-space>
        <el-button @click="goToBoard">Sprint看板</el-button>
        <el-button @click="goToPlanning">Sprint规划</el-button>
        <el-button @click="goToRetrospective">Sprint回顾</el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const sprint = ref(null);
const stories = ref([]);

onMounted(async () => {
  const sprintId = route.params.id as string;
  
  // 加载Sprint数据
  const sprintResponse = await fetch('/mock/sprint/sprints.json');
  const sprintResult = await sprintResponse.json();
  sprint.value = sprintResult.data.find((s: any) => s.id === sprintId);
  
  // 加载Stories
  const storiesResponse = await fetch('/mock/sprint/stories.json');
  const storiesResult = await storiesResponse.json();
  stories.value = storiesResult.data.filter((s: any) => s.sprintId === sprintId);
});

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'in_progress': 'primary',
    'completed': 'success',
    'planned': 'info',
    'todo': '',
    'doing': 'warning',
    'done': 'success',
  };
  return map[status] || 'info';
};

const goBack = () => router.back();
const viewStory = (id: string) => router.push(`/sprint/story-detail/${id}`);
const goToBoard = () => router.push(`/sprint/board/${route.params.id}`);
const goToPlanning = () => router.push(`/sprint/planning/${route.params.id}`);
const goToRetrospective = () => router.push(`/sprint/retrospective/${route.params.id}`);
</script>
```

---

## 🔧 TypeScript类型定义

### project.ts（扩展）

```typescript
// frontend/src/types/project.ts（扩展）

export interface PIDetail {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  iteration: number;
  iterationLength: number;
  teams: string[];
  objectives: PIObjective[];
  metrics: PIMetrics;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PIObjective {
  id: string;
  name: string;
  businessValue: number;
  uncommittedObjective: boolean;
  team: string;
  storyPoints: number;
  status: string;
  progress: number;
}

export interface PIMetrics {
  totalStoryPoints: number;
  completedStoryPoints: number;
  predictability: number;
  velocity: number;
}

export interface TeamPlanning {
  id: string;
  piId: string;
  name: string;
  members: TeamMember[];
  totalCapacity: number;
  allocatedCapacity: number;
  objectives: string[];
  totalStoryPoints: number;
  velocityHistory: number[];
  predictedVelocity: number;
  confidence: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  capacity: number;
}

export interface Dependency {
  id: string;
  source: string;
  target: string;
  type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'blocked';
  resolvedDate?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface Risk {
  id: string;
  piId: string;
  title: string;
  description: string;
  category: 'technical' | 'resource' | 'schedule' | 'external';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  status: 'identified' | 'mitigated' | 'accepted' | 'resolved';
  owner: string;
  mitigation: string;
  createdAt: string;
  updatedAt: string;
}
```

### sprint.ts

```typescript
// frontend/src/types/sprint.ts

export interface Sprint {
  id: string;
  name: string;
  piId: string;
  iteration: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed';
  goal: string;
  team: string;
  capacity: number;
  committed: number;
  completed: number;
  stories: string[];
  velocity: number | null;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  sprintId: string;
  requirementId: string;
  storyPoints: number;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'todo' | 'doing' | 'done' | 'completed';
  assignee: string;
  tasks: string[];
  acceptanceCriteria: string[];
  completedDate?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  storyId: string;
  type: 'design' | 'development' | 'testing' | 'review' | 'other';
  status: 'todo' | 'in_progress' | 'completed';
  assignee: string;
  estimatedHours: number;
  actualHours?: number;
  description: string;
  commits?: string[];
  pullRequest?: string;
  testCases?: string[];
  completedDate?: string;
  createdAt: string;
}

export interface Commit {
  id: string;
  taskId: string;
  storyId: string;
  message: string;
  author: string;
  authorName: string;
  timestamp: string;
  repo: string;
  branch: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  buildStatus: 'pending' | 'success' | 'failed';
}

export interface PullRequest {
  id: string;
  taskId: string;
  storyId: string;
  title: string;
  description: string;
  author: string;
  authorName: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed';
  createdAt: string;
  mergedAt?: string;
  reviewer: string;
  reviewerName: string;
  commits: string[];
  comments: number;
  approvals: number;
  changesRequested: number;
}

export interface Review {
  id: string;
  type: 'code_review' | 'design_review' | 'requirement_review';
  title: string;
  pullRequestId?: string;
  storyId: string;
  status: 'pending' | 'approved' | 'changes_requested' | 'rejected';
  reviewer: string;
  reviewerName: string;
  author: string;
  authorName: string;
  comments: ReviewComment[];
  createdAt: string;
  completedAt?: string;
}

export interface ReviewComment {
  id: string;
  content: string;
  type: 'comment' | 'suggestion' | 'issue';
  timestamp: string;
  resolved?: boolean;
}
```

---

## 🛠️ Mock Service扩展

```typescript
// frontend/src/services/mockData.ts（扩展）

export class MockDataService {
  // ... 前面的方法 ...

  // PI Planning相关
  async getPIDetails() {
    const response = await fetch('/mock/project/pi-details.json');
    const result = await response.json();
    return result.data;
  }

  async getPIDetailById(id: string) {
    const details = await this.getPIDetails();
    return details.find((pi: any) => pi.id === id);
  }

  async getTeamPlannings(piId: string) {
    const response = await fetch('/mock/project/team-planning.json');
    const result = await response.json();
    return result.data.filter((tp: any) => tp.piId === piId);
  }

  async getDependencies(piId: string) {
    const response = await fetch('/mock/project/dependencies.json');
    return response.json();
  }

  async getRisks(piId: string) {
    const response = await fetch('/mock/project/risks.json');
    const result = await response.json();
    return result.data.filter((r: any) => r.piId === piId);
  }

  // Sprint相关
  async getSprints() {
    const response = await fetch('/mock/sprint/sprints.json');
    const result = await response.json();
    return result.data;
  }

  async getSprintById(id: string) {
    const sprints = await this.getSprints();
    return sprints.find((s: any) => s.id === id);
  }

  async getStories() {
    const response = await fetch('/mock/sprint/stories.json');
    const result = await response.json();
    return result.data;
  }

  async getStoryById(id: string) {
    const stories = await this.getStories();
    return stories.find((s: any) => s.id === id);
  }

  async getTasks() {
    const response = await fetch('/mock/sprint/tasks.json');
    const result = await response.json();
    return result.data;
  }

  async getTaskById(id: string) {
    const tasks = await this.getTasks();
    return tasks.find((t: any) => t.id === id);
  }

  async getCommits() {
    const response = await fetch('/mock/sprint/commits.json');
    const result = await response.json();
    return result.data;
  }

  async getPullRequests() {
    const response = await fetch('/mock/sprint/pull-requests.json');
    const result = await response.json();
    return result.data;
  }

  async getReviews() {
    const response = await fetch('/mock/sprint/reviews.json');
    const result = await response.json();
    return result.data;
  }
}

export const mockDataService = new MockDataService();
```

---

## 🛣️ 路由配置更新

```typescript
// frontend/src/router/index.ts（添加Phase 2路由）

// PI Planning路由
{
  path: 'detail/:id',
  name: 'PIDetail',
  component: () => import('@/views/PIPlanning/Detail.vue'),
  meta: { title: 'PI Planning详情' },
},
{
  path: 'team-planning/:piId',
  name: 'TeamPlanning',
  component: () => import('@/views/PIPlanning/TeamPlanning.vue'),
  meta: { title: '团队规划' },
},
{
  path: 'dependencies/:piId',
  name: 'Dependencies',
  component: () => import('@/views/PIPlanning/Dependencies.vue'),
  meta: { title: '依赖管理' },
},
{
  path: 'risks/:piId',
  name: 'Risks',
  component: () => import('@/views/PIPlanning/Risks.vue'),
  meta: { title: '风险管理' },
},
{
  path: 'report/:piId',
  name: 'PIReport',
  component: () => import('@/views/PIPlanning/Report.vue'),
  meta: { title: 'PI报告' },
},

// Sprint路由
{
  path: 'detail/:id',
  name: 'SprintDetail',
  component: () => import('@/views/Sprint/Detail.vue'),
  meta: { title: 'Sprint详情' },
},
{
  path: 'board/:id',
  name: 'SprintBoard',
  component: () => import('@/views/Sprint/Board.vue'),
  meta: { title: 'Sprint看板' },
},
{
  path: 'planning/:id',
  name: 'SprintPlanning',
  component: () => import('@/views/Sprint/Planning.vue'),
  meta: { title: 'Sprint规划' },
},
{
  path: 'retrospective/:id',
  name: 'SprintRetrospective',
  component: () => import('@/views/Sprint/Retrospective.vue'),
  meta: { title: 'Sprint回顾' },
},
{
  path: 'stories',
  name: 'Stories',
  component: () => import('@/views/Sprint/Stories.vue'),
  meta: { title: 'Story列表' },
},
{
  path: 'story-detail/:id',
  name: 'StoryDetail',
  component: () => import('@/views/Sprint/StoryDetail.vue'),
  meta: { title: 'Story详情' },
},
{
  path: 'tasks',
  name: 'Tasks',
  component: () => import('@/views/Sprint/Tasks.vue'),
  meta: { title: 'Task列表' },
},
{
  path: 'task-detail/:id',
  name: 'TaskDetail',
  component: () => import('@/views/Sprint/TaskDetail.vue'),
  meta: { title: 'Task详情' },
},
{
  path: 'commits',
  name: 'Commits',
  component: () => import('@/views/Sprint/Commits.vue'),
  meta: { title: '代码提交' },
},
{
  path: 'pull-requests',
  name: 'PullRequests',
  component: () => import('@/views/Sprint/PullRequests.vue'),
  meta: { title: 'Pull Requests' },
},
{
  path: 'reviews',
  name: 'Reviews',
  component: () => import('@/views/Sprint/Reviews.vue'),
  meta: { title: '评审管理' },
},
```

---

## ✅ 实施步骤

### 第1步：创建Mock数据（1小时）
```bash
cd biz-data/mock
mkdir -p project sprint

# 创建8个JSON文件
# - project/pi-details.json
# - project/team-planning.json
# - project/dependencies.json
# - project/risks.json
# - sprint/sprints.json
# - sprint/stories.json
# - sprint/tasks.json
# - sprint/commits.json
# - sprint/pull-requests.json
# - sprint/reviews.json
```

### 第2步：创建TypeScript类型（30分钟）
```bash
cd frontend/src/types
# 扩展project.ts
# 创建sprint.ts
```

### 第3步：扩展Mock Service（30分钟）
```bash
cd frontend/src/services
# 扩展mockData.ts
```

### 第4步：创建页面组件（6-8小时）
```bash
cd frontend/src/views

# 创建PI Planning页面（5个）
cd PIPlanning
# Detail.vue, TeamPlanning.vue, Dependencies.vue, Risks.vue, Report.vue

# 创建Sprint页面（11个）
cd ../Sprint
# Detail.vue, Board.vue, Planning.vue, Retrospective.vue
# Stories.vue, StoryDetail.vue, Tasks.vue, TaskDetail.vue
# Commits.vue, PullRequests.vue, Reviews.vue
```

### 第5步：更新路由配置（30分钟）
```bash
cd frontend/src/router
# 更新index.ts
```

### 第6步：测试（1-2小时）
```bash
npm run dev
# 测试所有16个页面
```

---

## 📊 预期成果

完成Phase 2后将实现：
- ✅ 54个页面可用（38个Phase 0+1 + 16个Phase 2）
- ✅ 完整的PI Planning功能
- ✅ 完整的Sprint协同功能
- ✅ 所有Mock数据就绪
- ✅ 完整的类型定义
- ✅ 完整的Mock Service

---

**创建日期**: 2025-01-05  
**预计完成时间**: 8-10小时（团队并行工作）  
**状态**: 指南完成，可立即开始实施


