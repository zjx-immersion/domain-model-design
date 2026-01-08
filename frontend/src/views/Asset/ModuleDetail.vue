<template>
  <div class="detail-container">
    <el-page-header @back="goBack" title="软件模块列表">
      <template #content><span class="detail-title">{{ data?.name }}</span></template>
      <template #extra><el-button type="primary" @click="handleEdit">编辑</el-button></template>
    </el-page-header>

    <el-card class="info-card" v-loading="loading">
      <template #header><span>基本信息</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="模块编号">{{ data?.code }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">{{ getStatusLabel(data?.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属特性">{{ data?.featureName }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{ data?.version }}</el-descriptions-item>
        <el-descriptions-item label="开发语言">{{ data?.language }}</el-descriptions-item>
        <el-descriptions-item label="框架">{{ data?.framework }}</el-descriptions-item>
        <el-descriptions-item label="代码仓库" :span="2">{{ data?.repository }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ data?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="metrics-card">
      <template #header><span>质量指标</span></template>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="metric-item">
            <div class="metric-value">{{ data?.metrics?.codeLines?.toLocaleString() || 0 }}</div>
            <div class="metric-label">代码行数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-item">
            <div class="metric-value">{{ data?.metrics?.testCoverage || 0 }}%</div>
            <div class="metric-label">测试覆盖率</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-item">
            <div class="metric-value">{{ data?.metrics?.issues || 0 }}</div>
            <div class="metric-label">Issue数量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="metric-item">
            <div class="metric-value">{{ data?.metrics?.technicalDebt || 0 }}</div>
            <div class="metric-label">技术债</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { SoftwareModule } from '@/types/asset'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const data = ref<SoftwareModule | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await fetch('/biz-data/mock/asset/modules.json')
    const result = await response.json()
    data.value = result.data.find((item: SoftwareModule) => item.id === id)
    if (!data.value) {
      ElMessage.error('模块不存在')
      router.back()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
const handleEdit = () => ElMessage.info('编辑功能待实现')

const getStatusType = (status?: string) => ({ 'active': 'success', 'inactive': 'info', 'deprecated': 'danger' }[status || ''] || 'info')
const getStatusLabel = (status?: string) => ({ 'active': '活跃', 'inactive': '不活跃', 'deprecated': '已废弃' }[status || ''] || status)

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.detail-container { padding: 20px; }
.detail-title { font-size: 18px; font-weight: bold; }
.info-card, .metrics-card { margin-bottom: 20px; }
.metric-item {
  text-align: center;
  padding: 20px;
  .metric-value { font-size: 32px; font-weight: bold; color: #409eff; }
  .metric-label { margin-top: 10px; color: #909399; }
}
</style>

