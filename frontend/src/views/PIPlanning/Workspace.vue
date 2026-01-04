<template>
  <div class="pi-workspace page-container">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/pi-planning' }">PI Planning</el-breadcrumb-item>
          <el-breadcrumb-item>{{ piData?.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{ piData?.name }}</h1>
        <div class="header-meta">
          <el-tag :type="getStatusType(piData?.status)">{{ getStatusText(piData?.status) }}</el-tag>
          <span>{{ piData?.startDate }} ~ {{ piData?.endDate }}</span>
          <span>{{ piData?.duration }}周</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button icon="View" @click="goToBoard">查看看板</el-button>
        <el-button icon="Document" @click="generateReport">生成报告</el-button>
        <el-button type="primary" icon="Edit">编辑PI</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="pi-tabs">
      <!-- 概览Tab -->
      <el-tab-pane label="概览" name="overview">
        <el-row :gutter="24">
          <el-col :span="16">
            <!-- 进度统计 -->
            <el-card header="进度统计" class="section-card">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-label">Story Points</div>
                  <div class="stat-value">{{ piData?.completedPoints }} / {{ piData?.totalPoints }}</div>
                  <el-progress
                    :percentage="piData?.progress"
                    :color="getProgressColor(piData?.progress)"
                  />
                </div>
                <div class="stat-item">
                  <div class="stat-label">团队数量</div>
                  <div class="stat-value">{{ piData?.teamCount }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">目标数量</div>
                  <div class="stat-value">{{ piData?.objectiveCount }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Story数量</div>
                  <div class="stat-value">{{ piData?.storyCount }}</div>
                </div>
              </div>
            </el-card>

            <!-- PI目标 -->
            <el-card header="PI Objectives" class="section-card">
              <div v-if="objectives.length > 0">
                <div v-for="obj in objectives" :key="obj.id" class="objective-item">
                  <div class="objective-header">
                    <el-tag>{{ obj.team }}</el-tag>
                    <h4>{{ obj.title }}</h4>
                  </div>
                  <p class="objective-desc">{{ obj.description }}</p>
                  <div class="objective-meta">
                    <span>{{ obj.storyCount }}个Story</span>
                    <span>{{ obj.points }} SP</span>
                    <el-progress
                      :percentage="obj.progress"
                      :stroke-width="6"
                      :show-text="false"
                    />
                  </div>
                </div>
              </div>
              <el-empty v-else description="暂无PI目标" />
            </el-card>
          </el-col>

          <el-col :span="8">
            <!-- 置信度投票 -->
            <el-card header="置信度投票" class="section-card">
              <div class="confidence-vote">
                <div class="vote-display">
                  <el-icon :size="48" color="#1890ff"><TrendCharts /></el-icon>
                  <div class="vote-value">{{ piData?.confidence }}/10</div>
                </div>
                <el-rate
                  v-model="confidence"
                  :max="10"
                  show-score
                  score-template="{value}分"
                />
                <el-button type="primary" size="small" @click="submitVote">提交投票</el-button>
              </div>
            </el-card>

            <!-- 关键成果 -->
            <el-card header="关键成果" class="section-card">
              <el-tag
                v-for="(achievement, index) in piData?.achievements"
                :key="index"
                type="success"
                effect="plain"
                style="margin: 4px"
              >
                {{ achievement }}
              </el-tag>
              <el-empty v-if="!piData?.achievements?.length" description="暂无成果" :image-size="60" />
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 风险管理Tab -->
      <el-tab-pane label="风险管理" name="risks">
        <el-card>
          <template #header>
            <div class="card-header-actions">
              <span>风险列表</span>
              <el-button type="primary" size="small" icon="Plus" @click="addRisk">
                添加风险
              </el-button>
            </div>
          </template>

          <el-table :data="piData?.risks" stripe>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="title" label="风险描述" min-width="200" />
            <el-table-column prop="level" label="风险等级" width="120">
              <template #default="{ row }">
                <el-tag :type="getRiskLevelType(row.level)">
                  {{ getRiskLevelText(row.level) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="impact" label="影响" min-width="150" />
            <el-table-column prop="mitigation" label="缓解措施" min-width="180" />
            <el-table-column prop="owner" label="负责人" width="120" />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editRisk(row)">
                  编辑
                </el-button>
                <el-button text type="danger" size="small" @click="deleteRisk(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="!piData?.risks?.length" description="暂无风险" />
        </el-card>
      </el-tab-pane>

      <!-- 依赖管理Tab -->
      <el-tab-pane label="依赖管理" name="dependencies">
        <el-card>
          <template #header>
            <div class="card-header-actions">
              <span>依赖关系</span>
              <el-button type="primary" size="small" icon="Plus" @click="addDependency">
                添加依赖
              </el-button>
            </div>
          </template>

          <el-table :data="piData?.dependencies" stripe>
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="from" label="依赖方" width="150" />
            <el-table-column prop="to" label="被依赖方" width="150" />
            <el-table-column prop="type" label="依赖类型" width="150">
              <template #default="{ row }">
                {{ getDependencyTypeText(row.type) }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="getDependencyStatusType(row.status)">
                  {{ getDependencyStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editDependency(row)">
                  编辑
                </el-button>
                <el-button text type="danger" size="small" @click="deleteDependency(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="!piData?.dependencies?.length" description="暂无依赖" />
        </el-card>
      </el-tab-pane>

      <!-- 团队容量Tab -->
      <el-tab-pane label="团队容量" name="capacity">
        <el-card>
          <div class="capacity-overview">
            <div class="capacity-summary">
              <h3>容量规划</h3>
              <p>总计 {{ piData?.teamCount }} 个团队参与此PI</p>
            </div>
            <el-button type="primary" @click="planCapacity">容量规划</el-button>
          </div>
          <el-empty description="容量规划功能开发中" :image-size="100" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import piPlanningsData from '@/data/projects/pi-plannings.json'
import type { PIPlanning } from '@/types/project'

const router = useRouter()
const route = useRoute()

const activeTab = ref('overview')
const confidence = ref(0)
const piData = ref<PIPlanning | null>(null)

// 模拟PI Objectives数据
const objectives = ref([
  {
    id: 'OBJ001',
    team: '感知团队',
    title: '提升感知算法准确率到95%',
    description: '优化视觉和雷达融合算法，提升目标检测和跟踪准确率',
    storyCount: 8,
    points: 34,
    progress: 35,
  },
  {
    id: 'OBJ002',
    team: '融合团队',
    title: '完成多传感器融合架构升级',
    description: '重构融合框架，支持更多传感器类型',
    storyCount: 6,
    points: 28,
    progress: 20,
  },
  {
    id: 'OBJ003',
    team: '规划团队',
    title: '实现复杂场景路径规划',
    description: '支持环岛、匝道等复杂场景的路径规划',
    storyCount: 7,
    points: 30,
    progress: 15,
  },
])

onMounted(() => {
  const piId = route.params.id as string
  const pi = piPlanningsData.find(p => p.id === piId)
  if (pi) {
    piData.value = pi as PIPlanning
    confidence.value = pi.confidence / 10
  }
})

function getStatusType(status?: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    active: 'primary',
    completed: 'success',
  }
  return typeMap[status || ''] || 'info'
}

function getStatusText(status?: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    active: '进行中',
    completed: '已完成',
  }
  return textMap[status || ''] || status
}

function getProgressColor(progress?: number) {
  if (!progress) return '#f5222d'
  if (progress < 30) return '#f5222d'
  if (progress < 70) return '#faad14'
  return '#52c41a'
}

function getRiskLevelType(level: string) {
  const typeMap: Record<string, any> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  }
  return typeMap[level] || 'info'
}

function getRiskLevelText(level: string) {
  const textMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
  }
  return textMap[level] || level
}

function getDependencyTypeText(type: string) {
  const textMap: Record<string, string> = {
    data_interface: '数据接口',
    module_integration: '模块集成',
    resource: '资源依赖',
    knowledge: '知识依赖',
  }
  return textMap[type] || type
}

function getDependencyStatusType(status: string) {
  const typeMap: Record<string, any> = {
    identified: 'info',
    at_risk: 'warning',
    resolved: 'success',
  }
  return typeMap[status] || 'info'
}

function getDependencyStatusText(status: string) {
  const textMap: Record<string, string> = {
    identified: '已识别',
    at_risk: '有风险',
    resolved: '已解决',
  }
  return textMap[status] || status
}

function goToBoard() {
  router.push(`/pi-planning/${route.params.id}/board`)
}

function generateReport() {
  ElMessage.info('生成报告功能开发中...')
}

function submitVote() {
  ElMessage.success(`提交置信度投票: ${confidence.value * 10}分`)
}

function addRisk() {
  ElMessage.info('添加风险功能开发中...')
}

function editRisk(risk: any) {
  ElMessage.info(`编辑风险: ${risk.title}`)
}

function deleteRisk(risk: any) {
  ElMessage.success(`删除风险: ${risk.title}`)
}

function addDependency() {
  ElMessage.info('添加依赖功能开发中...')
}

function editDependency(dep: any) {
  ElMessage.info(`编辑依赖: ${dep.id}`)
}

function deleteDependency(dep: any) {
  ElMessage.success(`删除依赖: ${dep.id}`)
}

function planCapacity() {
  ElMessage.info('容量规划功能开发中...')
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.pi-workspace {
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
        color: $text-secondary;
        font-size: 14px;
      }
    }

    .header-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .pi-tabs {
    .section-card {
      margin-bottom: $spacing-lg;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: $spacing-lg;

      .stat-item {
        .stat-label {
          font-size: 14px;
          color: $text-secondary;
          margin-bottom: $spacing-xs;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: $spacing-sm;
        }
      }
    }

    .objective-item {
      padding: $spacing-md;
      background: $bg-secondary;
      border-radius: $radius-sm;
      margin-bottom: $spacing-md;

      &:last-child {
        margin-bottom: 0;
      }

      .objective-header {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin-bottom: $spacing-sm;

        h4 {
          margin: 0;
          font-size: 16px;
        }
      }

      .objective-desc {
        color: $text-secondary;
        margin-bottom: $spacing-sm;
      }

      .objective-meta {
        display: flex;
        gap: $spacing-md;
        align-items: center;
        font-size: 14px;
        color: $text-secondary;

        .el-progress {
          flex: 1;
        }
      }
    }

    .confidence-vote {
      text-align: center;

      .vote-display {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: $spacing-md;

        .vote-value {
          font-size: 32px;
          font-weight: 600;
          color: $primary;
          margin-top: $spacing-sm;
        }
      }

      .el-rate {
        margin: $spacing-md 0;
      }
    }

    .card-header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .capacity-overview {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-lg;

      h3 {
        margin: 0 0 $spacing-xs 0;
      }

      p {
        margin: 0;
        color: $text-secondary;
      }
    }
  }
}
</style>

