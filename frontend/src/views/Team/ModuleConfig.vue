<template>
  <div class="team-module-config-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-button icon="ArrowLeft" @click="handleBack">返回</el-button>
      <h2>团队-模块配置</h2>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <!-- 左侧：团队信息 -->
      <el-col :span="10">
        <!-- 团队基本信息卡片 -->
        <el-card class="team-info-card" shadow="never">
          <template #header>
            <span>团队基本信息</span>
          </template>

          <el-descriptions :column="1" border>
            <el-descriptions-item label="团队名称">
              {{ team.name }}
            </el-descriptions-item>
            <el-descriptions-item label="团队代码">
              {{ team.code }}
            </el-descriptions-item>
            <el-descriptions-item label="团队负责人">
              {{ team.owner }}
            </el-descriptions-item>
            <el-descriptions-item label="团队成员">
              {{ team.members?.length || 0 }} 人
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ formatDate(team.createdAt) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 团队产能配置卡片 -->
        <el-card class="capacity-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>团队产能配置</span>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="handleEditCapacity"
              >
                编辑
              </el-button>
            </div>
          </template>

          <div class="capacity-item">
            <div class="capacity-label">Sprint产能</div>
            <div class="capacity-value">
              {{ team.capacity?.sprintCapacity || 0 }} <span class="unit">SP</span>
            </div>
          </div>

          <div class="capacity-item">
            <div class="capacity-label">历史速率</div>
            <div class="capacity-value">
              {{ team.capacity?.velocity || 0 }} <span class="unit">SP</span>
            </div>
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

        <!-- 当前工作概览卡片 -->
        <el-card class="work-overview-card" shadow="never">
          <template #header>
            <span>当前工作概览</span>
          </template>

          <div class="overview-item">
            <div class="overview-label">当前PI</div>
            <div class="overview-value">{{ team.currentPI || '-' }}</div>
          </div>

          <div class="overview-item">
            <div class="overview-label">当前Sprint</div>
            <div class="overview-value">{{ team.currentSprint || '-' }}</div>
          </div>

          <div class="overview-item">
            <div class="overview-label">当前工作项</div>
            <div class="overview-value">
              {{ team.workItems?.length || 0 }} 个
              <el-button
                v-if="team.workItems && team.workItems.length > 0"
                link
                type="primary"
                @click="handleViewWorkItems"
              >
                查看
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 团队统计卡片 -->
        <el-card class="stats-card" shadow="never">
          <template #header>
            <span>团队统计</span>
          </template>

          <div class="stat-item">
            <div class="stat-label">负责模块数</div>
            <div class="stat-value">{{ team.responsibleModules?.length || 0 }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">平均速率</div>
            <div class="stat-value">{{ team.metrics?.avgVelocity || 0 }} SP</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">完成率</div>
            <div class="stat-value">
              {{ Math.round((team.metrics?.completionRate || 0) * 100) }}%
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-label">缺陷率</div>
            <div class="stat-value">
              {{ Math.round((team.metrics?.defectRate || 0) * 100) }}%
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：模块配置 -->
      <el-col :span="14">
        <!-- 负责的模块列表卡片 -->
        <el-card class="modules-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>负责的模块 ({{ moduleList.length }})</span>
              <div>
                <el-button
                  type="primary"
                  icon="Plus"
                  @click="handleAddModules"
                >
                  添加模块
                </el-button>
                <el-button
                  :disabled="selectedModules.length === 0"
                  icon="Delete"
                  @click="handleRemoveModules"
                >
                  移除模块
                </el-button>
              </div>
            </div>
          </template>

          <el-alert
            v-if="moduleList.length === 0"
            title="该团队还未配置负责的模块"
            type="info"
            :closable="false"
            show-icon
            style="margin-bottom: 20px"
          >
            <template #default>
              <div>点击上方"添加模块"按钮为团队分配负责的模块</div>
            </template>
          </el-alert>

          <el-table
            v-if="moduleList.length > 0"
            :data="moduleList"
            border
            @selection-change="handleModuleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            
            <el-table-column prop="id" label="模块ID" width="120" />
            
            <el-table-column prop="name" label="模块名称" min-width="200">
              <template #default="{ row }">
                <el-link type="primary" @click="handleViewModule(row.id)">
                  {{ row.name }}
                </el-link>
              </template>
            </el-table-column>
            
            <el-table-column label="当前工作项" width="120" align="center">
              <template #default="{ row }">
                <el-tag type="warning">{{ row.currentWorkItems || 0 }}</el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="待办工作项" width="120" align="center">
              <template #default="{ row }">
                <el-tag type="info">{{ row.backlogWorkItems || 0 }}</el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="负责人" width="120">
              <template #default="{ row }">
                {{ row.responsiblePerson || '-' }}
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button
                  link
                  type="primary"
                  @click="handleViewModule(row.id)"
                >
                  详情
                </el-button>
                <el-button
                  link
                  type="primary"
                  @click="handleViewModuleWorkItems(row.id)"
                >
                  工作项
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 模块工作项分布图 -->
        <el-card class="chart-card" shadow="never">
          <template #header>
            <span>模块工作项分布</span>
          </template>

          <div ref="chartRef" style="height: 300px"></div>
        </el-card>

        <!-- 模块工作负载分析 -->
        <el-card class="workload-card" shadow="never">
          <template #header>
            <span>模块工作负载分析</span>
          </template>

          <el-table :data="moduleWorkload" border>
            <el-table-column prop="moduleName" label="模块" min-width="150" />
            
            <el-table-column label="工作项数" width="100" align="center">
              <template #default="{ row }">
                {{ row.workItemCount }}
              </template>
            </el-table-column>
            
            <el-table-column label="总工作量" width="120" align="center">
              <template #default="{ row }">
                {{ row.totalEffort }}h
              </template>
            </el-table-column>
            
            <el-table-column label="负载状态" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="getWorkloadType(row.load)">
                  {{ getWorkloadLabel(row.load) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="负载率" width="150">
              <template #default="{ row }">
                <el-progress
                  :percentage="Math.round(row.utilizationRate * 100)"
                  :color="getWorkloadColor(row.utilizationRate)"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加模块对话框 -->
    <el-dialog
      v-model="addModuleDialogVisible"
      title="添加模块"
      width="600px"
      @close="handleAddModuleDialogClose"
    >
      <el-transfer
        v-model="selectedModuleIds"
        :data="availableModules"
        :titles="['可选模块', '已选模块']"
        :button-texts="['移除', '添加']"
        :props="{ key: 'id', label: 'label' }"
        filterable
        filter-placeholder="搜索模块"
      />
      
      <template #footer>
        <el-button @click="addModuleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAddModules">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑产能对话框 -->
    <el-dialog
      v-model="editCapacityDialogVisible"
      title="编辑团队产能"
      width="500px"
    >
      <el-form :model="capacityForm" label-width="120px">
        <el-form-item label="Sprint产能">
          <el-input-number
            v-model="capacityForm.sprintCapacity"
            :min="0"
            :max="200"
            :step="5"
          />
          <span style="margin-left: 8px">SP</span>
        </el-form-item>
        
        <el-form-item label="历史速率">
          <el-input-number
            v-model="capacityForm.velocity"
            :min="0"
            :max="200"
            :step="1"
          />
          <span style="margin-left: 8px">SP</span>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="editCapacityDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmEditCapacity">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import type { Team } from '@/types/team'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 团队数据
const team = ref<Team>({
  id: '',
  name: '',
  code: '',
  members: [],
  responsibleModules: [],
  capacity: {
    sprintCapacity: 0,
    velocity: 0,
    utilizationRate: 0,
  },
  currentPI: '',
  currentSprint: '',
  workItems: [],
  owner: '',
  createdAt: '',
})

// 模块列表
const moduleList = ref<any[]>([])
const selectedModules = ref<any[]>([])

// 模块工作负载
const moduleWorkload = ref([
  {
    moduleId: 'MOD-001',
    moduleName: '摄像头感知模块',
    workItemCount: 2,
    totalEffort: 48,
    load: 'normal',
    utilizationRate: 0.65,
  },
  {
    moduleId: 'MOD-004',
    moduleName: '传感器融合模块',
    workItemCount: 4,
    totalEffort: 116,
    load: 'high',
    utilizationRate: 0.92,
  },
  {
    moduleId: 'MOD-012',
    moduleName: '3D目标检测模块',
    workItemCount: 1,
    totalEffort: 52,
    load: 'normal',
    utilizationRate: 0.73,
  },
])

// 添加模块对话框
const addModuleDialogVisible = ref(false)
const selectedModuleIds = ref<string[]>([])
const availableModules = ref([
  { id: 'MOD-001', label: 'MOD-001 - 摄像头感知模块' },
  { id: 'MOD-002', label: 'MOD-002 - 激光雷达感知模块' },
  { id: 'MOD-003', label: 'MOD-003 - 毫米波雷达感知模块' },
  { id: 'MOD-004', label: 'MOD-004 - 传感器融合模块' },
  { id: 'MOD-005', label: 'MOD-005 - 全局路径规划模块' },
  { id: 'MOD-006', label: 'MOD-006 - 局部路径规划模块' },
  { id: 'MOD-007', label: 'MOD-007 - 决策引擎模块' },
  { id: 'MOD-008', label: 'MOD-008 - 横向控制模块' },
  { id: 'MOD-009', label: 'MOD-009 - 纵向控制模块' },
  { id: 'MOD-010', label: 'MOD-010 - 高精地图模块' },
  { id: 'MOD-011', label: 'MOD-011 - 高精定位模块' },
  { id: 'MOD-012', label: 'MOD-012 - 3D目标检测模块' },
  { id: 'MOD-013', label: 'MOD-013 - 目标追踪模块' },
])

// 编辑产能对话框
const editCapacityDialogVisible = ref(false)
const capacityForm = reactive({
  sprintCapacity: 0,
  velocity: 0,
})

// 获取团队详情
const fetchTeamDetail = async () => {
  loading.value = true
  try {
    const teamId = route.params.id as string
    
    const response = await fetch('/biz-data/mock/teams.json')
    const data = await response.json()
    const teamData = data.data.find((t: Team) => t.id === teamId)
    
    if (teamData) {
      team.value = teamData
      
      // 构建模块列表
      moduleList.value = (teamData.moduleDetails || []).map((m: any) => ({
        id: m.id,
        name: m.name,
        currentWorkItems: Math.floor(Math.random() * 5),
        backlogWorkItems: Math.floor(Math.random() * 10),
        responsiblePerson: '工程师' + String.fromCharCode(65 + Math.floor(Math.random() * 3)),
      }))
      
      // 初始化图表
      await nextTick()
      initChart()
    } else {
      ElMessage.error('团队不存在')
      router.back()
    }
  } catch (error) {
    console.error('Failed to fetch team:', error)
    ElMessage.error('获取团队详情失败')
  } finally {
    loading.value = false
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: 10,
      left: 'center',
    },
    series: [
      {
        name: '工作项数量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: moduleWorkload.value.map((m) => ({
          name: m.moduleName,
          value: m.workItemCount,
        })),
      },
    ],
  }
  
  chartInstance.setOption(option)
}

