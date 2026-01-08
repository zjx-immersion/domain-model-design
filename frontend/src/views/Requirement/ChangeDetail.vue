<template>
  <div class="detail-container">
    <el-page-header @back="goBack" title="需求变更列表">
      <template #content><span class="detail-title">{{ data?.title }}</span></template>
      <template #extra>
        <el-button type="success" @click="handleApprove" v-if="data?.status === 'in_review'">批准</el-button>
        <el-button type="danger" @click="handleReject" v-if="data?.status === 'in_review'">拒绝</el-button>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </template>
    </el-page-header>

    <el-card class="info-card" v-loading="loading">
      <template #header><span>基本信息</span></template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="变更编号">{{ data?.code }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag :type="getStatusType(data?.status)">{{ getStatusLabel(data?.status) }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="变更类型"><el-tag>{{ getChangeTypeLabel(data?.changeType) }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="优先级"><el-tag :type="getPriorityType(data?.priority)">{{ data?.priority }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="目标类型">{{ data?.targetType }}</el-descriptions-item>
        <el-descriptions-item label="目标">{{ data?.targetTitle }}</el-descriptions-item>
        <el-descriptions-item label="提出人">{{ data?.proposer }}</el-descriptions-item>
        <el-descriptions-item label="提出时间">{{ formatDate(data?.proposedAt) }}</el-descriptions-item>
        <el-descriptions-item label="变更原因" :span="2">{{ data?.changeReason }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ data?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="impact-card">
      <template #header><span>影响分析</span></template>
      <el-row :gutter="20">
        <el-col :span="6"><div class="impact-item"><div class="impact-value">{{ data?.impact?.affectedUserRequirements || 0 }}</div><div class="impact-label">用户需求</div></div></el-col>
        <el-col :span="6"><div class="impact-item"><div class="impact-value">{{ data?.impact?.affectedFeatureRequirements || 0 }}</div><div class="impact-label">特性需求</div></div></el-col>
        <el-col :span="6"><div class="impact-item"><div class="impact-value">{{ data?.impact?.estimatedWorkload || 0 }}</div><div class="impact-label">工作量(人天)</div></div></el-col>
        <el-col :span="6"><div class="impact-item"><div class="impact-value">{{ data?.impact?.scheduleImpact || 0 }}</div><div class="impact-label">进度影响(天)</div></div></el-col>
      </el-row>
    </el-card>

    <el-card class="history-card">
      <template #header><span>变更历史</span></template>
      <el-timeline>
        <el-timeline-item v-for="(item, index) in data?.changeHistory" :key="index" :timestamp="item.date" placement="top">
          <p><strong>{{ item.action }}</strong> - {{ item.operator }}</p>
          <p v-if="item.description">{{ item.description }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { RequirementChange } from '@/types/requirement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const data = ref<RequirementChange | null>(null)

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/requirement/requirement-changes.json')
    data.value = (await response.json()).data.find((item: RequirementChange) => item.id === route.params.id)
    if (!data.value) { ElMessage.error('变更不存在'); router.back() }
  } catch (error) { ElMessage.error('加载数据失败') } finally { loading.value = false }
}

const goBack = () => router.back()
const handleEdit = () => ElMessage.info('编辑功能待实现')
const handleApprove = () => ElMessage.success('批准成功')
const handleReject = () => ElMessage.success('拒绝成功')

const getChangeTypeLabel = (type?: string) => ({scope_change: '范围变更', technical_solution: '技术方案', schedule_change: '进度变更', requirement_change: '需求变更', ux_optimization: 'UX优化', security_enhancement: '安全增强'}[type || ''] || type)
const getStatusType = (status?: string) => ({pending: 'info', in_review: 'warning', approved: 'success', rejected: 'danger'}[status || ''] || 'info')
const getStatusLabel = (status?: string) => ({pending: '待处理', in_review: '评审中', approved: '已批准', rejected: '已拒绝'}[status || ''] || status)
const getPriorityType = (priority?: string) => ({P0: 'danger', P1: 'warning', P2: 'info'}[priority || ''] || 'info')
const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.detail-container { padding: 20px; }
.detail-title { font-size: 18px; font-weight: bold; }
.info-card, .impact-card, .history-card { margin-bottom: 20px; }
.impact-item {
  text-align: center;
  padding: 20px;
  .impact-value { font-size: 32px; font-weight: bold; color: #409eff; }
  .impact-label { margin-top: 10px; color: #909399; }
}
</style>

