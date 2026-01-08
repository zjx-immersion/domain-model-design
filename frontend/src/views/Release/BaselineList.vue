<template>
  <div class="baseline-list">
    <div class="page-header">
      <div class="header-left">
        <h2>特性包管理</h2>
        <span class="subtitle">Feature Baseline Management</span>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="Plus" @click="createBaseline">
          创建特性包
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
            <el-option label="草稿" value="draft" />
            <el-option label="已基线化" value="baseline" />
            <el-option label="已冻结" value="frozen" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item label="PI">
          <el-select v-model="filters.piId" placeholder="选择PI" clearable style="width: 180px">
            <el-option 
              v-for="pi in piList" 
              :key="pi.id" 
              :label="pi.name" 
              :value="pi.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input 
            v-model="filters.keyword" 
            placeholder="搜索名称或编号" 
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
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-icon draft">
              <el-icon><Edit /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.draft }}</div>
              <div class="stat-label">草稿</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-icon baseline">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.baseline }}</div>
              <div class="stat-label">已基线化</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-icon frozen">
              <el-icon><Lock /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.frozen }}</div>
              <div class="stat-label">已冻结</div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
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
        <el-table-column prop="code" label="编号" width="150" fixed />
        <el-table-column prop="name" label="特性包名称" min-width="200">
          <template #default="scope">
            <el-link type="primary" @click="viewDetail(scope.row.id)">
              {{ scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品" width="180" />
        <el-table-column prop="releaseName" label="关联版本" width="150">
          <template #default="scope">
            <el-link type="primary" @click="viewRelease(scope.row.releaseId)">
              {{ scope.row.releaseName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="piName" label="PI" width="120" />
        <el-table-column label="特性构成" width="180">
          <template #default="scope">
            <div class="feature-composition">
              <el-tag size="small" type="success">直接采用 {{ scope.row.adoptedFeatures?.length || 0 }}</el-tag>
              <el-tag size="small" type="warning" style="margin-left: 4px">
                需要开发 {{ scope.row.developmentFeatures?.length || 0 }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="工作量" width="120">
          <template #default="scope">
            <el-tooltip :content="`预计${scope.row.estimatedSprints}个迭代`" placement="top">
              <span>{{ scope.row.estimatedStoryPoints }} SP</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="scope">
            <el-progress 
              :percentage="Math.round(scope.row.progress * 100)" 
              :status="scope.row.progress === 1 ? 'success' : undefined"
            />
          </template>
        </el-table-column>
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
            <el-button 
              link 
              type="primary" 
              @click="editBaseline(scope.row)"
              v-if="scope.row.status === 'draft'"
            >
              编辑
            </el-button>
            <el-button 
              link 
              type="success" 
              @click="baselineAction(scope.row)"
              v-if="scope.row.status === 'draft'"
            >
              基线化
            </el-button>
            <el-button 
              link 
              type="warning" 
              @click="freezeAction(scope.row)"
              v-if="scope.row.status === 'baseline'"
            >
              冻结
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Check, Lock, FolderOpened } from '@element-plus/icons-vue'
import baselinesData from '@/data/release/baselines.json'
import productsData from '@/data/products/domain-products.json'
import piData from '@/data/projects/pi-plannings.json'

const router = useRouter()
const loading = ref(false)
const rawData = ref<any[]>([])

// 筛选条件
const filters = ref({
  productId: '',
  status: '',
  piId: '',
  keyword: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 产品列表和PI列表
const products = ref(productsData)
const piList = ref(piData)

// 统计数据
const stats = computed(() => {
  const data = rawData.value
  return {
    draft: data.filter(b => b.status === 'draft').length,
    baseline: data.filter(b => b.status === 'baseline').length,
    frozen: data.filter(b => b.status === 'frozen').length,
    archived: data.filter(b => b.status === 'archived').length,
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
  if (filters.value.piId) {
    data = data.filter(item => item.piId === filters.value.piId)
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
  if (filters.value.piId) {
    data = data.filter(item => item.piId === filters.value.piId)
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
    rawData.value = baselinesData.data
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
    piId: '',
    keyword: ''
  }
  loadData()
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    baseline: 'success',
    frozen: 'warning',
    archived: ''
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    baseline: '已基线化',
    frozen: '已冻结',
    archived: '已归档'
  }
  return labelMap[status] || status
}

const createBaseline = () => {
  ElMessage.info('创建特性包功能开发中')
}

const viewDetail = (id: string) => {
  router.push({ name: 'BaselineDetail', params: { id } })
}

const viewRelease = (releaseId: string) => {
  router.push({ name: 'ReleaseDetail', params: { id: releaseId } })
}

const editBaseline = (baseline: any) => {
  ElMessage.info(`编辑特性包: ${baseline.name}`)
}

const baselineAction = (baseline: any) => {
  ElMessageBox.confirm(
    `确定将特性包 "${baseline.name}" 设置为基线状态吗？基线化后将不能随意修改。`,
    '基线化确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 更新状态
    baseline.status = 'baseline'
    ElMessage.success('基线化成功')
  }).catch(() => {
    ElMessage.info('已取消基线化')
  })
}

const freezeAction = (baseline: any) => {
  ElMessageBox.confirm(
    `确定冻结特性包 "${baseline.name}" 吗？冻结后将完全锁定，不能进行任何修改。`,
    '冻结确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 更新状态
    baseline.status = 'frozen'
    ElMessage.success('冻结成功')
  }).catch(() => {
    ElMessage.info('已取消冻结')
  })
}
</script>

<style scoped lang="scss">
.baseline-list {
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

        &.draft {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.baseline {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.frozen {
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

  .table-card {
    .feature-composition {
      display: flex;
      align-items: center;
    }
  }
}
</style>

