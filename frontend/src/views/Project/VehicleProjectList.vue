<template>
  <div class="vehicle-project-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>车型项目管理</h2>
        <span class="subtitle">管理整车级别的项目</span>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Plus" @click="handleCreate">
          新建车型项目
        </el-button>
      </div>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="关键词">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索项目名称或代码"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
            style="width: 240px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部状态"
            clearable
            style="width: 150px"
          >
            <el-option label="计划中" value="planned" />
            <el-option label="进行中" value="active" />
            <el-option label="暂停" value="on-hold" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>

        <el-form-item label="负责人">
          <el-input
            v-model="filterForm.owner"
            placeholder="负责人"
            clearable
            style="width: 150px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">总项目数</div>
              <div class="stat-value">{{ stats.totalProjects }}</div>
            </div>
            <div class="stat-icon total">
              <el-icon><Document /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">进行中</div>
              <div class="stat-value">{{ stats.activeProjects }}</div>
            </div>
            <div class="stat-icon active">
              <el-icon><VideoPlay /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">已完成</div>
              <div class="stat-value">{{ stats.completedProjects }}</div>
            </div>
            <div class="stat-icon completed">
              <el-icon><CircleCheck /></el-icon>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">平均进度</div>
              <div class="stat-value">{{ stats.averageProgress }}%</div>
            </div>
            <div class="stat-icon progress">
              <el-icon><TrendCharts /></el-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 项目列表 -->
    <el-card class="table-card" shadow="never">
      <el-table
        :data="displayedProjects"
        v-loading="loading"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column prop="code" label="项目代码" width="150" fixed />
        <el-table-column prop="name" label="项目名称" width="280" fixed>
          <template #default="{ row }">
            <router-link :to="`/projects/vehicle/${row.id}`" class="project-link">
              {{ row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="180">
          <template #default="{ row }">
            <div class="progress-cell">
              <el-progress
                :percentage="row.progress"
                :color="getProgressColor(row.progress)"
                :stroke-width="8"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phase" label="阶段" width="100" />
        <el-table-column label="领域项目" width="120">
          <template #default="{ row }">
            {{ row.completedDomainProjects || 0 }} / {{ row.totalDomainProjects || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="targetDate" label="目标日期" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              link
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredProjects.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Document,
  VideoPlay,
  CircleCheck,
  TrendCharts
} from '@element-plus/icons-vue'
import type { VehicleProject } from '@/types/project-v2'

// 导入数据
import vehicleProjectsData from '@/biz-data/mock/project/vehicle-projects.json'

const router = useRouter()

// 数据
const projects = ref<VehicleProject[]>([])
const loading = ref(false)

// 筛选表单
const filterForm = ref({
  keyword: '',
  status: '',
  owner: ''
})

// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

// 统计数据
const stats = computed(() => {
  const total = projects.value.length
  const active = projects.value.filter(p => p.status === 'active').length
  const completed = projects.value.filter(p => p.status === 'completed').length
  const avgProgress = total > 0
    ? Math.round(projects.value.reduce((sum, p) => sum + p.progress, 0) / total)
    : 0

  return {
    totalProjects: total,
    activeProjects: active,
    completedProjects: completed,
    averageProgress: avgProgress
  }
})

// 过滤后的项目
const filteredProjects = computed(() => {
  let result = projects.value

  if (filterForm.value.keyword) {
    const keyword = filterForm.value.keyword.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.code.toLowerCase().includes(keyword)
    )
  }

  if (filterForm.value.status) {
    result = result.filter(p => p.status === filterForm.value.status)
  }

  if (filterForm.value.owner) {
    result = result.filter(p =>
      p.owner.includes(filterForm.value.owner)
    )
  }

  return result
})

// 当前页显示的项目
const displayedProjects = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredProjects.value.slice(start, end)
})

// 加载数据
const loadProjects = async () => {
  loading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    projects.value = vehicleProjectsData.data as VehicleProject[]
  } catch (error) {
    ElMessage.error('加载项目列表失败')
    console.error('加载项目失败:', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.value.currentPage = 1
}

// 重置
const handleReset = () => {
  filterForm.value = {
    keyword: '',
    status: '',
    owner: ''
  }
  handleSearch()
}

// 新建项目
const handleCreate = () => {
  ElMessage.info('新建项目功能开发中...')
}

// 查看详情
const handleView = (row: VehicleProject) => {
  router.push(`/projects/vehicle/${row.id}`)
}

// 编辑项目
const handleEdit = (row: VehicleProject) => {
  ElMessage.info(`编辑项目：${row.name}（开发中...）`)
}

// 删除项目
const handleDelete = (row: VehicleProject) => {
  ElMessageBox.confirm(
    `确定要删除车型项目"${row.name}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 实际项目中应该调用API删除
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 状态标签类型
const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    planned: 'info',
    active: 'success',
    'on-hold': 'warning',
    completed: '',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

// 状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    planned: '计划中',
    active: '进行中',
    'on-hold': '暂停',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

// 进度颜色
const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

// 分页事件
const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  pagination.value.currentPage = 1
}

const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val
}

// 生命周期
onMounted(() => {
  loadProjects()
})
</script>

<style scoped lang="scss">
.vehicle-project-list {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
        font-weight: 600;
      }

      .subtitle {
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .filter-card {
    margin-bottom: 20px;
  }

  .stats-cards {
    margin-bottom: 20px;

    .stat-card {
      position: relative;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
      }

      :deep(.el-card__body) {
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .stat-content {
        flex: 1;

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

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;

        &.total {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        &.active {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }

        &.completed {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
        }

        &.progress {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          color: white;
        }
      }
    }
  }

  .table-card {
    .project-link {
      color: #409eff;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }

    .progress-cell {
      padding: 0 10px;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

