<template>
  <div class="team-workspace page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>👥 团队工作全景</h2>
      <p class="page-description">一页查看团队当前Sprint、工作项、任务和团队效能</p>
      <div class="header-actions">
        <el-select v-model="selectedTeam" placeholder="选择团队" style="width: 200px">
          <el-option
            v-for="team in teams"
            :key="team.id"
            :label="team.name"
            :value="team.id"
          />
        </el-select>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 区域1：当前Sprint信息 -->
    <section class="section current-sprint-section">
      <div class="section-title">
        <h3>当前Sprint</h3>
      </div>
      <el-card class="sprint-card">
        <div class="sprint-header">
          <div class="sprint-info">
            <h4>🏃 Sprint 2 - NOA功能开发</h4>
            <el-tag type="success">进行中</el-tag>
          </div>
          <div class="sprint-dates">
            <span>2025-01-13 ~ 2025-01-24</span>
            <span class="days-left">剩余 5 天</span>
          </div>
        </div>
        <el-row :gutter="20" class="sprint-stats">
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">38</div>
              <div class="stat-label">计划故事点</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">25</div>
              <div class="stat-label">已完成</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">13</div>
              <div class="stat-label">进行中</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-box">
              <div class="stat-value">66%</div>
              <div class="stat-label">完成率</div>
            </div>
          </el-col>
        </el-row>
        <div class="burndown-chart">
          <h5>Sprint燃尽图</h5>
          <div class="chart-placeholder">
            <el-empty description="燃尽图将在这里显示" :image-size="60" />
          </div>
        </div>
      </el-card>
    </section>

    <!-- 区域2：工作项列表 -->
    <section class="section work-items-section">
      <div class="section-title">
        <h3>工作项</h3>
        <el-button type="primary" :icon="Plus" size="small">新建工作项</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="work-items-card">
            <template #header>
              <div class="card-header">
                <span>📝 待开始 (5)</span>
              </div>
            </template>
            <div class="work-item-list">
              <div v-for="item in todoItems" :key="item.id" class="work-item" draggable="true">
                <div class="item-header">
                  <el-tag :type="getWorkItemTypeColor(item.type)" size="small">{{ item.type }}</el-tag>
                  <span class="item-id">{{ item.id }}</span>
                </div>
                <div class="item-title">{{ item.title }}</div>
                <div class="item-footer">
                  <el-avatar :size="24" :src="item.assignee?.avatar" />
                  <span class="story-points">{{ item.storyPoints }} SP</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="work-items-card">
            <template #header>
              <div class="card-header">
                <span>🚧 进行中 (3)</span>
              </div>
            </template>
            <div class="work-item-list">
              <div v-for="item in inProgressItems" :key="item.id" class="work-item" draggable="true">
                <div class="item-header">
                  <el-tag :type="getWorkItemTypeColor(item.type)" size="small">{{ item.type }}</el-tag>
                  <span class="item-id">{{ item.id }}</span>
                </div>
                <div class="item-title">{{ item.title }}</div>
                <div class="item-footer">
                  <el-avatar :size="24" :src="item.assignee?.avatar" />
                  <span class="story-points">{{ item.storyPoints }} SP</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="work-items-card">
            <template #header>
              <div class="card-header">
                <span>✅ 已完成 (8)</span>
              </div>
            </template>
            <div class="work-item-list">
              <div v-for="item in doneItems" :key="item.id" class="work-item" draggable="true">
                <div class="item-header">
                  <el-tag :type="getWorkItemTypeColor(item.type)" size="small">{{ item.type }}</el-tag>
                  <span class="item-id">{{ item.id }}</span>
                </div>
                <div class="item-title">{{ item.title }}</div>
                <div class="item-footer">
                  <el-avatar :size="24" :src="item.assignee?.avatar" />
                  <span class="story-points">{{ item.storyPoints }} SP</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 区域3：团队成员工作负载 -->
    <section class="section team-capacity-section">
      <div class="section-title">
        <h3>团队成员工作负载</h3>
      </div>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="6" v-for="member in teamMembers" :key="member.id">
            <div class="member-card">
              <div class="member-header">
                <el-avatar :size="40" :src="member.avatar" />
                <div class="member-info">
                  <div class="member-name">{{ member.name }}</div>
                  <div class="member-role">{{ member.role }}</div>
                </div>
              </div>
              <div class="member-stats">
                <div class="stat-item">
                  <span class="label">任务数:</span>
                  <span class="value">{{ member.taskCount }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">故事点:</span>
                  <span class="value">{{ member.storyPoints }} SP</span>
                </div>
                <div class="stat-item">
                  <span class="label">利用率:</span>
                  <el-progress
                    :percentage="member.utilization"
                    :color="getUtilizationColor(member.utilization)"
                    :stroke-width="6"
                  />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </section>

    <!-- 区域4：团队效能指标 -->
    <section class="section metrics-section">
      <div class="section-title">
        <h3>团队效能指标</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in teamMetrics" :key="metric.label">
          <el-card class="metric-card">
            <el-statistic :title="metric.label" :value="metric.value">
              <template #prefix>
                <el-icon :style="{ color: metric.color }">
                  <component :is="metric.icon" />
                </el-icon>
              </template>
              <template #suffix v-if="metric.suffix">{{ metric.suffix }}</template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Refresh, TrendCharts, User, Check, Warning } from '@element-plus/icons-vue'

// 团队列表
const teams = ref([
  { id: 'team-1', name: '感知团队' },
  { id: 'team-2', name: '决策团队' },
  { id: 'team-3', name: 'HMI团队' },
])

const selectedTeam = ref('team-1')

// 工作项数据
const todoItems = ref([
  {
    id: 'WI-001',
    title: '实现车道线检测算法',
    type: '需求',
    storyPoints: 5,
    assignee: { name: '张三', avatar: '' },
  },
  {
    id: 'WI-002',
    title: '前车距离检测优化',
    type: '需求',
    storyPoints: 3,
    assignee: { name: '李四', avatar: '' },
  },
])

const inProgressItems = ref([
  {
    id: 'WI-003',
    title: '融合算法性能优化',
    type: '技术债',
    storyPoints: 8,
    assignee: { name: '王五', avatar: '' },
  },
])

const doneItems = ref([
  {
    id: 'WI-004',
    title: '高精地图加载功能',
    type: '需求',
    storyPoints: 5,
    assignee: { name: '张三', avatar: '' },
  },
])

// 团队成员数据
const teamMembers = ref([
  {
    id: 'm-1',
    name: '张三',
    role: '高级工程师',
    avatar: '',
    taskCount: 5,
    storyPoints: 18,
    utilization: 85,
  },
  {
    id: 'm-2',
    name: '李四',
    role: '工程师',
    avatar: '',
    taskCount: 4,
    storyPoints: 15,
    utilization: 75,
  },
  {
    id: 'm-3',
    name: '王五',
    role: '高级工程师',
    avatar: '',
    taskCount: 6,
    storyPoints: 22,
    utilization: 95,
  },
  {
    id: 'm-4',
    name: '赵六',
    role: '工程师',
    avatar: '',
    taskCount: 3,
    storyPoints: 12,
    utilization: 60,
  },
])

// 团队效能指标
const teamMetrics = ref([
  { label: '团队速度', value: 38, icon: TrendCharts, color: '#409EFF', suffix: ' SP' },
  { label: '完成率', value: 85, icon: Check, color: '#67C23A', suffix: '%' },
  { label: '团队人数', value: 12, icon: User, color: '#E6A23C' },
  { label: '缺陷数', value: 3, icon: Warning, color: '#F56C6C' },
])

// 方法
const getWorkItemTypeColor = (type: string) => {
  const colorMap: Record<string, any> = {
    '需求': '',
    'Bug': 'danger',
    '技术债': 'warning',
    '优化': 'success',
  }
  return colorMap[type] || ''
}

const getUtilizationColor = (utilization: number) => {
  if (utilization < 70) return '#67c23a'
  if (utilization < 90) return '#e6a23c'
  return '#f56c6c'
}

const refreshData = () => {
  console.log('刷新数据')
}
</script>

<style scoped lang="scss">
.team-workspace {
  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .page-description {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .section {
    margin-bottom: 24px;

    .section-title {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }

  .sprint-card {
    .sprint-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .sprint-info {
        display: flex;
        align-items: center;
        gap: 12px;

        h4 {
          margin: 0;
          font-size: 18px;
        }
      }

      .sprint-dates {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;

        .days-left {
          font-weight: 600;
          color: #e6a23c;
        }
      }
    }

    .sprint-stats {
      margin-bottom: 20px;

      .stat-box {
        text-align: center;
        padding: 16px;
        background: #f5f7fa;
        border-radius: 4px;

        .stat-value {
          font-size: 32px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }

    .burndown-chart {
      h5 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 600;
      }

      .chart-placeholder {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        border-radius: 4px;
      }
    }
  }

  .work-items-card {
    .card-header {
      font-weight: 600;
    }

    .work-item-list {
      max-height: 500px;
      overflow-y: auto;

      .work-item {
        padding: 12px;
        margin-bottom: 8px;
        background: #f5f7fa;
        border-radius: 4px;
        border-left: 3px solid #409eff;
        cursor: move;
        transition: all 0.3s;

        &:hover {
          background: #ecf5ff;
          transform: translateX(4px);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .item-id {
            font-size: 12px;
            color: #909399;
          }
        }

        .item-title {
          font-size: 14px;
          color: #303133;
          margin-bottom: 8px;
        }

        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .story-points {
            font-size: 12px;
            font-weight: 600;
            color: #409eff;
          }
        }
      }
    }
  }

  .team-capacity-section {
    .member-card {
      padding: 16px;
      background: #f5f7fa;
      border-radius: 4px;

      .member-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .member-info {
          flex: 1;

          .member-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .member-role {
            font-size: 12px;
            color: #909399;
          }
        }
      }

      .member-stats {
        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          .label {
            font-size: 14px;
            color: #909399;
          }

          .value {
            font-weight: 600;
          }
        }
      }
    }
  }

  .metric-card {
    :deep(.el-statistic) {
      .el-statistic__head {
        font-size: 14px;
        color: #909399;
      }

      .el-statistic__content {
        font-size: 28px;
        font-weight: 600;
      }
    }
  }
}
</style>