// 工具函数
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

const getUtilizationColor = (rate: number) => {
  if (rate < 0.5) return '#67C23A'
  if (rate < 0.8) return '#E6A23C'
  return '#F56C6C'
}

const getWorkloadType = (load: string) => {
  const map: Record<string, any> = {
    low: 'success',
    normal: 'primary',
    high: 'warning',
    overload: 'danger',
  }
  return map[load] || 'info'
}

const getWorkloadLabel = (load: string) => {
  const map: Record<string, string> = {
    low: '轻负载',
    normal: '正常',
    high: '高负载',
    overload: '超载',
  }
  return map[load] || load
}

const getWorkloadColor = (rate: number) => {
  if (rate < 0.5) return '#67C23A'
  if (rate < 0.8) return '#E6A23C'
  return '#F56C6C'
}

// 事件处理
const handleBack = () => {
  router.back()
}

const handleEditCapacity = () => {
  capacityForm.sprintCapacity = team.value.capacity?.sprintCapacity || 0
  capacityForm.velocity = team.value.capacity?.velocity || 0
  editCapacityDialogVisible.value = true
}

const handleConfirmEditCapacity = () => {
  // TODO: 调用API保存产能配置
  if (team.value.capacity) {
    team.value.capacity.sprintCapacity = capacityForm.sprintCapacity
    team.value.capacity.velocity = capacityForm.velocity
  }
  ElMessage.success('产能配置已更新')
  editCapacityDialogVisible.value = false
}

