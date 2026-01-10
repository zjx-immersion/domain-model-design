<template>
  <div class="requirement-analysis-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#67C23A"><Document /></el-icon>
            <div class="stage-text">
              <h2>L2需求分析</h2>
              <p>需求识别 → 需求分解 → 验收标准</p>
            </div>
          </div>
          <el-tag type="success" size="large">价值流阶段 2/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="当前PI">PI 2026 Q1</el-descriptions-item>
        <el-descriptions-item label="需求总数">156个</el-descriptions-item>
        <el-descriptions-item label="负责人">需求分析团队</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="warning">分析中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span><el-icon><List /></el-icon> 需求分解流程</span>
          </template>
          <div ref="flowChartRef" style="height: 400px"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span><el-icon><PieChart /></el-icon> 需求分布</span>
          </template>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-label">用户需求</div>
              <div class="stat-value">24个</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">特性需求</div>
              <div class="stat-value">68个</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">模块需求</div>
              <div class="stat-value">156个</div>
            </div>
            <el-divider />
            <div class="stat-item">
              <div class="stat-label">分析完成度</div>
              <el-progress :percentage="82" status="success" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><DocumentChecked /></el-icon> 待分析需求列表</span>
      </template>
      <el-table :data="requirements" border>
        <el-table-column prop="id" label="需求ID" width="120" />
        <el-table-column prop="title" label="需求标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80" />
        <el-table-column prop="storyPoints" label="故事点" width="80" align="center" />
        <el-table-column label="分析状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">分析</el-button>
            <el-button link type="primary" size="small">分解</el-button>
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
        流转到下一阶段：L2项目规划
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const flowChartRef = ref<HTMLElement>()

const requirements = ref([
  { id: 'UR-001', title: '提升感知精度', type: '用户需求', priority: 'P0', storyPoints: 13, status: '已分析' },
  { id: 'FR-005', title: '激光雷达融合算法', type: '特性需求', priority: 'P0', storyPoints: 8, status: '分析中' },
  { id: 'MR-012', title: '点云处理优化', type: '模块需求', priority: 'P1', storyPoints: 5, status: '待分析' },
])

const stageInputs = ref([
  '产品路线图',
  '业务目标',
  '特性列表',
  '用户反馈',
])

const stageOutputs = ref([
  '用户需求列表',
  '特性需求列表',
  '模块需求列表',
  '需求追溯矩阵',
  '验收标准',
])

const initFlowChart = () => {
  if (flowChartRef.value) {
    const chart = echarts.init(flowChartRef.value)
    chart.setOption({
      title: { text: '需求分解流程', left: 'center' },
      tooltip: {},
      series: [{
        type: 'tree',
        data: [{
          name: '用户需求',
          children: [{
            name: '特性需求1',
            children: [
              { name: '模块需求1' },
              { name: '模块需求2' },
            ],
          }, {
            name: '特性需求2',
            children: [
              { name: '模块需求3' },
            ],
          }],
        }],
        top: '10%',
        left: '10%',
        bottom: '10%',
        right: '20%',
        symbolSize: 14,
        label: { position: 'left', verticalAlign: 'middle', align: 'right' },
        leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
      }],
    })
  }
}

const getTypeTag = (type: string) => {
  const map: Record<string, any> = {
    用户需求: 'primary',
    特性需求: 'success',
    模块需求: 'warning',
  }
  return map[type] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    已分析: 'success',
    分析中: 'warning',
    待分析: 'info',
  }
  return map[status] || 'info'
}

const goToNextStage = () => {
  router.push('/value-stream/project-planning')
}

onMounted(() => {
  initFlowChart()
})
</script>

<style scoped lang="scss">
.requirement-analysis-container {
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

.stats {
  .stat-item {
    margin-bottom: 20px;

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
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

