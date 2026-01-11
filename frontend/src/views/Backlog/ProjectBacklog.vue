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
              <el-descriptions-item label="所属PI Planning">
                {{ backlog.piName || backlog.piPlanningId || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="领域项目">
                <el-tag v-if="backlog.domainProjectIds && backlog.domainProjectIds.length > 0" size="small">
                  {{ backlog.domainProjectIds.length }}个
                </el-tag>
                <span v-else>-</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="总工作项">{{ backlog.totalWorkItems || 0 }} 项</el-descriptions-item>
              <el-descriptions-item label="完成进度">{{ backlog.progress || 0 }}%</el-descriptions-item>
              <el-descriptions-item label="需求统计">
                UR:{{ backlog.statistics?.urCount || 0 }}, 
                FR:{{ backlog.statistics?.frCount || 0 }}, 
                MR:{{ backlog.statistics?.mrCount || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 统计卡片 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="总工作项" :value="backlog.totalWorkItems || 0">
              <template #prefix>
                <el-icon><List /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="用户需求(UR)" :value="backlog.statistics?.urCount || 0">
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="特性需求(FR)" :value="backlog.statistics?.frCount || 0">
              <template #prefix>
                <el-icon><Star /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <el-statistic title="模块需求(MR)" :value="backlog.statistics?.mrCount || 0">
              <template #prefix>
                <el-icon><TrendCharts /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>

      <!-- 需求列表 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><List /></el-icon>
              需求列表
            </span>
          </div>
        </template>

        <!-- UR列表 -->
        <div v-if="backlog.requirements?.urs && backlog.requirements.urs.length > 0" class="requirement-section">
          <h4>用户需求 (UR) - {{ backlog.requirements.urs.length }}个</h4>
          <el-table :data="backlog.requirements.urs" stripe style="margin-bottom: 20px;">
            <el-table-column prop="code" label="需求编码" width="140" />
            <el-table-column prop="name" label="需求名称" min-width="250" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="viewRequirement('UR', row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- FR列表 -->
        <div v-if="backlog.requirements?.frs && backlog.requirements.frs.length > 0" class="requirement-section">
          <h4>特性需求 (FR) - {{ backlog.requirements.frs.length }}个</h4>
          <el-table :data="backlog.requirements.frs" stripe style="margin-bottom: 20px;">
            <el-table-column prop="code" label="需求编码" width="140" />
            <el-table-column prop="name" label="需求名称" min-width="250" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="relatedFeatureAssetId" label="关联Feature" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.relatedFeatureAssetId" type="success" size="small">已关联</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="viewRequirement('FR', row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- MR列表 -->
        <div v-if="backlog.requirements?.mrs && backlog.requirements.mrs.length > 0" class="requirement-section">
          <h4>模块需求 (MR) - {{ backlog.requirements.mrs.length }}个</h4>
          <el-table :data="backlog.requirements.mrs" stripe>
            <el-table-column prop="code" label="需求编码" width="140" />
            <el-table-column prop="name" label="需求名称" min-width="250" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusTagType(row.status)" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="moduleId" label="关联Module" width="150">
              <template #default="{ row }">
                <el-tag v-if="row.moduleId" type="success" size="small">已关联</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="assignedTeamId" label="分配团队" width="120">
              <template #default="{ row }">
                <span v-if="row.assignedTeamId">{{ getTeamName(row.assignedTeamId) }}</span>
                <span v-else class="no-team">未分配</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="primary" link size="small" @click="viewRequirement('MR', row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-empty v-if="!backlog.requirements || 
          (!backlog.requirements.urs?.length && !backlog.requirements.frs?.length && !backlog.requirements.mrs?.length)" 
          description="暂无需求" :image-size="100" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Star } from '@element-plus/icons-vue'
import projectBacklogsData from '@/biz-data/mock/backlog/project-backlogs.json'
import teamsData from '@/biz-data/mock/teams.json'
import type { ProjectBacklog } from '@/types/backlog'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const backlog = ref<ProjectBacklog | null>(null)

onMounted(() => {
  const backlogId = route.params.id as string
  const foundBacklog = projectBacklogsData.data.find((b: ProjectBacklog) => b.id === backlogId)
  
  if (foundBacklog) {
    backlog.value = foundBacklog as ProjectBacklog
  }
})

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'planned': 'info',
    'completed': '',
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': '进行中',
    'planned': '已规划',
    'completed': '已完成',
  }
  return map[status] || status
}

const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'open': 'info',
    'in_progress': 'primary',
    'in_review': 'warning',
    'done': 'success',
    'pending': 'info',
    'approved': 'success',
  }
  return map[status] || 'info'
}

const getTeamName = (teamId: string) => {
  const teams = Array.isArray(teamsData) ? teamsData : teamsData.data || []
  const team = teams.find((t: any) => t.id === teamId)
  return team ? team.name : teamId
}

const goBack = () => {
  router.push('/backlog/project')
}

const viewRequirement = (type: string, requirement: any) => {
  ElMessage.info(`查看${type}需求: ${requirement.name}`)
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

  .requirement-section {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>
