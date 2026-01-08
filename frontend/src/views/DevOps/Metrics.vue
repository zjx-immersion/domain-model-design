<template>
  <div class="devops-metrics-container">
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
            <span>构建成功率趋势</span>
          </template>
          <div ref="buildTrendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>部署频率</span>
          </template>
          <div ref="deployFrequencyChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>平均修复时间(MTTR)</span>
          </template>
          <div ref="mttrChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>变更失败率</span>
          </template>
          <div ref="changeFailureChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const metrics = ref([
  { key: 'builds', label: '总构建次数', value: '1,248', icon: 'DataLine', color: '#409EFF' },
  { key: 'deployments', label: '总部署次数', value: '342', icon: 'Upload', color: '#67C23A' },
  { key: 'successRate', label: '成功率', value: '94.2%', icon: 'SuccessFilled', color: '#67C23A' },
  { key: 'avgTime', label: '平均构建时间', value: '8.5分钟', icon: 'Timer', color: '#E6A23C' },
])

const buildTrendChartRef = ref<HTMLElement>()
const deployFrequencyChartRef = ref<HTMLElement>()
const mttrChartRef = ref<HTMLElement>()
const changeFailureChartRef = ref<HTMLElement>()

const initCharts = () => {
  if (buildTrendChartRef.value) {
    const chart = echarts.init(buildTrendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: { type: 'value', name: '成功率(%)' },
      series: [{
        name: '成功率',
        type: 'line',
        data: [92, 94, 91, 95, 94, 93, 96],
        smooth: true,
        areaStyle: { opacity: 0.3 },
      }],
    })
  }

  if (deployFrequencyChartRef.value) {
    const chart = echarts.init(deployFrequencyChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      yAxis: { type: 'value', name: '次数' },
      series: [{
        name: '部署次数',
        type: 'bar',
        data: [8, 12, 10, 15, 18, 5, 3],
      }],
    })
  }

  if (mttrChartRef.value) {
    const chart = echarts.init(mttrChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周'],
      },
      yAxis: { type: 'value', name: '小时' },
      series: [{
        name: 'MTTR',
        type: 'line',
        data: [2.5, 2.2, 1.8, 1.5],
      }],
    })
  }

  if (changeFailureChartRef.value) {
    const chart = echarts.init(changeFailureChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周'],
      },
      yAxis: { type: 'value', name: '失败率(%)' },
      series: [{
        name: '失败率',
        type: 'line',
        data: [8, 7, 6, 5],
      }],
    })
  }
}

onMounted(async () => {
  await nextTick()
  initCharts()
})
</script>

<style scoped lang="scss">
.devops-metrics-container {
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

