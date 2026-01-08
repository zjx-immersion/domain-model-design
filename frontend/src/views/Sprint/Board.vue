<template>
  <div class="sprint-board-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button icon="ArrowLeft" @click="handleBack">返回</el-button>
        <div class="sprint-info">
          <h2>{{ sprint.name }}</h2>
          <el-tag :type="getSprintStatusType(sprint.status)" size="large">
            {{ getSprintStatusLabel(sprint.status) }}
          </el-tag>
        </div>
      </div>
      <div class="header-right">
        <el-button icon="Refresh" @click="handleRefresh">刷新</el-button>
        <el-button icon="Download" @click="handleExport">导出</el-button>
        <el-button icon="Setting" @click="handleSettings">设置</el-button>
      </div>
    </div>

    <!-- Sprint信息卡片 -->
    <el-row :gutter="20" class="info-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="info-card">
          <div class="card-content">
            <el-icon :size="30" color="#409EFF"><Calendar /></el-icon>
            <div class="card-text">
              <div class="card-label">Sprint周期</div>
              <div class="card-value">
                {{ formatDate(sprint.startDate) }} ~ {{ formatDate(sprint.endDate) }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="info-card">
          <div class="card-content">
            <el-icon :size="30" color="#67C23A"><TrendCharts /></el-icon>
            <div class="card-text">
              <div class="card-label">完成进度</div>
              <div class="card-value">{{ Math.round(sprint.progress * 100) }}%</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="info-card">
          <div class="card-content">
            <el-icon :size="30" color="#E6A23C"><Document /></el-icon>
            <div class="card-text">
              <div class="card-label">工作项</div>
              <div class="card-value">
                {{ completedWorkItems }}/{{ totalWorkItems }}
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card shadow="hover" class="info-card">
          <div class="card-content">
            <el-icon :size="30" color="#F56C6C"><Timer /></el-icon>
            <div class="card-text">
              <div class="card-label">剩余时间</div>
              <div class="card-value">{{ remainingDays }} 天</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 看板主体 -->
    <el-card class="board-card" shadow="never" v-loading="loading">
      <template #header>
        <div class="board-header">
          <span>Sprint看板</span>
          <div class="board-actions">
            <el-select v-model="groupBy" placeholder="分组方式" style="width: 150px">
              <el-option label="按状态分组" value="status" />
              <el-option label="按负责人分组" value="assignee" />
              <el-option label="按优先级分组" value="priority" />
            </el-select>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索工作项"
              clearable
              style="width: 200px; margin-left: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <!-- 看板列 -->
      <div class="kanban-board">
        <div
          v-for="column in boardColumns"
          :key="column.status"
          class="kanban-column"
        >
          <!-- 列头 -->
          <div class="column-header" :style="{ background: column.color }">
            <div class="column-title">
              <span>{{ column.title }}</span>
              <el-badge :value="getWorkItemCount(column.status)" class="count-badge" />
            </div>
            <div class="column-stats">
              <span>{{ getColumnEffort(column.status) }}h</span>
            </div>
          </div>

          <!-- 工作项卡片列表 -->
          <div class="column-body">
            <draggable
              v-model="column.items"
              group="workItems"
              @change="handleDragChange($event, column.status)"
              item-key="id"
              class="draggable-list"
            >
              <template #item="{ element }">
                <div class="work-item-card" @click="handleViewWorkItem(element.id)">
                  <!-- 卡片头部 -->
                  <div class="card-header">
                    <el-tag :type="getWorkItemTypeTagType(element.type)" size="small">
                      {{ getWorkItemTypeLabel(element.type) }}
                    </el-tag>
                    <el-tag :type="getPriorityTagType(element.priority)" size="small">
                      {{ element.priority }}
                    </el-tag>
                  </div>

                  <!-- 卡片标题 -->
                  <div class="card-title">{{ element.title }}</div>

                  <!-- 卡片ID -->
                  <div class="card-id">{{ element.id }}</div>

                  <!-- 卡片底部 -->
                  <div class="card-footer">
                    <div class="card-left">
                      <el-avatar :size="24" v-if="element.assignee">
                        {{ element.assignee.substring(0, 1) }}
                      </el-avatar>
                      <span class="assignee-name">{{ element.assignee || '未分配' }}</span>
                    </div>
                    <div class="card-right">
                      <el-tooltip content="任务数量" placement="top">
                        <el-icon><List /></el-icon>
                        <span>{{ element.taskCount || 0 }}</span>
                      </el-tooltip>
                      <el-tooltip content="工作量" placement="top">
                        <el-icon><Clock /></el-icon>
                        <span>{{ element.estimatedHours || 0 }}h</span>
                      </el-tooltip>
                    </div>
                  </div>

                  <!-- 进度条 -->
                  <el-progress
                    :percentage="calculateProgress(element)"
                    :stroke-width="4"
                    :show-text="false"
                    class="card-progress"
                  />
                </div>
              </template>
            </draggable>

            <!-- 空状态 -->
            <div v-if="getWorkItemCount(column.status) === 0" class="empty-column">
              <el-empty description="暂无工作项" :image-size="60" />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 底部统计信息 -->
    <el-row :gutter="20" class="stats-section">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>工作项类型分布</span>
          </template>
          <div ref="workItemTypeChartRef" style="height: 250px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>燃尽图</span>
          </template>
          <div ref="burndownChartRef" style="height: 250px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const searchKeyword = ref('')
const groupBy = ref('status')

// Sprint数据
const sprint = ref({
  id: '',
  name: '',
  startDate: '',
  endDate: '',
  status: 'active',
  progress: 0,
})

// 工作项列表
const workItems = ref<any[]>([])

// 看板列配置
const boardColumns = ref([
  {
    status: 'todo',
    title: '待办',
    color: '#909399',
    items: [],
  },
  {
    status: 'in_progress',
    title: '进行中',
    color: '#E6A23C',
    items: [],
  },
  {
    status: 'in_review',
    title: '评审中',
    color: '#409EFF',
    items: [],
  },
  {
    status: 'done',
    title: '已完成',
    color: '#67C23A',
    items: [],
  },
])

// 图表引用
const workItemTypeChartRef = ref<HTMLElement>()
const burndownChartRef = ref<HTMLElement>()
let workItemTypeChart: echarts.ECharts | null = null
let burndownChart: echarts.ECharts | null = null

// 计算属性
const totalWorkItems = computed(() => workItems.value.length)
const completedWorkItems = computed(
  () => workItems.value.filter((item) => item.status === 'done').length
)
const remainingDays = computed(() => {
  if (!sprint.value.endDate) return 0
  const today = new Date()
  const endDate = new Date(sprint.value.endDate)
  const diff = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
})

// 获取Sprint数据
const fetchSprintData = async () => {
  loading.value = true
  try {
    const sprintId = route.params.id as string
    
    // 加载Sprint数据
    const response = await fetch('/biz-data/mock/sprint/sprint-details.json')
    const data = await response.json()
    const sprintData = data.data.find((s: any) => s.id === sprintId)
    
    if (sprintData) {
      sprint.value = sprintData
      
      // 加载工作项数据
      if (sprintData.workItems) {
        workItems.value = sprintData.workItems
        distributeWorkItems()
      }
      
      // 初始化图表
      await nextTick()
      initCharts()
    } else {
      ElMessage.error('Sprint不存在')
      router.back()
    }
  } catch (error) {
    console.error('Failed to fetch sprint data:', error)
    ElMessage.error('获取Sprint数据失败')
  } finally {
    loading.value = false
  }
}

// 分发工作项到看板列
const distributeWorkItems = () => {
  boardColumns.value.forEach((column) => {
    column.items = workItems.value.filter((item) => item.status === column.status)
  })
}

// 获取工作项数量
const getWorkItemCount = (status: string) => {
  return workItems.value.filter((item) => item.status === status).length
}

// 获取列工作量
const getColumnEffort = (status: string) => {
  return workItems.value
    .filter((item) => item.status === status)
    .reduce((sum, item) => sum + (item.estimatedHours || 0), 0)
}

// 计算进度
const calculateProgress = (workItem: any) => {
  if (!workItem.taskCount || workItem.taskCount === 0) return 0
  return Math.round((workItem.completedTaskCount / workItem.taskCount) * 100)
}

// 工具函数
const getSprintStatusType = (status: string) => {
  const map: Record<string, any> = {
    planned: 'info',
    active: 'warning',
    completed: 'success',
    cancelled: 'danger',
  }
  return map[status] || 'info'
}

const getSprintStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    planned: '已规划',
    active: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

const getWorkItemTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    module_requirement: '模块需求',
    bugfix: 'Bugfix',
    tech_debt: '技术债',
    non_functional: '非功能需求',
    optimization: '优化',
    research: '调研',
  }
  return map[type] || type
}

const getWorkItemTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    module_requirement: 'primary',
    bugfix: 'danger',
    tech_debt: 'warning',
    non_functional: 'info',
    optimization: 'success',
    research: '',
  }
  return map[type] || 'info'
}

const getPriorityTagType = (priority: string) => {
  const map: Record<string, any> = {
    P0: 'danger',
    P1: 'warning',
    P2: 'primary',
    P3: 'info',
  }
  return map[priority] || 'info'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

// 初始化图表
const initCharts = () => {
  if (workItemTypeChartRef.value) {
    workItemTypeChart = echarts.init(workItemTypeChartRef.value)
    const typeData = Object.entries(
      workItems.value.reduce((acc: any, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1
        return acc
      }, {})
    ).map(([name, value]) => ({
      name: getWorkItemTypeLabel(name),
      value,
    }))
    
    workItemTypeChart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: typeData,
        },
      ],
    })
  }
  
  if (burndownChartRef.value) {
    burndownChart = echarts.init(burndownChartRef.value)
    burndownChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'],
      },
      yAxis: { type: 'value', name: '工作量(h)' },
      series: [
        {
          name: '理想燃尽',
          type: 'line',
          data: [100, 85, 70, 55, 40, 25, 10],
          lineStyle: { type: 'dashed' },
        },
        {
          name: '实际燃尽',
          type: 'line',
          data: [100, 90, 75, 65, 50, 35, 20],
        },
      ],
    })
  }
}

