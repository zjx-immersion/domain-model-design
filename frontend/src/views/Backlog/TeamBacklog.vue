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
                {{ team?.name || backlog.teamId }}
              </el-descriptions-item>
              <el-descriptions-item label="所属项目">
                <el-link type="primary" @click="goToDomainProject(backlog.projectId)">
                  {{ domainProject?.name || backlog.projectId }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item label="来源项目待办">
                <el-link type="primary" @click="goToProjectBacklog(backlog.projectBacklogId)">
                  查看项目待办
                </el-link>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="团队容量">{{ backlog.capacity }} SP/Sprint</el-descriptions-item>
              <el-descriptions-item label="已分配容量">{{ allocatedCapacity }} SP</el-descriptions-item>
              <el-descriptions-item label="剩余容量">{{ remainingCapacity }} SP</el-descriptions-item>
              <el-descriptions-item label="容量利用率">
                <el-progress
                  :percentage="capacityUtilization"
                  :color="getCapacityColor(capacityUtilization)"
                  :stroke-width="12"
                />
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="待办工作项" :value="backlog.items.length">
              <template #prefix>
                <el-icon><List /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="待规划" :value="unplannedCount">
              <template #prefix>
                <el-icon><Clock /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="已规划" :value="plannedCount">
              <template #prefix>
                <el-icon><Check /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="总故事点" :value="totalStoryPoints">
              <template #prefix>
                <el-icon><TrendCharts /></el-icon>
              </template>
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
                  待办工作项 ({{ filteredItems.length }})
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
                    v-model="filterPriority"
                    placeholder="优先级"
                    clearable
                    style="width: 120px"
                  >
                    <el-option label="全部" value="" />
                    <el-option label="紧急" value="critical" />
                    <el-option label="高" value="high" />
                    <el-option label="中" value="medium" />
                    <el-option label="低" value="low" />
                  </el-select>
                </div>
              </div>
            </template>

            <!-- 优先级队列视图 -->
            <div class="priority-queue">
              <draggable
                v-model="sortedItems"
                item-key="id"
                class="draggable-list"
                @change="onPriorityChange"
              >
                <template #item="{ element }">
                  <div class="queue-item" :class="{ 'planned': element.sprintId }">
                    <div class="item-handle">
                      <el-icon><Rank /></el-icon>
                    </div>
                    <div class="item-content">
                      <div class="item-header">
                        <div class="item-title-row">
                          <el-tag size="small" :type="getTypeColor(element.type)">{{ element.type }}</el-tag>
                          <span class="item-code">{{ element.code }}</span>
                          <span class="item-title">{{ element.title }}</span>
                        </div>
                        <div class="item-meta">
                          <el-tag :type="getPriorityType(element.priority)" size="small">
                            {{ getPriorityText(element.priority) }}
                          </el-tag>
                          <el-tag type="info" size="small">{{ element.storyPoints || 0 }} SP</el-tag>
                          <el-tag v-if="element.sprintId" type="success" size="small">
                            已加入Sprint
                          </el-tag>
                        </div>
                      </div>
                      <div class="item-actions">
                        <el-button type="primary" link size="small" @click="viewItem(element)">
                          查看
                        </el-button>
                        <el-button
                          v-if="!element.sprintId"
                          type="success"
                          link
                          size="small"
                          @click="addToSprint(element)"
                        >
                          加入Sprint
                        </el-button>
                        <el-button v-else type="warning" link size="small" @click="removeFromSprint(element)">
                          移出Sprint
                        </el-button>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>

              <el-empty v-if="sortedItems.length === 0" description="暂无工作项" :image-size="100" />
            </div>
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
                :percentage="capacityUtilization"
                :color="getCapacityColor(capacityUtilization)"
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
                <span class="detail-value">{{ backlog.capacity }} SP</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">已分配:</span>
                <span class="detail-value">{{ allocatedCapacity }} SP</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">剩余:</span>
                <span class="detail-value">{{ remainingCapacity }} SP</span>
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
import draggable from 'vuedraggable'
import teamBacklogsData from '@/biz-data/mock/backlog/team-backlogs.json'
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import sprintsData from '@/biz-data/mock/sprint/sprints.json'
import teamsData from '@/biz-data/mock/teams.json'
import type { TeamBacklog, BacklogItem } from '@/types/backlog'
import type { DomainProject } from '@/types/project-v2'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const backlog = ref<TeamBacklog | null>(null)
const domainProject = ref<DomainProject | null>(null)
const team = ref<any>(null)
const sprints = ref<any[]>([])

const searchKeyword = ref('')
const filterPriority = ref('')
const sortedItems = ref<BacklogItem[]>([])

onMounted(() => {
  const backlogId = route.params.id as string
  const foundBacklog = teamBacklogsData.data.find((b: TeamBacklog) => b.id === backlogId)
  
  if (foundBacklog) {
    backlog.value = foundBacklog as TeamBacklog
    sortedItems.value = [...foundBacklog.items]
    
    // 加载关联的领域项目
    const foundProject = domainProjectsData.data.find(
      (p: DomainProject) => p.id === foundBacklog.projectId
    )
    domainProject.value = foundProject as DomainProject || null

    // 加载团队信息
    team.value = teamsData.data.find((t: any) => t.id === foundBacklog.teamId) || null

    // 加载相关Sprint
    sprints.value = sprintsData.data.filter((s: any) => s.teamId === foundBacklog.teamId) || []
  }
})

const filteredItems = computed(() => {
  let items = sortedItems.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
    )
  }

  // 优先级筛选
  if (filterPriority.value) {
    items = items.filter(item => item.priority === filterPriority.value)
  }

  return items
})

