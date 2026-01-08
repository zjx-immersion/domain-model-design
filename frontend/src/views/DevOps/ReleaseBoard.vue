<template>
  <div class="release-board-container">
    <el-card>
      <template #header>
        <span>发布看板</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="6" v-for="env in environments" :key="env.type">
          <el-card class="env-card" :body-style="{ padding: '15px' }">
            <template #header>
              <div class="env-header">
                <el-tag :type="getEnvTypeTagType(env.type)">
                  {{ env.name }}
                </el-tag>
                <el-tag :type="env.status === 'running' ? 'success' : 'info'" size="small">
                  {{ env.status === 'running' ? '运行中' : '已停止' }}
                </el-tag>
              </div>
            </template>

            <div class="env-info">
              <div class="info-item">
                <span class="label">当前版本:</span>
                <span class="value">{{ env.currentVersion }}</span>
              </div>
              <div class="info-item">
                <span class="label">发布时间:</span>
                <span class="value">{{ formatDate(env.lastDeployTime) }}</span>
              </div>
            </div>

            <el-button type="primary" size="small" @click="deploy(env)" style="width: 100%; margin-top: 10px">
              部署
            </el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <div class="release-timeline">
        <h3>发布时间线</h3>
        <el-timeline>
          <el-timeline-item
            v-for="release in recentReleases"
            :key="release.id"
            :timestamp="formatDateTime(release.releaseTime)"
            placement="top"
            :type="getTimelineType(release.status)"
          >
            <el-card>
              <h4>{{ release.version }} - {{ release.name }}</h4>
              <p>环境: {{ release.environment }}</p>
              <p>状态: <el-tag :type="getStatusType(release.status)" size="small">
                {{ getStatusLabel(release.status) }}
              </el-tag></p>
              <p>发布人: {{ release.releaseBy }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const environments = ref<any[]>([])
const recentReleases = ref<any[]>([])

const fetchData = async () => {
  try {
    const [envRes, releaseRes] = await Promise.all([
      fetch('/biz-data/mock/devops/environments.json'),
      fetch('/biz-data/mock/devops/releases.json'),
    ])
    
    const envData = await envRes.json()
    const releaseData = await releaseRes.json()
    
    environments.value = envData.data
    recentReleases.value = releaseData.data.slice(0, 5)
  } catch (error) {
    ElMessage.error('获取数据失败')
  }
}

const getEnvTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    dev: 'info',
    test: 'warning',
    staging: 'primary',
    production: 'success',
  }
  return map[type] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    in_progress: 'warning',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    in_progress: '进行中',
  }
  return map[status] || status
}

const getTimelineType = (status: string) => {
  const map: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    in_progress: 'warning',
  }
  return map[status] || 'primary'
}

const formatDate = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleDateString('zh-CN') : '-'
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const deploy = (env: any) => {
  ElMessage.info(`部署到${env.name}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="scss">
.release-board-container {
  padding: 20px;
}

.env-card {
  margin-bottom: 20px;

  .env-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .env-info {
    .info-item {
      margin-bottom: 8px;
      font-size: 14px;

      .label {
        color: #909399;
      }

      .value {
        margin-left: 8px;
        font-weight: 500;
      }
    }
  }
}

.release-timeline {
  margin-top: 30px;

  h3 {
    margin-bottom: 20px;
  }
}
</style>

