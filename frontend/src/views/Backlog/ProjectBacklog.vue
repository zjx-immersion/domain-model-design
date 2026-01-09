<template>
  <div class="project-backlog page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/backlog/project' }">项目待办</el-breadcrumb-item>
        <el-breadcrumb-item>{{ backlog?.name || '待办详情' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="!backlog" class="empty-state">
      <el-empty description="待办不存在" />
      <el-button type="primary" @click="goBack">返回列表</el-button>
    </div>

    <div v-else>
      <!-- 项目信息卡片 -->
      <el-card class="section-card info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><InfoFilled /></el-icon>
              项目待办信息
            </span>
            <el-tag :type="getStatusType(backlog.status)">{{ getStatusText(backlog.status) }}</el-tag>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="待办名称">{{ backlog.name }}</el-descriptions-item>
              <el-descriptions-item label="所属领域项目">
                <el-link type="primary" @click="goToDomainProject(backlog.projectId)">
                  {{ domainProject?.name || backlog.projectId }}
                </el-link>
              </el-descriptions-item>
              <el-descriptions-item label="来源PI Planning">
                <el-link type="primary" @click="goToPIPlanning(backlog.piPlanningId)">
                  {{ piPlanning?.name || backlog.piPlanningId }}
                </el-link>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="创建时间">{{ backlog.createdAt }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ backlog.updatedAt }}</el-descriptions-item>
              <el-descriptions-item label="总工作项">{{ backlog.items.length }} 项</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="总工作项" :value="backlog.items.length">
              <template #prefix>
                <el-icon><List /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="待分配" :value="unassignedCount">
              <template #prefix>
                <el-icon><Clock /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="已分配" :value="assignedCount">
              <template #prefix>
                <el-icon><Check /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="总故事点" :value="totalStoryPoints">
              <template #prefix>
                <el-icon><TrendCharts /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>

      <!-- 工作项列表 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><List /></el-icon>
              工作项列表 ({{ filteredItems.length }})
            </span>
            <div class="header-actions">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索工作项"
                clearable
                style="width: 200px; margin-right: 10px"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-select
                v-model="filterStatus"
                placeholder="筛选状态"
                clearable
                style="width: 150px; margin-right: 10px"
              >
                <el-option label="全部状态" value="" />
                <el-option label="待分配" value="unassigned" />
                <el-option label="已分配" value="assigned" />
              </el-select>
              <el-select
                v-model="filterPriority"
                placeholder="筛选优先级"
                clearable
                style="width: 150px"
              >
                <el-option label="全部优先级" value="" />
                <el-option label="紧急" value="critical" />
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </div>
          </div>
        </template>

        <el-table :data="filteredItems" stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column prop="code" label="工作项编码" width="140" />
          <el-table-column prop="title" label="标题" min-width="250">
            <template #default="{ row }">
              <div class="item-title">
                <el-tag size="small" :type="getTypeColor(row.type)">{{ row.type }}</el-tag>
                <span>{{ row.title }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="100">
            <template #default="{ row }">
              <el-tag :type="getPriorityType(row.priority)" size="small">
                {{ getPriorityText(row.priority) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="storyPoints" label="故事点" width="100" align="center">
            <template #default="{ row }">
              <el-tag type="info" size="small">{{ row.storyPoints || 0 }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="assignedTeamId" label="分配状态" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.assignedTeamId" type="success" size="small">已分配</el-tag>
              <el-tag v-else type="warning" size="small">待分配</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="assignedTeamId" label="团队" width="120">
            <template #default="{ row }">
              <el-link v-if="row.assignedTeamId" type="primary" @click="goToTeamBacklog(row.assignedTeamId)">
                {{ getTeamName(row.assignedTeamId) }}
              </el-link>
              <span v-else class="no-team">未分配</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="viewItem(row)">查看</el-button>
              <el-button
                v-if="!row.assignedTeamId"
                type="success"
                link
                size="small"
                @click="assignToTeam(row)"
              >
                分配
              </el-button>
              <el-button v-else type="warning" link size="small" @click="reassignTeam(row)">
                重新分配
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-empty v-if="filteredItems.length === 0" description="暂无工作项" :image-size="100" />

        <div v-if="filteredItems.length > 0" class="table-footer">
          <el-button type="primary" @click="batchAssign">批量分配</el-button>
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredItems.length"
            layout="total, sizes, prev, pager, next, jumper"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import projectBacklogsData from '@/biz-data/mock/backlog/project-backlogs.json'
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import piPlanningsData from '@/data/projects/pi-plannings.json'
import teamsData from '@/biz-data/mock/teams.json'
import type { ProjectBacklog, BacklogItem } from '@/types/backlog'
import type { DomainProject } from '@/types/project-v2'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const backlog = ref<ProjectBacklog | null>(null)
const domainProject = ref<DomainProject | null>(null)
const piPlanning = ref<any>(null)

const searchKeyword = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

onMounted(() => {
  const backlogId = route.params.id as string
  const foundBacklog = projectBacklogsData.data.find((b: ProjectBacklog) => b.id === backlogId)
  
  if (foundBacklog) {
    backlog.value = foundBacklog as ProjectBacklog
    
    // 加载关联的领域项目
    const foundProject = domainProjectsData.data.find(
      (p: DomainProject) => p.id === foundBacklog.projectId
    )
    domainProject.value = foundProject as DomainProject || null

    // 加载关联的PI Planning
    piPlanning.value = piPlanningsData.find(pi => pi.id === foundBacklog.piPlanningId) || null
  }
})

const filteredItems = computed(() => {
  if (!backlog.value) return []
  
  let items = backlog.value.items

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.code.toLowerCase().includes(keyword)
    )
  }

  // 状态筛选
  if (filterStatus.value) {
    if (filterStatus.value === 'assigned') {
      items = items.filter(item => item.assignedTeamId)
    } else if (filterStatus.value === 'unassigned') {
      items = items.filter(item => !item.assignedTeamId)
    }
  }

  // 优先级筛选
  if (filterPriority.value) {
    items = items.filter(item => item.priority === filterPriority.value)
  }

  return items
})

const unassignedCount = computed(() => {
  if (!backlog.value) return 0
  return backlog.value.items.filter(item => !item.assignedTeamId).length
})

const assignedCount = computed(() => {
  if (!backlog.value) return 0
  return backlog.value.items.filter(item => item.assignedTeamId).length
})

const totalStoryPoints = computed(() => {
  if (!backlog.value) return 0
  return backlog.value.items.reduce((sum, item) => sum + (item.storyPoints || 0), 0)
})

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'planning': 'info',
    'closed': 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': '活动中',
    'planning': '计划中',
    'closed': '已关闭'
  }
  return map[status] || status
}

const getPriorityType = (priority: string) => {
  const map: Record<string, any> = {
    'critical': 'danger',
    'high': 'warning',
    'medium': 'primary',
    'low': 'info'
  }
  return map[priority] || 'info'
}

const getPriorityText = (priority: string) => {
  const map: Record<string, string> = {
    'critical': '紧急',
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  return map[priority] || priority
}

const getTypeColor = (type: string) => {
  const map: Record<string, any> = {
    'feature': 'primary',
    'story': 'success',
    'task': 'info',
    'bug': 'danger'
  }
  return map[type] || 'info'
}

const getTeamName = (teamId: string) => {
  const team = teamsData.data.find((t: any) => t.id === teamId)
  return team ? team.name : teamId
}

const goBack = () => {
  router.push('/backlog/project')
}

const goToDomainProject = (projectId: string) => {
  router.push(`/projects/domain/${projectId}`)
}

const goToPIPlanning = (piId: string) => {
  router.push(`/pi-planning/${piId}`)
}

const goToTeamBacklog = (teamId: string) => {
  // 查找对应的TeamBacklog ID
  ElMessage.info(`跳转到团队 ${getTeamName(teamId)} 的待办`)
  router.push(`/backlog/team/${teamId}`)
}

const viewItem = (item: BacklogItem) => {
  ElMessage.info(`查看工作项: ${item.title}`)
}

const assignToTeam = (item: BacklogItem) => {
  ElMessage.info(`分配工作项: ${item.title}`)
}

const reassignTeam = (item: BacklogItem) => {
  ElMessage.info(`重新分配工作项: ${item.title}`)
}

const batchAssign = () => {
  ElMessage.info('批量分配功能开发中')
}
</script>

<style scoped lang="scss">
.project-backlog {
  .page-header {
    margin-bottom: 20px;
  }

  .empty-state {
    text-align: center;
    padding: 60px 0;

    .el-button {
      margin-top: 20px;
    }
  }

  .section-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
        font-size: 16px;
      }

      .header-actions {
        display: flex;
        align-items: center;
      }
    }
  }

  .info-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    :deep(.el-descriptions__label) {
      color: rgba(255, 255, 255, 0.9);
    }

    :deep(.el-descriptions__content) {
      color: #fff;
    }

    :deep(.el-link) {
      color: #fff;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .stats-row {
    margin-bottom: 20px;

    .stat-card {
      text-align: center;
      
      :deep(.el-statistic__head) {
        font-size: 14px;
        color: #606266;
      }

      :deep(.el-statistic__content) {
        font-size: 28px;
        font-weight: bold;
        color: #409eff;
      }
    }
  }

  .item-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .no-team {
    color: #c0c4cc;
    font-size: 12px;
  }

  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