const unplannedCount = computed(() => {
  return sortedItems.value.filter(item => !item.sprintId).length
})

const plannedCount = computed(() => {
  return sortedItems.value.filter(item => item.sprintId).length
})

const totalStoryPoints = computed(() => {
  return sortedItems.value.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
})

const allocatedCapacity = computed(() => {
  return sortedItems.value
    .filter(item => item.sprintId)
    .reduce((sum, item) => sum + (item.storyPoints || 0), 0)
})

const remainingCapacity = computed(() => {
  if (!backlog.value) return 0
  return backlog.value.capacity - allocatedCapacity.value
})

const capacityUtilization = computed(() => {
  if (!backlog.value || backlog.value.capacity === 0) return 0
  return Math.round((allocatedCapacity.value / backlog.value.capacity) * 100)
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

const getTypeColor = (type: string) => {
  const map: Record<string, any> = {
    'feature': 'primary',
    'story': 'success',
    'task': 'info',
    'bug': 'danger'
  }
  return map[type] || 'info'
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
  return sortedItems.value.filter(item => item.sprintId === sprintId).length
}

const getSprintStoryPoints = (sprintId: string) => {
  return sortedItems.value
    .filter(item => item.sprintId === sprintId)
    .reduce((sum, item) => sum + (item.storyPoints || 0), 0)
}

const onPriorityChange = () => {
  ElMessage.success('优先级已调整')
}

const goBack = () => {
  router.push('/backlog/team')
}

const goToDomainProject = (projectId: string) => {
  router.push(`/projects/domain/${projectId}`)
}

const goToProjectBacklog = (backlogId: string) => {
  router.push(`/backlog/project/${backlogId}`)
}

const goToSprint = (sprintId: string) => {
  router.push(`/sprint/${sprintId}`)
}

const viewItem = (item: BacklogItem) => {
  ElMessage.info(`查看工作项: ${item.title}`)
}

const addToSprint = (item: BacklogItem) => {
  ElMessage.info(`将工作项 "${item.title}" 加入Sprint`)
}

const removeFromSprint = (item: BacklogItem) => {
  ElMessage.info(`将工作项 "${item.title}" 从Sprint移出`)
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

  .priority-queue {
    .draggable-list {
      min-height: 400px;
    }

    .queue-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 12px;
      background: #fff;
      border: 1px solid #e4e7ed;
      border-radius: 6px;
      cursor: move;
      transition: all 0.3s;

      &:hover {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
      }

      &.planned {
        background: #f0f9ff;
        border-color: #67c23a;
      }

      .item-handle {
        margin-right: 12px;
        color: #909399;
        cursor: move;
      }

      .item-content {
        flex: 1;

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .item-title-row {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;

            .item-code {
              font-size: 12px;
              color: #909399;
            }

            .item-title {
              font-size: 14px;
              font-weight: 500;
            }
          }

          .item-meta {
            display: flex;
            gap: 6px;
          }
        }

        .item-actions {
          display: flex;
          gap: 8px;
        }
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
