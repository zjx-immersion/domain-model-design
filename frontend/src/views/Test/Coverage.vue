<template>
  <div class="test-coverage-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="metric in metrics" :key="metric.key">
        <el-card shadow="hover" class="metric-card">
          <div class="metric-content">
            <el-icon :size="40" :color="metric.color">
              <component :is="metric.icon" />
            </el-icon>
            <div class="metric-text">
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value">{{ metric.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>模块覆盖率</span>
          </template>
          <div ref="moduleCoverageChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>代码覆盖率趋势</span>
          </template>
          <div ref="coverageTrendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span>模块详细覆盖率</span>
      </template>
      <el-table :data="moduleCoverage" border>
        <el-table-column prop="module" label="模块" min-width="150">
          <template #default="{ row }">
            <el-link type="primary" @click="goToModule(row.moduleId)">
              {{ row.module }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="代码覆盖率" width="200">
          <template #default="{ row }">
            <el-progress :percentage="row.codeCoverage" :color="getCoverageColor(row.codeCoverage)" />
          </template>
        </el-table-column>
        <el-table-column label="需求覆盖率" width="200">
          <template #default="{ row }">
            <el-progress :percentage="row.requirementCoverage" :color="getCoverageColor(row.requirementCoverage)" />
          </template>
        </el-table-column>
        <el-table-column prop="testCaseCount" label="测试用例数" width="120" align="center" />
        <el-table-column prop="lastUpdateTime" label="更新时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.lastUpdateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="viewTraceability(row)">追溯</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()

const metrics = ref([
  { key: 'code', label: '代码覆盖率', value: '78.5%', icon: 'Checked', color: '#67C23A' },
  { key: 'requirement', label: '需求覆盖率', value: '92.3%', icon: 'Document', color: '#409EFF' },
  { key: 'testCase', label: '测试用例数', value: '1,856', icon: 'List', color: '#E6A23C' },
  { key: 'branch', label: '分支覆盖率', value: '65.2%', icon: 'Connection', color: '#F56C6C' },
])

const moduleCoverage = ref<any[]>([])
const moduleCoverageChartRef = ref<HTMLElement>()
const coverageTrendChartRef = ref<HTMLElement>()

const fetchCoverageData = async () => {
  try {
    const response = await fetch('/biz-data/mock/test/coverage.json')
    const data = await response.json()
    moduleCoverage.value = data.data
  } catch (error) {
    ElMessage.error('获取覆盖率数据失败')
  }
}

const getCoverageColor = (coverage: number) => {
  if (coverage >= 80) return '#67C23A'
  if (coverage >= 60) return '#E6A23C'
  return '#F56C6C'
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const initCharts = () => {
  if (moduleCoverageChartRef.value) {
    const chart = echarts.init(moduleCoverageChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { data: ['代码覆盖率', '需求覆盖率'] },
      xAxis: {
        type: 'category',
        data: ['感知模块', '规划模块', '控制模块', '仿真平台', '工具链'],
      },
      yAxis: { type: 'value', name: '覆盖率(%)' },
      series: [
        {
          name: '代码覆盖率',
          type: 'bar',
          data: [75, 82, 68, 90, 78],
        },
        {
          name: '需求覆盖率',
          type: 'bar',
          data: [88, 95, 85, 98, 92],
        },
      ],
    })
  }

  if (coverageTrendChartRef.value) {
    const chart = echarts.init(coverageTrendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['代码覆盖率', '需求覆盖率'] },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
      },
      yAxis: { type: 'value', name: '覆盖率(%)' },
      series: [
        {
          name: '代码覆盖率',
          type: 'line',
          data: [65, 68, 72, 75, 77, 78],
          smooth: true,
        },
        {
          name: '需求覆盖率',
          type: 'line',
          data: [85, 87, 89, 90, 91, 92],
          smooth: true,
        },
      ],
    })
  }
}

const viewDetail = (row: any) => ElMessage.info(`查看模块覆盖率详情: ${row.module}`)
const viewTraceability = (row: any) => {
  router.push(`/requirements/traceability?moduleId=${row.moduleId}`)
}
const goToModule = (moduleId: string) => router.push(`/assets/modules/${moduleId}`)

onMounted(async () => {
  await fetchCoverageData()
  await nextTick()
  initCharts()
})
</script>

<style scoped lang="scss">
.test-coverage-container {
  padding: 20px;
}

.metric-card {
  .metric-content {
    display: flex;
    align-items: center;
    gap: 20px;

    .metric-text {
      flex: 1;

      .metric-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
      }

      .metric-value {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
      }
    }
  }
}
</style>

