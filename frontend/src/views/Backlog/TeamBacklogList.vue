<template>
  <div class="team-backlog-list page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>团队待办列表</h2>
      <p class="page-description">查看和管理所有团队的待办事项</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="团队总数" :value="backlogs.length">
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总工作项" :value="totalWorkItems">
            <template #prefix>
              <el-icon><List /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="平均容量利用率" :value="averageUtilization">
            <template #prefix>
              <el-icon><TrendCharts /></el-icon>
            </template>
            <template #suffix>%</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="活跃团队" :value="activeBacklogsCount">
            <template #prefix>
              <el-icon><Check /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 团队待办列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><List /></el-icon>
            团队待办列表
          </span>
        </div>
      </template>

      <el-table :data="backlogs" stripe style="width: 100%">
        <el-table-column prop="name" label="待办名称" min-width="200">
          <template #default="{ row }">
            <el-link type="primary" @click="goToDetail(row.id)">
              {{ row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="teamName" label="所属团队" width="150">
          <template #default="{ row }">
            {{ getTeamName(row.teamId) }}
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="所属项目" width="180">
          <template #default="{ row }">
            {{ getProjectName(row.projectId) }}
          </template>
        </el-table-column>
        <el-table-column prop="capacity" label="团队容量" width="120" align="center">
          <template #default="{ row }">
            {{ row.capacity }} SP
          </template>
        </el-table-column>
        <el-table-column label="容量利用率" width="150" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="calculateUtilization(row)"
              :color="getUtilizationColor(calculateUtilization(row))"
            />
          </template>
        </el-table-column>
        <el-table-column prop="items" label="工作项数" width="120" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.items.length }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="goToDetail(row.id)">查看</el-button>
            <el-button link type="primary" @click="goToProjectBacklog(row.projectBacklogId)">来源</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, List, TrendCharts, Check } from '@element-plus/icons-vue'
import teamBacklogsData from '@/biz-data/mock/backlog/team-backlogs.json'
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import teamsData from '@/biz-data/mock/teams.json'
import type { TeamBacklog } from '@/types/backlog'
import type { DomainProject } from '@/types/project-v2'

const router = useRouter()

const backlogs = ref<TeamBacklog[]>([])

onMounted(() => {
  backlogs.value = teamBacklogsData.data as TeamBacklog[]
})

const totalWorkItems = computed(() => {
  return backlogs.value.reduce((sum, b) => sum + b.items.length, 0)
})

const averageUtilization = computed(() => {
  if (backlogs.value.length === 0) return 0
  const totalUtil = backlogs.value.reduce((sum, b) => sum + calculateUtilization(b), 0)
  return Math.round(totalUtil / backlogs.value.length)
})

const activeBacklogsCount = computed(() => {
  return backlogs.value.filter(b => b.status === 'active').length
})

const getTeamName = (teamId: string) => {
  const team = teamsData.data.find((t: any) => t.id === teamId)
  return team?.name || teamId
}

const getProjectName = (projectId: string) => {
  const project = domainProjectsData.data.find((p: DomainProject) => p.id === projectId)
  return project?.name || projectId
}

const calculateUtilization = (backlog: TeamBacklog) => {
  const allocated = backlog.items.reduce((sum, item) => sum + item.storyPoints, 0)
  return Math.round((allocated / backlog.capacity) * 100)
}

const getUtilizationColor = (utilization: number) => {
  if (utilization < 70) return '#67c23a'
  if (utilization < 90) return '#e6a23c'
  return '#f56c6c'
}

const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    active: 'success',
    planned: 'info',
    completed: '',
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    active: '进行中',
    planned: '已规划',
    completed: '已完成',
  }
  return texts[status] || status
}

const goToDetail = (id: string) => {
  router.push(`/backlog/team/${id}`)
}

const goToProjectBacklog = (id: string) => {
  router.push(`/backlog/project/${id}`)
}
</script>

<style scoped lang="scss">
.team-backlog-list {
  .page-header {
    margin-bottom: 24px;

    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }

    .page-description {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }
  }

  .stats-row {
    margin-bottom: 24px;

    .stat-card {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      :deep(.el-card__body) {
        width: 100%;
      }
    }
  }

  .table-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>

