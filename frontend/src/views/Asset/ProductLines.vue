<template>
  <div class="product-lines-container">
    <!-- 搜索和操作栏 -->
    <el-row class="search-bar" :gutter="20">
      <el-col :span="8">
        <el-input
          v-model="searchText"
          placeholder="搜索产品线名称或编号"
          clearable
          @input="handleSearch"
          prefix-icon="Search"
        />
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="活跃" value="active" />
          <el-option label="不活跃" value="inactive" />
          <el-option label="已归档" value="archived" />
        </el-select>
      </el-col>
      <el-col :span="6" class="text-right">
        <el-button type="primary" @click="handleCreate">新建产品线</el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table :data="filteredData" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="name" label="产品线名称" min-width="200" />
      <el-table-column prop="productCount" label="产品数量" width="100" align="center" />
      <el-table-column prop="featureCount" label="特性数量" width="100" align="center" />
      <el-table-column prop="owner" label="负责人" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.updatedAt) }}
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
import { useRouter } from 'vue-router'
import type { ProductLine } from '@/types/asset'
import { ElMessage } from 'element-plus'
import productLinesData from '@/data/products/product-lines.json'

const router = useRouter()
const loading = ref(false)
const rawData = ref<ProductLine[]>([])
const searchText = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 加载数据
const loadData = () => {
  loading.value = true
  try {
    rawData.value = productLinesData as ProductLine[]
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 计算过滤后的数据
const filteredData = computed(() => {
  let data = rawData.value
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    data = data.filter(item => 
      item.name?.toLowerCase().includes(search) ||
      item.code?.toLowerCase().includes(search)
    )
  }
  
  if (filterStatus.value) {
    data = data.filter(item => item.status === filterStatus.value)
  }
  
  return data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const total = computed(() => rawData.value.length)

// 事件处理
const handleSearch = () => {
  currentPage.value = 1
}

const handleView = (row: ProductLine) => {
  router.push({ name: 'ProductLineDetail', params: { id: row.id } })
}

const handleEdit = (row: ProductLine) => {
  ElMessage.info('编辑功能待实现')
}

const handleCreate = () => {
  ElMessage.info('新建功能待实现')
}

const handlePageChange = () => {
  // 分页变化处理
}

const getStatusType = (status: string) => {
  const map: Record<string, string> = {
    'active': 'success',
    'inactive': 'info',
    'archived': 'warning'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'active': '活跃',
    'inactive': '不活跃',
    'archived': '已归档'
  }
  return map[status] || status
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.product-lines-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}
</style>

