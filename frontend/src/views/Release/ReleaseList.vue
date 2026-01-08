<template>
  <div class="release-list">
    <div class="page-header">
      <div class="header-left">
        <h2>版本管理</h2>
        <span class="subtitle">Product Release Management</span>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="Plus" @click="createRelease">
          创建版本
        </el-button>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true">
        <el-form-item label="产品">
          <el-select v-model="filters.productId" placeholder="选择产品" clearable style="width: 200px">
            <el-option 
              v-for="product in products" 
              :key="product.id" 
              :label="product.name" 
              :value="product.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="选择状态" clearable style="width: 150px">
            <el-option label="规划中" value="planning" />
            <el-option label="进行中" value="in_progress" />
            <el-option label="测试中" value="testing" />
            <el-option label="已发布" value="released" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索版本名称或编号" 
            clearable 
            style="width: 200px"
            @clear="loadData"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="16">
        <el-col :span="4">
          <el-card class="stat-card">
            <div class="stat-icon planning">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.planning }}</div>
              <div class="stat-label">规划中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="stat-card">
            <div class="stat-icon in_progress">
              <el-icon><Loading /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.in_progress }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="stat-card">
            <div class="stat-icon testing">
              <el-icon><Loading /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.testing }}</div>
              <div class="stat-label">测试中</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="stat-card">
            <div class="stat-icon released">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.released }}</div>
              <div class="stat-label">已发布</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card class="stat-card">
            <div class="stat-icon archived">
              <el-icon><FolderOpened /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.archived }}</div>
              <div class="stat-label">已归档</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 列表 -->
    <el-card class="table-card">
      <el-table :data="filteredData" v-loading="loading" stripe>
        <el-table-column prop="code" label="版本编号" width="150" fixed />
        <el-table-column prop="name" label="版本名称" min-width="200">
          <template #default="scope">
            <el-link type="primary" @click="viewDetail(scope.row.id)">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品" width="180" />
        <el-table-column prop="version" label="版本号" width="120">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="releaseDate" label="发布日期" width="120" />
        <el-table-column label="特性包" width="100" align="center">
          <template #default="scope">
            <el-link 
              v-if="scope.row.featureBaselines && scope.row.featureBaselines.length > 0"
              type="primary"
              @click="viewBaselines(scope.row.id)"
            >
              {{ scope.row.featureBaselines.length }}
            </el-link>
            <span v-else style="color: #909399">0</span>
          </template>
        </el-table-column>
        <el-table-column prop="ownerName" label="负责人" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row.id)">详情</el-button>
            <el-button link type="primary" @click="manageBaselines(scope.row.id)">特性包</el-button>
            <el-button 
              link 
              type="primary" 
              @click="editRelease(scope.row)"
              v-if="scope.row.status !== 'released' && scope.row.status !== 'archived'"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 16px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus, Edit, Loading, Check, FolderOpened } from '@element-plus/icons-vue'
import releasesData from '@/data/release/releases.json'
import productsData from '@/data/products/domain-products.json'

const router = useRouter()
const loading = ref(false)
const rawData = ref<any[]>([])

// 筛选条件
const filters = ref({
  productId: '',
  status: '',
  keyword: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 产品列表
const products = ref(productsData)

// 统计数据
const stats = computed(() => {
  const data = rawData.value
  return {
    planning: data.filter(r => r.status === 'planning').length,
    in_progress: data.filter(r => r.status === 'in_progress').length,
    testing: data.filter(r => r.status === 'testing').length,
    released: data.filter(r => r.status === 'released').length,
    archived: data.filter(r => r.status === 'archived').length,
  }
})

// 过滤后的数据
const filteredData = computed(() => {
  let data = rawData.value

  // 应用筛选条件
  if (filters.value.productId) {
    data = data.filter(item => item.productId === filters.value.productId)
  }
  if (filters.value.status) {
    data = data.filter(item => item.status === filters.value.status)
  }
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    data = data.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.code.toLowerCase().includes(keyword)
    )
  }

  return data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const total = computed(() => {
  let data = rawData.value

  if (filters.value.productId) {
    data = data.filter(item => item.productId === filters.value.productId)
  }
  if (filters.value.status) {
    data = data.filter(item => item.status === filters.value.status)
  }
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    data = data.filter(item => 
      item.name.toLowerCase().includes(keyword) || 
      item.code.toLowerCase().includes(keyword)
    )
  }

  return data.length
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    rawData.value = releasesData.data
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    productId: '',
    status: '',
    keyword: ''
  }
  loadData()
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: 'warning',
    testing: 'danger',
    released: 'success',
    archived: ''
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    testing: '测试中',
    released: '已发布',
    archived: '已归档'
  }
  return labelMap[status] || status
}

const createRelease = () => {
  ElMessage.info('创建版本功能开发中')
}

const viewDetail = (id: string) => {
  ElMessage.info(`查看版本详情: ${id}`)
}

const viewBaselines = (releaseId: string) => {
  router.push({ path: '/baselines/list', query: { releaseId } })
}

const manageBaselines = (releaseId: string) => {
  router.push({ path: '/baselines/list', query: { releaseId } })
}

const editRelease = (release: any) => {
  ElMessage.info(`编辑版本: ${release.name}`)
}
</script>

<style scoped lang="scss">
.release-list {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      h2 {
        margin: 0;
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
    margin-bottom: 16px;
  }

  .stats-cards {
    margin-bottom: 16px;

    .stat-card {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      :deep(.el-card__body) {
        display: flex;
        align-items: center;
        padding: 20px;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;

        .el-icon {
          font-size: 24px;
          color: #fff;
        }

        &.planning {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.in_progress {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.testing {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        &.released {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.archived {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-content {
        flex: 1;

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #303133;
          line-height: 1;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>

