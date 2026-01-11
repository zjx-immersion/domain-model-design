<template>
  <div class="feature-list-page page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="Feature资产列表">
        <template #extra>
          <el-space>
            <el-button type="primary" :icon="Plus" @click="handleCreate">
              新建Feature
            </el-button>
            <el-button :icon="Download" @click="handleExport">
              导出
            </el-button>
          </el-space>
        </template>
      </el-page-header>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="search-card" shadow="never">
      <el-form :inline="true">
        <el-form-item label="搜索">
          <el-input
            v-model="searchKeyword"
            placeholder="Feature名称或编码"
            :prefix-icon="Search"
            clearable
            style="width: 250px"
            @input="handleSearch"
          />
        </el-form-item>
        <el-form-item label="业务域">
          <el-select v-model="filterDomain" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="ADAS" value="ADAS" />
            <el-option label="IVI" value="IVI" />
            <el-option label="BCM" value="BCM" />
            <el-option label="PDC" value="PDC" />
            <el-option label="Cockpit" value="Cockpit" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="Active" value="active" />
            <el-option label="Deprecated" value="deprecated" />
            <el-option label="Planning" value="planning" />
          </el-select>
        </el-form-item>
        <el-form-item label="复用率">
          <el-slider
            v-model="filterReuseRange"
            range
            :min="0"
            :max="100"
            :marks="{ 0: '0%', 60: '60%', 100: '100%' }"
            style="width: 200px"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="Feature总数" :value="stats.total">
            <template #prefix>
              <el-icon><Box /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="Active Feature" :value="stats.active">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="平均复用率" :value="stats.avgReuseRate" suffix="%">
            <template #prefix>
              <el-icon color="#409EFF"><DataAnalysis /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="复用收益" :value="stats.reuseBenefit" suffix="%">
            <template #prefix>
              <el-icon color="#E6A23C"><TrendCharts /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- Feature列表表格 -->
    <el-card class="table-card">
      <el-table
        :data="paginatedFeatures"
        v-loading="loading"
        stripe
        highlight-current-row
        @row-click="handleRowClick"
        style="width: 100%"
      >
        <el-table-column prop="code" label="编码" width="140" fixed />
        <el-table-column label="Feature名称" min-width="220">
          <template #default="{ row }">
            <div class="feature-name">
              <span class="name">{{ row.name }}</span>
              <el-tag
                v-if="row.complexity === 'high'"
                type="danger"
                size="small"
                style="margin-left: 8px"
              >
                高复杂度
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="domain" label="业务域" width="100">
          <template #default="{ row }">
            <el-tag :type="getDomainTagType(row.domain)">
              {{ row.domain }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentVersion" label="版本" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="复用情况" width="250">
          <template #default="{ row }">
            <div class="reuse-info">
              <el-progress
                :percentage="getReuseRate(row)"
                :color="getReuseColor(row)"
                :stroke-width="10"
              >
                <template #default="{ percentage }">
                  <span style="font-size: 12px">{{ percentage }}%</span>
                </template>
              </el-progress>
              <span class="reuse-text">
                复用{{ row.reuseCount || 0 }}次 / {{ (row.products || []).length }}个产品
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模块数" width="80" align="center">
          <template #default="{ row }">
            <el-tag type="info">{{ (row.moduleIds || []).length }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用产品" min-width="200">
          <template #default="{ row }">
            <el-space wrap>
              <el-tag
                v-for="product in (row.products || []).slice(0, 3)"
                :key="product.id"
                size="small"
                type="success"
              >
                {{ product.name }}
              </el-tag>
              <el-tag v-if="(row.products || []).length > 3" size="small" type="info">
                +{{ (row.products || []).length - 3 }}
              </el-tag>
            </el-space>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.updatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-space>
              <el-button type="primary" link size="small" @click.stop="viewDetail(row.id)">
                查看
              </el-button>
              <el-button type="primary" link size="small" @click.stop="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="primary" link size="small" @click.stop="handleCopy(row)">
                复制
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredFeatures.length"
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
import {
  Plus,
  Download,
  Search,
  Box,
  SuccessFilled,
  DataAnalysis,
  TrendCharts
} from '@element-plus/icons-vue'
import featuresDataRaw from '@/biz-data/mock/feature/features.json'
import dayjs from 'dayjs'

const router = useRouter()

// 数据
const features = ref<any[]>([])
const loading = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const filterDomain = ref('')
const filterStatus = ref('')
const filterReuseRange = ref([0, 100])

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 加载数据
onMounted(() => {
  const featuresData = featuresDataRaw.data || featuresDataRaw
  features.value = featuresData
})

// 统计数据
const stats = computed(() => {
  const total = features.value.length
  const active = features.value.filter(f => f.status === 'active').length
  const totalReuseCount = features.value.reduce((sum, f) => sum + (f.reuseCount || 0), 0)
  const avgReuseRate = total > 0 ? Math.round((totalReuseCount / total) * 10) : 0
  const reuseBenefit = avgReuseRate > 0 ? Math.min(93, avgReuseRate * 15) : 0

  return {
    total,
    active,
    avgReuseRate,
    reuseBenefit
  }
})

// 筛选后的Feature列表
const filteredFeatures = computed(() => {
  let result = features.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      f =>
        f.name.toLowerCase().includes(keyword) ||
        f.code.toLowerCase().includes(keyword)
    )
  }

  // 业务域筛选
  if (filterDomain.value) {
    result = result.filter(f => f.domain === filterDomain.value)
  }

  // 状态筛选
  if (filterStatus.value) {
    result = result.filter(f => f.status === filterStatus.value)
  }

  // 复用率筛选
  const [minReuse, maxReuse] = filterReuseRange.value
  result = result.filter(f => {
    const reuseRate = getReuseRate(f)
    return reuseRate >= minReuse && reuseRate <= maxReuse
  })

  return result
})

