<template>
  <div class="sprint-detail-container">
    <div class="page-header">
      <el-button icon="ArrowLeft" @click="handleBack">返回</el-button>
      <div class="header-actions">
        <el-button icon="View" @click="goToBoard">看板视图</el-button>
        <el-button icon="Edit" @click="handleEdit">编辑</el-button>
        <el-button icon="Download" @click="handleExport">导出</el-button>
      </div>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <h2>{{ sprint.name }}</h2>
              <el-tag :type="getStatusType(sprint.status)" size="large">
                {{ getStatusLabel(sprint.status) }}
              </el-tag>
            </div>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="Sprint ID">
              {{ sprint.id }}
            </el-descriptions-item>
            <el-descriptions-item label="所属PI">
              <el-link type="primary">{{ sprint.piId }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="开始日期">
              {{ formatDate(sprint.startDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="结束日期">
              {{ formatDate(sprint.endDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="所属团队">
              <el-link type="primary">{{ sprint.teamId }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="来源Backlog">
              <router-link :to="`/backlog/team/${sprint.teamId}`" class="backlog-link">
                <el-tag type="info" size="small">TeamBacklog</el-tag>
                查看团队待办
              </router-link>
            </el-descriptions-item>
            <el-descriptions-item label="Sprint目标" :span="2">
              {{ sprint.goal || '暂无目标' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="work-items-card">
          <template #header>
            <div class="card-header">
              <span>工作项列表 ({{ workItems.length }})</span>
              <el-button type="primary" icon="Plus" @click="handleAddWorkItem">
                添加工作项
              </el-button>
            </div>
          </template>

          <el-table :data="workItems" border>
            <el-table-column prop="id" label="ID" width="120">
              <template #default="{ row }">
                <el-link type="primary" @click="goToWorkItem(row.id)">
                  {{ row.id }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
            <el-table-column label="类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getTypeTagType(row.type)" size="small">
                  {{ getTypeLabel(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)" size="small">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="assignee" label="负责人" width="100" />
            <el-table-column label="进度" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.progress * 100" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="burndown-card">
          <template #header>
            <span>燃尽图</span>
          </template>
          <div ref="burndownChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>Sprint统计</span>
          </template>

          <div class="stat-item">
            <div class="stat-label">团队产能</div>
            <div class="stat-value">{{ sprint.capacity }}h</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已承诺</div>
            <div class="stat-value">{{ sprint.commitment }}h</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">已完成</div>
            <div class="stat-value">{{ sprint.completedEffort }}h</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">完成率</div>
            <div class="stat-value">{{ getCompletionRate() }}%</div>
          </div>
        </el-card>

        <el-card>
          <template #header>
            <span>团队成员</span>
          </template>
          <div v-for="member in sprint.members" :key="member" class="member-item">
            <el-avatar>{{ member.substring(0, 1) }}</el-avatar>
            <span>{{ member }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()
const loading = ref(true)

const sprint = ref<any>({})
const workItems = ref<any[]>([])

const burndownChartRef = ref<HTMLElement>()
let burndownChart: echarts.ECharts | null = null

const fetchSprintDetail = async () => {
  loading.value = true
  try {
    const sprintId = route.params.id as string
    const response = await fetch('/biz-data/mock/sprint/sprint-details.json')
    const data = await response.json()
    const sprintData = data.data.find((s: any) => s.id === sprintId)
    
    if (sprintData) {
      sprint.value = sprintData
      workItems.value = sprintData.workItems || []
      
      await nextTick()
      initBurndownChart()
    }
  } catch (error) {
    ElMessage.error('获取Sprint详情失败')
  } finally {
    loading.value = false
  }
}

const initBurndownChart = () => {
  if (!burndownChartRef.value) return
  
  burndownChart = echarts.init(burndownChartRef.value)
  burndownChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['理想燃尽', '实际燃尽'] },
    xAxis: {
      type: 'category',
      data: ['第1天', '第2天', '第3天', '第4天', '第5天', '第6天', '第7天'],
    },
    yAxis: { type: 'value', name: '剩余工作量(h)' },
    series: [
      {
        name: '理想燃尽',
        type: 'line',
        data: [120, 102, 85, 68, 51, 34, 17],
        lineStyle: { type: 'dashed' },
      },
      {
        name: '实际燃尽',
        type: 'line',
        data: [120, 110, 95, 80, 65, 50, 35],
      },
    ],
  })
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    planned: 'info',
    active: 'warning',
    completed: 'success',
    cancelled: 'danger',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    planned: '已规划',
    active: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    todo: '待办',
    in_progress: '进行中',
    in_review: '评审中',
    done: '已完成',
  }
  return map[status] || status
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    module_requirement: '模块需求',
    bugfix: 'Bugfix',
    tech_debt: '技术债',
    non_functional: '非功能需求',
  }
  return map[type] || type
}

const getTypeTagType = (type: string) => {
  const map: Record<string, any> = {
    module_requirement: 'primary',
    bugfix: 'danger',
    tech_debt: 'warning',
    non_functional: 'info',
  }
  return map[type] || 'info'
}

const formatDate = (date: string) => {
  return date ? new Date(date).toLocaleDateString('zh-CN') : '-'
}

const getCompletionRate = () => {
  if (!sprint.value.commitment) return 0
  return Math.round((sprint.value.completedEffort / sprint.value.commitment) * 100)
}

const handleBack = () => router.back()
const goToBoard = () => router.push(`/sprints/${sprint.value.id}/board`)
const handleEdit = () => ElMessage.info('编辑功能开发中')
const handleExport = () => ElMessage.info('导出功能开发中')
const handleAddWorkItem = () => ElMessage.info('添加工作项功能开发中')
const goToWorkItem = (id: string) => router.push(`/work-items/${id}`)

onMounted(() => {
  fetchSprintDetail()
})
</script>

<style scoped lang="scss">
.sprint-detail-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.backlog-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
  }
}

.work-items-card,
.burndown-card {
  margin-top: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }

  .stat-label {
    color: #606266;
  }

  .stat-value {
    font-weight: 600;
    color: #303133;
  }
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #EBEEF5;

  &:last-child {
    border-bottom: none;
  }
}
</style>


