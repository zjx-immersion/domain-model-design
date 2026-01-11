<template>
  <div class="platform-list page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="Platform资产管理">
        <template #extra>
          <el-space>
            <el-button type="primary" :icon="Plus">新建Platform</el-button>
            <el-button :icon="Download">导出</el-button>
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
            placeholder="Platform名称或编码"
            :prefix-icon="Search"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filterType" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="硬件平台" value="hardware" />
            <el-option label="软件平台" value="software" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="Active" value="active" />
            <el-option label="EOL" value="eol" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="Platform总数" :value="stats.total">
            <template #prefix>
              <el-icon><Platform /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="硬件平台" :value="stats.hardware">
            <template #prefix>
              <el-icon color="#409EFF"><Cpu /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="软件平台" :value="stats.software">
            <template #prefix>
              <el-icon color="#67C23A"><Monitor /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="Active平台" :value="stats.active">
            <template #prefix>
              <el-icon color="#E6A23C"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- Platform列表 -->
    <el-card class="table-card">
      <el-table
        :data="paginatedPlatforms"
        v-loading="loading"
        stripe
        highlight-current-row
        @row-click="handleRowClick"
        style="width: 100%"
      >
        <el-table-column prop="code" label="编码" width="150" fixed />
        <el-table-column prop="name" label="名称" min-width="220">
          <template #default="{ row }">
            <div class="platform-name">
              <span class="name">{{ row.name }}</span>
              <el-tag v-if="row.isPrimary" type="success" size="small">主力</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="vendor" label="供应商" width="150" />
        <el-table-column prop="version" label="版本" width="120" />
        <el-table-column label="部署模块" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="primary">{{ row.deployedModules?.length || 0 }} 个</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="兼容性" width="120">
          <template #default="{ row }">
            <el-progress
              :percentage="getCompatibilityScore(row)"
              :color="getCompatibilityColor(row)"
              :stroke-width="8"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="releaseDate" label="发布日期" width="120" />
        <el-table-column label="使用产品" min-width="200">
          <template #default="{ row }">
            <el-space wrap v-if="row.usedInProducts && row.usedInProducts.length > 0">
              <el-tag v-for="product in row.usedInProducts.slice(0, 3)" :key="product" type="info" size="small">
                {{ product }}
              </el-tag>
              <el-tag v-if="row.usedInProducts.length > 3" type="info" size="small">
                +{{ row.usedInProducts.length - 3 }}
              </el-tag>
            </el-space>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-space>
              <el-button type="primary" link size="small" @click.stop="viewDetail(row.id)">
                查看
              </el-button>
              <el-button type="primary" link size="small" @click.stop="handleEdit(row)">
                编辑
              </el-button>
              <el-button type="primary" link size="small" @click.stop="handleAnalyze(row)">
                影响分析
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
          :page-sizes="[10, 20, 50]"
          :total="filteredPlatforms.length"
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
  Platform,
  Cpu,
  Monitor,
  SuccessFilled
} from '@element-plus/icons-vue'
import platformsDataRaw from '@/biz-data/mock/asset/platforms.json'

const router = useRouter()

// 数据
const platforms = ref<any[]>([])
const loading = ref(false)

// 搜索和筛选
const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')

// 分页
const currentPage = ref(1)
const pageSize = ref(20)

// 加载数据
onMounted(() => {
  const platformsData = platformsDataRaw.data || platformsDataRaw
  platforms.value = platformsData
})

// 统计数据
const stats = computed(() => {
  const total = platforms.value.length
  const hardware = platforms.value.filter(p => p.type === 'hardware').length
  const software = platforms.value.filter(p => p.type === 'software').length
  const active = platforms.value.filter(p => p.status === 'active').length

  return { total, hardware, software, active }
})

// 筛选后的Platform列表
const filteredPlatforms = computed(() => {
  let result = platforms.value

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(
      p =>
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword) ||
        p.vendor?.toLowerCase().includes(keyword)
    )
  }

  // 类型筛选
  if (filterType.value) {
    result = result.filter(p => p.type === filterType.value)
  }

  // 状态筛选
  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }

  return result
})

// 分页后的Platform列表
const paginatedPlatforms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPlatforms.value.slice(start, end)
})

// 获取类型标签类型
const getTypeTagType = (type: string) => {
  return type === 'hardware' ? 'primary' : 'success'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    'hardware': '硬件',
    'software': '软件'
  }
  return map[type] || type
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'deprecated': 'warning',
    'eol': 'danger'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': 'Active',
    'deprecated': 'Deprecated',
    'eol': 'EOL'
  }
  return map[status] || status
}

// 获取兼容性得分
const getCompatibilityScore = (platform: any) => {
  return platform.compatibilityScore || 85
}

// 获取兼容性颜色
const getCompatibilityColor = (platform: any) => {
  const score = getCompatibilityScore(platform)
  if (score >= 90) return '#67C23A'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
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
  router.push(`/platforms/${id}`)
}

// 编辑
const handleEdit = (row: any) => {
  ElMessage.info(`编辑Platform: ${row.name}`)
}

// 影响分析
const handleAnalyze = (row: any) => {
  ElMessage.info(`Platform影响分析: ${row.name}`)
}

// 返回
const goBack = () => {
  router.push('/assets')
}
</script>

<style scoped lang="scss">
.platform-list {
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
    .platform-name {
      display: flex;
      align-items: center;
      gap: 8px;

      .name {
        font-weight: 500;
      }
    }

    .empty-text {
      color: #909399;
    }

    .pagination-wrapper {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

