<template>
  <div class="vehicle-project-detail page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/projects/vehicle' }">车型项目</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project?.name || '项目详情' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="!project" class="empty-state">
      <el-empty description="项目不存在" />
      <el-button type="primary" @click="goBack">返回列表</el-button>
    </div>

    <div v-else>
      <!-- 项目基本信息 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Document /></el-icon>
              项目基本信息
            </span>
            <el-tag :type="getStatusType(project.status)">{{ getStatusText(project.status) }}</el-tag>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="项目编码">{{ project.code }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(project.priority)">{{ getPriorityText(project.priority) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="项目名称">{{ project.name }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ getUserName(project.ownerId) }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ project.startDate }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ project.endDate }}</el-descriptions-item>
          <el-descriptions-item label="项目进度" :span="2">
            <el-progress :percentage="project.progress" :color="getProgressColor(project.progress)" />
          </el-descriptions-item>
          <el-descriptions-item label="预算">¥{{ (project.budget / 10000).toFixed(2) }} 万</el-descriptions-item>
          <el-descriptions-item label="实际成本">¥{{ (project.actualCost / 10000).toFixed(2) }} 万</el-descriptions-item>
          <el-descriptions-item label="项目描述" :span="2">{{ project.description }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="领域项目数" :value="domainProjects.length">
              <template #prefix>
                <el-icon><FolderOpened /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="项目目标数" :value="project.objectives.length">
              <template #prefix>
                <el-icon><Flag /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="完成目标" :value="completedObjectivesCount">
              <template #prefix>
                <el-icon><CircleCheck /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="成本执行率" :value="costExecutionRate" suffix="%">
              <template #prefix>
                <el-icon><Money /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="16">
          <!-- 关联的领域项目 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><Grid /></el-icon>
                  关联领域项目 ({{ domainProjects.length }})
                </span>
                <el-button type="primary" size="small" @click="addDomainProject">
                  <el-icon><Plus /></el-icon> 新增
                </el-button>
              </div>
            </template>

            <el-table :data="domainProjects" stripe>
              <el-table-column prop="code" label="项目编码" width="140" />
              <el-table-column prop="name" label="项目名称" min-width="200">
                <template #default="{ row }">
                  <el-link type="primary" @click="goToDomainProject(row.id)">
                    {{ row.name }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="domain" label="技术领域" width="120">
                <template #default="{ row }">
                  <el-tag>{{ row.domain }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="progress" label="进度" width="150">
                <template #default="{ row }">
                  <el-progress :percentage="row.progress" :stroke-width="8" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="goToDomainProject(row.id)">
                    查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="domainProjects.length === 0" description="暂无领域项目" :image-size="80" />
          </el-card>

          <!-- 项目目标 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><Flag /></el-icon>
                  项目目标 ({{ project.objectives.length }})
                </span>
              </div>
            </template>

            <el-timeline>
              <el-timeline-item
                v-for="objective in project.objectives"
                :key="objective.id"
                :timestamp="objective.dueDate"
                placement="top"
                :type="getObjectiveType(objective.status)"
              >
                <el-card>
                  <div class="objective-header">
                    <h4>{{ objective.title }}</h4>
                    <el-tag :type="getStatusType(objective.status)">{{ getStatusText(objective.status) }}</el-tag>
                  </div>
                  <p class="objective-desc">{{ objective.description }}</p>
                  <div class="objective-footer">
                    <span class="owner">负责人: {{ getUserName(objective.ownerId) }}</span>
                    <el-progress :percentage="objective.progress" :stroke-width="6" style="width: 200px" />
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>

            <el-empty v-if="project.objectives.length === 0" description="暂无项目目标" :image-size="80" />
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- 项目团队 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><User /></el-icon>
                  项目团队 ({{ project.members.length }})
                </span>
              </div>
            </template>

            <div class="team-members">
              <div v-for="memberId in project.members" :key="memberId" class="member-item">
                <el-avatar :size="40">{{ getUserName(memberId).charAt(0) }}</el-avatar>
                <span class="member-name">{{ getUserName(memberId) }}</span>
              </div>
            </div>

            <el-empty v-if="project.members.length === 0" description="暂无团队成员" :image-size="60" />
          </el-card>

          <!-- 版本规划 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><Tickets /></el-icon>
                  版本规划 ({{ project.versions.length }})
                </span>
              </div>
            </template>

            <div class="version-list">
              <div v-for="version in project.versions" :key="version.id" class="version-item">
                <div class="version-header">
                  <el-tag type="success">{{ version.name }}</el-tag>
                  <el-tag :type="getStatusType(version.status)" size="small">{{ getStatusText(version.status) }}</el-tag>
                </div>
                <p class="version-desc">{{ version.description }}</p>
                <div class="version-footer">
                  <span class="version-date">{{ version.startDate }} ~ {{ version.endDate }}</span>
                </div>
              </div>
            </div>

            <el-empty v-if="project.versions.length === 0" description="暂无版本规划" :image-size="60" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import vehicleProjectsData from '@/biz-data/mock/project/vehicle-projects.json'
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import usersData from '@/biz-data/mock/users/users.json'
import type { VehicleProject, DomainProject } from '@/types/project-v2'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const project = ref<VehicleProject | null>(null)
const domainProjects = ref<DomainProject[]>([])

onMounted(() => {
  const projectId = route.params.id as string
  const foundProject = vehicleProjectsData.data.find((p: VehicleProject) => p.id === projectId)
  
  if (foundProject) {
    project.value = foundProject as VehicleProject
    // 加载关联的领域项目
    domainProjects.value = domainProjectsData.data.filter((dp: DomainProject) => 
      dp.associatedVehicleProjects?.includes(projectId)
    ) as DomainProject[]
  }
})

const completedObjectivesCount = computed(() => {
  if (!project.value) return 0
  return project.value.objectives.filter(obj => obj.status === 'completed').length
})

const costExecutionRate = computed(() => {
  if (!project.value || project.value.budget === 0) return 0
  return Math.round((project.value.actualCost / project.value.budget) * 100)
})

const getUserName = (userId: string) => {
  const user = usersData.data.find((u: any) => u.id === userId)
  return user ? user.name : '未知'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    'planning': 'info',
    'in_progress': 'primary',
    'completed': 'success',
    'on_hold': 'warning',
    'cancelled': 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'planning': '计划中',
    'in_progress': '进行中',
    'completed': '已完成',
    'on_hold': '暂停',
    'cancelled': '已取消'
  }
  return map[status] || status
}

const getPriorityType = (priority: string) => {
  const map: Record<string, any> = {
    'critical': 'danger',
    'high': 'warning',
    'medium': 'primary',
    'low': 'info'
  }
  return map[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const map: Record<string, string> = {
    'critical': '紧急',
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  return map[priority] || priority
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

const getObjectiveType = (status: string) => {
  const map: Record<string, any> = {
    'completed': 'success',
    'in_progress': 'primary',
    'planning': 'info'
  }
  return map[status] || 'info'
}

const goBack = () => {
  router.push('/projects/vehicle')
}

const goToDomainProject = (id: string) => {
  router.push(`/projects/domain/${id}`)
}

const addDomainProject = () => {
  ElMessage.info('新增领域项目功能开发中')
}
</script>

<style scoped lang="scss">
.vehicle-project-detail {
  .page-header {
    margin-bottom: 20px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;

    .el-button {
      margin-top: 20px;
    }
  }

  .section-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        font-size: 16px;
      }
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      text-align: center;
      
      :deep(.el-statistic__head) {
        font-size: 14px;
        color: #606266;
      }

      :deep(.el-statistic__content) {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
      }
    }
  }

  .objective-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    h4 {
      margin: 0;
      font-size: 16px;
    }
  }

  .objective-desc {
    color: #606266;
    margin: 10px 0;
    font-size: 14px;
  }

  .objective-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;

    .owner {
      font-size: 13px;
      color: #909399;
    }
  }

  .team-members {
    .member-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .member-name {
        font-size: 14px;
      }
    }
  }

  .version-list {
    .version-item {
      padding: 15px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .version-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .version-desc {
        font-size: 13px;
        color: #606266;
        margin: 8px 0;
      }

      .version-footer {
        .version-date {
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>

