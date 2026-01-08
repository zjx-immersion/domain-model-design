<template>
  <div class="release-detail" v-loading="loading">
    <div v-if="data" class="detail-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <el-button icon="ArrowLeft" @click="router.back()">返回</el-button>
          <div class="title-section">
            <h2>{{ data.name }}</h2>
            <span class="subtitle">{{ data.code }} - {{ data.version }}</span>
          </div>
        </div>
        <div class="header-right">
          <el-tag :type="getStatusType(data.status)" size="large">
            {{ getStatusLabel(data.status) }}
          </el-tag>
          <el-button 
            v-if="data.status === 'planning' || data.status === 'in_progress'" 
            type="primary" 
            icon="Edit"
            @click="editRelease"
          >
            编辑
          </el-button>
        </div>
      </div>

      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <span class="card-header-title">基本信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="版本编号">{{ data.code }}</el-descriptions-item>
          <el-descriptions-item label="版本号">
            <el-tag>{{ data.version }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="产品">
            <el-link type="primary" @click="viewProduct(data.productId)">
              {{ data.productName }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(data.status)">{{ getStatusLabel(data.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="负责人">{{ data.ownerName }}</el-descriptions-item>
          <el-descriptions-item label="发布日期">{{ data.releaseDate }}</el-descriptions-item>
          <el-descriptions-item label="计划开始">{{ data.planStartDate }}</el-descriptions-item>
          <el-descriptions-item label="计划结束">{{ data.planEndDate }}</el-descriptions-item>
          <el-descriptions-item label="关联PI" v-if="data.piPlanningId">
            <el-link type="primary" @click="viewPI(data.piPlanningId)">
              {{ data.piPlanningId }}
            </el-link>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ data.description }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(data.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(data.updatedAt) }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 特性包列表 -->
      <el-card class="baselines-card">
        <template #header>
          <div class="card-header-with-action">
            <span class="card-header-title">特性包 ({{ baselines.length }})</span>
            <el-button type="primary" icon="Plus" size="small" @click="createBaseline">
              创建特性包
            </el-button>
          </div>
        </template>

        <div v-if="baselines.length > 0">
          <el-table :data="baselines" stripe>
            <el-table-column prop="code" label="编号" width="150" />
            <el-table-column prop="name" label="特性包名称" min-width="200">
              <template #default="scope">
                <el-link type="primary" @click="viewBaseline(scope.row.id)">
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column label="特性构成" width="180">
              <template #default="scope">
                <el-tag size="small" type="success">
                  直接采用 {{ scope.row.adoptedFeatures?.length || 0 }}
                </el-tag>
                <el-tag size="small" type="warning" style="margin-left: 4px">
                  需要开发 {{ scope.row.developmentFeatures?.length || 0 }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="工作量" width="100" align="center">
              <template #default="scope">
                {{ scope.row.estimatedStoryPoints }} SP
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getBaselineStatusType(scope.row.status)">
                  {{ getBaselineStatusLabel(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="progress" label="进度" width="150">
              <template #default="scope">
                <el-progress 
                  :percentage="Math.round(scope.row.progress * 100)" 
                  :status="scope.row.progress === 1 ? 'success' : undefined"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="viewBaseline(scope.row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-empty v-else description="暂无特性包，点击上方按钮创建特性包" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Plus } from '@element-plus/icons-vue'
import releasesData from '@/data/release/releases.json'
import baselinesData from '@/data/release/baselines.json'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const data = ref<any>(null)
const baselines = ref<any[]>([])

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    data.value = releasesData.data.find((item: any) => item.id === id)
    
    if (!data.value) {
      ElMessage.error('版本不存在')
      router.back()
      return
    }

    // 加载该版本关联的特性包
    if (data.value.featureBaselines && data.value.featureBaselines.length > 0) {
      baselines.value = baselinesData.data.filter((b: any) => 
        data.value.featureBaselines.includes(b.id)
      )
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: 'warning',
    released: 'success',
    archived: ''
  }
  return typeMap[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    released: '已发布',
    archived: '已归档'
  }
  return labelMap[status] || status
}

const getBaselineStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    baseline: 'success',
    frozen: 'warning',
    archived: ''
  }
  return typeMap[status] || 'info'
}

const getBaselineStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    baseline: '已基线化',
    frozen: '已冻结',
    archived: '已归档'
  }
  return labelMap[status] || status
}

const editRelease = () => {
  ElMessage.info('编辑版本功能开发中')
}

const viewProduct = (productId: string) => {
  router.push({ name: 'ProductDetail', params: { id: productId } })
}

const viewPI = (piId: string) => {
  router.push({ name: 'PIPlanningWorkspace', params: { id: piId } })
}

const createBaseline = () => {
  ElMessage.info('创建特性包功能开发中')
}

const viewBaseline = (baselineId: string) => {
  router.push({ name: 'BaselineDetail', params: { id: baselineId } })
}
</script>

<style scoped lang="scss">
.release-detail {
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

  .baselines-card {
    .card-header-with-action {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-header-title {
        font-weight: 600;
      }
    }
  }
}
</style>

