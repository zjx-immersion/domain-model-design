<template>
  <div class="project-planning-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#E6A23C"><Calendar /></el-icon>
            <div class="stage-text">
              <h2>L2项目规划</h2>
              <p>PI Planning → 团队分配 → 迭代计划</p>
            </div>
          </div>
          <el-tag type="warning" size="large">价值流阶段 3/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="当前PI">PI 2026 Q1</el-descriptions-item>
        <el-descriptions-item label="团队数量">8个</el-descriptions-item>
        <el-descriptions-item label="Sprint数量">5个</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="primary">规划中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="8">
        <el-card>
          <template #header>
            <span><el-icon><User /></el-icon> 团队容量</span>
          </template>
          <div class="team-capacity">
            <div v-for="team in teams" :key="team.name" class="team-item">
              <div class="team-name">{{ team.name }}</div>
              <el-progress
                :percentage="Math.round((team.allocated / team.capacity) * 100)"
                :status="team.allocated > team.capacity ? 'exception' : 'success'"
              >
                <span>{{ team.allocated }}/{{ team.capacity }} SP</span>
              </el-progress>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card>
          <template #header>
            <span><el-icon><Histogram /></el-icon> Sprint规划视图</span>
          </template>
          <div ref="sprintChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><Grid /></el-icon> 工作项分配矩阵</span>
      </template>
      <el-table :data="workItems" border>
        <el-table-column prop="id" label="工作项ID" width="120" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sp" label="SP" width="60" align="center" />
        <el-table-column prop="team" label="分配团队" width="150" />
        <el-table-column prop="sprint" label="计划Sprint" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="io-card input-card">
          <template #header>
            <span><el-icon><Download /></el-icon> 阶段输入</span>
          </template>
          <el-tag v-for="input in stageInputs" :key="input" type="info" style="margin: 5px">
            {{ input }}
          </el-tag>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="io-card output-card">
          <template #header>
            <span><el-icon><Upload /></el-icon> 阶段输出</span>
          </template>
          <el-tag v-for="output in stageOutputs" :key="output" type="success" style="margin: 5px">
            {{ output }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-button type="primary" size="large" @click="goToNextStage" style="width: 100%">
        <el-icon><Right /></el-icon>
        流转到下一阶段：L2迭代研发
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const sprintChartRef = ref<HTMLElement>()

const teams = ref([
  { name: '感知团队', capacity: 80, allocated: 75 },
  { name: '规划团队', capacity: 65, allocated: 68 },
  { name: '控制团队', capacity: 70, allocated: 65 },
  { name: '平台团队', capacity: 60, allocated: 55 },
])

const workItems = ref([
  { id: 'WI-001', title: '激光雷达融合算法', type: 'module_requirement', sp: 13, team: '感知团队', sprint: 'Sprint 1', status: '已分配' },
  { id: 'WI-002', title: '路径规划优化', type: 'module_requirement', sp: 8, team: '规划团队', sprint: 'Sprint 1', status: '已分配' },
  { id: 'WI-003', title: '控制精度提升', type: 'optimization', sp: 5, team: '控制团队', sprint: 'Sprint 2', status: '已分配' },
])

const stageInputs = ref([
  '需求列表',
  '团队容量',
  '技术依赖',
  '优先级排序',
])

const stageOutputs = ref([
  'PI计划',
  'Sprint计划',
  '团队工作项分配',
  '依赖关系图',
  '风险列表',
])

const initSprintChart = () => {
  if (sprintChartRef.value) {
    const chart = echarts.init(sprintChartRef.value)
    chart.setOption({
      title: { text: 'Sprint工作量分配', left: 'center' },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['感知团队', '规划团队', '控制团队', '平台团队'], bottom: 10 },
      xAxis: { type: 'category', data: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'] },
      yAxis: { type: 'value', name: 'Story Points' },
      series: [
        { name: '感知团队', type: 'bar', stack: 'total', data: [15, 18, 16, 14, 12] },
        { name: '规划团队', type: 'bar', stack: 'total', data: [13, 14, 12, 15, 11] },
        { name: '控制团队', type: 'bar', stack: 'total', data: [14, 13, 14, 12, 12] },
        { name: '平台团队', type: 'bar', stack: 'total', data: [11, 12, 10, 13, 9] },
      ],
    })
  }
}

const getTypeTag = (type: string) => {
  const map: Record<string, any> = {
    module_requirement: 'primary',
    optimization: 'success',
    bugfix: 'warning',
  }
  return map[type] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    已分配: 'success',
    待分配: 'warning',
  }
  return map[status] || 'info'
}

const goToNextStage = () => {
  router.push('/value-stream/iteration-rd')
}

onMounted(() => {
  initSprintChart()
})
</script>

<style scoped lang="scss">
.project-planning-container {
  padding: 20px;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .stage-info {
    display: flex;
    align-items: center;
    gap: 15px;

    .stage-text {
      h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
      }

      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }
}

.team-capacity {
  .team-item {
    margin-bottom: 20px;

    .team-name {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }
  }
}

.io-card {
  min-height: 200px;

  &.input-card {
    border-left: 4px solid #409EFF;
  }

  &.output-card {
    border-left: 4px solid #67C23A;
  }
}
</style>

