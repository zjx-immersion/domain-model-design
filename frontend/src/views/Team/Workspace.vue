<template>
  <div class="team-workspace page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>👥 团队工作全景</h2>
        <p class="page-description">一页查看团队当前Sprint、工作项、成员负载和团队效能</p>
      </div>
      <div class="header-actions">
        <el-select v-model="selectedTeamId" placeholder="选择团队" style="width: 200px" @change="handleTeamChange">
          <el-option
            v-for="team in teamsData"
            :key="team.id"
            :label="team.name"
            :value="team.id"
          />
        </el-select>
        <el-button type="primary" :icon="Plus" @click="createWorkItem">新建工作项</el-button>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 区域1：当前Sprint信息 -->
    <section class="section current-sprint-section">
      <div class="section-title">
        <h3>当前 Sprint</h3>
        <el-button v-if="currentSprint" text type="primary" @click="goToSprintDetail">查看详情</el-button>
      </div>
      <el-card v-if="currentSprint" class="sprint-card">
        <div class="sprint-header">
          <div class="sprint-info">
            <h4>🏃 {{ currentSprint.name }}</h4>
            <el-tag :type="getStatusType(currentSprint.status)">
              {{ getStatusText(currentSprint.status) }}
            </el-tag>
          </div>
          <div class="sprint-dates">
            <span>{{ currentSprint.startDate }} ~ {{ currentSprint.endDate }}</span>
            <span class="days-left">剩余 {{ remainingDays }} 天</span>
          </div>
        </div>
        <el-row :gutter="20" class="sprint-stats">
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">{{ currentSprint.plannedStoryPoints }}</div>
              <div class="stat-label">计划故事点</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">{{ completedStoryPoints }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">{{ inProgressStoryPoints }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">{{ completionRate }}%</div>
              <div class="stat-label">完成率</div>
            </div>
          </el-col>
        </el-row>
        <div class="burndown-chart">
          <h5>Sprint 燃尽图</h5>
          <div class="chart-container">
            <div class="chart-placeholder">
              <el-empty description="燃尽图展示位置（使用ECharts实现）" :image-size="80" />
            </div>
          </div>
        </div>
      </el-card>
      <el-empty v-else description="当前团队没有进行中的Sprint" />
    </section>

    <!-- 区域2：工作项看板 -->
    <section class="section work-items-section">
      <div class="section-title">
        <h3>工作项看板</h3>
        <div class="filter-controls">
          <el-input
            v-model="workItemSearchText"
            placeholder="搜索工作项..."
            :prefix-icon="Search"
            clearable
            size="small"
            style="width: 200px; margin-right: 12px"
          />
          <el-select v-model="filterWorkItemType" placeholder="类型" clearable size="small" style="width: 150px">
            <el-option label="全部类型" value="" />
            <el-option label="需求任务" value="module_requirement" />
            <el-option label="缺陷" value="bugfix" />
            <el-option label="技术债" value="tech_debt" />
            <el-option label="优化" value="optimization" />
          </el-select>
        </div>
      </div>
      <el-row :gutter="20" class="kanban-board">
        <!-- 待开始列 -->
        <el-col :span="8">
          <el-card class="kanban-column">
            <template #header>
              <div class="column-header">
                <span>📝 待开始</span>
                <el-badge :value="todoWorkItems.length" type="info" />
              </div>
            </template>
            <draggable
              v-model="todoWorkItems"
              group="work-items"
              item-key="id"
              class="work-item-list"
              @change="handleKanbanChange($event, 'todo')"
            >
              <template #item="{ element }">
                <div class="work-item-card" @click="viewWorkItem(element)">
                  <div class="item-header">
                    <el-tag :type="getWorkItemTagType(element.type)" size="small">
                      {{ getWorkItemTypeLabel(element.type) }}
                    </el-tag>
                    <span class="item-id">#{{ element.id }}</span>
                  </div>
                  <div class="item-title">{{ element.title }}</div>
                  <div class="item-footer">
                    <el-avatar v-if="element.assigneeAvatar" :size="24" :src="element.assigneeAvatar" />
                    <span v-if="element.storyPoints" class="story-points">{{ element.storyPoints }} SP</span>
                  </div>
                </div>
              </template>
            </draggable>
          </el-card>
        </el-col>

        <!-- 进行中列 -->
        <el-col :span="8">
          <el-card class="kanban-column">
            <template #header>
              <div class="column-header">
                <span>🚀 进行中</span>
                <el-badge :value="inProgressWorkItems.length" type="warning" />
              </div>
            </template>
            <draggable
              v-model="inProgressWorkItems"
              group="work-items"
              item-key="id"
              class="work-item-list"
              @change="handleKanbanChange($event, 'in_progress')"
            >
              <template #item="{ element }">
                <div class="work-item-card" @click="viewWorkItem(element)">
                  <div class="item-header">
                    <el-tag :type="getWorkItemTagType(element.type)" size="small">
                      {{ getWorkItemTypeLabel(element.type) }}
                    </el-tag>
                    <span class="item-id">#{{ element.id }}</span>
                  </div>
                  <div class="item-title">{{ element.title }}</div>
                  <div class="item-footer">
                    <el-avatar v-if="element.assigneeAvatar" :size="24" :src="element.assigneeAvatar" />
                    <span v-if="element.storyPoints" class="story-points">{{ element.storyPoints }} SP</span>
                  </div>
                </div>
              </template>
            </draggable>
          </el-card>
        </el-col>

        <!-- 已完成列 -->
        <el-col :span="8">
          <el-card class="kanban-column">
            <template #header>
              <div class="column-header">
                <span>✅ 已完成</span>
                <el-badge :value="doneWorkItems.length" type="success" />
              </div>
            </template>
            <draggable
              v-model="doneWorkItems"
              group="work-items"
              item-key="id"
              class="work-item-list"
              @change="handleKanbanChange($event, 'done')"
            >
              <template #item="{ element }">
                <div class="work-item-card" @click="viewWorkItem(element)">
                  <div class="item-header">
                    <el-tag :type="getWorkItemTagType(element.type)" size="small">
                      {{ getWorkItemTypeLabel(element.type) }}
                    </el-tag>
                    <span class="item-id">#{{ element.id }}</span>
                  </div>
                  <div class="item-title">{{ element.title }}</div>
                  <div class="item-footer">
                    <el-avatar v-if="element.assigneeAvatar" :size="24" :src="element.assigneeAvatar" />
                    <span v-if="element.storyPoints" class="story-points">{{ element.storyPoints }} SP</span>
                  </div>
                </div>
              </template>
            </draggable>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 区域3：团队成员工作负载 -->
    <section class="section team-members-section">
      <div class="section-title">
        <h3>团队成员工作负载</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="member in teamMembers" :key="member.id">
          <el-card class="member-card" shadow="hover">
            <div class="member-info">
              <el-avatar :size="50" :src="member.avatar" />
              <div class="member-details">
                <div class="member-name">{{ member.name }}</div>
                <div class="member-role">{{ member.role }}</div>
              </div>
            </div>
            <div class="member-stats">
              <div class="stat-item">
                <span class="label">任务数:</span>
                <span class="value">{{ member.taskCount }}</span>
              </div>
              <div class="stat-item">
                <span class="label">故事点:</span>
                <span class="value">{{ member.storyPoints }}</span>
              </div>
            </div>
            <div class="utilization-bar">
              <span class="label">利用率:</span>
              <el-progress
                :percentage="member.utilization"
                :color="getUtilizationColor(member.utilization)"
                :stroke-width="10"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 区域4：团队效能指标 -->
    <section class="section team-metrics-section">
      <div class="section-title">
        <h3>团队效能指标</h3>
      </div>
      <el-row :gutter="20" class="metrics-row">
        <el-col :span="6" v-for="metric in teamMetrics" :key="metric.label">
          <el-card class="metric-card" shadow="hover">
            <el-statistic :title="metric.label" :value="metric.value">
              <template #prefix>
                <el-icon :style="{ color: metric.color, fontSize: '28px' }">
                  <component :is="metric.icon" />
                </el-icon>
              </template>
              <template #suffix v-if="metric.suffix">{{ metric.suffix }}</template>
            </el-statistic>
            <div v-if="metric.trend" class="trend">
              <el-icon :color="metric.trend > 0 ? '#67c23a' : '#f56c6c'">
                <component :is="metric.trend > 0 ? TopRight : BottomRight" />
              </el-icon>
              <span>{{ Math.abs(metric.trend) }}%</span>
              <span class="trend-label">{{ metric.trendLabel }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="charts-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>工作项类型分布</span>
            </template>
            <div class="type-distribution">
              <div v-for="type in workItemTypeDistribution" :key="type.name" class="type-item">
                <div class="type-bar" :style="{ width: type.percentage + '%', background: type.color }"></div>
                <span class="type-label">{{ type.name }}: {{ type.count }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>近期Sprint速度趋势</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="折线图展示位置" :image-size="100" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Refresh, Search, TrendCharts, CircleCheck, WarningFilled, Timer, TopRight, BottomRight } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'
import dayjs from 'dayjs'

// 导入数据
import teamsDataRaw from '@/biz-data/mock/teams.json'
import sprintsDataRaw from '@/biz-data/mock/sprint/sprints.json'
import workItemsDataRaw from '@/biz-data/mock/work-items.json'
import usersDataRaw from '@/biz-data/mock/users/users.json'

const router = useRouter()

// 解析数据
const teamsData = ref((teamsDataRaw as any).data || [])
const sprintsData = ref((sprintsDataRaw as any).data || [])
const allWorkItems = ref((workItemsDataRaw as any).data || [])
const usersData = ref((usersDataRaw as any).data || [])

// 状态
const selectedTeamId = ref('')
const workItemSearchText = ref('')
const filterWorkItemType = ref('')

// 关联工作项的负责人头像
allWorkItems.value.forEach((item: any) => {
  const assignee = usersData.value.find((u: any) => u.id === item.assigneeId)
  if (assignee) {
    item.assigneeAvatar = assignee.avatar
    item.assigneeName = assignee.name
  }
})

// 默认选中第一个团队
if (teamsData.value.length > 0) {
  selectedTeamId.value = teamsData.value[0].id
}

// 计算当前团队
const currentTeam = computed(() => {
  return teamsData.value.find((t: any) => t.id === selectedTeamId.value)
})

// 计算当前Sprint
const currentSprint = computed(() => {
  if (!selectedTeamId.value) return null
  return sprintsData.value.find((s: any) => 
    s.teamId === selectedTeamId.value && s.status === 'in_progress'
  )
})

// 计算剩余天数
const remainingDays = computed(() => {
  if (!currentSprint.value) return 0
  const endDate = dayjs(currentSprint.value.endDate)
  const today = dayjs()
  const days = endDate.diff(today, 'day')
  return days > 0 ? days : 0
})

// 计算工作项列表（当前团队 + 当前Sprint + 筛选）
const filteredWorkItems = computed(() => {
  let items = allWorkItems.value.filter((item: any) => {
    // 按团队筛选
    if (item.teamId !== selectedTeamId.value) return false
    
    // 按Sprint筛选（如果有当前Sprint）
    if (currentSprint.value && item.sprintId !== currentSprint.value.id) return false
    
    // 按类型筛选
    if (filterWorkItemType.value && item.type !== filterWorkItemType.value) return false
    
    // 按搜索文本筛选
    if (workItemSearchText.value) {
      const search = workItemSearchText.value.toLowerCase()
      return item.title.toLowerCase().includes(search) || 
             item.id.toLowerCase().includes(search)
    }
    
    return true
  })
  
  return items
})

// 分组工作项
const todoWorkItems = ref<any[]>([])
const inProgressWorkItems = ref<any[]>([])
const doneWorkItems = ref<any[]>([])

// 更新工作项分组
const updateWorkItemGroups = () => {
  todoWorkItems.value = filteredWorkItems.value.filter((item: any) => item.status === 'todo')
  inProgressWorkItems.value = filteredWorkItems.value.filter((item: any) => item.status === 'in_progress')
  doneWorkItems.value = filteredWorkItems.value.filter((item: any) => item.status === 'done')
}

// 监听筛选条件变化
watch([filteredWorkItems], () => {
  updateWorkItemGroups()
}, { immediate: true })

// 计算已完成和进行中的故事点
const completedStoryPoints = computed(() => {
  return doneWorkItems.value.reduce((sum: number, item: any) => 
    sum + (item.storyPoints || 0), 0
  )
})

const inProgressStoryPoints = computed(() => {
  return inProgressWorkItems.value.reduce((sum: number, item: any) => 
    sum + (item.storyPoints || 0), 0
  )
})

const completionRate = computed(() => {
  if (!currentSprint.value || currentSprint.value.plannedStoryPoints === 0) return 0
  return Math.round((completedStoryPoints.value / currentSprint.value.plannedStoryPoints) * 100)
})

// 计算团队成员负载
const teamMembers = computed(() => {
  if (!currentTeam.value || !currentTeam.value.members) return []
  
  return currentTeam.value.members.map((member: any) => {
    const memberWorkItems = filteredWorkItems.value.filter(
      (item: any) => item.assigneeId === member.id && item.status !== 'done'
    )
    const taskCount = memberWorkItems.length
    const storyPoints = memberWorkItems.reduce((sum: number, item: any) => 
      sum + (item.storyPoints || 0), 0
    )
    // 假设每人最多处理10个任务或30个故事点
    const utilization = Math.min(100, Math.round(Math.max(
      (taskCount / 10) * 100,
      (storyPoints / 30) * 100
    )))
    
    return {
      ...member,
      taskCount,
      storyPoints,
      utilization
    }
  })
})

// 计算团队效能指标
const teamMetrics = computed(() => {
  const totalWorkItems = filteredWorkItems.value.length
  const completedWorkItems = doneWorkItems.value.length
  const avgCompletionRate = totalWorkItems > 0 
    ? Math.round((completedWorkItems / totalWorkItems) * 100) 
    : 0
  
  // 模拟团队速度（近3个Sprint平均）
  const teamVelocity = currentSprint.value?.plannedStoryPoints || 35
  
  // 模拟缺陷数（从工作项中统计）
  const activeBugs = filteredWorkItems.value.filter(
    (item: any) => item.type === 'bugfix' && item.status !== 'done'
  ).length
  
  // 计算平均周期时间（天）
  const avgCycleTime = 3.5

  return [
    {
      label: '团队速度',
      value: teamVelocity,
      suffix: 'SP',
      icon: TrendCharts,
      color: '#409EFF',
      trend: 5,
      trendLabel: 'vs 上Sprint'
    },
    {
      label: 'Sprint完成率',
      value: completionRate.value,
      suffix: '%',
      icon: CircleCheck,
      color: '#67C23A',
      trend: 3,
      trendLabel: 'vs 上Sprint'
    },
    {
      label: '活跃缺陷',
      value: activeBugs,
      icon: WarningFilled,
      color: '#F56C6C',
      trend: -2,
      trendLabel: 'vs 上Sprint'
    },
    {
      label: '平均周期时间',
      value: avgCycleTime,
      suffix: '天',
      icon: Timer,
      color: '#E6A23C',
      trend: -1,
      trendLabel: 'vs 上Sprint'
    }
  ]
})

// 计算工作项类型分布
const workItemTypeDistribution = computed(() => {
  const typeMap: Record<string, any> = {
    module_requirement: { name: '需求任务', count: 0, color: '#409EFF' },
    bugfix: { name: '缺陷', count: 0, color: '#F56C6C' },
    tech_debt: { name: '技术债', count: 0, color: '#E6A23C' },
    optimization: { name: '优化', count: 0, color: '#67C23A' },
    non_functional: { name: '非功能', count: 0, color: '#909399' },
  }
  
  filteredWorkItems.value.forEach((item: any) => {
    if (typeMap[item.type]) {
      typeMap[item.type].count++
    }
  })
  
  const total = filteredWorkItems.value.length
  return Object.values(typeMap).map(t => ({
    ...t,
    percentage: total > 0 ? Math.round((t.count / total) * 100) : 0
  }))
})

// 方法实现
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: '',
    completed: 'success',
  }
  return typeMap[status] || ''
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    planning: '计划中',
    in_progress: '进行中',
    completed: '已完成',
  }
  return textMap[status] || status
}

