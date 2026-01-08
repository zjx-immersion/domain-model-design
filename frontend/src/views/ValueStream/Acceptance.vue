<template>
  <div class="acceptance-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#67C23A"><Select /></el-icon>
            <div class="stage-text">
              <h2>L2需求验收</h2>
              <p>验收测试 → 用户确认 → 签字批准</p>
            </div>
          </div>
          <el-tag type="success" size="large">价值流阶段 7/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="待验收需求">24个</el-descriptions-item>
        <el-descriptions-item label="验收中">8个</el-descriptions-item>
        <el-descriptions-item label="已验收">16个</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="primary">验收中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><PieChart /></el-icon> 验收状态分布</span>
          </template>
          <div ref="statusChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><TrendCharts /></el-icon> 验收通过率趋势</span>
          </template>
          <div ref="trendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><List /></el-icon> 需求验收列表</span>
      </template>
      <el-table :data="requirements" border>
        <el-table-column prop="id" label="需求ID" width="120">
          <template #default="{ row }">
            <el-link type="primary">{{ row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="需求标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="验收人" width="100">
          <template #default="{ row }">
            {{ row.acceptanceBy }}
          </template>
        </el-table-column>
        <el-table-column label="验收状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="验收标准" width="100">
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round((row.passedCriteria / row.totalCriteria) * 100)"
              :status="row.passedCriteria === row.totalCriteria ? 'success' : undefined"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">验收</el-button>
            <el-button link type="success" size="small">通过</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><DocumentChecked /></el-icon> 验收检查单</span>
      </template>
      <el-collapse>
        <el-collapse-item
          v-for="requirement in requirements"
          :key="requirement.id"
          :title="`${requirement.id} - ${requirement.title}`"
        >
          <div class="checklist">
            <div v-for="(criterion, index) in requirement.criteria" :key="index" class="criterion-item">
              <el-checkbox :model-value="criterion.passed">
                {{ criterion.description }}
              </el-checkbox>
              <el-tag v-if="criterion.passed" type="success" size="small">已验证</el-tag>
              <el-tag v-else type="warning" size="small">待验证</el-tag>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
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
        流转到下一阶段：L2发布交付
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const statusChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

const requirements = ref([
  {
    id: 'UR-001',
    title: '提升感知精度',
    type: '用户需求',
    acceptanceBy: '产品经理',
    status: '已通过',
    totalCriteria: 5,
    passedCriteria: 5,
    criteria: [
      { description: '激光雷达检测距离≥200m', passed: true },
      { description: '障碍物识别准确率≥95%', passed: true },
      { description: '响应时间≤100ms', passed: true },
      { description: '环境适应性测试通过', passed: true },
      { description: '用户手册完整', passed: true },
    ],
  },
  {
    id: 'FR-005',
    title: '激光雷达融合算法',
    type: '特性需求',
    acceptanceBy: '技术负责人',
    status: '验收中',
    totalCriteria: 4,
    passedCriteria: 3,
    criteria: [
      { description: '点云融合精度≥98%', passed: true },
      { description: '处理延迟≤50ms', passed: true },
      { description: '多传感器协同工作', passed: true },
      { description: '异常场景处理', passed: false },
    ],
  },
])

const stageInputs = ref([
  '测试报告',
  '质量评估',
  '验收标准',
  '用户反馈',
])

const stageOutputs = ref([
  '验收报告',
  '验收签字',
  '发布许可',
  '用户培训',
  '操作手册',
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    已通过: 'success',
    验收中: 'warning',
    待验收: 'info',
    未通过: 'danger',
  }
  return map[status] || 'info'
}

const initCharts = () => {
  if (statusChartRef.value) {
    const chart = echarts.init(statusChartRef.value)
    chart.setOption({
      title: { text: '验收状态分布', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: [
          { value: 16, name: '已通过' },
          { value: 8, name: '验收中' },
          { value: 0, name: '未通过' },
        ],
      }],
    })
  }

  if (trendChartRef.value) {
    const chart = echarts.init(trendChartRef.value)
    chart.setOption({
      title: { text: '验收通过率趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['第1周', '第2周', '第3周', '第4周'] },
      yAxis: { type: 'value', name: '通过率(%)' },
      series: [{
        type: 'line',
        data: [90, 92, 95, 98],
        smooth: true,
        areaStyle: { opacity: 0.3 },
      }],
    })
  }
}

const goToNextStage = () => {
  router.push('/value-stream/release')
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped lang="scss">
.acceptance-container {
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

.checklist {
  .criterion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin-bottom: 8px;
    background: #f5f7fa;
    border-radius: 4px;
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

