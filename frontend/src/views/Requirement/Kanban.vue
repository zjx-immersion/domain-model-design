<template>
  <div class="kanban-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>需求看板</span>
          <el-radio-group v-model="viewLevel" @change="handleLevelChange">
            <el-radio-button label="user">用户需求</el-radio-button>
            <el-radio-button label="feature">特性需求</el-radio-button>
            <el-radio-button label="module">模块需求</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      
      <el-row :gutter="20" v-loading="loading">
        <el-col :span="6" v-for="status in statuses" :key="status.key">
          <div class="kanban-column">
            <div class="column-header">
              <span>{{ status.label }}</span>
              <el-badge :value="getColumnCount(status.key)" />
            </div>
            <div class="column-content">
              <div
                v-for="item in getColumnItems(status.key)"
                :key="item.id"
                class="kanban-card"
                @click="handleCardClick(item)"
              >
                <div class="card-title">{{ item.title }}</div>
                <div class="card-meta">
                  <el-tag size="small" :type="getPriorityType(item.priority)">{{ item.priority }}</el-tag>
                  <span class="card-owner">{{ item.owner }}</span>
                </div>
                <div class="card-progress">
                  <el-progress :percentage="Math.round((item.progress || 0) * 100)" :show-text="false" />
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { UserRequirement, FeatureRequirement, ModuleRequirement } from '@/types/requirement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const viewLevel = ref('user')
const allData = ref<{
  user: UserRequirement[]
  feature: FeatureRequirement[]
  module: ModuleRequirement[]
}>({
  user: [],
  feature: [],
  module: []
})

const statuses = [
  { key: 'planned', label: '已规划' },
  { key: 'in_development', label: '开发中' },
  { key: 'in_review', label: '评审中' },
  { key: 'completed', label: '已完成' }
]

const loadData = async () => {
  loading.value = true
  try {
    const [urRes, frRes, mrRes] = await Promise.all([
      fetch('/biz-data/mock/requirement/user-requirements.json'),
      fetch('/biz-data/mock/requirement/feature-requirements.json'),
      fetch('/biz-data/mock/requirement/module-requirements.json')
    ])
    
    allData.value = {
      user: (await urRes.json()).data,
      feature: (await frRes.json()).data,
      module: (await mrRes.json()).data
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const currentData = computed(() => allData.value[viewLevel.value as keyof typeof allData.value])

const getColumnItems = (status: string) => {
  return currentData.value.filter(item => item.status === status)
}

const getColumnCount = (status: string) => {
  return getColumnItems(status).length
}

const handleLevelChange = () => {
  ElMessage.info(`切换到${viewLevel.value}视图`)
}

const handleCardClick = (item: any) => {
  const routeMap: Record<string, string> = {
    user: 'UserRequirementDetail',
    feature: 'FeatureRequirementDetail',
    module: 'ModuleRequirementDetail'
  }
  router.push({ name: routeMap[viewLevel.value], params: { id: item.id } })
}

const getPriorityType = (priority: string) => ({
  P0: 'danger',
  P1: 'warning',
  P2: 'info'
}[priority] || 'info')

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.kanban-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kanban-column {
  background: #f5f7fa;
  border-radius: 4px;
  padding: 10px;
  min-height: 600px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  font-weight: bold;
  border-bottom: 2px solid #dcdfe6;
  margin-bottom: 10px;
}

.column-content {
  .kanban-card {
    background: white;
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }
    
    .card-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      font-size: 12px;
      color: #909399;
    }
    
    .card-progress {
      margin-top: 8px;
    }
  }
}
</style>

