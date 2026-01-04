<template>
  <div class="dashboard-container page-container">
    <div class="page-header">
      <h1>欢迎回来，{{ userStore.userName }}</h1>
      <p class="description">{{ greeting }} 今天是 {{ currentDate }}</p>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <el-card
        v-for="action in quickActions"
        :key="action.title"
        class="action-card"
        shadow="hover"
        @click="router.push(action.path)"
      >
        <div class="action-content">
          <el-icon :size="32" :color="action.color">
            <component :is="action.icon" />
          </el-icon>
          <div class="action-info">
            <div class="action-title">{{ action.title }}</div>
            <div class="action-count">{{ action.count }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <el-row :gutter="24">
      <!-- 我的项目 -->
      <el-col :span="12">
        <el-card class="stat-card" header="我的项目">
          <div v-for="project in myProjects" :key="project.id" class="project-item">
            <div class="project-info">
              <div class="project-name">{{ project.name }}</div>
              <div class="project-meta">
                <el-tag :type="getStatusType(project.status)" size="small">
                  {{ getStatusText(project.status) }}
                </el-tag>
                <span class="project-progress">进度: {{ project.progress }}%</span>
              </div>
            </div>
            <el-progress
              :percentage="project.progress"
              :color="getProgressColor(project.progress)"
              :stroke-width="8"
            />
          </div>
          <el-empty v-if="myProjects.length === 0" description="暂无项目" />
        </el-card>
      </el-col>

      <!-- 待办事项 -->
      <el-col :span="12">
        <el-card class="stat-card" header="待办事项">
          <div v-for="todo in todos" :key="todo.id" class="todo-item">
            <div class="todo-content">
              <el-icon><Document /></el-icon>
              <div class="todo-text">
                <div class="todo-title">{{ todo.title }}</div>
                <div class="todo-meta">{{ todo.dueDate }} · {{ todo.type }}</div>
              </div>
            </div>
            <el-tag :type="getPriorityType(todo.priority)" size="small">
              {{ todo.priority }}
            </el-tag>
          </div>
          <el-empty v-if="todos.length === 0" description="暂无待办" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近访问 -->
    <el-card class="stat-card" header="最近访问">
      <div class="recent-items">
        <div
          v-for="item in recentVisits"
          :key="item.id"
          class="recent-item"
          @click="router.push(item.path)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <div class="recent-info">
            <div class="recent-title">{{ item.title }}</div>
            <div class="recent-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import projectsData from '@/data/projects/projects.json'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()

const currentDate = dayjs().format('YYYY年MM月DD日')

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const quickActions = ref([
  { title: 'PI Planning', icon: 'Calendar', path: '/pi-planning', count: '2个进行中', color: '#1890ff' },
  { title: '我的项目', icon: 'Box', path: '/projects', count: '3个项目', color: '#52c41a' },
  { title: '待办需求', icon: 'Document', path: '/requirements/user', count: '5个待评审', color: '#faad14' },
  { title: 'Sprint看板', icon: 'Histogram', path: '/sprints', count: '当前Sprint 3', color: '#722ed1' },
])

const myProjects = ref(projectsData.slice(0, 3))

const todos = ref([
  { id: '1', title: 'NOA v3.1用户需求评审', dueDate: '今天 15:00', type: '需求评审', priority: '高' },
  { id: '2', title: 'PI-2025-Q2规划会议', dueDate: '明天 10:00', type: 'PI Planning', priority: '中' },
  { id: '3', title: '感知模块PRD编写', dueDate: '01-05', type: 'PRD', priority: '中' },
  { id: '4', title: 'Sprint 3回顾会', dueDate: '01-06', type: 'Sprint', priority: '低' },
])

const recentVisits = ref([
  { id: '1', title: 'NOA v3.1项目', icon: 'Box', path: '/projects/PROJ001', time: '10分钟前' },
  { id: '2', title: 'PI-2025-Q1看板', icon: 'Calendar', path: '/pi-planning/PI001/board', time: '1小时前' },
  { id: '3', title: '领域产品列表', icon: 'Files', path: '/assets/products', time: '2小时前' },
  { id: '4', title: '需求追溯视图', icon: 'Share', path: '/requirements/traceability', time: '昨天' },
])

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: 'primary',
    completed: 'success',
    on_hold: 'warning',
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    completed: '已完成',
    on_hold: '暂停',
  }
  return textMap[status] || status
}

function getProgressColor(progress: number) {
  if (progress < 30) return '#f5222d'
  if (progress < 70) return '#faad14'
  return '#52c41a'
}

function getPriorityType(priority: string) {
  const typeMap: Record<string, any> = {
    高: 'danger',
    中: 'warning',
    低: 'info',
  }
  return typeMap[priority] || 'info'
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.dashboard-container {
  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: $spacing-md;
    margin-bottom: $spacing-lg;

    .action-card {
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-md;
      }

      .action-content {
        display: flex;
        align-items: center;
        gap: $spacing-md;

        .action-info {
          flex: 1;

          .action-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 4px;
          }

          .action-count {
            font-size: 14px;
            color: $text-secondary;
          }
        }
      }
    }
  }

  .stat-card {
    margin-bottom: $spacing-lg;

    .project-item {
      margin-bottom: $spacing-md;
      padding-bottom: $spacing-md;
      border-bottom: 1px solid $border-light;

      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .project-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-sm;

        .project-name {
          font-weight: 600;
        }

        .project-meta {
          display: flex;
          align-items: center;
          gap: $spacing-sm;
          font-size: 12px;
          color: $text-secondary;
        }
      }
    }

    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }

      .todo-content {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        flex: 1;

        .todo-text {
          .todo-title {
            font-size: 14px;
            margin-bottom: 4px;
          }

          .todo-meta {
            font-size: 12px;
            color: $text-secondary;
          }
        }
      }
    }
  }

  .recent-items {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: $spacing-md;

    .recent-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-md;
      background: $bg-secondary;
      border-radius: $radius-sm;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        background: $bg-hover;
      }

      .recent-info {
        flex: 1;

        .recent-title {
          font-size: 14px;
          margin-bottom: 4px;
        }

        .recent-time {
          font-size: 12px;
          color: $text-secondary;
        }
      }
    }
  }
}
</style>

