<template>
  <div class="detail-container">
    <el-page-header @back="goBack" title="用户需求列表">
      <template #content><span class="detail-title">{{ data?.title }}</span></template>
      <template #extra>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button @click="handleExport">导出</el-button>
      </template>
    </el-page-header>

    <el-card class="info-card" v-loading="loading">
      <template #header><span>基本信息</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="需求编号">{{ data?.code }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">{{ getStatusLabel(data?.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(data?.priority)">{{ data?.priority }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="风险等级">
          <el-tag :type="getRiskType(data?.riskLevel)">{{ getRiskLabel(data?.riskLevel) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="负责人">{{ data?.owner }}</el-descriptions-item>
        <el-descriptions-item label="产品线">{{ data?.productLine }}</el-descriptions-item>
        <el-descriptions-item label="产品">{{ data?.product }}</el-descriptions-item>
        <el-descriptions-item label="版本">{{ data?.version }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(data?.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="预计完成">{{ formatDate(data?.expectedCompleteAt) }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ data?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="progress-card">
      <template #header><span>进度跟踪</span></template>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="progress-item">
            <span class="progress-label">整体进度</span>
            <el-progress :percentage="Math.round((data?.progress || 0) * 100)" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="progress-item">
            <span class="progress-label">工作量</span>
            <span class="workload-text">{{ data?.actualWorkload }} / {{ data?.estimatedWorkload }} 人天</span>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="features-card">
      <template #header><span>特性需求（{{ data?.featureCount || 0 }}）</span></template>
      <el-table :data="featureRequirements" style="width: 100%">
        <el-table-column prop="code" label="编号" width="120" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="scope">
            <el-progress :percentage="Math.round((scope.row.progress || 0) * 100)" />
          </template>
        </el-table-column>
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
import type { UserRequirement, FeatureRequirement } from '@/types/requirement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const data = ref<UserRequirement | null>(null)
const featureRequirements = ref<FeatureRequirement[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await fetch('/biz-data/mock/requirement/user-requirements.json')
    const result = await response.json()
    data.value = result.data.find((item: UserRequirement) => item.id === id)
    
    if (!data.value) {
      ElMessage.error('需求不存在')
      router.back()
      return
    }
    
    // 加载关联的特性需求
    const frResponse = await fetch('/biz-data/mock/requirement/feature-requirements.json')
    const frResult = await frResponse.json()
    featureRequirements.value = frResult.data.filter((item: FeatureRequirement) => 
      data.value?.featureRequirements.includes(item.id)
    )
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const goBack = () => router.back()
const handleEdit = () => ElMessage.info('编辑功能待实现')
const handleExport = () => ElMessage.info('导出功能待实现')

const handleViewFeature = (row: FeatureRequirement) => {
  router.push({ name: 'FeatureRequirementDetail', params: { id: row.id } })
}

const getStatusType = (status?: string) => {
  const map: Record<string, string> = {
    'planned': 'info',
    'in_development': 'warning',
    'in_review': 'primary',
    'completed': 'success'
  }
  return map[status || ''] || 'info'
}

const getStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    'planned': '已规划',
    'in_development': '开发中',
    'in_review': '评审中',
    'completed': '已完成'
  }
  return map[status || ''] || status
}

const getPriorityType = (priority?: string) => {
  const map: Record<string, string> = { 'P0': 'danger', 'P1': 'warning', 'P2': 'info' }
  return map[priority || ''] || 'info'
}

const getRiskType = (level?: string) => {
  const map: Record<string, string> = { 'low': 'success', 'medium': 'warning', 'high': 'danger' }
  return map[level || ''] || 'info'
}

const getRiskLabel = (level?: string) => {
  const map: Record<string, string> = { 'low': '低', 'medium': '中', 'high': '高' }
  return map[level || ''] || level
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.detail-container { padding: 20px; }
.detail-title { font-size: 18px; font-weight: bold; }
.info-card, .progress-card, .features-card { margin-bottom: 20px; }
.progress-item { margin-bottom: 20px; }
.progress-label { display: block; margin-bottom: 10px; font-weight: bold; }
.workload-text { font-size: 16px; color: #409eff; }
</style>

