<template>
  <div class="environments-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>环境管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建环境
          </el-button>
        </div>
      </template>

      <el-table :data="environments" border v-loading="loading">
        <el-table-column prop="name" label="环境名称" width="150" />
        <el-table-column prop="type" label="环境类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'running' ? 'success' : 'info'">
              {{ row.status === 'running' ? '运行中' : '已停止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="currentVersion" label="当前版本" width="120" />
        <el-table-column prop="url" label="访问地址" min-width="200">
          <template #default="{ row }">
            <el-link :href="row.url" target="_blank" type="primary">
              {{ row.url }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="lastDeployTime" label="最后部署时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.lastDeployTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="deploy(row)">部署</el-button>
            <el-button link type="warning" @click="restart(row)">重启</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const environments = ref<any[]>([])

const fetchEnvironments = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/devops/environments.json')
    const data = await response.json()
    environments.value = data.data
  } catch (error) {
    ElMessage.error('获取环境列表失败')
  } finally {
    loading.value = false
  }
}

const getTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    dev: 'info',
    test: 'warning',
    staging: 'primary',
    production: 'success',
  }
  return map[type] || 'info'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    dev: '开发',
    test: '测试',
    staging: '预发布',
    production: '生产',
  }
  return map[type] || type
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const handleCreate = () => ElMessage.info('新建环境功能开发中')
const viewDetail = (row: any) => ElMessage.info(`查看环境: ${row.name}`)
const deploy = (row: any) => ElMessage.info(`部署到环境: ${row.name}`)
const restart = (row: any) => ElMessage.info(`重启环境: ${row.name}`)

onMounted(() => {
  fetchEnvironments()
})
</script>

<style scoped lang="scss">
.environments-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

