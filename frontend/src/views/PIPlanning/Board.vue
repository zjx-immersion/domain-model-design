<template>
  <div class="pi-board page-container">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/pi-planning' }">PI Planning</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: `/pi-planning/${route.params.id}` }">
            {{ piData?.name }}
          </el-breadcrumb-item>
          <el-breadcrumb-item>PI看板</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{ piData?.name }} - PI看板</h1>
      </div>
      <div class="header-actions">
        <el-button icon="Back" @click="router.back()">返回</el-button>
        <el-button icon="Refresh" @click="refreshBoard">刷新</el-button>
      </div>
    </div>

    <!-- 团队选择 -->
    <div class="team-selector">
      <el-radio-group v-model="selectedTeam" @change="loadTeamStories">
        <el-radio-button label="all">全部团队</el-radio-button>
        <el-radio-button label="perception">感知团队</el-radio-button>
        <el-radio-button label="fusion">融合团队</el-radio-button>
        <el-radio-button label="planning">规划团队</el-radio-button>
        <el-radio-button label="control">控制团队</el-radio-button>
        <el-radio-button label="integration">集成团队</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Kanban看板 -->
    <div class="kanban-board">
      <div v-for="column in kanbanColumns" :key="column.status" class="kanban-column">
        <div class="column-header">
          <h3>{{ column.name }}</h3>
          <el-badge :value="getColumnStoryCount(column.status)" type="primary" />
        </div>

        <div class="column-content">
          <div
            v-for="story in getColumnStories(column.status)"
            :key="story.id"
            class="story-card"
            :class="{ 'blocked': story.blocked }"
            @click="viewStory(story)"
          >
            <div class="story-header">
              <span class="story-id">{{ story.id }}</span>
              <el-tag v-if="story.blocked" type="danger" size="small">阻塞</el-tag>
              <el-tag v-else :type="getPriorityType(story.priority)" size="small">
                {{ story.priority }}
              </el-tag>
            </div>

            <div class="story-title">{{ story.title }}</div>

            <div class="story-meta">
              <el-tag size="small" effect="plain">{{ story.team }}</el-tag>
              <span class="story-points">{{ story.points }} SP</span>
            </div>

            <div class="story-assignee">
              <el-avatar :size="24" :src="story.assigneeAvatar" />
              <span>{{ story.assignee }}</span>
            </div>
          </div>

          <el-empty
            v-if="getColumnStories(column.status).length === 0"
            :image-size="60"
            description="暂无Story"
          />
        </div>
      </div>
    </div>

    <!-- 燃尽图 -->
    <el-card class="burndown-card" header="PI燃尽图">
      <div ref="burndownChart" style="width: 100%; height: 300px"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import piPlanningsData from '@/data/projects/pi-plannings.json'
import type { PIPlanning } from '@/types/project'

const router = useRouter()
const route = useRoute()

const piData = ref<PIPlanning | null>(null)
const selectedTeam = ref('all')
const burndownChart = ref<HTMLElement>()

const kanbanColumns = [
  { status: 'backlog', name: 'Backlog' },
  { status: 'todo', name: 'To Do' },
  { status: 'in_progress', name: 'In Progress' },
  { status: 'in_review', name: 'In Review' },
  { status: 'testing', name: 'Testing' },
  { status: 'done', name: 'Done' },
]

// 模拟Story数据
const stories = ref([
  {
    id: 'US001',
    title: '优化车道线检测算法',
    team: '感知团队',
    status: 'in_progress',
    priority: '高',
    points: 5,
    assignee: '张三',
    assigneeAvatar: '/avatars/u001.jpg',
    blocked: false,
  },
  {
    id: 'US002',
    title: '实现多传感器时间同步',
    team: '融合团队',
    status: 'todo',
    priority: '中',
    points: 8,
    assignee: '李四',
    assigneeAvatar: '/avatars/u002.jpg',
    blocked: false,
  },
  {
    id: 'US003',
    title: '完成路径规划模块重构',
    team: '规划团队',
    status: 'in_review',
    priority: '高',
    points: 13,
    assignee: '王五',
    assigneeAvatar: '/avatars/u003.jpg',
    blocked: false,
  },
  {
    id: 'US004',
    title: '集成新版感知算法',
    team: '集成团队',
    status: 'testing',
    priority: '高',
    points: 5,
    assignee: '赵六',
    assigneeAvatar: '/avatars/u004.jpg',
    blocked: false,
  },
  {
    id: 'US005',
    title: '目标跟踪性能优化',
    team: '感知团队',
    status: 'done',
    priority: '中',
    points: 3,
    assignee: '张三',
    assigneeAvatar: '/avatars/u001.jpg',
    blocked: false,
  },
  {
    id: 'US006',
    title: '雷达数据预处理模块',
    team: '感知团队',
    status: 'backlog',
    priority: '低',
    points: 5,
    assignee: '未分配',
    assigneeAvatar: '',
    blocked: false,
  },
  {
    id: 'US007',
    title: '融合算法参数调优',
    team: '融合团队',
    status: 'in_progress',
    priority: '中',
    points: 8,
    assignee: '李四',
    assigneeAvatar: '/avatars/u002.jpg',
    blocked: true,
  },
])

