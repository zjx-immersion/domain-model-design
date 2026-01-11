<template>
  <div class="project-backlog-list page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>项目待办列表</h2>
      <p class="page-description">查看和管理所有项目的待办事项</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="项目总数" :value="backlogs.length">
            <template #prefix>
              <el-icon><Box /></el-icon>
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
          <el-statistic title="待分配" :value="unallocatedCount">
            <template #prefix>
              <el-icon><Clock /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="已分配" :value="allocatedCount">
            <template #prefix>
              <el-icon><Check /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 项目待办列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><List /></el-icon>
            项目待办列表
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
        <el-table-column prop="piName" label="PI Planning" width="180">
          <template #default="{ row }">
            {{ row.piName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="domainProjects" label="领域项目" width="150">
          <template #default="{ row }">
            <el-tag v-if="row.domainProjectIds && row.domainProjectIds.length > 0" size="small">
              {{ row.domainProjectIds.length }}个
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalWorkItems" label="工作项数" width="120" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.totalWorkItems || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="完成进度" width="180" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress || 0"
              :color="getProgressColor(row.progress || 0)"
            >
              <template #default="{ percentage }">
                <span>{{ percentage }}%</span>
              </template>
            </el-progress>
          </template>
        </el-table-column>
        <el-table-column label="需求统计" width="200" align="center">
          <template #default="{ row }">
            <div class="priority-tags">
              <el-tag v-if="row.statistics?.urCount" type="success" size="small">
                UR: {{ row.statistics.urCount }}
              </el-tag>
              <el-tag v-if="row.statistics?.frCount" type="primary" size="small">
                FR: {{ row.statistics.frCount }}
              </el-tag>
              <el-tag v-if="row.statistics?.mrCount" type="warning" size="small">
                MR: {{ row.statistics.mrCount }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="goToDetail(row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Box, List, Clock, Check } from '@element-plus/icons-vue'
import projectBacklogsData from '@/biz-data/mock/backlog/project-backlogs.json'
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import type { ProjectBacklog } from '@/types/backlog'
import type { DomainProject } from '@/types/project-v2'

const router = useRouter()

const backlogs = ref<ProjectBacklog[]>([])

onMounted(() => {
  backlogs.value = projectBacklogsData.data as ProjectBacklog[]
})

const totalWorkItems = computed(() => {
  return backlogs.value.reduce((sum, b) => sum + (b.workItemIds?.length || 0), 0)
})

const unallocatedCount = computed(() => {
  return backlogs.value.reduce((sum, b) => {
    return sum + (b.unassignedWorkItems || 0)
  }, 0)
})

const allocatedCount = computed(() => {
  return backlogs.value.reduce((sum, b) => {
    return sum + (b.assignedWorkItems || 0)
  }, 0)
})

const getProjectName = (backlog: ProjectBacklog) => {
  // 使用domainProjectIds数组的第一个
  if (backlog.domainProjectIds && backlog.domainProjectIds.length > 0) {
    const project = domainProjectsData.data.find((p: DomainProject) => p.id === backlog.domainProjectIds[0])
    return project?.name || backlog.domainProjectIds[0]
  }
  return '-'
}

const getVehicleProjectName = (backlog: ProjectBacklog) => {
  // 从PI Planning ID推断
  if (backlog.piPlanningId) {
    return backlog.piName || backlog.piPlanningId
  }
  return '-'
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
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
  router.push(`/backlog/project/${id}`)
}
</script>

<style scoped lang="scss">
.project-backlog-list {
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

    .priority-tags {
      display: flex;
      gap: 4px;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>

