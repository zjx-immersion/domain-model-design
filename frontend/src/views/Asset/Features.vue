<template>
  <div class="features-container">
    <!-- 搜索和操作栏 -->
    <el-row class="search-bar" :gutter="20">
      <el-col :span="8">
        <el-input
          v-model="searchText"
          placeholder="搜索特性名称或编号"
          clearable
          @input="handleSearch"
          prefix-icon="Search"
        />
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterCategory" placeholder="类别筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="感知" value="perception" />
          <el-option label="规划" value="planning" />
          <el-option label="控制" value="control" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterType" placeholder="类型筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="通用特性" value="common" />
          <el-option label="变体特性" value="variant" />
          <el-option label="定制特性" value="custom" />
        </el-select>
      </el-col>
      <el-col :span="4" class="text-right">
        <el-button type="primary" @click="handleCreate">新建特性</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="filteredData" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="name" label="特性名称" min-width="200" />
      <el-table-column prop="productLineName" label="所属产品线" width="150" />
      <el-table-column prop="category" label="类别" width="100" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="scope">
          <el-tag :type="getTypeTagType(scope.row.type)">
            {{ getTypeLabel(scope.row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reuseCount" label="复用次数" width="100" align="center" />
      <el-table-column prop="moduleCount" label="模块数" width="100" align="center" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { DomainFeature } from '@/types/asset'
import { ElMessage } from 'element-plus'
import productsData from '@/data/products/domain-products.json'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const rawData = ref<DomainFeature[]>([])
const searchText = ref('')
const filterCategory = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const productFeatures = ref<string[]>([]) // 产品关联的特性ID列表

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/asset/features.json')
    const result = await response.json()
    rawData.value = result.data
    
    // 如果有productId参数，加载该产品的特性列表
    const productId = route.query.productId as string
    if (productId) {
      const product = productsData.find((p: any) => p.id === productId)
      if (product && product.features) {
        productFeatures.value = product.features
      }
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const filteredData = computed(() => {
  let data = rawData.value
  
  // 如果从产品页面跳转过来，只显示该产品的特性
  if (productFeatures.value.length > 0) {
    data = data.filter(item => productFeatures.value.includes(item.id))
  }
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    data = data.filter(item => 
      item.name?.toLowerCase().includes(search) ||
      item.code?.toLowerCase().includes(search)
    )
  }
  
  if (filterCategory.value) {
    data = data.filter(item => item.category === filterCategory.value)
  }
  
  if (filterType.value) {
    data = data.filter(item => item.type === filterType.value)
  }
  
  return data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const total = computed(() => rawData.value.length)

const handleSearch = () => {
  currentPage.value = 1
}

const handleView = (row: DomainFeature) => {
  router.push({ name: 'FeatureDetail', params: { id: row.id } })
}

const handleEdit = (row: DomainFeature) => {
  ElMessage.info('编辑功能待实现')
}

const handleCreate = () => {
  ElMessage.info('新建功能待实现')
}

const handlePageChange = () => {}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'active': 'success',
    'inactive': 'info',
    'deprecated': 'danger'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'active': '活跃',
    'inactive': '不活跃',
    'deprecated': '已废弃'
  }
  return map[status] || status
}

const getTypeTagType = (type: string) => {
  const map: Record<string, string> = {
    'common': 'success',
    'variant': 'warning',
    'custom': 'info'
  }
  return map[type] || ''
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    'common': '通用',
    'variant': '变体',
    'custom': '定制'
  }
  return map[type] || type
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.features-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}
</style>

