<template>
  <div class="testing-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#B88230"><Operation /></el-icon>
            <div class="stage-text">
              <h2>L2测试验证</h2>
              <p>测试执行 → 缺陷跟踪 → 质量报告</p>
            </div>
          </div>
          <el-tag color="#B88230" size="large">价值流阶段 6/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="测试用例数">1,856个</el-descriptions-item>
        <el-descriptions-item label="执行进度">85%</el-descriptions-item>
        <el-descriptions-item label="通过率">92.3%</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="warning">测试中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><PieChart /></el-icon> 测试覆盖率</span>
          </template>
          <div ref="coverageChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><TrendCharts /></el-icon> 缺陷趋势</span>
          </template>
          <div ref="defectTrendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><List /></el-icon> 测试计划执行</span>
      </template>
      <el-table :data="testPlans" border>
        <el-table-column prop="planId" label="计划ID" width="120" />
        <el-table-column prop="name" label="计划名称" min-width="200" />
        <el-table-column label="测试版本" width="120">
          <template #default="{ row }">
            <el-link type="primary">{{ row.buildVersion }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="200">
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round((row.passedCount / row.totalCount) * 100)"
              :status="row.passedCount === row.totalCount ? 'success' : undefined"
            />
            <div style="font-size: 12px; color: #909399; margin-top: 4px">
              {{ row.passedCount }}/{{ row.totalCount }} 通过
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">详情</el-button>
            <el-button link type="primary" size="small">报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><Warning /></el-icon> 活跃缺陷</span>
      </template>
      <el-table :data="defects" border>
        <el-table-column prop="defectId" label="缺陷ID" width="120" />
        <el-table-column prop="title" label="缺陷标题" min-width="200" />
        <el-table-column label="严重程度" width="100">
          <template #default="{ row }">
            <el-tag :type="getSeverityType(row.severity)" size="small">
              {{ row.severity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getDefectStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assignedTo" label="指派给" width="100" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">查看</el-button>
            <el-button link size="small">追溯</el-button>
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
        流转到下一阶段：L2需求验收
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const coverageChartRef = ref<HTMLElement>()
const defectTrendChartRef = ref<HTMLElement>()

const testPlans = ref([
  { planId: 'TP-001', name: 'v2.5.0版本功能测试', buildVersion: 'v2.5.0', totalCount: 45, passedCount: 43, status: '已完成' },
  { planId: 'TP-004', name: 'v2.6.0版本测试计划', buildVersion: 'v2.6.0-dev', totalCount: 52, passedCount: 18, status: '进行中' },
])

const defects = ref([
  { defectId: 'DEF-001', title: '紧急刹车在特定场景下失效', severity: '致命', status: '修复中', assignedTo: '王工' },
  { defectId: 'DEF-004', title: '车道线识别在夜间准确率下降', severity: '一般', status: '待修复', assignedTo: '赵工' },
])

const stageInputs = ref([
  '构建产物',
  '测试环境',
  '测试用例',
  '测试数据',
])

const stageOutputs = ref([
  '测试报告',
  '缺陷列表',
  '覆盖率报告',
  '质量评估',
  '回归测试结果',
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    已完成: 'success',
    进行中: 'warning',
    未开始: 'info',
  }
  return map[status] || 'info'
}

const getSeverityType = (severity: string) => {
  const map: Record<string, any> = {
    致命: 'danger',
    严重: 'warning',
    一般: 'primary',
    轻微: 'info',
  }
  return map[severity] || 'info'
}

const getDefectStatusType = (status: string) => {
  const map: Record<string, any> = {
    待修复: 'danger',
    修复中: 'warning',
    待验证: 'primary',
    已关闭: 'success',
  }
  return map[status] || 'info'
}

const initCharts = () => {
  if (coverageChartRef.value) {
    const chart = echarts.init(coverageChartRef.value)
    chart.setOption({
      title: { text: '测试覆盖率', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'gauge',
        progress: { show: true },
        detail: { valueAnimation: true, formatter: '{value}%' },
        data: [{ value: 78.5, name: '代码覆盖率' }],
      }],
    })
  }

  if (defectTrendChartRef.value) {
    const chart = echarts.init(defectTrendChartRef.value)
    chart.setOption({
      title: { text: '缺陷趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['新增', '修复', '累计'], bottom: 10 },
      xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周'] },
      yAxis: { type: 'value' },
      series: [
        { name: '新增', type: 'bar', data: [12, 8, 5, 3] },
        { name: '修复', type: 'bar', data: [10, 9, 6, 4] },
        { name: '累计', type: 'line', data: [12, 11, 10, 9] },
      ],
    })
  }
}

const goToNextStage = () => {
  router.push('/value-stream/acceptance')
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped lang="scss">
.testing-container {
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

