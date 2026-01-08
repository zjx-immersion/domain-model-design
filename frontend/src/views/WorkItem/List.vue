<template>
  <div class="work-item-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>工作项管理</h2>
        <span class="subtitle">统一管理需求、Bugfix、技术债等所有工作项</span>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="Plus" @click="handleCreate">
          创建工作项
        </el-button>
      </div>
    </div>

    <!-- 筛选栏 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="queryParams" inline>
        <el-form-item label="工作项类型">
          <el-select
            v-model="queryParams.type"
            placeholder="全部类型"
            clearable
            multiple
            collapse-tags
            style="width: 200px"
          >
            <el-option
              v-for="config in WORK_ITEM_TYPE_CONFIGS"
              :key="config.type"
              :label="config.label"
              :value="config.type"
            >
              <span :style="{ color: config.color }">
                <el-icon><component :is="config.icon" /></el-icon>
                {{ config.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="queryParams.status"
            placeholder="全部状态"
            clearable
            multiple
            collapse-tags
            style="width: 180px"
          >
            <el-option
              v-for="config in WORK_ITEM_STATUS_CONFIGS"
              :key="config.status"
              :label="config.label"
              :value="config.status"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级">
          <el-select
            v-model="queryParams.priority"
            placeholder="全部优先级"
            clearable
            multiple
            collapse-tags
            style="width: 150px"
          >
            <el-option
              v-for="config in PRIORITY_CONFIGS"
              :key="config.priority"
              :label="config.label"
              :value="config.priority"
            >
              <el-tag :type="getPriorityType(config.priority)" size="small">
                {{ config.label }}
              </el-tag>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="团队">
          <el-select
            v-model="queryParams.teamId"
            placeholder="全部团队"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="感知团队" value="TEAM-001" />
            <el-option label="规划团队" value="TEAM-002" />
            <el-option label="控制团队" value="TEAM-003" />
            <el-option label="未分配" value="unassigned" />
          </el-select>
        </el-form-item>

        <el-form-item label="Sprint">
          <el-select
            v-model="queryParams.sprintId"
            placeholder="全部Sprint"
            clearable
            style="width: 150px"
          >
            <el-option label="全部" value="" />
            <el-option label="Sprint 1" value="SPRINT-001" />
            <el-option label="Sprint 2" value="SPRINT-002" />
            <el-option label="未分配" value="unassigned" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryParams.keyword"
            placeholder="搜索标题或ID"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-label">总工作项</div>
          <div class="stat-value">{{ statistics.total }}</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-label">待办</div>
          <div class="stat-value">{{ statistics.byStatus.backlog || 0 }}</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-label">进行中</div>
          <div class="stat-value">{{ statistics.byStatus.in_progress || 0 }}</div>
        </div>
      </el-card>
      <el-card shadow="hover">
        <div class="stat-item">
          <div class="stat-label">已完成</div>
          <div class="stat-value">{{ statistics.byStatus.completed || 0 }}</div>
        </div>
      </el-card>
    </div>

    <!-- 工作项列表 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>工作项列表 ({{ total }})</span>
          <div>
            <el-button
              :disabled="selectedWorkItems.length === 0"
              @click="handleBatchAssignTeam"
            >
              批量分配团队
            </el-button>
            <el-button
              :disabled="selectedWorkItems.length === 0"
              @click="handleBatchAssignSprint"
            >
              批量分配Sprint
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="workItemList"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column prop="id" label="ID" width="100" />
        
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag :color="getTypeConfig(row.type)?.color" size="small">
              <el-icon><component :is="getTypeConfig(row.type)?.icon" /></el-icon>
              {{ getTypeConfig(row.type)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="title" label="标题" min-width="300">
          <template #default="{ row }">
            <el-link type="primary" @click="handleViewDetail(row.id)">
              {{ row.title }}
            </el-link>
            <div class="subtitle-text">{{ row.description }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="优先级" width="100">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusConfig(row.status)?.label }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="团队" width="120">
          <template #default="{ row }">
            <span v-if="row.assignedTeam">{{ row.assignedTeam }}</span>
            <el-tag v-else type="info" size="small">未分配</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Sprint" width="100">
          <template #default="{ row }">
            <span v-if="row.assignedSprint">{{ row.assignedSprint }}</span>
            <el-tag v-else type="info" size="small">未分配</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="工作量" width="100">
          <template #default="{ row }">
            <span>{{ row.estimatedEffort }}h</span>
          </template>
        </el-table-column>
        
        <el-table-column label="进度" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="calculateProgress(row)"
              :color="getProgressColor(calculateProgress(row))"
            />
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row.id)">
              详情
            </el-button>
            <el-button link type="primary" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button link type="primary" @click="handleAssign(row)">
              分配
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { WorkItem, WorkItemQuery, WorkItemStatistics } from '@/types/work-item'
import {
  WORK_ITEM_TYPE_CONFIGS,
  WORK_ITEM_STATUS_CONFIGS,
  PRIORITY_CONFIGS,
} from '@/types/work-item'

const router = useRouter()

// 数据
const loading = ref(false)
const workItemList = ref<WorkItem[]>([])
const total = ref(0)
const selectedWorkItems = ref<WorkItem[]>([])

// 查询参数
const queryParams = reactive<WorkItemQuery>({
  type: [],
  status: [],
  priority: [],
  teamId: '',
  sprintId: '',
  keyword: '',
  page: 1,
  pageSize: 20,
  sortBy: 'priority',
  sortOrder: 'asc',
})

// 统计信息
const statistics = ref<WorkItemStatistics>({
  total: 0,
  byType: {} as any,
  byPriority: {} as any,
  byStatus: {} as any,
  byTeam: {} as any,
  totalEffort: {
    estimated: 0,
    actual: 0,
  },
})

// 获取工作项列表
const fetchWorkItems = async () => {
  loading.value = true
  try {
    // TODO: 调用实际API
    const response = await fetch('/biz-data/mock/work-items.json')
    const data = await response.json()
    
    workItemList.value = data.data
    total.value = data.data.length
    statistics.value = data.statistics
  } catch (error) {
    console.error('Failed to fetch work items:', error)
    ElMessage.error('获取工作项列表失败')
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

const calculateProgress = (workItem: WorkItem) => {
  if (workItem.taskCount === 0) return 0
  return Math.round((workItem.completedTaskCount / workItem.taskCount) * 100)
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return '#F56C6C'
  if (progress < 70) return '#E6A23C'
  return '#67C23A'
}

// 事件处理
const handleSearch = () => {
  queryParams.page = 1
  fetchWorkItems()
}

const handleReset = () => {
  Object.assign(queryParams, {
    type: [],
    status: [],
    priority: [],
    teamId: '',
    sprintId: '',
    keyword: '',
    page: 1,
    pageSize: 20,
  })
  fetchWorkItems()
}

const handlePageChange = (page: number) => {
  queryParams.page = page
  fetchWorkItems()
}

const handlePageSizeChange = (pageSize: number) => {
  queryParams.pageSize = pageSize
  queryParams.page = 1
  fetchWorkItems()
}

const handleSelectionChange = (selection: WorkItem[]) => {
  selectedWorkItems.value = selection
}

const handleCreate = () => {
  router.push('/work-items/create')
}

const handleViewDetail = (id: string) => {
  router.push(`/work-items/${id}`)
}

const handleEdit = (workItem: WorkItem) => {
  router.push(`/work-items/${workItem.id}/edit`)
}

const handleAssign = (workItem: WorkItem) => {
  // TODO: 打开分配对话框
  ElMessage.info('分配功能开发中')
}

const handleDelete = async (workItem: WorkItem) => {
  try {
    await ElMessageBox.confirm(`确认删除工作项 "${workItem.title}" 吗？`, '确认删除', {
      type: 'warning',
    })
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    fetchWorkItems()
  } catch {
    // 用户取消
  }
}

const handleBatchAssignTeam = () => {
  // TODO: 批量分配团队
  ElMessage.info('批量分配团队功能开发中')
}

const handleBatchAssignSprint = () => {
  // TODO: 批量分配Sprint
  ElMessage.info('批量分配Sprint功能开发中')
}

// 生命周期
onMounted(() => {
  fetchWorkItems()
})
</script>

<style scoped lang="scss">
.work-item-list-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .header-left {
    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      font-size: 14px;
      color: #909399;
    }
  }
}

.filter-card {
  margin-bottom: 20px;
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  .stat-item {
    text-align: center;
    padding: 8px 0;

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.table-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.subtitle-text {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

