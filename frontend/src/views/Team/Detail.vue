<template>
  <div class="team-detail-container">
    <div class="page-header">
      <el-button icon="ArrowLeft" @click="handleBack">返回</el-button>
      <div class="header-actions">
        <el-button icon="Edit" @click="handleEdit">编辑</el-button>
        <el-button icon="Setting" @click="goToModuleConfig">模块配置</el-button>
      </div>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="team-title">
                <el-avatar :size="60" :style="{ background: getTeamColor(team.id) }">
                  {{ team.name?.substring(0, 1) }}
                </el-avatar>
                <div class="title-text">
                  <h2>{{ team.name }}</h2>
                  <span class="team-code">{{ team.code }}</span>
                </div>
              </div>
            </div>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="团队ID">{{ team.id }}</el-descriptions-item>
            <el-descriptions-item label="团队代码">{{ team.code }}</el-descriptions-item>
            <el-descriptions-item label="团队负责人">{{ team.owner }}</el-descriptions-item>
            <el-descriptions-item label="成员数量">{{ team.members?.length || 0 }}人</el-descriptions-item>
            <el-descriptions-item label="负责模块">{{ team.responsibleModules?.length || 0 }}个</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ formatDate(team.createdAt) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="members-card">
          <template #header>
            <div class="card-header">
              <span>团队成员 ({{ team.members?.length || 0 }})</span>
              <el-button type="primary" icon="Plus" size="small" @click="handleAddMember">
                添加成员
              </el-button>
            </div>
          </template>

          <div class="members-grid">
            <div v-for="member in team.members" :key="member" class="member-card">
              <el-avatar>{{ member.substring(0, 1) }}</el-avatar>
              <div class="member-info">
                <div class="member-name">{{ member }}</div>
                <div class="member-role">开发工程师</div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="work-items-card">
          <template #header>
            <div class="card-header">
              <span>当前工作项 ({{ team.workItems?.length || 0 }})</span>
              <el-button link type="primary" @click="goToWorkItems">
                查看全部
              </el-button>
            </div>
          </template>

          <el-table :data="team.workItems" border>
            <el-table-column prop="id" label="ID" width="120">
              <template #default="{ row }">
                <el-link type="primary" @click="goToWorkItem(row.id)">
                  {{ row.id }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
            <el-table-column label="类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getTypeTagType(row.type)" size="small">
                  {{ getTypeLabel(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" width="120">
              <template #default="{ row }">
                <el-progress :percentage="Math.round((row.progress || 0) * 100)" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>团队产能</span>
          </template>

          <div class="capacity-item">
            <div class="capacity-label">Sprint产能</div>
            <div class="capacity-value">{{ team.capacity?.sprintCapacity || 0 }} SP</div>
          </div>
          <div class="capacity-item">
            <div class="capacity-label">历史速率</div>
            <div class="capacity-value">{{ team.capacity?.velocity || 0 }} SP</div>
          </div>
          <div class="capacity-item">
            <div class="capacity-label">利用率</div>
            <div class="capacity-value">
              <el-progress
                :percentage="Math.round((team.capacity?.utilizationRate || 0) * 100)"
                :color="getUtilizationColor(team.capacity?.utilizationRate || 0)"
              />
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <span>团队指标</span>
          </template>

          <div class="metric-item">
            <div class="metric-label">平均速率</div>
            <div class="metric-value">{{ team.metrics?.avgVelocity || 0 }} SP</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">完成率</div>
            <div class="metric-value">
              {{ Math.round((team.metrics?.completionRate || 0) * 100) }}%
            </div>
          </div>
          <div class="metric-item">
            <div class="metric-label">缺陷率</div>
            <div class="metric-value">
              {{ Math.round((team.metrics?.defectRate || 0) * 100) }}%
            </div>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <span>负责的模块</span>
          </template>

          <div v-if="!team.moduleDetails || team.moduleDetails.length === 0" class="empty-state">
            <el-empty description="暂未配置负责模块" :image-size="60">
              <el-button type="primary" @click="goToModuleConfig">配置模块</el-button>
            </el-empty>
          </div>

          <div v-else class="module-list">
            <div v-for="module in team.moduleDetails" :key="module.id" class="module-item">
              <el-link type="primary" @click="goToModule(module.id)">
                {{ module.name }}
              </el-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const team = ref<any>({})

const fetchTeamDetail = async () => {
  loading.value = true
  try {
    const teamId = route.params.id as string
    const response = await fetch('/biz-data/mock/teams.json')
    const data = await response.json()
    const teamData = data.data.find((t: any) => t.id === teamId)
    
    if (teamData) {
      team.value = teamData
    } else {
      ElMessage.error('团队不存在')
      router.back()
    }
  } catch (error) {
    ElMessage.error('获取团队详情失败')
  } finally {
    loading.value = false
  }
}

const getTeamColor = (id: string) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const index = parseInt(id?.split('-')[1] || '0', 10) % colors.length
  return colors[index]
}

const getUtilizationColor = (rate: number) => {
  if (rate < 0.5) return '#67C23A'
  if (rate < 0.8) return '#E6A23C'
  return '#F56C6C'
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    module_requirement: '模块需求',
    bugfix: 'Bugfix',
    tech_debt: '技术债',
    non_functional: '非功能需求',
  }
  return map[type] || type
}

const getTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    module_requirement: 'primary',
    bugfix: 'danger',
    tech_debt: 'warning',
    non_functional: 'info',
  }
  return map[type] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    todo: 'info',
    in_progress: 'warning',
    in_review: 'primary',
    done: 'success',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    todo: '待办',
    in_progress: '进行中',
    in_review: '评审中',
    done: '已完成',
  }
  return map[status] || status
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString('zh-CN') : '-'
}

const handleBack = () => router.back()
const handleEdit = () => ElMessage.info('编辑团队功能开发中')
const handleAddMember = () => ElMessage.info('添加成员功能开发中')
const goToModuleConfig = () => router.push(`/teams/${team.value.id}/modules`)
const goToWorkItems = () => router.push(`/work-items?teamId=${team.value.id}`)
const goToWorkItem = (id: string) => router.push(`/work-items/${id}`)
const goToModule = (id: string) => router.push(`/assets/modules/${id}`)

onMounted(() => {
  fetchTeamDetail()
})
</script>

<style scoped lang="scss">
.team-detail-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .team-title {
    display: flex;
    align-items: center;
    gap: 16px;

    .title-text {
      h2 {
        margin: 0 0 4px 0;
      }

      .team-code {
        font-size: 14px;
        color: #909399;
      }
    }
  }
}

.members-card,
.work-items-card {
  margin-top: 20px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;

  .member-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid #EBEEF5;
    border-radius: 4px;

    .member-info {
      .member-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
      }

      .member-role {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}

.capacity-item,
.metric-item {
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }

  .capacity-label,
  .metric-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .capacity-value,
  .metric-value {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.module-list {
  .module-item {
    padding: 8px 0;
    border-bottom: 1px solid #EBEEF5;

    &:last-child {
      border-bottom: none;
    }
  }
}

.empty-state {
  text-align: center;
  padding: 20px;
}
</style>


