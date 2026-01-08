<template>
  <div class="pipeline-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>流水线管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建流水线
          </el-button>
        </div>
      </template>

      <el-table :data="pipelines" border v-loading="loading">
        <el-table-column prop="name" label="流水线名称" min-width="200" />
        <el-table-column prop="module" label="关联模块" width="150">
          <template #default="{ row }">
            <el-link type="primary" @click="goToModule(row.moduleId)">
              {{ row.module }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="最近执行" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.lastStatus)">
              {{ getStatusLabel(row.lastStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="executions" label="执行次数" width="100" align="center" />
        <el-table-column prop="successRate" label="成功率" width="100" align="center">
          <template #default="{ row }">
            {{ Math.round(row.successRate * 100) }}%
          </template>
        </el-table-column>
        <el-table-column prop="lastRunTime" label="最后执行时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.lastRunTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="runPipeline(row)">执行</el-button>
            <el-button link @click="editPipeline(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const pipelines = ref<any[]>([])

const fetchPipelines = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/devops/pipeline.json')
    const data = await response.json()
    pipelines.value = data.data
  } catch (error) {
    ElMessage.error('获取流水线列表失败')
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    running: 'warning',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '进行中',
  }
  return map[status] || status
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const handleCreate = () => ElMessage.info('新建流水线功能开发中')
const viewDetail = (row: any) => ElMessage.info(`查看流水线: ${row.name}`)
const runPipeline = (row: any) => ElMessage.info(`执行流水线: ${row.name}`)
const editPipeline = (row: any) => ElMessage.info(`编辑流水线: ${row.name}`)
const goToModule = (moduleId: string) => router.push(`/assets/modules/${moduleId}`)

onMounted(() => {
  fetchPipelines()
})
</script>

<style scoped lang="scss">
.pipeline-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

