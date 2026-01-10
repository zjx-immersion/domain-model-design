<template>
  <div class="product-planning-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#409EFF"><DocumentAdd /></el-icon>
            <div class="stage-text">
              <h2>L2产品规划</h2>
              <p>战略规划 → 产品路线图 → 业务目标</p>
            </div>
          </div>
          <el-tag type="primary" size="large">价值流阶段 1/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="当前周期">2026 Q1</el-descriptions-item>
        <el-descriptions-item label="规划产品">智能驾驶平台 v3.0</el-descriptions-item>
        <el-descriptions-item label="负责人">产品总监</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="success">进行中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 关键活动 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><List /></el-icon> 关键活动</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="activity in keyActivities"
              :key="activity.id"
              :timestamp="activity.time"
              :type="activity.status === 'completed' ? 'success' : 'primary'"
            >
              <div class="activity-item">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <el-tag :type="getStatusType(activity.status)" size="small">
                  {{ activity.status }}
                </el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><TrendCharts /></el-icon> 阶段指标</span>
          </template>
          <div class="metrics">
            <div class="metric-item" v-for="metric in metrics" :key="metric.key">
              <div class="metric-label">{{ metric.label }}</div>
              <div class="metric-value" :style="{color: metric.color}">
                {{ metric.value }}
              </div>
              <el-progress
                v-if="metric.progress !== undefined"
                :percentage="metric.progress"
                :status="metric.progress >= 80 ? 'success' : 'warning'"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 产品路线图 -->
    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><Calendar /></el-icon> 产品路线图</span>
      </template>
      <el-table :data="roadmapItems" border>
        <el-table-column prop="quarter" label="季度" width="100" />
        <el-table-column prop="milestone" label="里程碑" min-width="200" />
        <el-table-column label="关键特性" min-width="300">
          <template #default="{ row }">
            <el-tag
              v-for="feature in row.features"
              :key="feature"
              style="margin: 2px"
              size="small"
            >
              {{ feature }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="businessValue" label="业务价值" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 输入输出 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="io-card input-card">
          <template #header>
            <span><el-icon><Download /></el-icon> 阶段输入</span>
          </template>
          <el-tag
            v-for="input in stageInputs"
            :key="input"
            type="info"
            style="margin: 5px"
          >
            {{ input }}
          </el-tag>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="io-card output-card">
          <template #header>
            <span><el-icon><Upload /></el-icon> 阶段输出</span>
          </template>
          <el-tag
            v-for="output in stageOutputs"
            :key="output"
            type="success"
            style="margin: 5px"
          >
            {{ output }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>

    <!-- 流转到下一阶段 -->
    <el-card style="margin-top: 20px">
      <el-button type="primary" size="large" @click="goToNextStage" style="width: 100%">
        <el-icon><Right /></el-icon>
        流转到下一阶段：L2需求分析
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const keyActivities = ref([
  {
    id: 1,
    title: '战略目标分析',
    description: '分析公司战略目标，确定产品方向',
    time: '2026-01-01',
    status: 'completed',
  },
  {
    id: 2,
    title: '市场调研',
    description: '调研市场需求和竞品分析',
    time: '2026-01-05',
    status: 'completed',
  },
  {
    id: 3,
    title: '产品路线图规划',
    description: '制定Q1-Q4产品路线图',
    time: '2026-01-10',
    status: 'in_progress',
  },
  {
    id: 4,
    title: '业务价值评估',
    description: '评估各特性的业务价值和优先级',
    time: '2026-01-15',
    status: 'pending',
  },
])

const metrics = ref([
  { key: 'completion', label: '规划完成度', value: '75%', progress: 75, color: '#67C23A' },
  { key: 'features', label: '规划特性数', value: '24个', color: '#409EFF' },
  { key: 'value', label: '预期业务价值', value: '高', color: '#E6A23C' },
  { key: 'alignment', label: '战略对齐度', value: '95%', progress: 95, color: '#67C23A' },
])

const roadmapItems = ref([
  {
    quarter: '2026 Q1',
    milestone: '智能感知升级',
    features: ['激光雷达融合', '相机标定优化', '障碍物识别增强'],
    businessValue: '高',
    status: '进行中',
  },
  {
    quarter: '2026 Q2',
    milestone: '规划能力增强',
    features: ['路径规划优化', '决策树算法', '场景库扩展'],
    businessValue: '高',
    status: '已规划',
  },
  {
    quarter: '2026 Q3',
    milestone: '控制精度提升',
    features: ['纵向控制优化', '横向控制精度', '紧急制动'],
    businessValue: '中',
    status: '已规划',
  },
  {
    quarter: '2026 Q4',
    milestone: '平台能力完善',
    features: ['仿真平台升级', '工具链优化', '云端协同'],
    businessValue: '中',
    status: '待规划',
  },
])

const stageInputs = ref([
  '公司战略规划',
  '市场调研报告',
  '客户反馈',
  '技术趋势分析',
  '竞品分析报告',
])

const stageOutputs = ref([
  '产品路线图',
  '业务目标',
  '特性列表',
  '优先级排序',
  '投资预算',
])

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    completed: 'success',
    in_progress: 'warning',
    pending: 'info',
    已规划: 'primary',
    进行中: 'warning',
    待规划: 'info',
  }
  return map[status] || 'info'
}

const goToNextStage = () => {
  router.push('/value-stream/requirement-analysis')
}
</script>

<style scoped lang="scss">
.product-planning-container {
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

.activity-item {
  h4 {
    margin: 0 0 8px 0;
  }

  p {
    margin: 0 0 8px 0;
    color: #606266;
    font-size: 14px;
  }
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .metric-item {
    .metric-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 5px;
    }

    .metric-value {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 10px;
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