// 事件处理
const handleBack = () => {
  router.back()
}

const handleRefresh = () => {
  fetchSprintData()
}

const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

const handleSettings = () => {
  ElMessage.info('设置功能开发中')
}

const handleViewWorkItem = (id: string) => {
  router.push(`/work-items/${id}`)
}

const handleDragChange = (event: any, newStatus: string) => {
  ElMessage.success('工作项状态已更新')
}

// 生命周期
onMounted(() => {
  fetchSprintData()
})
</script>

<style scoped lang="scss">
.sprint-board-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .sprint-info {
      display: flex;
      align-items: center;
      gap: 12px;

      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
    }
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

.info-cards {
  margin-bottom: 20px;

  .info-card {
    .card-content {
      display: flex;
      align-items: center;
      gap: 16px;

      .card-text {
        flex: 1;

        .card-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 4px;
        }

        .card-value {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
        }
      }
    }
  }
}

.board-card {
  margin-bottom: 20px;

  .board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .board-actions {
      display: flex;
      align-items: center;
    }
  }
}

.kanban-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 20px;

  .kanban-column {
    flex: 1;
    min-width: 280px;
    background: #f5f7fa;
    border-radius: 4px;

    .column-header {
      padding: 12px 16px;
      border-radius: 4px 4px 0 0;
      color: white;

      .column-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .column-stats {
        font-size: 14px;
        opacity: 0.9;
      }
    }

    .column-body {
      padding: 16px;
      min-height: 400px;

      .draggable-list {
        min-height: 50px;
      }

      .work-item-card {
        background: white;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 4px;
          line-height: 1.5;
        }

        .card-id {
          font-size: 12px;
          color: #909399;
          margin-bottom: 8px;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;

          .card-left {
            display: flex;
            align-items: center;
            gap: 8px;

            .assignee-name {
              font-size: 12px;
              color: #606266;
            }
          }

          .card-right {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #909399;

            span {
              margin-left: 4px;
            }
          }
        }

        .card-progress {
          margin-top: 8px;
        }
      }

      .empty-column {
        text-align: center;
        padding: 40px 0;
      }
    }
  }
}

.stats-section {
  margin-top: 20px;
}
</style>


