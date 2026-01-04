<template>
  <div class="project-board page-container">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/projects' }">项目管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/projects/${route.params.id}` }">
            {{ project?.name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>项目看板</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{ project?.name }} - 项目看板</h1>
      </div>
      <div class="header-actions">
        <el-button icon="Back" @click="router.back()">返回</el-button>
        <el-button icon="Refresh" @click="refreshBoard">刷新</el-button>
      </div>
    </div>

    <!-- 项目概览统计 -->
    <div class="project-stats">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="28" color="#1890ff"><Calendar /></el-icon>
          <div>
            <div class="stat-value">{{ project?.piCount }}</div>
            <div class="stat-label">PI Planning</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="28" color="#52c41a"><User /></el-icon>
          <div>
            <div class="stat-value">{{ project?.memberCount }}</div>
            <div class="stat-label">团队成员</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="28" color="#faad14"><Flag /></el-icon>
          <div>
            <div class="stat-value">{{ project?.milestoneCount }}</div>
            <div class="stat-label">里程碑</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="28" color="#722ed1"><TrendCharts /></el-icon>
          <div>
            <div class="stat-value">{{ project?.progress }}%</div>
            <div class="stat-label">整体进度</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- PI Planning列表 -->
    <el-card header="PI Planning进度">
      <div v-if="piPlannings.length > 0" class="pi-list">
        <div v-for="pi in piPlannings" :key="pi.id" class="pi-card" @click="viewPI(pi.id)">
          <div class="pi-header">
            <div>
              <span class="pi-code">{{ pi.code }}</span>
              <h3>{{ pi.name }}</h3>
            </div>
            <el-tag :type="getStatusType(pi.status)">
              {{ getStatusText(pi.status) }}
            </el-tag>
          </div>

          <div class="pi-info">
            <div class="info-item">
              <span class="label">时间:</span>
              <span>{{ pi.startDate }} ~ {{ pi.endDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">团队:</span>
              <span>{{ pi.teamCount }}个</span>
            </div>
            <div class="info-item">
              <span class="label">目标:</span>
              <span>{{ pi.objectiveCount }}个</span>
            </div>
            <div class="info-item">
              <span class="label">Story:</span>
              <span>{{ pi.storyCount }}个 ({{ pi.completedPoints }}/{{ pi.totalPoints }} SP)</span>
            </div>
          </div>

          <div class="pi-progress">
            <div class="progress-header">
              <span>进度</span>
              <span class="progress-value">{{ pi.progress }}%</span>
            </div>
            <el-progress
              :percentage="pi.progress"
              :color="getProgressColor(pi.progress)"
              :stroke-width="8"
            />
          </div>

          <div class="pi-confidence">
            <span class="label">置信度:</span>
            <el-rate v-model="pi.confidence" disabled :max="10" show-score score-template="{value}分" />
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无PI Planning" />
    </el-card>

    <!-- 项目里程碑时间线 -->
    <el-card header="项目里程碑" style="margin-top: 16px">
      <el-timeline>
        <el-timeline-item
          v-for="milestone in milestones"
          :key="milestone.id"
          :timestamp="milestone.date"
          :type="getMilestoneType(milestone.status)"
          :hollow="milestone.status !== 'completed'"
        >
          <el-card>
            <template #header>
              <div class="milestone-header">
                <span>{{ milestone.name }}</span>
                <el-tag :type="getMilestoneTagType(milestone.status)" size="small">
                  {{ getMilestoneStatusText(milestone.status) }}
                </el-tag>
              </div>
            </template>
            <p>{{ milestone.description }}</p>
            <div v-if="milestone.deliverables" class="deliverables">
              <strong>交付物:</strong>
              <ul>
                <li v-for="(item, idx) in milestone.deliverables" :key="idx">{{ item }}</li>
              </ul>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import projectsData from '@/data/projects/projects.json'
import piPlanningsData from '@/data/projects/pi-plannings.json'
import type { Project, PIPlanning } from '@/types/project'

const router = useRouter()
const route = useRoute()

const project = ref<Project | null>(null)
const piPlannings = ref<PIPlanning[]>([])

// 模拟里程碑数据
const milestones = ref([
  {
    id: 'M001',
    name: 'PI-2025-Q1启动',
    date: '2025-01-06',
    status: 'completed',
    description: 'PI Planning会议完成，各团队明确目标',
    deliverables: ['PI Planning报告', '团队Backlog', '风险和依赖清单'],
  },
  {
    id: 'M002',
    name: '感知算法升级完成',
    date: '2025-02-15',
    status: 'completed',
    description: '核心感知算法升级到v3.0',
    deliverables: ['算法模型', '性能测试报告', '集成文档'],
  },
  {
    id: 'M003',
    name: '融合框架重构完成',
    date: '2025-03-28',
    status: 'in_progress',
    description: '多传感器融合框架重构',
    deliverables: ['新框架代码', '接口文档', '单元测试'],
  },
  {
    id: 'M004',
    name: 'PI-2025-Q1验收',
    date: '2025-03-30',
    status: 'upcoming',
    description: 'Q1 PI完成，进行成果验收',
    deliverables: ['功能演示', 'PI报告', 'Retrospective'],
  },
  {
    id: 'M005',
    name: 'NOA v3.1 Alpha版本',
    date: '2025-04-30',
    status: 'upcoming',
    description: 'Alpha版本发布，开始内部测试',
    deliverables: ['Alpha版本', '测试计划', '已知问题列表'],
  },
])

onMounted(() => {
  const projectId = route.params.id as string
  const proj = projectsData.find(p => p.id === projectId)
  if (proj) {
    project.value = proj as Project
    piPlannings.value = piPlanningsData.filter(
      pi => pi.projectId === projectId
    ) as PIPlanning[]
  }
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

function getMilestoneType(status: string) {
  const typeMap: Record<string, any> = {
    completed: 'success',
    in_progress: 'primary',
    upcoming: 'info',
    missed: 'danger',
  }
  return typeMap[status] || 'info'
}

function getMilestoneTagType(status: string) {
  const typeMap: Record<string, any> = {
    completed: 'success',
    in_progress: 'primary',
    upcoming: 'info',
    missed: 'danger',
  }
  return typeMap[status] || 'info'
}

function getMilestoneStatusText(status: string) {
  const textMap: Record<string, string> = {
    completed: '已完成',
    in_progress: '进行中',
    upcoming: '即将到来',
    missed: '已逾期',
  }
  return textMap[status] || status
}

function viewPI(piId: string) {
  router.push(`/pi-planning/${piId}`)
}

function refreshBoard() {
  ElMessage.success('看板已刷新')
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.project-board {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-lg;

    .header-left {
      flex: 1;

      h1 {
        margin: $spacing-sm 0;
      }
    }

    .header-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .project-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;
    margin-bottom: $spacing-lg;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: $spacing-md;

        .stat-value {
          font-size: 28px;
          font-weight: 600;
        }

        .stat-label {
          font-size: 14px;
          color: $text-secondary;
        }
      }
    }
  }

  .pi-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;

    .pi-card {
      padding: $spacing-lg;
      background: $bg-secondary;
      border-radius: $radius-md;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        background: $bg-hover;
        box-shadow: $shadow-sm;
      }

      .pi-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: $spacing-md;

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
        margin-bottom: $spacing-md;

        .info-item {
          display: flex;
          margin-bottom: $spacing-xs;
          font-size: 14px;

          .label {
            color: $text-secondary;
            min-width: 60px;
          }
        }
      }

      .pi-progress {
        margin-bottom: $spacing-md;

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

      .pi-confidence {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        font-size: 14px;

        .label {
          color: $text-secondary;
        }
      }
    }
  }

  .milestone-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .deliverables {
    margin-top: $spacing-md;
    padding-top: $spacing-md;
    border-top: 1px solid $border-light;

    ul {
      margin: $spacing-xs 0 0 0;
      padding-left: 20px;

      li {
        margin: 4px 0;
      }
    }
  }
}
</style>

