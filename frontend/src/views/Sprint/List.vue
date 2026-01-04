<template>
  <div class="sprint-list page-container">
    <div class="page-header">
      <h1>Sprint管理</h1>
      <p class="description">管理和跟踪所有Sprint迭代</p>
    </div>

    <div class="filter-bar">
      <el-select v-model="projectFilter" placeholder="选择项目" style="width: 250px">
        <el-option label="NOA v3.1 2025年度项目" value="PROJ001" />
        <el-option label="IVI v5.0 2025年度项目" value="PROJ002" />
      </el-select>
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px">
        <el-option label="规划中" value="planning" />
        <el-option label="进行中" value="active" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="handleCreate">创建Sprint</el-button>
    </div>

    <el-row :gutter="24">
      <el-col v-for="sprint in sprints" :key="sprint.id" :span="8">
        <el-card class="sprint-card" shadow="hover" @click="viewSprint(sprint.id)">
          <template #header>
            <div class="card-header">
              <div>
                <span class="sprint-code">{{ sprint.code }}</span>
                <h3>{{ sprint.name }}</h3>
              </div>
              <el-tag :type="getStatusType(sprint.status)">
                {{ getStatusText(sprint.status) }}
              </el-tag>
            </div>
          </template>

          <div class="sprint-content">
            <div class="sprint-info">
              <div class="info-item">
                <el-icon><Calendar /></el-icon>
                <span>{{ sprint.startDate }} ~ {{ sprint.endDate }}</span>
              </div>

              <div class="info-item">
                <el-icon><TrendCharts /></el-icon>
                <span>{{ sprint.completedPoints }} / {{ sprint.totalPoints }} SP</span>
              </div>

              <div class="info-item">
                <el-icon><Document /></el-icon>
                <span>{{ sprint.completedStories }} / {{ sprint.totalStories }} Stories</span>
              </div>
            </div>

            <div class="sprint-progress">
              <div class="progress-header">
                <span>完成度</span>
                <span class="progress-value">{{ sprint.progress }}%</span>
              </div>
              <el-progress
                :percentage="sprint.progress"
                :color="getProgressColor(sprint.progress)"
                :stroke-width="10"
              />
            </div>
          </div>

          <template #footer>
            <div class="card-actions">
              <el-button text @click.stop="viewBoard(sprint.id)">
                <el-icon><DataBoard /></el-icon> Sprint看板
              </el-button>
              <el-button text @click.stop="viewBacklog(sprint.id)">
                <el-icon><List /></el-icon> Backlog
              </el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="sprints.length === 0" description="暂无Sprint" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const projectFilter = ref('PROJ001')
const statusFilter = ref('')

// 模拟Sprint数据
const sprints = ref([
  {
    id: 'SPRINT001',
    code: 'Sprint 1',
    name: 'NOA v3.1 - Sprint 1',
    status: 'completed',
    startDate: '2025-01-06',
    endDate: '2025-01-19',
    totalPoints: 30,
    completedPoints: 30,
    totalStories: 8,
    completedStories: 8,
    progress: 100,
  },
  {
    id: 'SPRINT002',
    code: 'Sprint 2',
    name: 'NOA v3.1 - Sprint 2',
    status: 'completed',
    startDate: '2025-01-20',
    endDate: '2025-02-02',
    totalPoints: 32,
    completedPoints: 32,
    totalStories: 8,
    completedStories: 8,
    progress: 100,
  },
  {
    id: 'SPRINT003',
    code: 'Sprint 3',
    name: 'NOA v3.1 - Sprint 3',
    status: 'active',
    startDate: '2025-02-03',
    endDate: '2025-02-16',
    totalPoints: 32,
    completedPoints: 15,
    totalStories: 9,
    completedStories: 4,
    progress: 47,
  },
])

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

function viewSprint(id: string) {
  router.push(`/sprints/${id}`)
}

function viewBoard(id: string) {
  router.push(`/sprints/${id}/board`)
}

function viewBacklog(id: string) {
  router.push(`/sprints/${id}/backlog`)
}

function handleCreate() {
  ElMessage.info('创建Sprint功能开发中...')
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.sprint-list {
  .filter-bar {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    align-items: center;
  }

  .sprint-card {
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

      .sprint-code {
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

    .sprint-content {
      .sprint-info {
        margin-bottom: $spacing-md;

        .info-item {
          display: flex;
          align-items: center;
          gap: $spacing-xs;
          margin-bottom: $spacing-sm;
          font-size: 14px;
          color: $text-secondary;
        }
      }

      .sprint-progress {
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: $spacing-xs;
          font-size: 14px;

          .progress-value {
            font-weight: 600;
            color: $primary;
          }
        }
      }
    }

    .card-actions {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