// 分页后的Feature列表
const paginatedFeatures = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFeatures.value.slice(start, end)
})

// 获取复用率
const getReuseRate = (feature: any) => {
  const reuseCount = feature.reuseCount || 0
  if (reuseCount === 0) return 0
  // 假设最大复用次数为10，映射到100%
  return Math.min(100, Math.round((reuseCount / 10) * 100))
}

// 获取复用率颜色
const getReuseColor = (feature: any) => {
  const rate = getReuseRate(feature)
  if (rate >= 60) return '#67C23A'
  if (rate >= 30) return '#E6A23C'
  return '#F56C6C'
}

// 获取业务域标签类型
const getDomainTagType = (domain: string) => {
  const map: Record<string, any> = {
    'ADAS': 'success',
    'IVI': 'primary',
    'BCM': 'warning',
    'PDC': 'danger',
    'Cockpit': 'info'
  }
  return map[domain] || 'info'
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'deprecated': 'danger',
    'planning': 'warning',
    'development': 'primary'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': 'Active',
    'deprecated': 'Deprecated',
    'planning': 'Planning',
    'development': 'Development'
  }
  return map[status] || status
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

// 行点击
const handleRowClick = (row: any) => {
  viewDetail(row.id)
}

// 查看详情
const viewDetail = (id: string) => {
  router.push(`/assets/features/${id}`)
}

// 新建Feature
const handleCreate = () => {
  ElMessage.info('新建Feature功能开发中...')
}

// 编辑Feature
const handleEdit = (row: any) => {
  ElMessage.info(`编辑Feature: ${row.name}`)
}

// 复制Feature
const handleCopy = (row: any) => {
  ElMessage.info(`复制Feature: ${row.name}`)
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 返回
const goBack = () => {
  router.push('/assets')
}
</script>

<style scoped lang="scss">
.feature-list-page {
  .page-header {
    margin-bottom: 20px;
  }

  .search-card {
    margin-bottom: 20px;

    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      text-align: center;

      :deep(.el-statistic__head) {
        font-size: 14px;
        color: #909399;
      }

      :deep(.el-statistic__content) {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
      }
    }
  }

  .table-card {
    .feature-name {
      display: flex;
      align-items: center;

      .name {
        font-weight: 500;
      }
    }

    .reuse-info {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .reuse-text {
        font-size: 12px;
        color: #909399;
      }
    }

    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

