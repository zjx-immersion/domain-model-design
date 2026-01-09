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
        <el-table-column prop="projectName" label="所属项目" width="180">
          <template #default="{ row }">
            {{ getProjectName(row.projectId) }}
          </template>
        </el-table-column>
        <el-table-column prop="vehicleProject" label="车型项目" width="150">
          <template #default="{ row }">
            {{ getVehicleProjectName(row) }}
          </template>
        </el-table-column>
        <el-table-column prop="items" label="工作项数" width="120" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.items.length }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分配进度" width="180" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="calculateAllocationProgress(row)"
              :color="getProgressColor(calculateAllocationProgress(row))"
            >
              <template #default="{ percentage }">
                <span>{{ percentage }}%</span>
              </template>
            </el-progress>
          </template>
        </el-table-column>
        <el-table-column label="优先级分布" width="200" align="center">
          <template #default="{ row }">
            <div class="priority-tags">
              <el-tag v-if="getPriorityCount(row, 'high') > 0" type="danger" size="small">
                高: {{ getPriorityCount(row, 'high') }}
              </el-tag>
              <el-tag v-if="getPriorityCount(row, 'medium') > 0" type="warning" size="small">
                中: {{ getPriorityCount(row, 'medium') }}
              </el-tag>
              <el-tag v-if="getPriorityCount(row, 'low') > 0" type="info" size="small">
                低: {{ getPriorityCount(row, 'low') }}
              </el-tag>
            </div>
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
            <el-button link type="primary" @click="goToDomainProject(row.projectId)">项目</el-button>
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
import vehicleProjectsData from '@/biz-data/mock/project/vehicle-projects.json'
import type { ProjectBacklog } from '@/types/backlog'
import type { DomainProject, VehicleProject } from '@/types/project-v2'

const router = useRouter()

const backlogs = ref<ProjectBacklog[]>([])

onMounted(() => {
  backlogs.value = projectBacklogsData.data as ProjectBacklog[]
})

const totalWorkItems = computed(() => {
  return backlogs.value.reduce((sum, b) => sum + b.items.length, 0)
})

const unallocatedCount = computed(() => {
  return backlogs.value.reduce((sum, b) => {
    return sum + b.items.filter(item => !item.assignedTeamBacklogId).length
  }, 0)
})

const allocatedCount = computed(() => {
  return backlogs.value.reduce((sum, b) => {
    return sum + b.items.filter(item => item.assignedTeamBacklogId).length
  }, 0)
})

const getProjectName = (projectId: string) => {
  const project = domainProjectsData.data.find((p: DomainProject) => p.id === projectId)
  return project?.name || projectId
}

const getVehicleProjectName = (backlog: ProjectBacklog) => {
  const project = domainProjectsData.data.find((p: DomainProject) => p.id === backlog.projectId)
  if (!project) return '-'
  const vehicleProject = vehicleProjectsData.data.find((vp: VehicleProject) => vp.id === project.vehicleProjectId)
  return vehicleProject?.name || '-'
}

const calculateAllocationProgress = (backlog: ProjectBacklog) => {
  if (backlog.items.length === 0) return 0
  const allocated = backlog.items.filter(item => item.assignedTeamBacklogId).length
  return Math.round((allocated / backlog.items.length) * 100)
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

const getPriorityCount = (backlog: ProjectBacklog, priority: string) => {
  return backlog.items.filter(item => item.priority === priority).length
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

const goToDomainProject = (id: string) => {
  router.push(`/projects/domain/${id}`)
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

