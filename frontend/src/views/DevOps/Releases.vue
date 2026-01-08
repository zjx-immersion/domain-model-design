<template>
  <div class="releases-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>发布管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建发布
          </el-button>
        </div>
      </template>

      <el-table :data="releases" border v-loading="loading">
        <el-table-column prop="version" label="版本号" width="120" />
        <el-table-column prop="name" label="发布名称" min-width="200" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联构建" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="goToBuild(row.buildId)">
              #{{ row.buildId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="关联模块需求" width="150">
          <template #default="{ row }">
            <div v-for="req in row.requirements" :key="req" style="margin: 2px 0">
              <el-link type="primary" size="small" @click="goToRequirement(req)">
                {{ req }}
              </el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="releaseTime" label="发布时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.releaseTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="releaseBy" label="发布人" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="viewTraceability(row)">追溯</el-button>
            <el-button link type="danger" @click="rollback(row)">回滚</el-button>
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
const releases = ref<any[]>([])

const fetchReleases = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/devops/releases.json')
    const data = await response.json()
    releases.value = data.data
  } catch (error) {
    ElMessage.error('获取发布列表失败')
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    in_progress: 'warning',
    rolled_back: 'info',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    in_progress: '进行中',
    rolled_back: '已回滚',
  }
  return map[status] || status
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const handleCreate = () => ElMessage.info('新建发布功能开发中')
const viewDetail = (row: any) => ElMessage.info(`查看发布详情: ${row.version}`)
const viewTraceability = (row: any) => {
  router.push(`/requirements/traceability?releaseId=${row.id}`)
}
const rollback = (row: any) => ElMessage.info(`回滚版本: ${row.version}`)
const goToBuild = (buildId: string) => ElMessage.info(`跳转到构建: ${buildId}`)
const goToRequirement = (reqId: string) => {
  router.push(`/requirements/module-detail/${reqId}`)
}

onMounted(() => {
  fetchReleases()
})
</script>

<style scoped lang="scss">
.releases-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

