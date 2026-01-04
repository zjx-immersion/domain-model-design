<template>
  <div class="pi-planning-list page-container">
    <div class="page-header">
      <h1>PI Planning</h1>
      <p class="description">Program Increment Planning - 多项目协同规划</p>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="searchKey"
        placeholder="搜索PI名称或编号"
        prefix-icon="Search"
        style="width: 300px"
        clearable
      />
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px">
        <el-option label="规划中" value="planning" />
        <el-option label="进行中" value="active" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="handleCreate">创建PI Planning</el-button>
    </div>

    <el-row :gutter="24">
      <el-col v-for="pi in filteredPIList" :key="pi.id" :span="12">
        <el-card class="pi-card" shadow="hover" @click="goToWorkspace(pi.id)">
          <template #header>
            <div class="card-header">
              <div>
                <span class="pi-code">{{ pi.code }}</span>
                <h3>{{ pi.name }}</h3>
              </div>
              <el-tag :type="getStatusType(pi.status)">
                {{ getStatusText(pi.status) }}
              </el-tag>
            </div>
          </template>

          <div class="pi-info">
            <div class="info-row">
              <el-icon><Calendar /></el-icon>
              <span>{{ pi.startDate }} ~ {{ pi.endDate }}</span>
              <el-tag size="small">{{ pi.duration }}周</el-tag>
            </div>

            <div class="info-row">
              <el-icon><User /></el-icon>
              <span>{{ pi.teamCount }}个团队</span>
              <el-divider direction="vertical" />
              <span>{{ pi.objectiveCount }}个目标</span>
              <el-divider direction="vertical" />
              <span>{{ pi.storyCount }}个Story</span>
            </div>

            <div class="progress-section">
              <div class="progress-header">
                <span>进度: {{ pi.completedPoints }} / {{ pi.totalPoints }} SP</span>
                <span class="progress-percent">{{ pi.progress }}%</span>
              </div>
              <el-progress
                :percentage="pi.progress"
                :color="getProgressColor(pi.progress)"
                :stroke-width="10"
              />
            </div>

            <div class="confidence-section">
              <span class="label">置信度:</span>
              <el-rate
                v-model="pi.confidence"
                disabled
                show-score
                :max="10"
                score-template="{value}分"
              />
            </div>

            <div class="metrics">
              <div class="metric-item">
                <el-icon color="#f5222d"><WarningFilled /></el-icon>
                <span>{{ pi.risks?.length || 0 }}个风险</span>
              </div>
              <div class="metric-item">
                <el-icon color="#faad14"><Link /></el-icon>
                <span>{{ pi.dependencies?.length || 0 }}个依赖</span>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="card-actions">
              <el-button text @click.stop="goToWorkspace(pi.id)">
                <el-icon><Edit /></el-icon> 进入工作区
              </el-button>
              <el-button text @click.stop="goToBoard(pi.id)">
                <el-icon><DataBoard /></el-icon> PI看板
              </el-button>
              <el-dropdown @command="(cmd) => handleCommand(cmd, pi)">
                <el-button text icon="More" circle @click.stop />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="report">生成报告</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="filteredPIList.length === 0" description="暂无PI Planning" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import piData from '@/data/projects/pi-plannings.json'
import type { PIPlanning } from '@/types/project'

const router = useRouter()

const searchKey = ref('')
const statusFilter = ref('')
const piList = ref<PIPlanning[]>(piData as PIPlanning[])

const filteredPIList = computed(() => {
  return piList.value.filter(pi => {
    const matchSearch = !searchKey.value || 
      pi.name.includes(searchKey.value) || 
      pi.code.includes(searchKey.value)
    const matchStatus = !statusFilter.value || pi.status === statusFilter.value
    return matchSearch && matchStatus
  })
})

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    active: 'primary',
    completed: 'success',
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    active: '进行中',
    completed: '已完成',
  }
  return textMap[status] || status
}

function getProgressColor(progress: number) {
  if (progress < 30) return '#f5222d'
  if (progress < 70) return '#faad14'
  return '#52c41a'
}

function goToWorkspace(id: string) {
  router.push(`/pi-planning/${id}`)
}

function goToBoard(id: string) {
  router.push(`/pi-planning/${id}/board`)
}

function handleCreate() {
  ElMessage.info('创建PI Planning功能开发中...')
}

function handleCommand(command: string, pi: PIPlanning) {
  if (command === 'edit') {
    ElMessage.info(`编辑PI: ${pi.name}`)
  } else if (command === 'report') {
    ElMessage.info(`生成报告: ${pi.name}`)
  } else if (command === 'delete') {
    ElMessageBox.confirm(`确定删除 ${pi.name} 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      ElMessage.success('删除成功')
    })
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.pi-planning-list {
  .filter-bar {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    align-items: center;
  }

  .pi-card {
    margin-bottom: $spacing-lg;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      transform: translateY(-4px);
      box-shadow: $shadow-md;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .pi-code {
        font-size: 12px;
        color: $text-secondary;
        display: block;
        margin-bottom: 4px;
      }

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }

    .pi-info {
      .info-row {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-md;
        color: $text-secondary;
        font-size: 14px;
      }

      .progress-section {
        margin: $spacing-md 0;

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: $spacing-sm;
          font-size: 14px;

          .progress-percent {
            font-weight: 600;
            color: $primary;
          }
        }
      }

      .confidence-section {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin: $spacing-md 0;

        .label {
          font-size: 14px;
          color: $text-secondary;
        }
      }

      .metrics {
        display: flex;
        gap: $spacing-lg;
        padding-top: $spacing-md;
        border-top: 1px solid $border-light;

        .metric-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          font-size: 14px;
        }
      }
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

