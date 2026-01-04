<template>
  <div class="value-network-l2-page">
    <el-card class="header-card">
      <div class="page-header">
        <div class="title-section">
          <h2>L2执行级价值网络</h2>
          <p class="subtitle">详细活动网络与依赖关系</p>
        </div>
        <div class="action-section">
          <el-button type="primary" :icon="Download" @click="handleExport">导出</el-button>
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="选择阶段">
          <el-select v-model="filterForm.stageId" placeholder="选择阶段" style="width: 200px">
            <el-option label="迭代研发" value="stage-4" />
            <el-option label="集成晋级" value="stage-5" />
            <el-option label="测试验证" value="stage-6" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示">
          <el-checkbox v-model="filterForm.showDependencies">显示依赖</el-checkbox>
          <el-checkbox v-model="filterForm.showBottlenecks">显示瓶颈</el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="network-card">
      <template #header>
        <span>活动网络图 - {{ getStageName(filterForm.stageId) }}</span>
      </template>

      <div class="network-container">
        <div class="activities-grid">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity-card"
            :class="[`status-${activity.status}`, { 'is-bottleneck': activity.isBottleneck }]"
            @click="handleActivityClick(activity)"
          >
            <div class="card-header">
              <el-tag :type="getStatusType(activity.status)" size="small">
                {{ getStatusLabel(activity.status) }}
              </el-tag>
              <span v-if="activity.isBottleneck" class="bottleneck-icon">
                <el-icon><WarningFilled /></el-icon>
              </span>
            </div>
            <h4>{{ activity.name }}</h4>
            <el-progress :percentage="activity.progress" :status="getProgressStatus(activity.status)" />
            <div class="activity-meta">
              <div class="meta-item">
                <el-icon><User /></el-icon>
                <span>{{ activity.owner }}</span>
              </div>
              <div class="meta-item">
                <el-icon><Clock /></el-icon>
                <span>{{ activity.duration }}天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总活动数" :value="stats.totalActivities" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="已完成" :value="stats.completedActivities" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="进行中" :value="stats.inProgressActivities" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="瓶颈活动" :value="stats.bottleneckActivities" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh, WarningFilled, User, Clock } from '@element-plus/icons-vue'

// 过滤表单
const filterForm = reactive({
  stageId: 'stage-4',
  showDependencies: true,
  showBottlenecks: true,
})

// 活动数据
const activities = ref([
  {
    id: 'act-1',
    name: '需求分解',
    status: 'completed',
    progress: 100,
    owner: '张伟',
    duration: 3,
    isBottleneck: false,
  },
  {
    id: 'act-2',
    name: '架构设计',
    status: 'completed',
    progress: 100,
    owner: '李明',
    duration: 5,
    isBottleneck: false,
  },
  {
    id: 'act-3',
    name: '接口定义',
    status: 'completed',
    progress: 100,
    owner: '王芳',
    duration: 2,
    isBottleneck: false,
  },
  {
    id: 'act-4',
    name: '代码实现',
    status: 'in_progress',
    progress: 65,
    owner: '赵强',
    duration: 10,
    isBottleneck: true,
  },
  {
    id: 'act-5',
    name: '单元测试',
    status: 'in_progress',
    progress: 50,
    owner: '孙丽',
    duration: 5,
    isBottleneck: false,
  },
  {
    id: 'act-6',
    name: '代码评审',
    status: 'draft',
    progress: 0,
    owner: '周杰',
    duration: 2,
    isBottleneck: false,
  },
])

// 统计信息
const stats = computed(() => ({
  totalActivities: activities.value.length,
  completedActivities: activities.value.filter(a => a.status === 'completed').length,
  inProgressActivities: activities.value.filter(a => a.status === 'in_progress').length,
  bottleneckActivities: activities.value.filter(a => a.isBottleneck).length,
}))

// 获取阶段名称
const getStageName = (stageId: string) => {
  const stageMap: Record<string, string> = {
    'stage-4': '迭代研发',
    'stage-5': '集成晋级',
    'stage-6': '测试验证',
  }
  return stageMap[stageId] || stageId
}

// 活动点击
const handleActivityClick = (activity: any) => {
  ElMessage.info(`查看活动: ${activity.name}`)
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 刷新
const handleRefresh = () => {
  ElMessage.success('数据已刷新')
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    in_progress: 'warning',
    completed: 'success',
    blocked: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    blocked: '阻塞',
  }
  return labelMap[status] || status
}

// 获取进度状态
const getProgressStatus = (status: string) => {
  if (status === 'completed') return 'success'
  if (status === 'blocked') return 'exception'
  return undefined
}
</script>

<style scoped lang="scss">
.value-network-l2-page {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-section {
        h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .subtitle {
          margin: 0;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
      }

      .action-section {
        display: flex;
        gap: 12px;
      }
    }
  }

  .filter-card {
    margin-bottom: 20px;
  }

  .network-card {
    margin-bottom: 20px;

    .network-container {
      min-height: 400px;

      .activities-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        padding: 20px;

        .activity-card {
          padding: 16px;
          border-radius: 8px;
          border: 2px solid var(--el-border-color);
          background-color: white;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          &.status-completed {
            border-color: #67c23a;
            background-color: #f0f9ff;
          }

          &.status-in_progress {
            border-color: #e6a23c;
            background-color: #fef0e6;
          }

          &.status-draft {
            border-color: #909399;
            background-color: #f5f7fa;
          }

          &.is-bottleneck {
            border-color: #f56c6c;
            border-width: 3px;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .bottleneck-icon {
              color: #f56c6c;
              font-size: 18px;
            }
          }

          h4 {
            margin: 0 0 12px 0;
            font-size: 15px;
            font-weight: 600;
          }

          .activity-meta {
            margin-top: 12px;
            display: flex;
            justify-content: space-between;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 12px;
              color: var(--el-text-color-secondary);
            }
          }
        }
      }
    }
  }

  .stats-row {
    margin-top: 20px;
  }
}
</style>

