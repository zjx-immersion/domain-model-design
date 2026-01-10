<template>
  <div class="integration-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#909399"><SetUp /></el-icon>
            <div class="stage-text">
              <h2>L2集成晋级</h2>
              <p>持续集成 → 构建 → 环境部署</p>
            </div>
          </div>
          <el-tag type="info" size="large">价值流阶段 5/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="本周构建">42次</el-descriptions-item>
        <el-descriptions-item label="成功率">94.2%</el-descriptions-item>
        <el-descriptions-item label="当前环境">测试环境</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="success">运行中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><DataLine /></el-icon> 构建成功率趋势</span>
          </template>
          <div ref="buildTrendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><Odometer /></el-icon> 环境部署状态</span>
          </template>
          <div class="env-status">
            <div v-for="env in environments" :key="env.name" class="env-item">
              <div class="env-header">
                <span class="env-name">{{ env.name }}</span>
                <el-tag :type="env.status === 'running' ? 'success' : 'info'" size="small">
                  {{ env.status === 'running' ? '运行中' : '已停止' }}
                </el-tag>
              </div>
              <div class="env-info">
                <span>版本: {{ env.version }}</span>
                <span>更新: {{ env.lastUpdate }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><List /></el-icon> 最近构建记录</span>
      </template>
      <el-table :data="builds" border>
        <el-table-column prop="buildNumber" label="构建号" width="100">
          <template #default="{ row }">
            <el-link type="primary">#{{ row.buildNumber }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="150" />
        <el-table-column prop="branch" label="分支" width="150" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="耗时" width="100">
          <template #default="{ row }">
            {{ row.duration }}分钟
          </template>
        </el-table-column>
        <el-table-column prop="time" label="构建时间" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">详情</el-button>
            <el-button link type="primary" size="small">日志</el-button>
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
        流转到下一阶段：L2测试验证
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const buildTrendChartRef = ref<HTMLElement>()

const environments = ref([
  { name: '开发环境', status: 'running', version: 'v2.5.0-dev', lastUpdate: '2小时前' },
  { name: '测试环境', status: 'running', version: 'v2.4.5', lastUpdate: '1天前' },
  { name: '预发布环境', status: 'running', version: 'v2.4.0', lastUpdate: '3天前' },
  { name: '生产环境', status: 'running', version: 'v2.3.5', lastUpdate: '1周前' },
])

const builds = ref([
  { buildNumber: 2024, module: '感知模块', branch: 'feature/perception', status: '成功', duration: 8, time: '2026-01-05 14:28' },
  { buildNumber: 2023, module: '规划模块', branch: 'main', status: '成功', duration: 7, time: '2026-01-05 10:22' },
  { buildNumber: 2022, module: '控制模块', branch: 'hotfix/control', status: '失败', duration: 3, time: '2026-01-04 16:47' },
])

const stageInputs = ref([
  '代码提交',
  '功能分支',
  '配置文件',
  '依赖库',
])

const stageOutputs = ref([
  '构建产物',
  'Docker镜像',
  '部署包',
  '构建报告',
  '环境配置',
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    成功: 'success',
    失败: 'danger',
    进行中: 'warning',
  }
  return map[status] || 'info'
}

const initChart = () => {
  if (buildTrendChartRef.value) {
    const chart = echarts.init(buildTrendChartRef.value)
    chart.setOption({
      title: { text: '构建成功率趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
      yAxis: { type: 'value', name: '成功率(%)' },
      series: [{
        type: 'line',
        data: [92, 94, 91, 95, 94],
        smooth: true,
        areaStyle: { opacity: 0.3 },
      }],
    })
  }
}

const goToNextStage = () => {
  router.push('/value-stream/testing')
}

onMounted(() => {
  initChart()
})
</script>

<style scoped lang="scss">
.integration-container {
  padding: 0;
  width: 100%;
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

.env-status {
  .env-item {
    padding: 15px;
    margin-bottom: 15px;
    background: #f5f7fa;
    border-radius: 4px;

    .env-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .env-name {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .env-info {
      display: flex;
      gap: 20px;
      font-size: 13px;
      color: #606266;
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

