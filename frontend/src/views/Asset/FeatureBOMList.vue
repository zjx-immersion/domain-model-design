<template>
  <div class="feature-bom-list page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="Feature BOM管理">
        <template #extra>
          <el-space>
            <el-button type="primary" :icon="Plus" @click="handleCreate">
              新建BOM
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
            placeholder="产品名称或版本"
            :prefix-icon="Search"
            clearable
            style="width: 250px"
            @input="handleSearch"
          />
        </el-form-item>
        <el-form-item label="产品">
          <el-select v-model="filterProduct" placeholder="全部" clearable style="width: 200px">
            <el-option label="全部" value="" />
            <el-option
              v-for="product in uniqueProducts"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="released" />
            <el-option label="规划中" value="planning" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="BOM总数" :value="stats.total">
            <template #prefix>
              <el-icon><Box /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="已发布" :value="stats.released">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="平均Feature数" :value="stats.avgFeatures">
            <template #prefix>
              <el-icon color="#409EFF"><DataAnalysis /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总成本估算" :value="stats.totalCost" suffix="万元">
            <template #prefix>
              <el-icon color="#E6A23C"><TrendCharts /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- BOM列表 -->
    <el-card class="table-card">
      <el-table
        :data="paginatedBOMs"
        v-loading="loading"
        stripe
        highlight-current-row
        @row-click="handleRowClick"
        style="width: 100%"
      >
        <el-table-column prop="productName" label="产品名称" min-width="180" fixed />
        <el-table-column prop="versionName" label="版本" width="120">
          <template #default="{ row }">
            <el-tag :type="getVersionType(row.versionName)">
              {{ row.versionName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="versionCode" label="版本编码" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Feature统计" width="200">
          <template #default="{ row }">
            <div class="feature-stats">
              <el-space>
                <el-tag type="success" size="small">
                  核心: {{ row.statistics.coreFeatures }}
                </el-tag>
                <el-tag type="info" size="small">
                  可选: {{ row.statistics.optionalFeatures }}
                </el-tag>
              </el-space>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="总Feature数" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.statistics.totalFeatures }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="模块数" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="warning">{{ row.statistics.totalModules }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="估算成本" width="120" align="right">
          <template #default="{ row }">
            {{ formatCost(row.statistics.totalCost) }}
          </template>
        </el-table-column>
        <el-table-column label="估算工时" width="120" align="right">
          <template #default="{ row }">
            {{ row.statistics.totalEffort }} 小时
          </template>
        </el-table-column>
        <el-table-column prop="releaseDate" label="发布日期" width="120" />
        <el-table-column label="操作" width="180" fixed="right">
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
          :total="filteredBOMs.length"
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
import featureBOMDataRaw from '@/biz-data/mock/feature/feature-bom.json'

const router = useRouter()

// 数据
const boms = ref<any[]>([])
const loading = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const filterProduct = ref('')
const filterStatus = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 加载数据
onMounted(() => {
  const bomsData = featureBOMDataRaw.data || featureBOMDataRaw
  boms.value = bomsData
})

// 唯一产品列表
const uniqueProducts = computed(() => {
  const productMap = new Map()
  boms.value.forEach(bom => {
    if (!productMap.has(bom.productId)) {
      productMap.set(bom.productId, {
        id: bom.productId,
        name: bom.productName
      })
    }
  })
  return Array.from(productMap.values())
})

// 统计数据
const stats = computed(() => {
  const total = boms.value.length
  const released = boms.value.filter(b => b.status === 'released').length
  const totalFeatures = boms.value.reduce((sum, b) => sum + b.statistics.totalFeatures, 0)
  const avgFeatures = total > 0 ? Math.round(totalFeatures / total) : 0
  const totalCost = boms.value.reduce((sum, b) => sum + b.statistics.totalCost, 0)

  return {
    total,
    released,
    avgFeatures,
    totalCost: (totalCost / 10000).toFixed(1) // 转换为万元
  }
})

// 筛选后的BOM列表
const filteredBOMs = computed(() => {
  let result = boms.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      b =>
        b.productName.toLowerCase().includes(keyword) ||
        b.versionName.toLowerCase().includes(keyword) ||
        b.versionCode.toLowerCase().includes(keyword)
    )
  }

  // 产品筛选
  if (filterProduct.value) {
    result = result.filter(b => b.productId === filterProduct.value)
  }

  // 状态筛选
  if (filterStatus.value) {
    result = result.filter(b => b.status === filterStatus.value)
  }

  return result
})

// 分页后的BOM列表
const paginatedBOMs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredBOMs.value.slice(start, end)
})

// 获取版本类型
const getVersionType = (versionName: string) => {
  const map: Record<string, any> = {
    '旗舰版': 'danger',
    '高配版': 'warning',
    '标准版': 'info',
    '2026款': 'success'
  }
  return map[versionName] || 'primary'
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'released': 'success',
    'planning': 'warning',
    'archived': 'info'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'released': '已发布',
    'planning': '规划中',
    'archived': '已归档'
  }
  return map[status] || status
}

// 格式化成本
const formatCost = (cost: number) => {
  return `¥${(cost / 10000).toFixed(1)}万`
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
  router.push(`/assets/feature-bom/${id}`)
}

// 新建BOM
const handleCreate = () => {
  ElMessage.info('新建BOM功能开发中...')
}

// 编辑BOM
const handleEdit = (row: any) => {
  ElMessage.info(`编辑BOM: ${row.productName} - ${row.versionName}`)
}

// 复制BOM
const handleCopy = (row: any) => {
  ElMessage.info(`复制BOM: ${row.productName} - ${row.versionName}`)
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
.feature-bom-list {
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
    .feature-stats {
      display: flex;
      align-items: center;
    }

    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

