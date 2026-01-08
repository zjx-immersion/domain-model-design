<template>
  <div class="project-list page-container">
    <div class="page-header">
      <h1>项目管理</h1>
      <p class="description">管理和跟踪所有研发项目</p>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="searchKey"
        placeholder="搜索项目名称或编号"
        prefix-icon="Search"
        style="width: 300px"
        clearable
      />
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px">
        <el-option label="规划中" value="planning" />
        <el-option label="进行中" value="in_progress" />
        <el-option label="暂停" value="on_hold" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <el-select v-model="healthFilter" placeholder="健康度筛选" clearable style="width: 150px">
        <el-option label="健康" value="healthy" />
        <el-option label="有风险" value="at_risk" />
        <el-option label="延期" value="delayed" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="handleCreate">创建项目</el-button>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="32" color="#1890ff"><Box /></el-icon>
          <div>
            <div class="stat-value">{{ totalProjects }}</div>
            <div class="stat-label">总项目数</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="32" color="#52c41a"><TrendCharts /></el-icon>
          <div>
            <div class="stat-value">{{ activeProjects }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="32" color="#faad14"><WarningFilled /></el-icon>
          <div>
            <div class="stat-value">{{ atRiskProjects }}</div>
            <div class="stat-label">有风险</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="32" color="#722ed1"><User /></el-icon>
          <div>
            <div class="stat-value">{{ totalMembers }}</div>
            <div class="stat-label">总参与人数</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 项目列表 -->
    <el-table :data="filteredProjects" stripe @row-click="viewProject">
      <el-table-column prop="code" label="项目编号" width="180" fixed="left" />
      <el-table-column prop="name" label="项目名称" min-width="200" fixed="left">
        <template #default="{ row }">
          <div class="project-name-cell">
            <strong>{{ row.name }}</strong>
            <div class="project-tags">
              <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="health" label="健康度" width="120">
        <template #default="{ row }">
          <el-tag :type="getHealthType(row.health)">
            {{ getHealthText(row.health) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="progress" label="进度" width="200">
        <template #default="{ row }">
          <div class="progress-cell">
            <el-progress
              :percentage="row.progress"
              :color="getProgressColor(row.progress)"
              :stroke-width="8"
            />
            <span class="progress-text">{{ row.progress }}%</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="ownerName" label="项目经理" width="120" />

      <el-table-column label="团队规模" width="120">
        <template #default="{ row }">
          <span>{{ row.teamCount }}队/{{ row.memberCount }}人</span>
        </template>
      </el-table-column>

      <el-table-column label="时间计划" width="220">
        <template #default="{ row }">
          <div class="date-range">
            <span>{{ row.startDate }}</span>
            <el-icon><Right /></el-icon>
            <span>{{ row.plannedEndDate }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click.stop="viewProject(row)">
            查看
          </el-button>
          <el-button text type="primary" size="small" @click.stop="viewBoard(row)">
            看板
          </el-button>
          <el-dropdown @command="(cmd) => handleCommand(cmd, row)">
            <el-button text icon="More" size="small" @click.stop />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="team">团队管理</el-dropdown-item>
                <el-dropdown-item command="milestones">里程碑</el-dropdown-item>
                <el-dropdown-item command="report">项目报告</el-dropdown-item>
                <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="filteredProjects.length === 0" description="暂无项目" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import projectsData from '@/data/projects/projects.json'
import type { Project } from '@/types/project'

const router = useRouter()

const searchKey = ref('')
const statusFilter = ref('')
const healthFilter = ref('')
const projects = ref<Project[]>(projectsData as Project[])

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchSearch = !searchKey.value || 
      project.name.includes(searchKey.value) || 
      project.code.includes(searchKey.value)
    const matchStatus = !statusFilter.value || project.status === statusFilter.value
    const matchHealth = !healthFilter.value || project.health === healthFilter.value
    return matchSearch && matchStatus && matchHealth
  })
})

const totalProjects = computed(() => projects.value.length)
const activeProjects = computed(() => 
  projects.value.filter(p => p.status === 'in_progress').length
)
const atRiskProjects = computed(() => 
  projects.value.filter(p => p.health === 'at_risk' || p.health === 'delayed').length
)
const totalMembers = computed(() => 
  projects.value.reduce((sum, p) => sum + p.memberCount, 0)
)

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: 'primary',
    on_hold: 'warning',
    completed: 'success',
    cancelled: 'info',
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    on_hold: '暂停',
    completed: '已完成',
    cancelled: '已取消',
  }
  return textMap[status] || status
}

function getHealthType(health: string) {
  const typeMap: Record<string, any> = {
    healthy: 'success',
    at_risk: 'warning',
    delayed: 'danger',
    unknown: 'info',
  }
  return typeMap[health] || 'info'
}

function getHealthText(health: string) {
  const textMap: Record<string, string> = {
    healthy: '健康',
    at_risk: '有风险',
    delayed: '延期',
    unknown: '未知',
  }
  return textMap[health] || health
}

function getProgressColor(progress: number) {
  if (progress < 30) return '#f5222d'
  if (progress < 70) return '#faad14'
  return '#52c41a'
}

function viewProject(project: Project) {
  router.push(`/projects/${project.id}`)
}

function viewBoard(project: Project) {
  router.push(`/projects/${project.id}/board`)
}

function handleCreate() {
  ElMessage.info('创建项目功能开发中...')
}

function handleCommand(command: string, project: Project) {
  switch (command) {
    case 'edit':
      ElMessage.info(`编辑项目: ${project.name}`)
      break
    case 'team':
      router.push(`/projects/${project.id}/team`)
      break
    case 'milestones':
      router.push(`/projects/${project.id}/milestones`)
      break
    case 'report':
      router.push(`/projects/${project.id}/report`)
      break
    case 'delete':
      ElMessageBox.confirm(`确定删除项目 ${project.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        ElMessage.success('删除成功')
      })
      break
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.project-list {
  .filter-bar {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    align-items: center;
  }

  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $spacing-md;
    margin-bottom: $spacing-lg;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: $spacing-md;

        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: $text-primary;
        }

        .stat-label {
          font-size: 14px;
          color: $text-secondary;
        }
      }
    }
  }

  .project-name-cell {
    strong {
      display: block;
      margin-bottom: 4px;
    }

    .project-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }

  .progress-cell {
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .el-progress {
      flex: 1;
    }

    .progress-text {
      font-size: 12px;
      color: $text-secondary;
      min-width: 40px;
    }
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: 13px;
  }

  :deep(.el-table__row) {
    cursor: pointer;

    &:hover {
      background-color: $bg-hover;
    }
  }
}
</style>

