<template>
  <div class="project-overview page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>🚀 项目全景图</h2>
      <p class="page-description">一页查看车型项目、领域项目、PI Planning、Sprint及其与车型里程碑的对齐</p>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">创建项目</el-button>
        <el-button :icon="Download">导出报告</el-button>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 区域1：车型项目看板 -->
    <section class="section vehicle-projects-section">
      <div class="section-title">
        <h3>车型项目看板</h3>
      </div>
      <div class="vehicle-projects-cards">
        <el-card
          v-for="project in vehicleProjects"
          :key="project.id"
          class="vehicle-project-card"
          :class="getRiskClass(project.risk)"
          shadow="hover"
          @click="selectVehicleProject(project)"
        >
          <div class="card-header-content">
            <h4>🚗 {{ project.name }}</h4>
            <el-tag :type="getStatusType(project.status)">{{ project.status }}</el-tag>
          </div>
          <div class="card-body">
            <div class="info-item">
              <span class="label">SOP日期:</span>
              <span class="value">{{ project.sopDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">领域项目:</span>
              <span class="value">{{ project.domainProjectCount }} 个</span>
            </div>
            <div class="info-item">
              <span class="label">整体进度:</span>
              <el-progress :percentage="project.progress" :stroke-width="8" />
            </div>
            <div class="risk-info" v-if="project.riskCount > 0">
              <el-icon color="#F56C6C"><Warning /></el-icon>
              <span>{{ project.riskCount }} 个风险</span>
            </div>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 区域2：项目时间轴视图 -->
    <section class="section timeline-section">
      <div class="section-title">
        <h3>项目时间轴（甘特图）</h3>
        <p class="subtitle">车型里程碑与PI/Sprint对齐视图</p>
      </div>
      <el-card>
        <div class="timeline-placeholder">
          <el-empty description="项目时间轴甘特图将在这里显示">
            <template #image>
              <el-icon :size="80" color="#909399"><Calendar /></el-icon>
            </template>
          </el-empty>
          <p class="hint">甘特图将展示车型项目 → 领域项目 → PI → Sprint的时间关系和里程碑对齐</p>
        </div>
      </el-card>
    </section>

    <!-- 区域3：项目详情面板 -->
    <section class="section project-detail-section">
      <div class="section-title">
        <h3>项目详情</h3>
      </div>
      <el-row :gutter="20">
        <!-- 左侧：项目列表 (35%) -->
        <el-col :span="8">
          <el-card class="project-list-card">
            <template #header>
              <div class="card-header">
                <span>项目列表</span>
                <el-input
                  v-model="projectSearchText"
                  placeholder="搜索项目..."
                  :prefix-icon="Search"
                  clearable
                  size="small"
                  style="width: 180px"
                />
              </div>
            </template>
            <el-tree
              :data="projectTreeData"
              :props="projectTreeProps"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              @node-click="handleProjectNodeClick"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <el-icon>
                    <component :is="getProjectNodeIcon(data.type)" />
                  </el-icon>
                  <span>{{ node.label }}</span>
                  <el-progress
                    v-if="data.progress !== undefined"
                    :percentage="data.progress"
                    :width="40"
                    type="circle"
                    :stroke-width="4"
                  />
                </span>
              </template>
            </el-tree>
          </el-card>
        </el-col>

        <!-- 右侧：详情面板 (65%) -->
        <el-col :span="16">
          <el-card class="project-detail-card">
            <template #header>
              <div class="card-header">
                <span>{{ selectedProject?.label || '请选择项目' }}</span>
                <el-button v-if="selectedProject" type="primary" size="small">查看详情</el-button>
              </div>
            </template>
            <div v-if="!selectedProject" class="empty-state">
              <el-empty description="请从左侧选择要查看的项目" />
            </div>
            <div v-else class="detail-content">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="项目名称">{{ selectedProject.label }}</el-descriptions-item>
                <el-descriptions-item label="项目类型">{{ getProjectTypeLabel(selectedProject.type) }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="getStatusType(selectedProject.status)">
                    {{ selectedProject.status }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="进度">
                  <el-progress :percentage="selectedProject.progress || 0" />
                </el-descriptions-item>
              </el-descriptions>

              <div class="detail-section">
                <h4>PI Planning 列表</h4>
                <p class="placeholder-text">这里将显示该项目的PI Planning列表...</p>
              </div>

              <div class="detail-section">
                <h4>关键指标</h4>
                <p class="placeholder-text">这里将显示项目的关键指标和风险...</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 区域4：项目健康度仪表盘 -->
    <section class="section dashboard-section">
      <div class="section-title">
        <h3>项目健康度仪表盘</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in projectMetrics" :key="metric.label">
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
import { Plus, Download, Refresh, Search, Warning, Calendar, Box, Histogram, User, TrendCharts } from '@element-plus/icons-vue'

// 车型项目数据
const vehicleProjects = ref([
  {
    id: 'vp-1',
    name: '车型X-L3项目',
    sopDate: '2025-Q2',
    domainProjectCount: 5,
    progress: 75,
    status: '进行中',
    risk: 'medium',
    riskCount: 3,
  },
  {
    id: 'vp-2',
    name: '车型Y-L2+项目',
    sopDate: '2025-Q3',
    domainProjectCount: 3,
    progress: 60,
    status: '进行中',
    risk: 'high',
    riskCount: 5,
  },
  {
    id: 'vp-3',
    name: '车型Z-L4项目',
    sopDate: '2025-Q4',
    domainProjectCount: 4,
    progress: 45,
    status: '进行中',
    risk: 'low',
    riskCount: 1,
  },
])

// 项目树数据
const projectTreeData = ref([
  {
    id: '1',
    label: '车型X-L3项目',
    type: 'vehicle',
    progress: 75,
    status: '进行中',
    children: [
      {
        id: '1-1',
        label: '智驾L3项目',
        type: 'domain',
        progress: 75,
        status: '进行中',
      },
      {
        id: '1-2',
        label: '座舱项目',
        type: 'domain',
        progress: 60,
        status: '进行中',
      },
    ],
  },
  {
    id: '2',
    label: '车型Y-L2+项目',
    type: 'vehicle',
    progress: 60,
    status: '进行中',
    children: [
      {
        id: '2-1',
        label: '智驾L2+项目',
        type: 'domain',
        progress: 65,
        status: '进行中',
      },
    ],
  },
])

const projectSearchText = ref('')
const selectedProject = ref<any>(null)

const projectTreeProps = {
  children: 'children',
  label: 'label',
}

// 项目指标数据
const projectMetrics = ref([
  { label: '车型项目', value: 4, icon: Box, color: '#409EFF' },
  { label: '领域项目', value: 12, icon: Histogram, color: '#67C23A' },
  { label: 'PI数量', value: 28, icon: Calendar, color: '#E6A23C' },
  { label: '按时交付率', value: 82, icon: TrendCharts, color: '#F56C6C', suffix: '%' },
])

// 方法
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    '进行中': '',
    '已完成': 'success',
    '计划中': 'info',
    '暂停': 'warning',
    '已取消': 'danger',
  }
  return typeMap[status] || ''
}

const getRiskClass = (risk: string) => {
  return `risk-${risk}`
}

const getProjectNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    vehicle: Box,
    domain: Histogram,
    pi: Calendar,
    sprint: TrendCharts,
  }
  return iconMap[type] || Box
}

const getProjectTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    vehicle: '车型项目',
    domain: '领域项目',
    pi: 'PI Planning',
    sprint: 'Sprint',
  }
  return labelMap[type] || type
}

const selectVehicleProject = (project: any) => {
  console.log('选中车型项目:', project)
}

const handleProjectNodeClick = (data: any) => {
  selectedProject.value = data
  console.log('选中项目节点:', data)
}

const refreshData = () => {
  console.log('刷新数据')
}
</script>

<style scoped lang="scss">
.project-overview {
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
    }
  }

  .section {
    margin-bottom: 24px;

    .section-title {
      margin-bottom: 16px;

      h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 600;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .vehicle-projects-cards {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;

    .vehicle-project-card {
      min-width: 280px;
      cursor: pointer;
      transition: all 0.3s;
      border-left: 4px solid transparent;

      &.risk-low {
        border-left-color: #67c23a;
      }

      &.risk-medium {
        border-left-color: #e6a23c;
      }

      &.risk-high {
        border-left-color: #f56c6c;
      }

      &:hover {
        transform: translateY(-4px);
      }

      .card-header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        h4 {
          margin: 0;
          font-size: 16px;
        }
      }

      .card-body {
        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .label {
            color: #909399;
            font-size: 14px;
          }

          .value {
            font-weight: 600;
          }
        }

        .risk-info {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f56c6c;
          font-size: 14px;
          margin-top: 12px;
        }
      }
    }
  }

  .timeline-section {
    .timeline-placeholder {
      padding: 60px;
      text-align: center;

      .hint {
        margin-top: 16px;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .project-detail-section {
    .project-list-card,
    .project-detail-card {
      height: 500px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      :deep(.el-card__body) {
        height: calc(100% - 60px);
        overflow-y: auto;
      }
    }

    .tree-node {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      justify-content: space-between;
    }

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .detail-content {
      .detail-section {
        margin-top: 24px;

        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .placeholder-text {
          color: #909399;
          font-size: 14px;
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

