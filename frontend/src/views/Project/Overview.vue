<template>
  <div class="project-overview page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>🚀 项目全景图</h2>
        <p class="page-description">一页查看车型项目、领域项目、PI Planning及其与车型里程碑的对齐</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">创建项目</el-button>
        <el-button :icon="Download" @click="exportReport">导出报告</el-button>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索项目..."
        :prefix-icon="Search"
        clearable
        style="width: 300px"
        @input="handleSearch"
      />
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 150px" @change="applyFilter">
        <el-option label="全部" value="" />
        <el-option label="计划中" value="planning" />
        <el-option label="进行中" value="in_progress" />
        <el-option label="已完成" value="completed" />
        <el-option label="暂停" value="on_hold" />
      </el-select>
      <el-select v-model="filterVehicleProject" placeholder="车型项目" clearable style="width: 200px" @change="applyFilter">
        <el-option label="全部车型项目" value="" />
        <el-option v-for="vp in vehicleProjectsData" :key="vp.id" :label="vp.name" :value="vp.id" />
      </el-select>
    </div>

    <!-- 区域1：车型项目看板 -->
    <section class="section vehicle-projects-section">
      <div class="section-title">
        <h3>车型项目看板</h3>
      </div>
      <div class="vehicle-projects-cards">
        <el-card
          v-for="project in filteredVehicleProjects"
          :key="project.id"
          class="vehicle-project-card"
          shadow="hover"
          :class="{ selected: selectedVehicleProjectId === project.id, ...getRiskClass(project) }"
          @click="selectVehicleProject(project)"
        >
          <div class="card-icon">
            {{ getVehicleIcon(project.code) }}
          </div>
          <h4>{{ project.name }}</h4>
          <div class="card-stats">
            <div class="stat-item">
              <span class="label">SOP:</span>
              <span class="value">{{ project.sopDate }}</span>
            </div>
            <div class="stat-item">
              <span class="label">领域项目:</span>
              <span class="value">{{ project.domainProjects?.length || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">PI数量:</span>
              <span class="value">{{ calculatePICount(project) }}</span>
            </div>
          </div>
          <div class="progress-indicator">
            <span>整体进度:</span>
            <el-progress
              :percentage="project.progress"
              :color="getProgressColor(project.progress)"
              :stroke-width="8"
            />
          </div>
          <div class="risk-indicator" v-if="project.riskLevel">
            <el-tag :type="getRiskTagType(project.riskLevel)" size="small">
              风险: {{ getRiskText(project.riskLevel) }}
            </el-tag>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 区域2：项目时间轴与里程碑 -->
    <section class="section timeline-section">
      <div class="section-title">
        <h3>项目时间轴与里程碑</h3>
        <p class="subtitle">车型项目 → 领域项目 → PI → Sprint时间关系</p>
      </div>
      <el-card>
        <el-tabs v-model="activeTimeline" type="border-card">
          <el-tab-pane label="时间轴视图" name="timeline">
            <div class="timeline-view">
              <el-timeline>
                <el-timeline-item
                  v-for="milestone in milestones"
                  :key="milestone.id"
                  :timestamp="milestone.date"
                  :color="getMilestoneColor(milestone.status)"
                  placement="top"
                >
                  <el-card shadow="hover" class="milestone-card">
                    <div class="milestone-header">
                      <h4>{{ milestone.name }}</h4>
                      <el-tag :type="getStatusType(milestone.status)" size="small">
                        {{ getStatusText(milestone.status) }}
                      </el-tag>
                    </div>
                    <p class="milestone-desc">{{ milestone.description }}</p>
                    <div class="milestone-meta">
                      <span>项目: {{ milestone.projectName }}</span>
                      <span>负责人: {{ milestone.owner }}</span>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
          <el-tab-pane label="甘特图（占位）" name="gantt">
            <div class="gantt-placeholder">
              <el-empty description="甘特图功能开发中..." :image-size="100">
                <template #image>
                  <el-icon :size="80" color="#909399"><Calendar /></el-icon>
                </template>
              </el-empty>
              <p class="hint">将展示车型项目、领域项目、PI、Sprint的时间对齐关系</p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </section>

    <!-- 区域3：项目层级视图 + 详情面板 -->
    <section class="section tree-detail-section">
      <div class="section-title">
        <h3>项目层级结构</h3>
      </div>
      <el-row :gutter="20">
        <!-- 左侧：项目树 (35%) -->
        <el-col :span="9">
          <el-card class="tree-card">
            <template #header>
              <div class="card-header">
                <span>项目树</span>
                <el-input
                  v-model="treeSearchText"
                  placeholder="搜索..."
                  :prefix-icon="Search"
                  clearable
                  size="small"
                  style="width: 180px"
                />
              </div>
            </template>
            <el-tree
              :data="projectTreeData"
              :props="treeProps"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="treeRef"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <el-icon>
                    <component :is="getNodeIcon(data.type)" />
                  </el-icon>
                  <span>{{ node.label }}</span>
                  <el-progress
                    v-if="data.progress !== undefined"
                    :percentage="data.progress"
                    :stroke-width="6"
                    :show-text="false"
                    :color="getProgressColor(data.progress)"
                    class="node-progress"
                  />
                  <el-tag v-if="data.status" :type="getStatusType(data.status)" size="small">
                    {{ getStatusText(data.status) }}
                  </el-tag>
                </span>
              </template>
            </el-tree>
          </el-card>
        </el-col>

        <!-- 右侧：详情面板 (65%) -->
        <el-col :span="15">
          <el-card class="detail-card">
            <template #header>
              <div class="card-header">
                <span>{{ selectedNode?.label || '请选择项目' }}</span>
                <el-button-group v-if="selectedNode">
                  <el-button type="primary" size="small" :icon="View" @click="goToDetail">查看详情</el-button>
                  <el-button size="small" :icon="Edit">编辑</el-button>
                </el-button-group>
              </div>
            </template>
            <div v-if="!selectedNode" class="empty-state">
              <el-empty description="请从左侧选择要查看的项目" />
            </div>
            <div v-else class="detail-content">
              <!-- 车型项目详情 -->
              <div v-if="selectedNode.type === 'vehicle'" class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="项目名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="项目代码">{{ selectedNode.data.code }}</el-descriptions-item>
                  <el-descriptions-item label="SOP日期">{{ selectedNode.data.sopDate }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="负责人">{{ selectedNode.data.owner }}</el-descriptions-item>
                  <el-descriptions-item label="风险等级">
                    <el-tag :type="getRiskTagType(selectedNode.data.riskLevel)">
                      {{ getRiskText(selectedNode.data.riskLevel) }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
                <div class="detail-subsection">
                  <h4>项目描述</h4>
                  <p>{{ selectedNode.data.description }}</p>
                </div>
                <div class="detail-subsection">
                  <h4>关键指标</h4>
                  <el-row :gutter="16">
                    <el-col :span="6">
                      <el-statistic title="领域项目数" :value="selectedNode.data.domainProjects?.length || 0" />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic title="PI数量" :value="calculatePICount(selectedNode.data)" />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic title="整体进度" :value="selectedNode.data.progress" suffix="%" />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic title="团队数" :value="selectedNode.data.teams?.length || 0" />
                    </el-col>
                  </el-row>
                </div>
                <div class="detail-subsection">
                  <h4>领域项目列表 ({{ selectedNode.data.domainProjects?.length || 0 }})</h4>
                  <el-table :data="selectedNode.data.domainProjects" size="small" stripe>
                    <el-table-column prop="name" label="项目名称" />
                    <el-table-column label="状态" width="100">
                      <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)" size="small">
                          {{ getStatusText(row.status) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="进度" width="150">
                      <template #default="{ row }">
                        <el-progress :percentage="row.progress" :stroke-width="6" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 领域项目详情 -->
              <div v-else-if="selectedNode.type === 'domain'" class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="项目名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="项目代码">{{ selectedNode.data.code }}</el-descriptions-item>
                  <el-descriptions-item label="领域">{{ selectedNode.data.domain }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="负责人">{{ selectedNode.data.owner }}</el-descriptions-item>
                  <el-descriptions-item label="开始日期">{{ selectedNode.data.startDate }}</el-descriptions-item>
                  <el-descriptions-item label="结束日期">{{ selectedNode.data.endDate }}</el-descriptions-item>
                  <el-descriptions-item label="进度">
                    <el-progress :percentage="selectedNode.data.progress" :stroke-width="8" />
                  </el-descriptions-item>
                </el-descriptions>

                <div class="detail-subsection">
                  <h4>项目目标 ({{ selectedNode.data.objectives?.length || 0 }})</h4>
                  <el-table :data="selectedNode.data.objectives" size="small" stripe>
                    <el-table-column prop="description" label="目标描述" />
                    <el-table-column prop="businessValue" label="业务价值" width="100" align="center" />
                    <el-table-column label="是否延伸" width="100" align="center">
                      <template #default="{ row }">
                        <el-tag :type="row.stretch ? 'warning' : 'success'" size="small">
                          {{ row.stretch ? '是' : '否' }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="进度" width="150">
                      <template #default="{ row }">
                        <el-progress :percentage="row.progress" :stroke-width="6" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <div class="detail-subsection">
                  <h4>产品版本 ({{ selectedNode.data.projectVersions?.length || 0 }})</h4>
                  <el-table :data="selectedNode.data.projectVersions" size="small" stripe>
                    <el-table-column prop="productName" label="产品" />
                    <el-table-column prop="version" label="版本" width="100" />
                    <el-table-column prop="targetPI" label="目标PI" width="120" />
                    <el-table-column label="状态" width="100">
                      <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)" size="small">
                          {{ getStatusText(row.status) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- PI详情 -->
              <div v-else-if="selectedNode.type === 'pi'" class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="PI名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="开始日期">{{ selectedNode.data.startDate }}</el-descriptions-item>
                  <el-descriptions-item label="结束日期">{{ selectedNode.data.endDate }}</el-descriptions-item>
                </el-descriptions>
                <div class="detail-subsection">
                  <p>PI详细信息请点击"查看详情"按钮进入PI Planning工作区</p>
                </div>
              </div>

              <!-- 其他类型详情 -->
              <div v-else class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="类型">{{ getTypeLabel(selectedNode.type) }}</el-descriptions-item>
                  <el-descriptions-item v-if="selectedNode.data.status" label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                </el-descriptions>
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
      <el-row :gutter="20" class="metrics-row">
        <el-col :span="6" v-for="metric in metrics" :key="metric.label">
          <el-card class="metric-card" shadow="hover">
            <el-statistic :title="metric.label" :value="metric.value">
              <template #prefix>
                <el-icon :style="{ color: metric.color, fontSize: '24px' }">
                  <component :is="metric.icon" />
                </el-icon>
              </template>
              <template #suffix v-if="metric.suffix">{{ metric.suffix }}</template>
            </el-statistic>
            <div v-if="metric.trend" class="trend">
              <el-icon :color="metric.trend > 0 ? '#67c23a' : '#f56c6c'">
                <component :is="metric.trend > 0 ? TopRight : BottomRight" />
              </el-icon>
              <span>{{ Math.abs(metric.trend) }}%</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="charts-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>项目状态分布</span>
            </template>
            <div class="status-distribution">
              <div v-for="status in statusDistribution" :key="status.name" class="status-item">
                <div class="status-bar" :style="{ width: status.percentage + '%', background: status.color }"></div>
                <span class="status-label">{{ status.name }}: {{ status.count }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>按时交付率趋势</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="折线图展示位置" :image-size="100" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Download, Refresh, Search, Folder, Management, Calendar, Warning, View, Edit, TopRight, BottomRight } from '@element-plus/icons-vue'

// 导入数据
import vehicleProjectsDataRaw from '@/biz-data/mock/project/vehicle-projects.json'
import domainProjectsDataRaw from '@/biz-data/mock/project/domain-projects.json'
import piPlanningsDataRaw from '@/biz-data/mock/project/pi-details.json'

const router = useRouter()

// 解析数据
const vehicleProjectsData = ref((vehicleProjectsDataRaw as any).data || [])
const domainProjectsData = ref((domainProjectsDataRaw as any).data || [])
const piPlanningsData = ref((piPlanningsDataRaw as any).data || [])

// 筛选和搜索
const searchText = ref('')
const treeSearchText = ref('')
const filterStatus = ref('')
const filterVehicleProject = ref('')
const selectedVehicleProjectId = ref('')
const selectedNode = ref<any>(null)
const treeRef = ref<any>(null)
const activeTimeline = ref('timeline')

// 树配置
const treeProps = {
  children: 'children',
  label: 'label',
}

// 关联数据
vehicleProjectsData.value.forEach((vp: any) => {
  vp.domainProjects = domainProjectsData.value.filter((dp: any) => dp.vehicleProjectId === vp.id)
  vp.domainProjects.forEach((dp: any) => {
    dp.piPlannings = piPlanningsData.value.filter((pi: any) => pi.domainProjectId === dp.id)
  })
})

// 计算过滤后的车型项目
const filteredVehicleProjects = computed(() => {
  let filtered = vehicleProjectsData.value

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter((vp: any) =>
      vp.name.toLowerCase().includes(search) ||
      vp.code.toLowerCase().includes(search)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter((vp: any) => vp.status === filterStatus.value)
  }

  if (filterVehicleProject.value) {
    filtered = filtered.filter((vp: any) => vp.id === filterVehicleProject.value)
  }

  return filtered
})

// 构建项目树数据
const projectTreeData = computed(() => {
  return filteredVehicleProjects.value.map((vp: any) => ({
    id: vp.id,
    label: vp.name,
    type: 'vehicle',
    status: vp.status,
    progress: vp.progress,
    data: vp,
    children: vp.domainProjects.map((dp: any) => ({
      id: dp.id,
      label: dp.name,
      type: 'domain',
      status: dp.status,
      progress: dp.progress,
      data: dp,
      children: dp.piPlannings?.map((pi: any) => ({
        id: pi.id,
        label: pi.name,
        type: 'pi',
        status: pi.status,
        data: pi,
      })) || []
    }))
  }))
})

// 计算里程碑数据
const milestones = computed(() => {
  const allMilestones: any[] = []

  vehicleProjectsData.value.forEach((vp: any) => {
    if (vp.milestones && Array.isArray(vp.milestones)) {
      vp.milestones.forEach((m: any) => {
        allMilestones.push({
          ...m,
          projectName: vp.name,
          projectType: 'vehicle'
        })
      })
    }

    vp.domainProjects?.forEach((dp: any) => {
      if (dp.milestones && Array.isArray(dp.milestones)) {
        dp.milestones.forEach((m: any) => {
          allMilestones.push({
            ...m,
            projectName: dp.name,
            projectType: 'domain'
          })
        })
      }
    })
  })

  return allMilestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// 计算指标数据
const metrics = computed(() => {
  const totalVehicleProjects = vehicleProjectsData.value.length
  const totalDomainProjects = domainProjectsData.value.length
  const totalPIs = piPlanningsData.value.length
  
  const completedProjects = vehicleProjectsData.value.filter((p: any) => p.status === 'completed').length
  const onTimeRate = totalVehicleProjects > 0 ? Math.round((completedProjects / totalVehicleProjects) * 100) : 0

  return [
    {
      label: '车型项目数',
      value: totalVehicleProjects,
      icon: Folder,
      color: '#409EFF',
      trend: 2
    },
    {
      label: '领域项目数',
      value: totalDomainProjects,
      icon: Management,
      color: '#67C23A',
      trend: 5
    },
    {
      label: 'PI Planning数',
      value: totalPIs,
      icon: Calendar,
      color: '#E6A23C',
      trend: 3
    },
    {
      label: '按时交付率',
      value: onTimeRate,
      icon: Warning,
      color: '#F56C6C',
      suffix: '%',
      trend: -1
    }
  ]
})

// 计算状态分布
const statusDistribution = computed(() => {
  const statusMap: Record<string, any> = {
    planning: { name: '计划中', count: 0, color: '#909399' },
    in_progress: { name: '进行中', count: 0, color: '#409EFF' },
    completed: { name: '已完成', count: 0, color: '#67C23A' },
    on_hold: { name: '暂停', count: 0, color: '#E6A23C' },
  }

  domainProjectsData.value.forEach((dp: any) => {
    if (statusMap[dp.status]) {
      statusMap[dp.status].count++
    }
  })

  const total = domainProjectsData.value.length
  return Object.values(statusMap).map(s => ({
    ...s,
    percentage: total > 0 ? Math.round((s.count / total) * 100) : 0
  }))
})

// 方法实现
const getVehicleIcon = (code: string) => {
  return '🚗'
}

const calculatePICount = (project: any) => {
  if (!project.domainProjects) return 0
  return project.domainProjects.reduce((sum: number, dp: any) => 
    sum + (dp.piPlannings?.length || 0), 0
  )
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return '#67c23a'
  if (progress >= 40) return '#409eff'
  return '#e6a23c'
}

const getRiskClass = (project: any) => {
  const riskMap: Record<string, any> = {
    low: { 'risk-low': true },
    medium: { 'risk-medium': true },
    high: { 'risk-high': true },
  }
  return riskMap[project.riskLevel] || {}
}

const getRiskTagType = (riskLevel: string) => {
  const typeMap: Record<string, any> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  }
  return typeMap[riskLevel] || 'info'
}

const getRiskText = (riskLevel: string) => {
  const textMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
  }
  return textMap[riskLevel] || riskLevel
}

const getNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    vehicle: Folder,
    domain: Management,
    pi: Calendar,
  }
  return iconMap[type] || Folder
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: '',
    active: 'success',
    completed: 'success',
    on_hold: 'warning',
  }
  return typeMap[status] || ''
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    planning: '计划中',
    in_progress: '进行中',
    active: '进行中',
    completed: '已完成',
    on_hold: '暂停',
  }
  return textMap[status] || status
}

const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    vehicle: '车型项目',
    domain: '领域项目',
    pi: 'PI Planning',
  }
  return labelMap[type] || type
}

const getMilestoneColor = (status: string) => {
  const colorMap: Record<string, string> = {
    completed: '#67c23a',
    in_progress: '#409eff',
    upcoming: '#909399',
  }
  return colorMap[status] || '#909399'
}

const selectVehicleProject = (project: any) => {
  selectedVehicleProjectId.value = project.id
  filterVehicleProject.value = project.id
  applyFilter()
  ElMessage.success(`已选中车型项目: ${project.name}`)
}

const handleNodeClick = (data: any) => {
  selectedNode.value = data
}

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

const handleSearch = () => {
  // 搜索逻辑已在 computed 中实现
}

const applyFilter = () => {
  // 筛选逻辑已在 computed 中实现
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
}

const exportReport = () => {
  ElMessage.success('报告导出功能开发中...')
}

const goToDetail = () => {
  if (!selectedNode.value) return

  let path = ''
  switch (selectedNode.value.type) {
    case 'vehicle':
      path = `/projects/vehicle/${selectedNode.value.data.id}`
      break
    case 'domain':
      path = `/projects/domain/${selectedNode.value.data.id}`
      break
    case 'pi':
      path = `/projects/pi-planning/${selectedNode.value.data.id}`
      break
    default:
      ElMessage.warning('未知项目类型')
      return
  }
  router.push(path)
}

// 监听树搜索文本变化
watch(treeSearchText, (val) => {
  treeRef.value?.filter(val)
})
</script>

<style scoped lang="scss">
.project-overview {
  .page-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-left {
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
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
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
      min-width: 260px;
      cursor: pointer;
      transition: all 0.3s;

      &.selected {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
      }

      &.risk-low {
        border-left: 4px solid #67c23a;
      }

      &.risk-medium {
        border-left: 4px solid #e6a23c;
      }

      &.risk-high {
        border-left: 4px solid #f56c6c;
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .card-icon {
        font-size: 32px;
        text-align: center;
        margin-bottom: 12px;
      }

      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        text-align: center;
      }

      .card-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 12px;

        .stat-item {
          text-align: center;

          .label {
            display: block;
            font-size: 12px;
            color: #909399;
          }

          .value {
            display: block;
            font-size: 18px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .progress-indicator {
        margin-bottom: 12px;

        span {
          font-size: 12px;
          color: #909399;
          margin-right: 8px;
        }
      }

      .risk-indicator {
        text-align: center;
      }
    }
  }

  .timeline-section {
    .timeline-view {
      max-height: 600px;
      overflow-y: auto;
      padding: 20px;

      .milestone-card {
        margin-bottom: 12px;

        .milestone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;

          h4 {
            margin: 0;
            font-size: 16px;
          }
        }

        .milestone-desc {
          margin: 8px 0;
          color: #606266;
        }

        .milestone-meta {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .gantt-placeholder {
      height: 400px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #fafafa;

      .hint {
        margin-top: 16px;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .tree-detail-section {
    .tree-card,
    .detail-card {
      height: 600px;

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

      .node-progress {
        width: 60px;
        margin-left: auto;
        margin-right: 8px;
      }
    }

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .detail-content {
      .detail-section {
        margin-bottom: 20px;
      }

      .detail-subsection {
        margin-top: 20px;

        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        p {
          margin: 0;
          color: #606266;
          line-height: 1.6;
        }
      }
    }
  }

  .metrics-row {
    margin-bottom: 20px;

    .metric-card {
      :deep(.el-statistic) {
        .el-statistic__head {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .el-statistic__content {
          font-size: 28px;
          font-weight: 600;
        }
      }

      .trend {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 8px;
        font-size: 12px;
      }
    }
  }

  .charts-row {
    .chart-card {
      .status-distribution {
        padding: 20px;

        .status-item {
          margin-bottom: 16px;
          position: relative;

          .status-bar {
            height: 24px;
            border-radius: 4px;
            transition: all 0.3s;
          }

          .status-label {
            position: absolute;
            left: 8px;
            top: 2px;
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          }
        }
      }

      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
      }
    }
  }
}
</style>
