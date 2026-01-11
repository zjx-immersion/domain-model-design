<template>
  <div class="team-backlog page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/backlog/team' }">团队待办</el-breadcrumb-item>
        <el-breadcrumb-item>{{ backlog?.name || '待办详情' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="!backlog" class="empty-state">
      <el-empty description="待办不存在" />
      <el-button type="primary" @click="goBack">返回列表</el-button>
    </div>

    <div v-else>
      <!-- 团队信息卡片 -->
      <el-card class="section-card team-info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><User /></el-icon>
              团队待办信息
            </span>
            <el-tag :type="getStatusType(backlog.status)">{{ getStatusText(backlog.status) }}</el-tag>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="待办名称">{{ backlog.name }}</el-descriptions-item>
              <el-descriptions-item label="所属团队">
                {{ backlog.teamName || team?.name || backlog.teamId }}
              </el-descriptions-item>
              <el-descriptions-item label="所属PI Planning">
                {{ backlog.piName || backlog.piPlanningId || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="来源项目待办">
                <el-link v-if="backlog.projectBacklogId" type="primary" @click="goToProjectBacklog(backlog.projectBacklogId)">
                  查看项目待办
                </el-link>
                <span v-else>-</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="团队容量">{{ backlog.teamCapacity || 0 }}h</el-descriptions-item>
              <el-descriptions-item label="总工作项">{{ backlog.totalWorkItems || 0 }}项</el-descriptions-item>
              <el-descriptions-item label="容量利用率">
                <el-progress
                  :percentage="backlog.utilizationRate || 0"
                  :color="getCapacityColor(backlog.utilizationRate || 0)"
                  :stroke-width="12"
                />
              </el-descriptions-item>
              <el-descriptions-item label="完成度">{{ backlog.completionRate || 0 }}%</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="总工作项" :value="backlog.totalWorkItems || 0">
              <template #prefix>
                <el-icon><List /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="模块需求(MR)" :value="backlog.mrStatistics?.totalMRs || 0">
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="已完成MR" :value="backlog.mrStatistics?.doneMRs || 0">
              <template #prefix>
                <el-icon><Check /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="MR完成率" :value="backlog.mrStatistics?.mrCompletionRate || 0">
              <template #prefix>
                <el-icon><TrendCharts /></el-icon>
              </template>
              <template #suffix>%</template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="16">
          <!-- 工作项列表 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><List /></el-icon>
                  模块需求 (MR) - {{ mrList.length }}个
                </span>
                <div class="header-actions">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索工作项"
                    clearable
                    style="width: 200px; margin-right: 10px"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                  <el-select
                    v-model="filterStatus"
                    placeholder="状态"
                    clearable
                    style="width: 120px"
                  >
                    <el-option label="全部" value="" />
                    <el-option label="待开始" value="pending" />
                    <el-option label="进行中" value="in_progress" />
                    <el-option label="评审中" value="in_review" />
                    <el-option label="已完成" value="done" />
                  </el-select>
                </div>
              </div>
            </template>

            <!-- MR列表 -->
            <el-table :data="filteredMRs" stripe>
              <el-table-column prop="code" label="需求编码" width="140" />
              <el-table-column prop="name" label="需求名称" min-width="250" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="priority" label="优先级" width="100">
                <template #default="{ row }">
                  <el-tag :type="getPriorityType(row.priority)" size="small">
                    {{ getPriorityText(row.priority) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="moduleId" label="关联Module" width="150">
                <template #default="{ row }">
                  <el-tag v-if="row.moduleId" type="success" size="small">已关联</el-tag>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="viewMR(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="mrList.length === 0" description="暂无模块需求" :image-size="100" />
          </el-card>
        </el-col>

        <el-col :span="8">
          <!-- Sprint列表 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><Calendar /></el-icon>
                  Sprint 列表
                </span>
              </div>
            </template>

            <div class="sprint-list">
              <div v-for="sprint in sprints" :key="sprint.id" class="sprint-item">
                <div class="sprint-header">
                  <el-tag type="primary">{{ sprint.name }}</el-tag>
                  <el-tag :type="getSprintStatusType(sprint.status)" size="small">
                    {{ getSprintStatusText(sprint.status) }}
                  </el-tag>
                </div>
                <div class="sprint-info">
                  <div class="info-row">
                    <span class="label">时间:</span>
                    <span class="value">{{ sprint.startDate }} ~ {{ sprint.endDate }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">工作项:</span>
                    <span class="value">{{ getSprintItemCount(sprint.id) }} 项</span>
                  </div>
                  <div class="info-row">
                    <span class="label">故事点:</span>
                    <span class="value">{{ getSprintStoryPoints(sprint.id) }} SP</span>
                  </div>
                </div>
                <el-button type="primary" link size="small" @click="goToSprint(sprint.id)">
                  查看详情 →
                </el-button>
              </div>
            </div>

            <el-empty v-if="sprints.length === 0" description="暂无Sprint" :image-size="80" />
          </el-card>

          <!-- 容量分析 -->
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><PieChart /></el-icon>
                  容量分析
                </span>
              </div>
            </template>

            <div class="capacity-chart">
              <el-progress
                type="dashboard"
                :percentage="backlog.utilizationRate || 0"
                :color="getCapacityColor(backlog.utilizationRate || 0)"
              >
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ percentage }}%</span>
                  <span class="percentage-label">容量利用率</span>
                </template>
              </el-progress>
            </div>

            <div class="capacity-details">
              <div class="detail-item">
                <span class="detail-label">团队容量:</span>
                <span class="detail-value">{{ backlog.teamCapacity || 0 }}h</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">总工作项:</span>
                <span class="detail-value">{{ backlog.totalWorkItems || 0 }}项</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">完成率:</span>
                <span class="detail-value">{{ backlog.completionRate || 0 }}%</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document } from '@element-plus/icons-vue'
import teamBacklogsData from '@/biz-data/mock/backlog/team-backlogs.json'
import sprintsData from '@/biz-data/mock/sprint/sprints.json'
import teamsData from '@/biz-data/mock/teams.json'
import type { TeamBacklog } from '@/types/backlog'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const backlog = ref<TeamBacklog | null>(null)
const team = ref<any>(null)
const sprints = ref<any[]>([])

const searchKeyword = ref('')
const filterStatus = ref('')

onMounted(() => {
  const backlogId = route.params.id as string
  const foundBacklog = teamBacklogsData.data.find((b: TeamBacklog) => b.id === backlogId)
  
  if (foundBacklog) {
    backlog.value = foundBacklog as TeamBacklog
    
    // 加载团队信息
    const teams = Array.isArray(teamsData) ? teamsData : teamsData.data || []
    team.value = teams.find((t: any) => t.id === foundBacklog.teamId) || null

    // 加载相关Sprint
    sprints.value = sprintsData.data.filter((s: any) => s.teamId === foundBacklog.teamId) || []
  }
})

const mrList = computed(() => {
  if (!backlog.value || !backlog.value.mrsDetails) return []
  return backlog.value.mrsDetails
})

const filteredMRs = computed(() => {
  let mrs = mrList.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    mrs = mrs.filter(mr => 
      mr.name?.toLowerCase().includes(keyword) ||
      mr.code?.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (filterStatus.value) {
    mrs = mrs.filter(mr => mr.status === filterStatus.value)
  }

  return mrs
})

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'planning': 'info',
    'closed': 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': '活动中',
    'planning': '计划中',
    'closed': '已关闭'
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

const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'open': 'info',
    'pending': 'info',
    'in_progress': 'primary',
    'in_review': 'warning',
    'done': 'success',
    'approved': 'success',
  }
  return map[status] || 'info'
}

const getSprintStatusType = (status: string) => {
  const map: Record<string, any> = {
    'planning': 'info',
    'active': 'success',
    'completed': 'info'
  }
  return map[status] || 'info'
}

const getSprintStatusText = (status: string) => {
  const map: Record<string, string> = {
    'planning': '计划中',
    'active': '进行中',
    'completed': '已完成'
  }
  return map[status] || status
}

const getCapacityColor = (utilization: number) => {
  if (utilization < 70) return '#67c23a'
  if (utilization < 90) return '#e6a23c'
  return '#f56c6c'
}

const getSprintItemCount = (sprintId: string) => {
  if (!backlog.value || !backlog.value.mrsBySprint) return 0
  const sprintMRs = backlog.value.mrsBySprint[sprintId] || []
  return sprintMRs.length
}

const getSprintStoryPoints = (sprintId: string) => {
  if (!backlog.value || !backlog.value.mrsBySprint) return 0
  const sprintMRs = backlog.value.mrsBySprint[sprintId] || []
  return sprintMRs.reduce((sum: number, mrId: string) => {
    const mr = backlog.value?.mrsDetails?.find(m => m.id === mrId)
    return sum + (mr?.estimatedHours || 0)
  }, 0)
}

const goBack = () => {
  router.push('/backlog/team')
}

const goToProjectBacklog = (backlogId: string) => {
  router.push(`/backlog/project/${backlogId}`)
}

const goToSprint = (sprintId: string) => {
  router.push(`/sprint/${sprintId}`)
}

const viewMR = (mr: any) => {
  ElMessage.info(`查看模块需求: ${mr.name}`)
}
</script>

<style scoped lang="scss">
.team-backlog {
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

      .header-actions {
        display: flex;
        align-items: center;
      }
    }
  }

  .team-info-card {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: #fff;

    :deep(.el-descriptions__label) {
      color: rgba(255, 255, 255, 0.9);
    }

    :deep(.el-descriptions__content) {
      color: #fff;
    }

    :deep(.el-link) {
      color: #fff;
      
      &:hover {
        opacity: 0.8;
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

  .sprint-list {
    .sprint-item {
      padding: 15px;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .sprint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .sprint-info {
        margin: 10px 0;

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
          font-size: 13px;

          .label {
            color: #909399;
          }

          .value {
            font-weight: 500;
          }
        }
      }
    }
  }

  .capacity-chart {
    display: flex;
    justify-content: center;
    padding: 20px 0;

    .percentage-value {
      display: block;
      font-size: 28px;
      font-weight: bold;
      line-height: 1;
    }

    .percentage-label {
      display: block;
      font-size: 12px;
      color: #909399;
      margin-top: 8px;
    }
  }

  .capacity-details {
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .detail-label {
        font-size: 14px;
        color: #606266;
      }

      .detail-value {
        font-size: 14px;
        font-weight: 500;
        color: #409eff;
      }
    }
  }
}
</style>
