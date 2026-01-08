<template>
  <div class="detail-container">
    <el-page-header @back="goBack" title="领域特性列表">
      <template #content>
        <span class="detail-title">{{ data?.name }}</span>
      </template>
      <template #extra>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </template>
    </el-page-header>

    <el-card class="info-card" v-loading="loading">
      <template #header>
        <span>基本信息</span>
      </template>
      
      <el-descriptions :column="2" border>
        <el-descriptions-item label="特性编号">{{ data?.code }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(data?.status)">
            {{ getStatusLabel(data?.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="所属产品线">{{ data?.productLineName }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ data?.category }}</el-descriptions-item>
        <el-descriptions-item label="类型">
          <el-tag :type="getTypeTagType(data?.type)">
            {{ getTypeLabel(data?.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="复用次数">{{ data?.reuseCount }}</el-descriptions-item>
        <el-descriptions-item label="模块数量">{{ data?.moduleCount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(data?.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">{{ data?.description }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 接口定义 -->
    <el-card class="interfaces-card">
      <template #header>
        <span>接口定义（{{ data?.interfaces?.length || 0 }}）</span>
      </template>
      
      <el-collapse>
        <el-collapse-item
          v-for="(iface, index) in data?.interfaces"
          :key="index"
          :title="iface.name"
        >
          <div class="interface-detail">
            <p><strong>类型:</strong> {{ iface.type }}</p>
            <p><strong>描述:</strong> {{ iface.description }}</p>
            <p><strong>返回值:</strong> {{ iface.returns }}</p>
            <div v-if="iface.parameters && iface.parameters.length > 0">
              <p><strong>参数:</strong></p>
              <el-table :data="iface.parameters" size="small">
                <el-table-column prop="name" label="参数名" width="150" />
                <el-table-column prop="type" label="类型" width="150" />
                <el-table-column prop="required" label="必填" width="80">
                  <template #default="scope">
                    <el-tag :type="scope.row.required ? 'danger' : 'info'" size="small">
                      {{ scope.row.required ? '是' : '否' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" />
              </el-table>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!-- 关联需求 -->
    <el-card class="requirements-card">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>关联需求（{{ featureRequirements.length }}）</span>
          <el-button link type="primary" @click="viewAllRequirements">
            查看全部 →
          </el-button>
        </div>
      </template>
      
      <el-table :data="featureRequirements" v-loading="loadingRequirements" style="width: 100%">
        <el-table-column prop="code" label="需求编号" width="120" />
        <el-table-column prop="title" label="需求标题" min-width="200" />
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag :type="getPriorityType(scope.row.priority)" size="small">
              {{ scope.row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getRequirementStatusType(scope.row.status)" size="small">
              {{ getRequirementStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="120">
          <template #default="scope">
            <el-progress :percentage="Math.round(scope.row.progress * 100)" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="viewRequirementDetail(scope.row.id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="featureRequirements.length === 0 && !loadingRequirements" 
        description="暂无关联需求" />
    </el-card>

    <!-- 包含的模块 -->
    <el-card class="modules-card">
      <template #header>
        <span>包含模块（{{ data?.modules?.length || 0 }}）</span>
      </template>
      
      <el-table :data="data?.modules || []" style="width: 100%">
        <el-table-column prop="name" label="模块名称" />
        <el-table-column prop="version" label="版本" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" @click="handleViewModule(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { DomainFeature } from '@/types/asset'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const loadingRequirements = ref(false)
const data = ref<DomainFeature | null>(null)
const featureRequirements = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await fetch('/biz-data/mock/asset/features.json')
    const result = await response.json()
    data.value = result.data.find((item: DomainFeature) => item.id === id)
    
    if (!data.value) {
      ElMessage.error('特性不存在')
      router.back()
      return
    }
    
    // 加载关联需求
    await loadFeatureRequirements(id)
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 加载特性关联的需求
const loadFeatureRequirements = async (featureId: string) => {
  loadingRequirements.value = true
  try {
    const response = await fetch('/biz-data/mock/requirement/feature-requirements.json')
    const result = await response.json()
    // 筛选出该特性的需求
    featureRequirements.value = result.data.filter((req: any) => req.featureId === featureId)
  } catch (error) {
    console.error('加载需求失败:', error)
    ElMessage.error('加载需求失败')
  } finally {
    loadingRequirements.value = false
  }
}

const goBack = () => router.back()
const handleEdit = () => ElMessage.info('编辑功能待实现')

const handleViewModule = (module: any) => {
  router.push({ name: 'ModuleDetail', params: { id: module.id } })
}

const viewAllRequirements = () => {
  router.push({ path: '/requirements/feature', query: { featureId: data.value?.id } })
}

const viewRequirementDetail = (requirementId: string) => {
  router.push({ name: 'FeatureRequirementDetail', params: { id: requirementId } })
}

const getPriorityType = (priority: string) => {
  const map: Record<string, string> = {
    'P0': 'danger',
    'P1': 'warning',
    'P2': 'info'
  }
  return map[priority] || 'info'
}

const getRequirementStatusType = (status: string) => {
  const map: Record<string, string> = {
    'planning': 'info',
    'in_development': 'warning',
    'in_review': 'primary',
    'completed': 'success'
  }
  return map[status] || 'info'
}

const getRequirementStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    'planning': '已规划',
    'in_development': '开发中',
    'in_review': '评审中',
    'completed': '已完成'
  }
  return map[status] || status
}

const getStatusType = (status?: string) => {
  const map: Record<string, string> = {
    'active': 'success',
    'inactive': 'info',
    'deprecated': 'danger'
  }
  return map[status || ''] || 'info'
}

const getStatusLabel = (status?: string) => {
  const map: Record<string, string> = {
    'active': '活跃',
    'inactive': '不活跃',
    'deprecated': '已废弃'
  }
  return map[status || ''] || status
}

const getTypeTagType = (type?: string) => {
  const map: Record<string, string> = {
    'common': 'success',
    'variant': 'warning',
    'custom': 'info'
  }
  return map[type || ''] || ''
}

const getTypeLabel = (type?: string) => {
  const map: Record<string, string> = {
    'common': '通用',
    'variant': '变体',
    'custom': '定制'
  }
  return map[type || ''] || type
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

onMounted(() => loadData())
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
.interfaces-card,
.requirements-card,
.modules-card {
  margin-bottom: 20px;
}

.interface-detail {
  padding: 10px;
  
  p {
    margin: 8px 0;
  }
}
</style>

