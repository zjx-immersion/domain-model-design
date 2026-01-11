<template>
  <div class="detail-container">
    <el-page-header @back="goBack" title="模块需求列表">
      <template #content><span class="detail-title">{{ data?.title }}</span></template>
      <template #extra><el-button type="primary" @click="handleEdit">编辑</el-button></template>
    </el-page-header>

    <el-card class="info-card" v-loading="loading">
      <template #header><span>基本信息</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="编号">{{ data?.code }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag :type="getStatusType(data?.status)">{{ getStatusLabel(data?.status) }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="特性需求">{{ data?.featureRequirementTitle }}</el-descriptions-item>
        <el-descriptions-item label="优先级"><el-tag :type="getPriorityType(data?.priority)">{{ data?.priority }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="模块">{{ data?.moduleName }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ data?.owner }}</el-descriptions-item>
        <el-descriptions-item label="Story数量">{{ data?.storyCount }}</el-descriptions-item>
        <el-descriptions-item label="Task数量">{{ data?.taskCount }} (已完成: {{ data?.completedTasks }})</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ data?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="progress-card">
      <template #header><span>进度跟踪</span></template>
      <el-row :gutter="20">
        <el-col :span="12"><el-progress :percentage="Math.round((data?.progress || 0) * 100)" /></el-col>
        <el-col :span="12"><span class="workload-text">工作量: {{ data?.actualWorkload }} / {{ data?.estimatedWorkload }} 人天</span></el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ModuleRequirement } from '@/types/requirement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const data = ref<ModuleRequirement | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/requirement/module-requirements.json')
    const result = await response.json()
    const list = Array.isArray(result) ? result : (result.data || [])
    data.value = list.find((item: ModuleRequirement) => item.id === route.params.id) || null
    if (!data.value) { 
      ElMessage.error('需求不存在')
      router.back() 
    }
  } catch (error) { 
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
    data.value = null
  } finally { 
    loading.value = false 
  }
}

const goBack = () => router.back()
const handleEdit = () => ElMessage.info('编辑功能待实现')
const getStatusType = (status?: string) => ({planned: 'info', in_development: 'warning', in_review: 'primary', completed: 'success'}[status || ''] || 'info')
const getStatusLabel = (status?: string) => ({planned: '已规划', in_development: '开发中', in_review: '评审中', completed: '已完成'}[status || ''] || status)
const getPriorityType = (priority?: string) => ({P0: 'danger', P1: 'warning', P2: 'info'}[priority || ''] || 'info')

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.detail-container { padding: 20px; }
.detail-title { font-size: 18px; font-weight: bold; }
.info-card, .progress-card { margin-bottom: 20px; }
.workload-text { font-size: 16px; color: #409eff; }
</style>