const getWorkItemTagType = (type: string) => {
  const typeMap: Record<string, any> = {
    module_requirement: '',
    bugfix: 'danger',
    tech_debt: 'warning',
    optimization: 'success',
    non_functional: 'info',
  }
  return typeMap[type] || ''
}

const getWorkItemTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    module_requirement: '需求',
    bugfix: '缺陷',
    tech_debt: '技术债',
    optimization: '优化',
    non_functional: '非功能',
    research: '调研',
  }
  return labelMap[type] || type
}

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 90) return '#F56C6C' // 过载-红色
  if (utilization >= 70) return '#E6A23C' // 繁忙-橙色
  if (utilization >= 40) return '#67C23A' // 正常-绿色
  return '#909399' // 空闲-灰色
}

const handleTeamChange = () => {
  updateWorkItemGroups()
  ElMessage.success(`已切换到团队: ${currentTeam.value?.name}`)
}

const handleKanbanChange = (event: any, newStatus: string) => {
  if (event.added) {
    const movedItem = event.added.element
    // 更新工作项状态
    const itemIndex = allWorkItems.value.findIndex((item: any) => item.id === movedItem.id)
    if (itemIndex !== -1) {
      allWorkItems.value[itemIndex].status = newStatus
      ElMessage.success(`工作项 #${movedItem.id} 状态已更新`)
    }
  }
}

