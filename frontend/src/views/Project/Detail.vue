<template>
  <div class="project-detail page-container">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/projects' }">项目管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ project?.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{ project?.name }}</h1>
        <div class="header-meta">
          <el-tag :type="getStatusType(project?.status)">
            {{ getStatusText(project?.status) }}
          </el-tag>
          <el-tag :type="getHealthType(project?.health)">
            {{ getHealthText(project?.health) }}
          </el-tag>
          <span class="meta-text">{{ project?.ownerName }}</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button icon="Back" @click="router.back()">返回</el-button>
        <el-button icon="DataBoard" @click="viewBoard">项目看板</el-button>
        <el-button type="primary" icon="Edit">编辑项目</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <!-- 项目概览 -->
      <el-tab-pane label="项目概览" name="overview">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-card header="项目信息">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="项目编号">{{ project?.code }}</el-descriptions-item>
                <el-descriptions-item label="项目类型">
                  {{ getProjectTypeText(project?.type) }}
                </el-descriptions-item>
                <el-descriptions-item label="关联产品">
                  <el-link type="primary">{{ project?.productName }}</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="项目经理">{{ project?.ownerName }}</el-descriptions-item>
                <el-descriptions-item label="开始日期">{{ project?.startDate }}</el-descriptions-item>
                <el-descriptions-item label="计划完成日期">{{ project?.plannedEndDate }}</el-descriptions-item>
                <el-descriptions-item label="实际完成日期">
                  {{ project?.actualEndDate || '进行中' }}
                </el-descriptions-item>
                <el-descriptions-item label="项目预算">
                  ¥{{ formatNumber(project?.budget) }}
                </el-descriptions-item>
                <el-descriptions-item label="团队数量">{{ project?.teamCount }}个</el-descriptions-item>
                <el-descriptions-item label="团队人数">{{ project?.memberCount }}人</el-descriptions-item>
                <el-descriptions-item label="PI数量">{{ project?.piCount }}个</el-descriptions-item>
                <el-descriptions-item label="里程碑">{{ project?.milestoneCount }}个</el-descriptions-item>
                <el-descriptions-item label="项目描述" :span="2">
                  {{ project?.description }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card header="项目进度" style="margin-top: 16px">
              <div class="progress-section">
                <div class="progress-stats">
                  <div class="progress-stat">
                    <span class="label">整体进度</span>
                    <span class="value">{{ project?.progress }}%</span>
                  </div>
                </div>
                <el-progress
                  :percentage="project?.progress"
                  :color="getProgressColor(project?.progress)"
                  :stroke-width="20"
                />
              </div>
            </el-card>

            <el-card header="PI Planning列表" style="margin-top: 16px">
              <div v-if="piPlannings.length > 0">
                <div v-for="pi in piPlannings" :key="pi.id" class="pi-item" @click="viewPI(pi.id)">
                  <div class="pi-header">
                    <h4>{{ pi.name }}</h4>
                    <el-tag :type="getStatusType(pi.status)">
                      {{ getStatusText(pi.status) }}
                    </el-tag>
                  </div>
                  <div class="pi-meta">
                    <span>{{ pi.startDate }} ~ {{ pi.endDate }}</span>
                    <span>{{ pi.teamCount }}个团队</span>
                    <span>{{ pi.objectiveCount }}个目标</span>
                  </div>
                  <el-progress
                    :percentage="pi.progress"
                    :color="getProgressColor(pi.progress)"
                    :stroke-width="6"
                  />
                </div>
              </div>
              <el-empty v-else description="暂无PI Planning" />
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card header="项目标签">
              <el-tag
                v-for="tag in project?.tags"
                :key="tag"
                style="margin: 4px"
                effect="plain"
              >
                {{ tag }}
              </el-tag>
            </el-card>

            <el-card header="关键指标" style="margin-top: 16px">
              <div class="metrics-list">
                <div class="metric-item">
                  <span class="metric-label">团队数量</span>
                  <span class="metric-value">{{ project?.teamCount }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">成员人数</span>
                  <span class="metric-value">{{ project?.memberCount }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">PI数量</span>
                  <span class="metric-value">{{ project?.piCount }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">里程碑</span>
                  <span class="metric-value">{{ project?.milestoneCount }}</span>
                </div>
              </div>
            </el-card>

            <el-card header="快捷操作" style="margin-top: 16px">
              <div class="quick-actions">
                <el-button @click="viewTeam" style="width: 100%">
                  <el-icon><User /></el-icon> 团队管理
                </el-button>
                <el-button @click="viewMilestones" style="width: 100%">
                  <el-icon><Flag /></el-icon> 里程碑
                </el-button>
                <el-button @click="viewIntegration" style="width: 100%">
                  <el-icon><Connection /></el-icon> 集成规划
                </el-button>
                <el-button @click="viewReport" style="width: 100%">
                  <el-icon><Document /></el-icon> 项目报告
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 团队成员 -->
      <el-tab-pane label="团队成员" name="team">
        <el-card>
          <el-empty description="团队管理功能开发中" />
        </el-card>
      </el-tab-pane>

      <!-- 里程碑 -->
      <el-tab-pane label="里程碑" name="milestones">
        <el-card>
          <el-empty description="里程碑管理功能开发中" />
        </el-card>
      </el-tab-pane>

      <!-- 项目动态 -->
      <el-tab-pane label="项目动态" name="timeline">
        <el-card>
          <el-timeline>
            <el-timeline-item timestamp="2025-01-03 10:30" placement="top">
              <el-card>
                <h4>项目启动</h4>
                <p>项目正式启动，完成初始化配置</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2025-01-02 14:00" placement="top">
              <el-card>
                <h4>创建项目</h4>
                <p>{{ project?.ownerName }} 创建了项目</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-tab-pane>
    </el-tabs>
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

const activeTab = ref('overview')
const project = ref<Project | null>(null)
const piPlannings = ref<PIPlanning[]>([])

onMounted(() => {
  const projectId = route.params.id as string
  const proj = projectsData.find(p => p.id === projectId)
  if (proj) {
    project.value = proj as Project
    // 加载该项目的PI Plannings
    piPlannings.value = piPlanningsData.filter(
      pi => pi.projectId === projectId
    ) as PIPlanning[]
  }
})

function getStatusType(status?: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: 'primary',
    active: 'primary',
    on_hold: 'warning',
    completed: 'success',
  }
  return typeMap[status || ''] || 'info'
}

function getStatusText(status?: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    active: '进行中',
    on_hold: '暂停',
    completed: '已完成',
  }
  return textMap[status || ''] || status
}

function getHealthType(health?: string) {
  const typeMap: Record<string, any> = {
    healthy: 'success',
    at_risk: 'warning',
    delayed: 'danger',
    unknown: 'info',
  }
  return typeMap[health || ''] || 'info'
}

function getHealthText(health?: string) {
  const textMap: Record<string, string> = {
    healthy: '健康',
    at_risk: '有风险',
    delayed: '延期',
    unknown: '未知',
  }
  return textMap[health || ''] || health
}

function getProjectTypeText(type?: string) {
  const textMap: Record<string, string> = {
    product_development: '产品开发',
    research: '技术预研',
    maintenance: '维护项目',
  }
  return textMap[type || ''] || type
}

function getProgressColor(progress?: number) {
  if (!progress) return '#f5222d'
  if (progress < 30) return '#f5222d'
  if (progress < 70) return '#faad14'
  return '#52c41a'
}

function formatNumber(num?: number) {
  return num?.toLocaleString() || '0'
}

function viewBoard() {
  router.push(`/projects/${route.params.id}/board`)
}

function viewPI(piId: string) {
  router.push(`/pi-planning/${piId}`)
}

function viewTeam() {
  router.push(`/projects/${route.params.id}/team`)
}

function viewMilestones() {
  router.push(`/projects/${route.params.id}/milestones`)
}

function viewIntegration() {
  router.push(`/projects/${route.params.id}/integration`)
}

function viewReport() {
  router.push(`/projects/${route.params.id}/report`)
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.project-detail {
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

      .header-meta {
        display: flex;
        gap: $spacing-md;
        align-items: center;

        .meta-text {
          color: $text-secondary;
          font-size: 14px;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .progress-section {
    .progress-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: $spacing-md;

      .progress-stat {
        .label {
          display: block;
          font-size: 14px;
          color: $text-secondary;
          margin-bottom: 4px;
        }

        .value {
          font-size: 24px;
          font-weight: 600;
          color: $primary;
        }
      }
    }
  }

  .pi-item {
    padding: $spacing-md;
    background: $bg-secondary;
    border-radius: $radius-sm;
    margin-bottom: $spacing-md;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      background: $bg-hover;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .pi-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;

      h4 {
        margin: 0;
        font-size: 16px;
      }
    }

    .pi-meta {
      display: flex;
      gap: $spacing-md;
      font-size: 14px;
      color: $text-secondary;
      margin-bottom: $spacing-sm;
    }
  }

  .metrics-list {
    .metric-item {
      display: flex;
      justify-content: space-between;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }

      .metric-label {
        color: $text-secondary;
      }

      .metric-value {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
}
</style>

