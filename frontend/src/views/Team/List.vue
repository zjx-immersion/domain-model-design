<template>
  <div class="team-list-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>团队管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建团队
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="filters">
        <el-form-item label="搜索">
          <el-input v-model="filters.search" placeholder="团队名称或代码" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="20" v-loading="loading">
        <el-col :span="8" v-for="team in teams" :key="team.id">
          <el-card class="team-card" shadow="hover" @click="goToDetail(team.id)">
            <div class="team-header">
              <el-avatar :size="50" :style="{ background: getTeamColor(team.id) }">
                {{ team.name.substring(0, 1) }}
              </el-avatar>
              <div class="team-info">
                <div class="team-name">{{ team.name }}</div>
                <div class="team-code">{{ team.code }}</div>
              </div>
            </div>

            <el-divider />

            <div class="team-stats">
              <div class="stat-item">
                <el-icon><User /></el-icon>
                <span>{{ team.members?.length || 0 }}人</span>
              </div>
              <div class="stat-item">
                <el-icon><Files /></el-icon>
                <span>{{ team.responsibleModules?.length || 0 }}模块</span>
              </div>
              <div class="stat-item">
                <el-icon><Document /></el-icon>
                <span>{{ team.workItems?.length || 0 }}工作项</span>
              </div>
            </div>

            <el-divider />

            <div class="team-capacity">
              <div class="capacity-label">产能利用率</div>
              <el-progress
                :percentage="Math.round((team.capacity?.utilizationRate || 0) * 100)"
                :color="getUtilizationColor(team.capacity?.utilizationRate || 0)"
              />
            </div>

            <div class="team-actions">
              <el-button link type="primary" @click.stop="goToDetail(team.id)">
                详情
              </el-button>
              <el-button link type="primary" @click.stop="goToModuleConfig(team.id)">
                模块配置
              </el-button>
              <el-button link @click.stop="handleEdit(team.id)">
                编辑
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)

const filters = ref({
  search: '',
})

const teams = ref<any[]>([])

const fetchTeams = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/teams.json')
    const data = await response.json()
    teams.value = data.data
  } catch (error) {
    ElMessage.error('获取团队列表失败')
  } finally {
    loading.value = false
  }
}

const getTeamColor = (id: string) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  const index = parseInt(id.split('-')[1] || '0', 10) % colors.length
  return colors[index]
}

const getUtilizationColor = (rate: number) => {
  if (rate < 0.5) return '#67C23A'
  if (rate < 0.8) return '#E6A23C'
  return '#F56C6C'
}

const handleSearch = () => {
  fetchTeams()
}

const handleReset = () => {
  filters.value.search = ''
  fetchTeams()
}

const handleCreate = () => {
  ElMessage.info('创建团队功能开发中')
}

const handleEdit = (id: string) => {
  ElMessage.info('编辑团队功能开发中')
}

const goToDetail = (id: string) => {
  router.push(`/teams/${id}`)
}

const goToModuleConfig = (id: string) => {
  router.push(`/teams/${id}/modules`)
}

onMounted(() => {
  fetchTeams()
})
</script>

<style scoped lang="scss">
.team-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
  }

  .team-header {
    display: flex;
    align-items: center;
    gap: 16px;

    .team-info {
      flex: 1;

      .team-name {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }

      .team-code {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .team-stats {
    display: flex;
    justify-content: space-around;
    margin: 16px 0;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      color: #606266;
    }
  }

  .team-capacity {
    margin: 16px 0;

    .capacity-label {
      font-size: 14px;
      color: #606266;
      margin-bottom: 8px;
    }
  }

  .team-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 12px;
  }
}
</style>


