<template>
  <div class="iteration-rd-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#F56C6C"><Histogram /></el-icon>
            <div class="stage-text">
              <h2>L2迭代研发</h2>
              <p>任务执行 → 代码提交 → 每日站会</p>
            </div>
          </div>
          <el-tag type="danger" size="large">价值流阶段 4/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="当前Sprint">Sprint 3</el-descriptions-item>
        <el-descriptions-item label="剩余天数">5天</el-descriptions-item>
        <el-descriptions-item label="任务完成率">68%</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="warning">开发中</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><TrendCharts /></el-icon> Sprint燃尽图</span>
          </template>
          <div ref="burndownChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><DataLine /></el-icon> 代码提交趋势</span>
          </template>
          <div ref="commitChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><List /></el-icon> 任务看板</span>
      </template>
      <el-row :gutter="15">
        <el-col :span="6" v-for="status in ['待开始', '进行中', '代码审查', '已完成']" :key="status">
          <div class="kanban-column">
            <div class="column-header">{{ status }}</div>
            <div class="column-content">
              <div
                v-for="task in getTasksByStatus(status)"
                :key="task.id"
                class="task-card"
              >
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta">
                  <el-tag size="small">{{ task.assignee }}</el-tag>
                  <span class="task-sp">{{ task.sp }}SP</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><Edit /></el-icon> 最近代码提交</span>
      </template>
      <el-table :data="commits" border>
        <el-table-column prop="commitId" label="Commit ID" width="120">
          <template #default="{ row }">
            <el-link type="primary">{{ row.commitId.substring(0, 8) }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="提交信息" min-width="250" />
        <el-table-column prop="author" label="作者" width="100" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small">详情</el-button>
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
        流转到下一阶段：L2集成晋级
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const burndownChartRef = ref<HTMLElement>()
const commitChartRef = ref<HTMLElement>()

const tasks = ref([
  { id: 'T-001', title: '激光雷达数据处理', status: '已完成', assignee: '张工', sp: 5 },
  { id: 'T-002', title: '相机标定优化', status: '代码审查', assignee: '李工', sp: 3 },
  { id: 'T-003', title: '障碍物检测算法', status: '进行中', assignee: '王工', sp: 8 },
  { id: 'T-004', title: '点云融合', status: '待开始', assignee: '赵工', sp: 5 },
])

const commits = ref([
  { commitId: 'a7f8b9c1d2e3', message: 'feat: 优化激光雷达点云处理算法', author: '张工', module: '感知模块', time: '2026-01-05 14:20' },
  { commitId: 'b8g9h0i1j2k3', message: 'fix: 修复路径规划死锁问题', author: '李工', module: '规划模块', time: '2026-01-05 10:15' },
])

const stageInputs = ref([
  'Sprint计划',
  '任务列表',
  '技术方案',
  '开发环境',
])

const stageOutputs = ref([
  '代码提交',
  '功能分支',
  '单元测试',
  'Code Review',
  '燃尽图',
])

const getTasksByStatus = (status: string) => {
  return tasks.value.filter(t => t.status === status)
}

const initCharts = () => {
  if (burndownChartRef.value) {
    const chart = echarts.init(burndownChartRef.value)
    chart.setOption({
      title: { text: 'Sprint燃尽图', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { data: ['理想燃尽', '实际燃尽'], bottom: 10 },
      xAxis: { type: 'category', data: ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7', 'Day8', 'Day9', 'Day10'] },
      yAxis: { type: 'value', name: 'Story Points' },
      series: [
        {
          name: '理想燃尽',
          type: 'line',
          data: [80, 72, 64, 56, 48, 40, 32, 24, 16, 8, 0],
          lineStyle: { type: 'dashed' },
        },
        {
          name: '实际燃尽',
          type: 'line',
          data: [80, 75, 68, 65, 58, 52, 45, null, null, null],
        },
      ],
    })
  }

  if (commitChartRef.value) {
    const chart = echarts.init(commitChartRef.value)
    chart.setOption({
      title: { text: '代码提交趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
      yAxis: { type: 'value', name: '提交次数' },
      series: [{
        type: 'bar',
        data: [12, 18, 15, 22, 16],
      }],
    })
  }
}

const goToNextStage = () => {
  router.push('/value-stream/integration')
}

onMounted(() => {
  initCharts()
})
</script>

<style scoped lang="scss">
.iteration-rd-container {
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

.kanban-column {
  .column-header {
    background: #f5f7fa;
    padding: 10px;
    font-weight: 600;
    text-align: center;
    border-radius: 4px 4px 0 0;
  }

  .column-content {
    min-height: 300px;
    padding: 10px;
    background: #fafafa;
    border-radius: 0 0 4px 4px;

    .task-card {
      background: white;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
      border-left: 3px solid #409EFF;
      cursor: pointer;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .task-title {
        font-size: 14px;
        margin-bottom: 8px;
      }

      .task-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .task-sp {
          font-size: 12px;
          color: #909399;
        }
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