onMounted(() => {
  const piId = route.params.id as string
  const pi = piPlanningsData.find(p => p.id === piId)
  if (pi) {
    piData.value = pi as PIPlanning
  }
  
  nextTick(() => {
    initBurndownChart()
  })
})

function getColumnStories(status: string) {
  return stories.value.filter(story => {
    const matchStatus = story.status === status
    const matchTeam = selectedTeam.value === 'all' || 
      story.team.includes(getTeamName(selectedTeam.value))
    return matchStatus && matchTeam
  })
}

function getColumnStoryCount(status: string) {
  return getColumnStories(status).length
}

function getTeamName(team: string) {
  const teamMap: Record<string, string> = {
    perception: '感知',
    fusion: '融合',
    planning: '规划',
    control: '控制',
    integration: '集成',
  }
  return teamMap[team] || ''
}

function getPriorityType(priority: string) {
  const typeMap: Record<string, any> = {
    高: 'danger',
    中: 'warning',
    低: 'info',
  }
  return typeMap[priority] || 'info'
}

function loadTeamStories() {
  ElMessage.success(`切换到: ${selectedTeam.value === 'all' ? '全部团队' : getTeamName(selectedTeam.value) + '团队'}`)
}

function refreshBoard() {
  ElMessage.success('看板已刷新')
}

function viewStory(story: any) {
  ElMessage.info(`查看Story: ${story.title}`)
}

function initBurndownChart() {
  if (!burndownChart.value) return

  const chart = echarts.init(burndownChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['理想燃尽', '实际燃尽'],
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    },
    yAxis: {
      type: 'value',
      name: 'Story Points',
    },
    series: [
      {
        name: '理想燃尽',
        type: 'line',
        data: [180, 150, 120, 90, 60, 0],
        lineStyle: {
          type: 'dashed',
          color: '#d9d9d9',
        },
        itemStyle: {
          color: '#d9d9d9',
        },
      },
      {
        name: '实际燃尽',
        type: 'line',
        data: [180, 155, 130, 110, null, null],
        lineStyle: {
          color: '#1890ff',
        },
        itemStyle: {
          color: '#1890ff',
        },
      },
    ],
  }

  chart.setOption(option)
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.pi-board {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-lg;

    .header-left {
      flex: 1;

      h1 {
        margin: $spacing-sm 0;
      }
    }

    .header-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .team-selector {
    margin-bottom: $spacing-lg;
  }

  .kanban-board {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    overflow-x: auto;

    .kanban-column {
      background: $bg-secondary;
      border-radius: $radius-md;
      min-width: 250px;

      .column-header {
        padding: $spacing-md;
        background: $bg-primary;
        border-radius: $radius-md $radius-md 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid $border-light;

        h3 {
          margin: 0;
          font-size: 16px;
        }
      }

      .column-content {
        padding: $spacing-md;
        min-height: 400px;
        max-height: 600px;
        overflow-y: auto;

        .story-card {
          background: $bg-primary;
          border: 1px solid $border-color;
          border-radius: $radius-sm;
          padding: $spacing-md;
          margin-bottom: $spacing-md;
          cursor: pointer;
          transition: all $transition-base;

          &:hover {
            box-shadow: $shadow-sm;
            border-color: $primary;
          }

          &.blocked {
            border-left: 3px solid $danger;
          }

          .story-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: $spacing-sm;

            .story-id {
              font-weight: 600;
              color: $primary;
            }
          }

          .story-title {
            font-size: 14px;
            margin-bottom: $spacing-md;
            line-height: 1.5;
          }

          .story-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: $spacing-sm;

            .story-points {
              font-size: 12px;
              color: $text-secondary;
              font-weight: 600;
            }
          }

          .story-assignee {
            display: flex;
            align-items: center;
            gap: $spacing-xs;
            font-size: 12px;
            color: $text-secondary;
          }
        }
      }
    }
  }

  .burndown-card {
    margin-top: $spacing-lg;
  }
}
</style>

