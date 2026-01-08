<template>
  <div class="detail-container">
    <el-page-header @back="goBack" title="产品线列表">
      <template #content>
        <span class="detail-title">{{ data?.name }}</span>
      </template>
      <template #extra>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </el-page-header>

    <el-card class="info-card" v-loading="loading">
      <!-- 基本信息 -->
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="产品线编号">{{ data?.code }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">
            {{ getStatusLabel(data?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="负责人">{{ data?.owner }}</el-descriptions-item>
        <el-descriptions-item label="产品数量">{{ data?.productCount }}</el-descriptions-item>
        <el-descriptions-item label="特性数量">{{ data?.featureCount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(data?.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" :span="2">{{ formatDate(data?.updatedAt) }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ data?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 产品列表 -->
    <el-card class="products-card">
      <template #header>
        <span>产品列表（{{ data?.products?.length || 0 }}）</span>
      </template>
      
      <el-table :data="data?.products || []" style="width: 100%">
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="version" label="版本" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" @click="handleViewProduct(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 领域特性 -->
    <el-card class="features-card">
      <template #header>
        <span>领域特性（{{ data?.features?.length || 0 }}）</span>
      </template>
      
      <el-table :data="data?.features || []" style="width: 100%">
        <el-table-column prop="name" label="特性名称" />
        <el-table-column prop="reuseCount" label="复用次数" width="120" align="center" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" @click="handleViewFeature(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ProductLine } from '@/types/asset'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const data = ref<ProductLine | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await fetch('/biz-data/mock/asset/product-lines.json')
    const result = await response.json()
    data.value = result.data.find((item: ProductLine) => item.id === id)
    
    if (!data.value) {
      ElMessage.error('产品线不存在')
      router.back()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const handleEdit = () => {
  ElMessage.info('编辑功能待实现')
}

const handleExport = () => {
  ElMessage.info('导出功能待实现')
}

const handleViewProduct = (product: any) => {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

const handleViewFeature = (feature: any) => {
  router.push({ name: 'FeatureDetail', params: { id: feature.id } })
}

const getStatusType = (status?: string) => {
  const map: Record<string, string> = {
    'active': 'success',
    'inactive': 'info',
    'archived': 'warning'
  }
  return map[status || ''] || 'info'
}

const getStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    'active': '活跃',
    'inactive': '不活跃',
    'archived': '已归档'
  }
  return map[status || ''] || status
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.detail-container {
  padding: 20px;
}

.detail-title {
  font-size: 18px;
  font-weight: bold;
}

.info-card,
.products-card,
.features-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