const handleViewWorkItems = () => {
  router.push(`/work-items?teamId=${team.value.id}`)
}

const handleModuleSelectionChange = (selection: any[]) => {
  selectedModules.value = selection
}

const handleAddModules = () => {
  selectedModuleIds.value = [...team.value.responsibleModules]
  addModuleDialogVisible.value = true
}

const handleRemoveModules = async () => {
  try {
    await ElMessageBox.confirm(
      `确认移除选中的 ${selectedModules.value.length} 个模块吗？`,
      '确认移除',
      { type: 'warning' }
    )
    // TODO: 调用API移除模块
    const removedIds = selectedModules.value.map((m) => m.id)
    moduleList.value = moduleList.value.filter((m) => !removedIds.includes(m.id))
    ElMessage.success('模块已移除')
  } catch {
    // 用户取消
  }
}

const handleAddModuleDialogClose = () => {
  selectedModuleIds.value = []
}

const handleConfirmAddModules = () => {
  // TODO: 调用API添加模块
  ElMessage.success('模块已添加')
  addModuleDialogVisible.value = false
  fetchTeamDetail()
}

const handleViewModule = (moduleId: string) => {
  router.push(`/products/modules/${moduleId}`)
}

const handleViewModuleWorkItems = (moduleId: string) => {
  router.push(`/work-items?moduleId=${moduleId}`)
}

// 生命周期
onMounted(() => {
  fetchTeamDetail()
})
</script>

<style scoped lang="scss">
.team-module-config-container {
  padding: 20px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
}

.team-info-card,
.capacity-card,
.work-overview-card,
.stats-card,
.modules-card,
.chart-card,
.workload-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.capacity-item,
.overview-item {
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }

  .capacity-label,
  .overview-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }

  .capacity-value,
  .overview-value {
    font-size: 20px;
    font-weight: 600;
    color: #303133;

    .unit {
      font-size: 14px;
      font-weight: normal;
      color: #909399;
      margin-left: 4px;
    }
  }
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }

  .stat-label {
    font-size: 14px;
    color: #606266;
  }

  .stat-value {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}
</style>

