<template>
  <div class="work-item-detail-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button icon="ArrowLeft" @click="handleBack">返回</el-button>
      <div class="header-actions">
        <el-button icon="Edit" @click="handleEdit">编辑</el-button>
        <el-button icon="Share" @click="handleShare">分享</el-button>
        <el-dropdown @command="handleMoreActions">
          <el-button icon="More">更多</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="changeStatus">变更状态</el-dropdown-item>
              <el-dropdown-item command="changeAssignment">重新分配</el-dropdown-item>
              <el-dropdown-item command="export">导出</el-dropdown-item>
              <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <!-- 左侧主要内容 -->
      <el-col :span="16">
        <!-- 基本信息卡片 -->
        <el-card class="info-card" shadow="never">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-tag :color="getTypeConfig(workItem.type)?.color" class="type-tag">
                  <el-icon><component :is="getTypeConfig(workItem.type)?.icon" /></el-icon>
                  {{ getTypeConfig(workItem.type)?.label }}
                </el-tag>
                <el-tag :type="getPriorityType(workItem.priority)">
                  {{ workItem.priority }}
                </el-tag>
                <el-tag :type="getStatusType(workItem.status)">
                  {{ getStatusConfig(workItem.status)?.label }}
                </el-tag>
              </div>
            </div>
          </template>

          <h2 class="work-item-title">{{ workItem.title }}</h2>
          <div class="work-item-id">工作项ID: {{ workItem.id }}</div>

          <el-divider />

          <div class="section">
            <div class="section-title">描述</div>
            <div class="section-content">
              {{ workItem.description }}
            </div>
          </div>

          <el-divider />

          <!-- 来源信息 -->
          <div class="section">
            <div class="section-title">来源信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="来源类型">
                {{ getSourceTypeLabel(workItem.sourceType) }}
              </el-descriptions-item>
              <el-descriptions-item label="来源ID">
                <el-link v-if="workItem.sourceId" type="primary">
                  {{ workItem.sourceId }}
                </el-link>
                <span v-else>-</span>
              </el-descriptions-item>
              <el-descriptions-item label="关联模块">
                <el-link v-if="workItem.moduleId" type="primary">
                  {{ workItem.moduleId }}
                </el-link>
                <span v-else>-</span>
              </el-descriptions-item>
              <el-descriptions-item label="关联需求">
                <el-link v-if="workItem.requirementId" type="primary">
                  {{ workItem.requirementId }}
                </el-link>
                <span v-else>-</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <el-divider />

          <!-- 分配信息 -->
          <div class="section">
            <div class="section-title">分配信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="分配团队">
                <el-tag v-if="workItem.assignedTeam" type="primary">
                  {{ workItem.assignedTeam }}
                </el-tag>
                <el-tag v-else type="info">未分配</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="分配Sprint">
                <el-tag v-if="workItem.assignedSprint" type="success">
                  {{ workItem.assignedSprint }}
                </el-tag>
                <el-tag v-else type="info">未分配</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>

          <el-divider />

          <!-- 工作量信息 -->
          <div class="section">
            <div class="section-title">工作量信息</div>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="估算工作量">
                {{ workItem.estimatedEffort }} 小时
              </el-descriptions-item>
              <el-descriptions-item label="实际工作量">
                {{ workItem.actualEffort || 0 }} 小时
              </el-descriptions-item>
              <el-descriptions-item label="任务数量">
                {{ workItem.taskCount }} 个
              </el-descriptions-item>
              <el-descriptions-item label="已完成任务">
                {{ workItem.completedTaskCount }} 个
              </el-descriptions-item>
            </el-descriptions>
            
            <div class="progress-section">
              <div class="progress-label">
                完成进度: {{ calculateProgress(workItem) }}%
              </div>
              <el-progress
                :percentage="calculateProgress(workItem)"
                :color="getProgressColor(calculateProgress(workItem))"
                :stroke-width="20"
              />
            </div>
          </div>
        </el-card>

        <!-- 任务列表卡片 -->
        <el-card class="tasks-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>任务列表 ({{ tasks.length }})</span>
              <el-button type="primary" icon="Plus" @click="handleCreateTask">
                创建任务
              </el-button>
            </div>
          </template>

          <el-empty v-if="tasks.length === 0" description="暂无任务，点击上方按钮创建任务" />

          <el-table v-else :data="tasks" border>
            <el-table-column prop="id" label="任务ID" width="120" />
            
            <el-table-column prop="title" label="任务名称" min-width="250">
              <template #default="{ row }">
                <el-link type="primary" @click="handleViewTask(row.id)">
                  {{ row.title }}
                </el-link>
              </template>
            </el-table-column>
            
            <el-table-column label="负责人" width="120">
              <template #default="{ row }">
                {{ row.assignee || '-' }}
              </template>
            </el-table-column>
            
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getTaskStatusType(row.status)">
                  {{ getTaskStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="工时" width="150">
              <template #default="{ row }">
                <span>{{ row.actualHours || 0 }} / {{ row.estimatedHours }}h</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="handleViewTask(row.id)">
                  详情
                </el-button>
                <el-button link type="primary" @click="handleEditTask(row)">
                  编辑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 活动时间线 -->
        <el-card class="timeline-card" shadow="never">
          <template #header>
            <span>活动时间线</span>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="activity in activities"
              :key="activity.id"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <div class="activity-content">
                <strong>{{ activity.user }}</strong>
                {{ activity.action }}
                <span v-if="activity.detail" class="activity-detail">
                  {{ activity.detail }}
                </span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧信息栏 -->
      <el-col :span="8">
        <!-- 元数据卡片 -->
        <el-card class="metadata-card" shadow="never">
          <template #header>
            <span>元数据</span>
          </template>

          <div class="metadata-item">
            <div class="metadata-label">创建人</div>
            <div class="metadata-value">{{ workItem.createdBy }}</div>
          </div>

          <div class="metadata-item">
            <div class="metadata-label">创建时间</div>
            <div class="metadata-value">{{ formatDate(workItem.createdAt) }}</div>
          </div>

          <div class="metadata-item">
            <div class="metadata-label">更新时间</div>
            <div class="metadata-value">{{ formatDate(workItem.updatedAt) }}</div>
          </div>

          <div v-if="workItem.completedAt" class="metadata-item">
            <div class="metadata-label">完成时间</div>
            <div class="metadata-value">{{ formatDate(workItem.completedAt) }}</div>
          </div>
        </el-card>

        <!-- 依赖关系卡片 -->
        <el-card class="dependencies-card" shadow="never">
          <template #header>
            <span>依赖关系</span>
          </template>

          <div v-if="!workItem.dependencies || workItem.dependencies.length === 0">
            <el-empty description="无依赖关系" :image-size="80" />
          </div>
          <div v-else>
            <div class="dependency-section">
              <div class="dependency-title">依赖的工作项</div>
              <el-tag
                v-for="depId in workItem.dependencies"
                :key="depId"
                type="warning"
                class="dependency-tag"
              >
                {{ depId }}
              </el-tag>
            </div>
          </div>

          <div v-if="workItem.blockedBy && workItem.blockedBy.length > 0" class="dependency-section">
            <div class="dependency-title">被阻塞</div>
            <el-tag
              v-for="blockerId in workItem.blockedBy"
              :key="blockerId"
              type="danger"
              class="dependency-tag"
            >
              {{ blockerId }}
            </el-tag>
          </div>

          <el-button
            icon="Plus"
            text
            type="primary"
            @click="handleAddDependency"
            style="margin-top: 12px"
          >
            添加依赖
          </el-button>
        </el-card>

        <!-- 快速操作卡片 -->
        <el-card class="actions-card" shadow="never">
          <template #header>
            <span>快速操作</span>
          </template>

          <el-space direction="vertical" fill style="width: 100%">
            <el-button icon="User" @click="handleChangeAssignment">
              重新分配
            </el-button>
            <el-button icon="Calendar" @click="handleChangeStatus">
              变更状态
            </el-button>
            <el-button icon="Link" @click="handleLinkToSprint">
              关联到Sprint
            </el-button>
            <el-button icon="Download" @click="handleExport">
              导出信息
            </el-button>
          </el-space>
        </el-card>

        <!-- 统计信息卡片 -->
        <el-card class="stats-card" shadow="never">
          <template #header>
            <span>统计信息</span>
          </template>

          <div class="stat-item">
            <div class="stat-label">总任务数</div>
            <div class="stat-value">{{ workItem.taskCount }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">已完成</div>
            <div class="stat-value">{{ workItem.completedTaskCount }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">完成率</div>
            <div class="stat-value">{{ calculateProgress(workItem) }}%</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">工时利用</div>
            <div class="stat-value">
              {{ workItem.actualEffort || 0 }} / {{ workItem.estimatedEffort }}h
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { WorkItem } from '@/types/work-item'
import type { Task } from '@/types/task'
import {
  WORK_ITEM_TYPE_CONFIGS,
  WORK_ITEM_STATUS_CONFIGS,
} from '@/types/work-item'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const workItem = ref<WorkItem>({
  id: '',
  type: 'module_requirement',
  title: '',
  description: '',
  priority: 'P1',
  status: 'backlog',
  sourceType: 'requirement',
  estimatedEffort: 0,
  tasks: [],
  taskCount: 0,
  completedTaskCount: 0,
  createdBy: '',
  createdAt: '',
  updatedAt: '',
})

const tasks = ref<Task[]>([])

const activities = ref([
  {
    id: '1',
    user: '算法工程师A',
    action: '完成了任务',
    detail: 'TASK-001: 算法模型优化',
    timestamp: '2025-01-04 18:00',
  },
  {
    id: '2',
    user: '算法工程师A',
    action: '更新了工作项状态',
    detail: '从"已规划"变更为"进行中"',
    timestamp: '2025-01-03 10:00',
  },
  {
    id: '3',
    user: '项目经理A',
    action: '分配了工作项',
    detail: '分配给感知团队，Sprint 1',
    timestamp: '2025-01-02 15:00',
  },
  {
    id: '4',
    user: '需求分析师A',
    action: '创建了工作项',
    detail: '',
    timestamp: '2024-12-15 10:00',
  },
])

// 获取工作项详情
const fetchWorkItemDetail = async () => {
  loading.value = true
  try {
    const workItemId = route.params.id as string
    
    // 加载工作项数据
    const response = await fetch('/biz-data/mock/work-items.json')
    const data = await response.json()
    const item = data.data.find((w: WorkItem) => w.id === workItemId)
    
    if (item) {
      workItem.value = item
      
      // 加载任务数据
      const tasksResponse = await fetch('/biz-data/mock/sprint/tasks.json')
      const tasksData = await tasksResponse.json()
      tasks.value = tasksData.data.filter((t: Task) => item.tasks.includes(t.id))
    } else {
      ElMessage.error('工作项不存在')
      router.back()
    }
  } catch (error) {
    console.error('Failed to fetch work item:', error)
    ElMessage.error('获取工作项详情失败')
  } finally {
    loading.value = false
  }
}

// 工具函数
const getTypeConfig = (type: string) => {
  return WORK_ITEM_TYPE_CONFIGS.find((c) => c.type === type)
}

const getStatusConfig = (status: string) => {
  return WORK_ITEM_STATUS_CONFIGS.find((c) => c.status === status)
}

const getPriorityType = (priority: string) => {
  const map: Record<string, any> = {
    P0: 'danger',
    P1: 'warning',
    P2: 'primary',
    P3: 'info',
  }
  return map[priority] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    backlog: 'info',
    planned: 'primary',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger',
  }
  return map[status] || 'info'
}

const getTaskStatusType = (status: string) => {
  const map: Record<string, any> = {
    todo: 'info',
    in_progress: 'warning',
    code_review: 'primary',
    testing: 'success',
    done: 'success',
  }
  return map[status] || 'info'
}

const getTaskStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    todo: '待办',
    in_progress: '进行中',
    code_review: '代码评审',
    testing: '测试中',
    done: '已完成',
  }
  return map[status] || status
}

const getSourceTypeLabel = (sourceType: string) => {
  const map: Record<string, string> = {
    requirement: '需求',
    defect: '缺陷',
    tech_debt: '技术债',
    nfr: '非功能需求',
    optimization: '优化',
    research: '调研',
  }
  return map[sourceType] || sourceType
}

const calculateProgress = (workItem: WorkItem) => {
  if (workItem.taskCount === 0) return 0
  return Math.round((workItem.completedTaskCount / workItem.taskCount) * 100)
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#F56C6C'
  if (progress < 70) return '#E6A23C'
  return '#67C23A'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

// 事件处理
const handleBack = () => {
  router.back()
}

const handleEdit = () => {
  router.push(`/work-items/${workItem.value.id}/edit`)
}

const handleShare = () => {
  ElMessage.info('分享功能开发中')
}

const handleMoreActions = (command: string) => {
  switch (command) {
    case 'changeStatus':
      handleChangeStatus()
      break
    case 'changeAssignment':
      handleChangeAssignment()
      break
    case 'export':
      handleExport()
      break
    case 'delete':
      handleDelete()
      break
  }
}

const handleCreateTask = () => {
  // TODO: 打开创建任务对话框
  ElMessage.info('创建任务功能开发中')
}

const handleViewTask = (taskId: string) => {
  router.push(`/tasks/${taskId}`)
}

const handleEditTask = (task: Task) => {
  router.push(`/tasks/${task.id}/edit`)
}

const handleAddDependency = () => {
  ElMessage.info('添加依赖功能开发中')
}

const handleChangeAssignment = () => {
  ElMessage.info('重新分配功能开发中')
}

const handleChangeStatus = () => {
  ElMessage.info('变更状态功能开发中')
}

const handleLinkToSprint = () => {
  ElMessage.info('关联Sprint功能开发中')
}

const handleExport = () => {
  ElMessage.info('导出功能开发中')
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确认删除工作项 "${workItem.value.title}" 吗？`,
      '确认删除',
      { type: 'warning' }
    )
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    router.push('/work-items')
  } catch {
    // 用户取消
  }
}

// 生命周期
onMounted(() => {
  fetchWorkItemDetail()
})
</script>

<style scoped lang="scss">
.work-item-detail-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.info-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-left {
      display: flex;
      gap: 8px;
      align-items: center;

      .type-tag {
        font-weight: 500;
      }
    }
  }

  .work-item-title {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #303133;
  }

  .work-item-id {
    font-size: 14px;
    color: #909399;
  }

  .section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
    }

    .section-content {
      font-size: 14px;
      color: #606266;
      line-height: 1.6;
    }
  }

  .progress-section {
    margin-top: 16px;

    .progress-label {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }
}

.tasks-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.timeline-card {
  margin-bottom: 20px;

  .activity-content {
    font-size: 14px;
    color: #606266;

    .activity-detail {
      color: #909399;
      margin-left: 4px;
    }
  }
}

.metadata-card,
.dependencies-card,
.actions-card,
.stats-card {
  margin-bottom: 20px;

  .metadata-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .metadata-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }

    .metadata-value {
      font-size: 14px;
      color: #303133;
    }
  }

  .dependency-section {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }

    .dependency-title {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }

    .dependency-tag {
      margin-right: 8px;
      margin-bottom: 8px;
    }
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #EBEEF5;

    &:last-child {
      border-bottom: none;
    }

    .stat-label {
      font-size: 14px;
      color: #606266;
    }

    .stat-value {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>

