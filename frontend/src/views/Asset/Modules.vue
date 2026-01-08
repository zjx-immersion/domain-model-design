<template>
  <div class="modules-container">
    <el-row class="search-bar" :gutter="20">
      <el-col :span="8">
        <el-input v-model="searchText" placeholder="搜索模块名称或编号" clearable @input="handleSearch" prefix-icon="Search" />
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="不活跃" value="inactive" />
        </el-select>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-button type="primary" @click="handleCreate">新建模块</el-button>
      </el-col>
    </el-row>

    <el-table :data="filteredData" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="name" label="模块名称" min-width="200" />
      <el-table-column prop="featureName" label="所属特性" width="150" />
      <el-table-column prop="language" label="语言" width="100" />
      <el-table-column prop="version" label="版本" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="handleView(scope.row)">查看</el-button>
          <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
      layout="total, sizes, prev, pager, next, jumper" @current-change="handlePageChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { SoftwareModule } from '@/types/asset'
import { ElMessage } from 'element-plus'
import productsData from '@/data/products/domain-products.json'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const rawData = ref<SoftwareModule[]>([])
const searchText = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const productModules = ref<string[]>([]) // 产品关联的模块ID列表

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/asset/modules.json')
    const result = await response.json()
    rawData.value = result.data
    
    // 如果有productId参数，加载该产品的模块列表
    const productId = route.query.productId as string
    if (productId) {
      const product = productsData.find((p: any) => p.id === productId)
      if (product && product.modules) {
        productModules.value = product.modules
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
  
  // 如果从产品页面跳转过来，只显示该产品的模块
  if (productModules.value.length > 0) {
    data = data.filter(item => productModules.value.includes(item.id))
  }
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    data = data.filter(item => item.name?.toLowerCase().includes(search) || item.code?.toLowerCase().includes(search))
  }
  if (filterStatus.value) {
    data = data.filter(item => item.status === filterStatus.value)
  }
  return data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const total = computed(() => rawData.value.length)

const handleSearch = () => { currentPage.value = 1 }
const handleView = (row: SoftwareModule) => { router.push({ name: 'ModuleDetail', params: { id: row.id } }) }
const handleEdit = (row: SoftwareModule) => { ElMessage.info('编辑功能待实现') }
const handleCreate = () => { ElMessage.info('新建功能待实现') }
const handlePageChange = () => {}

const getStatusType = (status: string) => ({ 'active': 'success', 'inactive': 'info', 'deprecated': 'danger' }[status] || 'info')
const getStatusLabel = (status: string) => ({ 'active': '活跃', 'inactive': '不活跃', 'deprecated': '已废弃' }[status] || status)

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.modules-container { padding: 20px; }
.search-bar { margin-bottom: 20px; }
.text-right { text-align: right; }
</style>

