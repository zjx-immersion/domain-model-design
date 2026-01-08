<template>
  <div class="baseline-detail" v-loading="loading">
    <div v-if="data" class="detail-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <el-button icon="ArrowLeft" @click="router.back()">返回</el-button>
          <div class="title-section">
            <h2>{{ data.name }}</h2>
            <span class="subtitle">{{ data.code }}</span>
          </div>
        </div>
        <div class="header-right">
          <el-tag :type="getStatusType(data.status)" size="large">
            {{ getStatusLabel(data.status) }}
          </el-tag>
          <el-button 
            v-if="data.status === 'draft'" 
            type="primary" 
            icon="Edit"
            @click="editBaseline"
          >
            编辑
          </el-button>
          <el-button 
            v-if="data.status === 'draft'" 
            type="success" 
            icon="Check"
            @click="baselineAction"
          >
            基线化
          </el-button>
          <el-button 
            v-if="data.status === 'baseline'" 
            type="warning" 
            icon="Lock"
            @click="freezeAction"
          >
            冻结
          </el-button>
        </div>
      </div>

      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <span class="card-header-title">基本信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="编号">{{ data.code }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(data.status)">{{ getStatusLabel(data.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品">
            <el-link type="primary" @click="viewProduct(data.productId)">
              {{ data.productName }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="关联版本">
            <el-link type="primary" @click="viewRelease(data.releaseId)">
              {{ data.releaseName }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="关联PI">
            <el-link type="primary" @click="viewPI(data.piId)">
              {{ data.piName }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="基线类型">
            <el-tag>{{ data.type === 'standard' ? '标准基线' : '高级基线' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ data.description }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(data.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(data.updatedAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="基线化时间" v-if="data.baselinedAt">
            {{ formatDate(data.baselinedAt) }} ({{ data.baselinedBy }})
          </el-descriptions-item>
          <el-descriptions-item label="冻结时间" v-if="data.frozenAt">
            {{ formatDate(data.frozenAt) }} ({{ data.frozenBy }})
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 统计卡片 -->
      <div class="stats-row">
        <el-row :gutter="16">
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="总特性数" :value="data.totalFeatures">
                <template #suffix>个</template>
              </el-statistic>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="直接采用" :value="data.adoptedFeatures?.length || 0">
                <template #suffix>个</template>
              </el-statistic>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="需要开发" :value="data.developmentFeatures?.length || 0">
                <template #suffix>个</template>
              </el-statistic>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <el-statistic title="预估工作量" :value="data.estimatedStoryPoints">
                <template #suffix>SP</template>
              </el-statistic>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <!-- 特性列表 -->
      <el-card class="features-card">
        <template #header>
          <div class="card-header">
            <span class="card-header-title">特性列表 ({{ data.features?.length || 0 }})</span>
            <div class="header-tabs">
              <el-radio-group v-model="featureFilter" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="direct">直接采用</el-radio-button>
                <el-radio-button label="development">需要开发</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>

        <el-table :data="filteredFeatures" stripe>
          <el-table-column prop="featureCode" label="特性编号" width="120" />
          <el-table-column prop="featureName" label="特性名称" min-width="200">
            <template #default="scope">
              <el-link type="primary" @click="viewFeature(scope.row.featureId)">
                {{ scope.row.featureName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="adoptionType" label="采用方式" width="120">
            <template #default="scope">
              <el-tag 
                :type="scope.row.adoptionType === 'direct' ? 'success' : 'warning'"
                effect="plain"
              >
                {{ scope.row.adoptionType === 'direct' ? '直接采用' : '需要开发' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="版本/需求" width="150">
            <template #default="scope">
              <div v-if="scope.row.adoptionType === 'direct'">
                <el-tag size="small" type="info">{{ scope.row.currentVersion }}</el-tag>
              </div>
              <div v-else>
                <el-tag 
                  size="small" 
                  type="warning"
                  v-for="reqId in scope.row.requirements" 
                  :key="reqId"
                  style="margin: 2px"
                  @click="viewRequirement(reqId)"
                  class="clickable-tag"
                >
                  {{ reqId }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="工作量" width="100" align="center">
            <template #default="scope">
              <span v-if="scope.row.adoptionType === 'development'">
                {{ scope.row.estimatedPoints }} SP
              </span>
              <span v-else style="color: #909399">-</span>
            </template>
          </el-table-column>
          <el-table-column label="分配团队" width="150">
            <template #default="scope">
              <el-link 
                v-if="scope.row.assignedTeam" 
                type="primary"
                @click="viewTeam(scope.row.assignedTeam)"
              >
                {{ scope.row.assignedTeam }}
              </el-link>
              <span v-else style="color: #909399">未分配</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getFeatureStatusType(scope.row.status)">
                {{ getFeatureStatusLabel(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="progress" label="进度" width="120">
            <template #default="scope">
              <el-progress 
                :percentage="Math.round(scope.row.progress * 100)" 
                :status="scope.row.progress === 1 ? 'success' : undefined"
              />
            </template>
          </el-table-column>
          <el-table-column label="依赖" width="100" align="center">
            <template #default="scope">
              <el-popover 
                v-if="scope.row.dependencies && scope.row.dependencies.length > 0"
                placement="left"
                :width="200"
                trigger="hover"
              >
                <template #reference>
                  <el-badge :value="scope.row.dependencies.length" class="item">
                    <el-icon><Link /></el-icon>
                  </el-badge>
                </template>
                <div>
                  <div v-for="depId in scope.row.dependencies" :key="depId">
                    <el-link type="primary" size="small" @click="viewFeature(depId)">
                      {{ depId }}
                    </el-link>
                  </div>
                </div>
              </el-popover>
              <span v-else style="color: #909399">无</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 迭代分配 -->
      <el-card class="sprints-card" v-if="data.sprints && data.sprints.length > 0">
        <template #header>
          <span class="card-header-title">迭代分配 ({{ data.sprints.length }})</span>
        </template>
        <el-table :data="data.sprints" stripe>
          <el-table-column prop="sprintId" label="迭代编号" width="120" />
          <el-table-column prop="sprintName" label="迭代名称" width="150">
            <template #default="scope">
              <el-link type="primary" @click="viewSprint(scope.row.sprintId)">
                {{ scope.row.sprintName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="特性" min-width="200">
            <template #default="scope">
              <el-tag 
                v-for="featureId in scope.row.features" 
                :key="featureId"
                size="small"
                style="margin: 2px"
              >
                {{ getFeatureName(featureId) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="工作量" width="120" align="center">
            <template #default="scope">
              {{ scope.row.estimatedPoints }} / {{ scope.row.capacity }} SP
            </template>
          </el-table-column>
          <el-table-column label="负载率" width="150">
            <template #default="scope">
              <el-progress 
                :percentage="Math.round((scope.row.estimatedPoints / scope.row.capacity) * 100)"
                :status="scope.row.estimatedPoints > scope.row.capacity ? 'exception' : undefined"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 团队分配 -->
      <el-card class="teams-card" v-if="data.teams && data.teams.length > 0">
        <template #header>
          <span class="card-header-title">团队分配 ({{ data.teams.length }})</span>
        </template>
        <el-table :data="data.teams" stripe>
          <el-table-column prop="teamId" label="团队编号" width="120" />
          <el-table-column prop="teamName" label="团队名称" width="150">
            <template #default="scope">
              <el-link type="primary" @click="viewTeam(scope.row.teamId)">
                {{ scope.row.teamName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="负责特性" min-width="200">
            <template #default="scope">
              <el-tag 
                v-for="featureId in scope.row.features" 
                :key="featureId"
                size="small"
                style="margin: 2px"
              >
                {{ getFeatureName(featureId) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="工作量" width="120" align="center">
            <template #default="scope">
              {{ scope.row.estimatedPoints }} / {{ scope.row.capacity }} SP
            </template>
          </el-table-column>
          <el-table-column label="负载率" width="150">
            <template #default="scope">
              <el-progress 
                :percentage="Math.round((scope.row.estimatedPoints / scope.row.capacity) * 100)"
                :status="scope.row.estimatedPoints > scope.row.capacity ? 'exception' : undefined"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft, Edit, Check, Lock, Link } from '@element-plus/icons-vue'
import baselinesData from '@/data/release/baselines.json'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const data = ref<any>(null)
const featureFilter = ref('all')

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    data.value = baselinesData.data.find((item: any) => item.id === id)
    
    if (!data.value) {
      ElMessage.error('特性包不存在')
      router.back()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const filteredFeatures = computed(() => {
  if (!data.value || !data.value.features) return []
  
  let features = data.value.features
  
  if (featureFilter.value === 'direct') {
    features = features.filter((f: any) => f.adoptionType === 'direct')
  } else if (featureFilter.value === 'development') {
    features = features.filter((f: any) => f.adoptionType === 'development')
  }
  
  return features
})

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    baseline: 'success',
    frozen: 'warning',
    archived: ''
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    baseline: '已基线化',
    frozen: '已冻结',
    archived: '已归档'
  }
  return labelMap[status] || status
}

const getFeatureStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    planned: 'info',
    in_progress: 'warning',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

const getFeatureStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    planned: '已规划',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return labelMap[status] || status
}

const getFeatureName = (featureId: string) => {
  if (!data.value || !data.value.features) return featureId
  const feature = data.value.features.find((f: any) => f.featureId === featureId)
  return feature ? feature.featureName : featureId
}

const editBaseline = () => {
  ElMessage.info('编辑特性包功能开发中')
}

const baselineAction = () => {
  ElMessageBox.confirm(
    `确定将特性包 "${data.value.name}" 设置为基线状态吗？基线化后将不能随意修改。`,
    '基线化确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    data.value.status = 'baseline'
    ElMessage.success('基线化成功')
  }).catch(() => {
    ElMessage.info('已取消基线化')
  })
}

const freezeAction = () => {
  ElMessageBox.confirm(
    `确定冻结特性包 "${data.value.name}" 吗？冻结后将完全锁定，不能进行任何修改。`,
    '冻结确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    data.value.status = 'frozen'
    ElMessage.success('冻结成功')
  }).catch(() => {
    ElMessage.info('已取消冻结')
  })
}

const viewProduct = (productId: string) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}

const viewRelease = (releaseId: string) => {
  router.push({ name: 'ReleaseDetail', params: { id: releaseId } })
}

const viewPI = (piId: string) => {
  router.push({ name: 'PIDetail', params: { id: piId } })
}

const viewFeature = (featureId: string) => {
  router.push({ name: 'FeatureDetail', params: { id: featureId } })
}

const viewRequirement = (reqId: string) => {
  router.push({ name: 'FeatureRequirementDetail', params: { id: reqId } })
}

const viewTeam = (teamId: string) => {
  router.push({ name: 'TeamDetail', params: { id: teamId } })
}

const viewSprint = (sprintId: string) => {
  router.push({ name: 'SprintDetail', params: { id: sprintId } })
}
</script>

<style scoped lang="scss">
.baseline-detail {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .title-section {
        h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 14px;
          color: #909399;
        }
      }
    }

    .header-right {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  }

  .info-card {
    margin-bottom: 16px;
  }

  .stats-row {
    margin-bottom: 16px;

    .stat-card {
      text-align: center;
    }
  }

  .features-card,
  .sprints-card,
  .teams-card {
    margin-bottom: 16px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-header-title {
        font-weight: 600;
      }
    }

    .clickable-tag {
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }
  }
}
</style>

