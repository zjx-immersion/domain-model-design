<template>
  <div class="domain-project-list">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>领域项目管理</h2>
        <span class="subtitle">管理技术领域的项目</span>
      </div>
      <div class="header-right">
        <el-button type="primary" :icon="Plus" @click="handleCreate">
          新建领域项目
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
            @keyup.enter="handleSearch"
            style="width: 240px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="技术领域">
          <el-select
            v-model="filterForm.domain"
            placeholder="全部领域"
            clearable
            style="width: 150px"
          >
            <el-option label="智能驾驶" value="智能驾驶" />
            <el-option label="智能座舱" value="智能座舱" />
            <el-option label="电子电器" value="电子电器" />
          </el-select>
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

        <el-form-item label="车型项目">
          <el-select
            v-model="filterForm.vehicleProjectId"
            placeholder="全部车型项目"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="vp in vehicleProjects"
              :key="vp.id"
              :label="vp.name"
              :value="vp.id"
            />
          </el-select>
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
        <el-col :span="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">总项目数</div>
              <div class="stat-value">{{ stats.totalProjects }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">智能驾驶</div>
              <div class="stat-value">{{ stats.adProjects }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">智能座舱</div>
              <div class="stat-value">{{ stats.icProjects }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">电子电器</div>
              <div class="stat-value">{{ stats.eeProjects }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">进行中</div>
              <div class="stat-value">{{ stats.activeProjects }}</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-label">平均进度</div>
              <div class="stat-value">{{ stats.averageProgress }}%</div>
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
        <el-table-column prop="code" label="项目代码" width="120" fixed />
        <el-table-column prop="name" label="项目名称" width="240" fixed>
          <template #default="{ row }">
            <router-link :to="`/projects/domain/${row.id}`" class="project-link">
              {{ row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="技术领域" width="120">
          <template #default="{ row }">
            <el-tag :type="getDomainType(row.domain)">
              {{ row.domain }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="100" />
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
        <el-table-column label="PI进度" width="100">
          <template #default="{ row }">
            {{ row.completedPIs }} / {{ row.totalPIs }}
          </template>
        </el-table-column>
        <el-table-column label="工作项" width="120">
          <template #default="{ row }">
            <span v-if="row.stats">
              {{ row.stats.completedWorkItems }} / {{ row.stats.totalWorkItems }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
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
              @click="handleBacklog(row)"
            >
              待办
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
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
import { ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import type { DomainProject, VehicleProject } from '@/types/project-v2'

// 导入数据
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import vehicleProjectsData from '@/biz-data/mock/project/vehicle-projects.json'

const router = useRouter()

// 数据
const projects = ref<DomainProject[]>([])
const vehicleProjects = ref<VehicleProject[]>([])
const loading = ref(false)

// 筛选表单
const filterForm = ref({
  keyword: '',
  domain: '',
  status: '',
  vehicleProjectId: ''
})

// 分页
const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

// 统计数据
const stats = computed(() => {
  const total = projects.value.length
  const ad = projects.value.filter(p => p.domain === '智能驾驶').length
  const ic = projects.value.filter(p => p.domain === '智能座舱').length
  const ee = projects.value.filter(p => p.domain === '电子电器').length
  const active = projects.value.filter(p => p.status === 'active').length
  const avgProgress = total > 0
    ? Math.round(projects.value.reduce((sum, p) => sum + p.progress, 0) / total)
    : 0

  return {
    totalProjects: total,
    adProjects: ad,
    icProjects: ic,
    eeProjects: ee,
    activeProjects: active,
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

  if (filterForm.value.domain) {
    result = result.filter(p => p.domain === filterForm.value.domain)
  }

  if (filterForm.value.status) {
    result = result.filter(p => p.status === filterForm.value.status)
  }

  if (filterForm.value.vehicleProjectId) {
    result = result.filter(p => p.vehicleProjectId === filterForm.value.vehicleProjectId)
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
    await new Promise(resolve => setTimeout(resolve, 300))
    projects.value = domainProjectsData.data as DomainProject[]
    vehicleProjects.value = vehicleProjectsData.data as VehicleProject[]
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
    domain: '',
    status: '',
    vehicleProjectId: ''
  }
  handleSearch()
}

// 新建项目
const handleCreate = () => {
  ElMessage.info('新建项目功能开发中...')
}

// 查看详情
const handleView = (row: DomainProject) => {
  router.push(`/projects/domain/${row.id}`)
}

// 查看待办
const handleBacklog = (row: DomainProject) => {
  if (row.backlogIds && row.backlogIds.length > 0) {
    router.push(`/backlog/project/${row.backlogIds[0]}`)
  } else {
    ElMessage.info('该项目暂无待办')
  }
}

// 编辑项目
const handleEdit = (row: DomainProject) => {
  ElMessage.info(`编辑项目：${row.name}（开发中...）`)
}

// 领域标签类型
const getDomainType = (domain: string) => {
  const types: Record<string, any> = {
    '智能驾驶': 'success',
    '智能座舱': 'warning',
    '电子电器': 'info'
  }
  return types[domain] || ''
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
.domain-project-list {
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
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      :deep(.el-card__body) {
        padding: 20px;
      }

      .stat-content {
        text-align: center;

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: #303133;
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

