<template>
  <div class="domain-project-detail" v-loading="loading">
    <div v-if="project">
      <!-- 页面头部 -->
      <div class="page-header">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/projects/domain' }">领域项目</el-breadcrumb-item>
          <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="header-actions">
          <el-button @click="goBack">返回</el-button>
          <el-button type="primary">编辑</el-button>
        </div>
      </div>

      <!-- 项目概览 -->
      <el-card class="overview-card" shadow="never">
        <div class="project-header">
          <div class="header-left">
            <h2>{{ project.name }}</h2>
            <el-tag :type="getDomainType(project.domain)" size="large">
              {{ project.domain }}
            </el-tag>
            <el-tag :type="getStatusType(project.status)" size="large">
              {{ getStatusText(project.status) }}
            </el-tag>
          </div>
          <div class="header-right">
            <el-progress
              type="circle"
              :percentage="project.progress"
              :width="100"
              :color="getProgressColor(project.progress)"
            />
          </div>
        </div>
        <el-descriptions :column="3" border class="project-info">
          <el-descriptions-item label="项目代码">{{ project.code }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ project.owner }}</el-descriptions-item>
          <el-descriptions-item label="阶段">{{ project.phase || '-' }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ project.startDate }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ project.endDate }}</el-descriptions-item>
          <el-descriptions-item label="车型项目">
            <router-link :to="`/projects/vehicle/${project.vehicleProjectId}`" class="link">
              {{ getVehicleProjectName(project.vehicleProjectId) }}
            </router-link>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="3">
            {{ project.description }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 统计数据 -->
      <el-row :gutter="16" class="stats-row">
        <el-col :span="6">
          <el-card shadow="hover">
            <el-statistic title="总工作项" :value="project.stats?.totalWorkItems || 0" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-statistic title="已完成工作项" :value="project.stats?.completedWorkItems || 0" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-statistic title="总故事点" :value="project.totalStoryPoints || 0" />
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <el-statistic title="PI 进度" :value="`${project.completedPIs}/${project.totalPIs}`" />
          </el-card>
        </el-col>
      </el-row>

      <!-- 标签页 -->
      <el-tabs v-model="activeTab" class="content-tabs">
        <!-- 项目目标 -->
        <el-tab-pane label="项目目标" name="objectives">
          <el-card shadow="never">
            <el-table :data="project.objectives" border stripe>
              <el-table-column label="目标描述" prop="description" />
              <el-table-column label="业务价值" width="100">
                <template #default="{ row }">
                  <el-rate v-model="row.businessValue" disabled show-score />
                </template>
              </el-table-column>
              <el-table-column label="进度" width="180">
                <template #default="{ row }">
                  <el-progress :percentage="row.progress" :stroke-width="10" />
                </template>
              </el-table-column>
              <el-table-column label="类型" width="100">
                <template #default="{ row }">
                  <el-tag v-if="row.stretch" type="danger">拉伸目标</el-tag>
                  <el-tag v-else type="success">承诺目标</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 版本规划 -->
        <el-tab-pane label="版本规划" name="versions">
          <el-card shadow="never">
            <el-table :data="project.projectVersions" border stripe>
              <el-table-column label="产品" prop="productName" width="150" />
              <el-table-column label="版本" prop="version" width="100" />
              <el-table-column label="目标PI" prop="targetPI" width="150" />
              <el-table-column label="计划特性">
                <template #default="{ row }">
                  <el-tag v-for="(feature, index) in row.features" :key="index" style="margin: 2px">
                    {{ feature }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getVersionStatusType(row.status)">
                    {{ getVersionStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- PI Planning -->
        <el-tab-pane label="PI Planning" name="piPlannings">
          <el-card shadow="never">
            <el-table :data="piPlannings" border stripe>
              <el-table-column label="PI 名称" prop="name" width="200">
                <template #default="{ row }">
                  <router-link :to="`/pi-planning/${row.id}`" class="link">
                    {{ row.name }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="开始日期" prop="startDate" width="120" />
              <el-table-column label="结束日期" prop="endDate" width="120" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag>{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button size="small" type="primary" link @click="viewPI(row)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 团队 -->
        <el-tab-pane label="团队" name="teams">
          <el-card shadow="never">
            <el-table :data="teams" border stripe>
              <el-table-column label="团队名称" prop="name" />
              <el-table-column label="团队类型" prop="type" />
              <el-table-column label="团队规模" prop="memberCount" />
              <el-table-column label="负责人" prop="lead" />
            </el-table>
          </el-card>
        </el-tab-pane>

        <!-- 产品 -->
        <el-tab-pane label="产品" name="products">
          <el-card shadow="never">
            <el-table :data="products" border stripe>
              <el-table-column label="产品名称" prop="name">
                <template #default="{ row }">
                  <router-link :to="`/assets/products/${row.id}`" class="link">
                    {{ row.name }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="产品线" prop="productLineName" />
              <el-table-column label="负责人" prop="owner" />
              <el-table-column label="状态" prop="status" />
            </el-table>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { DomainProject } from '@/types/project-v2'

// 导入数据
import domainProjectsData from '@/biz-data/mock/project/domain-projects.json'
import vehicleProjectsData from '@/biz-data/mock/project/vehicle-projects.json'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const project = ref<DomainProject | null>(null)
const activeTab = ref('objectives')

// Mock 数据 - 实际应该从 API 加载
const piPlannings = ref([
  { id: 'PI-2025-Q1', name: '2025 Q1', startDate: '2025-01-01', endDate: '2025-03-31', status: 'active' },
  { id: 'PI-2025-Q2', name: '2025 Q2', startDate: '2025-04-01', endDate: '2025-06-30', status: 'planned' }
])

const teams = ref([
  { id: 'TEAM-PERCEPTION', name: '感知团队', type: '研发团队', memberCount: 12, lead: '张工' },
  { id: 'TEAM-PLANNING', name: '规划团队', type: '研发团队', memberCount: 10, lead: '李工' },
  { id: 'TEAM-CONTROL', name: '控制团队', type: '研发团队', memberCount: 8, lead: '王工' }
])

const products = ref([
  { id: 'PROD-AD-NOA', name: '高速NOA', productLineName: '智能驾驶', owner: '产品经理A', status: '开发中' },
  { id: 'PROD-AD-PARK', name: '智能泊车', productLineName: '智能驾驶', owner: '产品经理B', status: '开发中' }
])

// 加载项目数据
const loadProject = async () => {
  loading.value = true
  try {
    const projectId = route.params.id as string
    const data = domainProjectsData.data.find(p => p.id === projectId)
    if (data) {
      project.value = data as DomainProject
    } else {
      ElMessage.error('项目不存在')
      router.push('/projects/domain')
    }
  } catch (error) {
    ElMessage.error('加载项目详情失败')
  } finally {
    loading.value = false
  }
}

// 获取车型项目名称
const getVehicleProjectName = (id: string) => {
  const vp = vehicleProjectsData.data.find(p => p.id === id)
  return vp ? vp.name : id
}

// 领域标签类型
const getDomainType = (domain: string) => {
  const types: Record<string, any> = {
    '智能驾驶': 'success',
    '智能座舱': 'warning',
    '电子电器': 'info'
  }
  return types[domain] || ''
}

// 状态标签类型和文本
const getStatusType = (status: string) => {
  const types: Record<string, any> = {
    planned: 'info',
    active: 'success',
    'on-hold': 'warning',
    completed: '',
    cancelled: 'danger'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    planned: '计划中',
    active: '进行中',
    'on-hold': '暂停',
    completed: '已完成',
    cancelled: '已取消'
  }
  return texts[status] || status
}

// 版本状态
const getVersionStatusType = (status: string) => {
  const types: Record<string, any> = {
    planned: 'info',
    'in-progress': 'success',
    completed: ''
  }
  return types[status] || 'info'
}

const getVersionStatusText = (status: string) => {
  const texts: Record<string, string> = {
    planned: '计划中',
    'in-progress': '进行中',
    completed: '已完成'
  }
  return texts[status] || status
}

// 进度颜色
const getProgressColor = (progress: number) => {
  if (progress < 30) return '#f56c6c'
  if (progress < 70) return '#e6a23c'
  return '#67c23a'
}

// 返回
const goBack = () => {
  router.back()
}

// 查看PI
const viewPI = (pi: any) => {
  router.push(`/pi-planning/${pi.id}`)
}

// 生命周期
onMounted(() => {
  loadProject()
})
</script>

<style scoped lang="scss">
.domain-project-detail {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-actions {
      display: flex;
      gap: 10px;
    }
  }

  .overview-card {
    margin-bottom: 20px;

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;

      .header-left {
        h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .el-tag {
          margin-right: 10px;
        }
      }
    }

    .project-info {
      margin-top: 20px;
    }
  }

  .stats-row {
    margin-bottom: 20px;
  }

  .content-tabs {
    :deep(.el-tabs__content) {
      padding: 0;
    }
  }

  .link {
    color: #409eff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