const viewWorkItem = (item: any) => {
  router.push(`/team/work-items/${item.id}`)
}

const createWorkItem = () => {
  ElMessage.info('创建工作项功能开发中...')
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
}

const goToSprintDetail = () => {
  if (currentSprint.value) {
    router.push(`/team/sprints/${currentSprint.value.id}`)
  }
}
</script>

<style scoped lang="scss">
.team-workspace {
  max-width: 100%;
  overflow-x: hidden;
  padding: 20px;

  .page-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-left {
      h2 {
        margin: 0 0 8px 0;
        font-size: 24px;
        font-weight: 600;
      }

      .page-description {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .section {
    margin-bottom: 24px;

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .filter-controls {
        display: flex;
        align-items: center;
      }
    }
  }

  .current-sprint-section {
    .sprint-card {
      .sprint-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .sprint-info {
          display: flex;
          align-items: center;
          gap: 12px;

          h4 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
          }
        }

        .sprint-dates {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          font-size: 14px;
          color: #606266;

          .days-left {
            font-weight: 600;
            color: #E6A23C;
          }
        }
      }

      .sprint-stats {
        margin-bottom: 20px;

        .stat-box {
          text-align: center;
          padding: 16px;
          background: #f5f7fa;
          border-radius: 4px;

          .stat-value {
            font-size: 32px;
            font-weight: 600;
            color: #409EFF;
            margin-bottom: 8px;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
          }
        }
      }

      .burndown-chart {
        h5 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .chart-container {
          height: 250px;
          background: #fafafa;
          border-radius: 4px;

          .chart-placeholder {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }

  .work-items-section {
    .kanban-board {
      margin: 0 -10px;

      .kanban-column {
        .column-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
        }

        :deep(.el-card__body) {
          padding: 12px;
          min-height: 400px;
          max-height: 600px;
          overflow-y: auto;
        }

        .work-item-list {
          min-height: 350px;
        }

        .work-item-card {
          padding: 12px;
          margin-bottom: 8px;
          background: #fff;
          border: 1px solid #e4e7ed;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;

          &:hover {
            border-color: #409EFF;
            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
          }

          &:focus,
          &:active {
            outline: none;
            border-color: #409EFF;
          }

          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .item-id {
              font-size: 12px;
              color: #909399;
            }
          }

          .item-title {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 8px;
            line-height: 1.4;
          }

          .item-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .story-points {
              font-size: 12px;
              padding: 2px 6px;
              background: #f0f9ff;
              color: #409EFF;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }

  .team-members-section {
    .member-card {
      .member-info {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .member-details {
          flex: 1;

          .member-name {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 4px;
          }

          .member-role {
            font-size: 12px;
            color: #909399;
          }
        }
      }

      .member-stats {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;

        .stat-item {
          .label {
            font-size: 12px;
            color: #909399;
            margin-right: 4px;
          }

          .value {
            font-size: 18px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .utilization-bar {
        .label {
          font-size: 12px;
          color: #909399;
          margin-right: 8px;
        }
      }
    }
  }

  .team-metrics-section {
    .metrics-row {
      margin-bottom: 20px;

      .metric-card {
        :deep(.el-statistic) {
          .el-statistic__head {
            font-size: 14px;
            color: #909399;
            margin-bottom: 8px;
          }

          .el-statistic__content {
            font-size: 28px;
            font-weight: 600;
          }
        }

        .trend {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 8px;
          font-size: 12px;

          .trend-label {
            margin-left: 4px;
            color: #909399;
          }
        }
      }
    }

    .charts-row {
      .chart-card {
        .type-distribution {
          padding: 20px;

          .type-item {
            margin-bottom: 16px;
            position: relative;

            .type-bar {
              height: 28px;
              border-radius: 4px;
              transition: all 0.3s;
            }

            .type-label {
              position: absolute;
              left: 8px;
              top: 5px;
              color: #fff;
              font-size: 13px;
              font-weight: 600;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
          }
        }

        .chart-placeholder {
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fafafa;
        }
      }
    }
  }
}
</style>
