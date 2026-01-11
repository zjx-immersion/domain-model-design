<template>
  <div class="feature-detail-page page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" :content="`Feature详情 - ${feature?.name || ''}`">
        <template #extra>
          <el-space>
            <el-button :icon="Edit" @click="handleEdit">编辑</el-button>
            <el-button :icon="CopyDocument" @click="handleCopy">复制</el-button>
            <el-button :icon="Download" @click="handleExport">导出</el-button>
          </el-space>
        </template>
      </el-page-header>
    </div>

    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <div v-else-if="!feature" class="empty-state">
      <el-empty description="Feature不存在" />
      <el-button type="primary" @click="goBack">返回列表</el-button>
    </div>

    <div v-else>
      <!-- 基本信息卡片 -->
      <el-card class="section-card info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </span>
            <el-tag :type="getStatusTagType(feature.status)">
              {{ getStatusText(feature.status) }}
            </el-tag>
          </div>
        </template>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="Feature编码">
            {{ feature.code }}
          </el-descriptions-item>
          <el-descriptions-item label="Feature名称">
            {{ feature.name }}
          </el-descriptions-item>
          <el-descriptions-item label="业务域">
            <el-tag :type="getDomainTagType(feature.domain)">
              {{ feature.domain }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="版本">
            {{ feature.currentVersion }}
          </el-descriptions-item>
          <el-descriptions-item label="复杂度">
            <el-tag :type="getComplexityType(feature.complexity)">
              {{ getComplexityText(feature.complexity) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="负责人">
            {{ feature.owner || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            {{ formatDate(feature.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDate(feature.updatedAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ feature.description || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 复用情况卡片 -->
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><TrendCharts /></el-icon>
                  复用情况分析
                </span>
              </div>
            </template>

            <div class="reuse-stats">
              <el-row :gutter="16">
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ feature.reuseCount || 0 }}</div>
                    <div class="stat-label">复用次数</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ (feature.products || []).length }}</div>
                    <div class="stat-label">使用产品数</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="stat-item">
                    <div class="stat-value">{{ getReuseRate(feature) }}%</div>
                    <div class="stat-label">复用率</div>
                  </div>
                </el-col>
              </el-row>

              <el-divider />

              <div class="reuse-chart">
                <div class="chart-title">复用趋势</div>
                <el-progress
                  :percentage="getReuseRate(feature)"
                  :color="getReuseColor(feature)"
                  :stroke-width="20"
                >
                  <template #default="{ percentage }">
                    <span class="percentage-text">{{ percentage }}%</span>
                  </template>
                </el-progress>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="section-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">
                  <el-icon><Box /></el-icon>
                  组成模块
                </span>
              </div>
            </template>

            <div class="module-list">
              <el-tag
                v-for="moduleId in (feature.moduleIds || [])"
                :key="moduleId"
                type="info"
                size="large"
                style="margin: 4px"
              >
                {{ moduleId }}
              </el-tag>
              <el-empty v-if="!(feature.moduleIds || []).length" description="暂无模块" :image-size="80" />
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 使用产品列表 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><ShoppingCart /></el-icon>
              使用该Feature的产品 ({{ (feature.products || []).length }})
            </span>
          </div>
        </template>

        <el-table :data="feature.products || []" stripe>
          <el-table-column prop="id" label="产品ID" width="150" />
          <el-table-column prop="name" label="产品名称" min-width="200" />
          <el-table-column label="产品线" width="150">
            <template #default="{ row }">
              <el-tag type="primary">{{ row.productLine || '-' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="配置类型" width="120">
            <template #default="{ row }">
              <el-tag v-if="row.isCore" type="success">核心配置</el-tag>
              <el-tag v-else type="info">可选配置</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="viewProduct(row.id)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-empty v-if="!(feature.products || []).length" description="暂无产品使用该Feature" :image-size="100" />
      </el-card>

      <!-- 关联需求 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Document /></el-icon>
              关联需求
            </span>
          </div>
        </template>

        <div class="requirement-stats">
          <el-space>
            <el-tag type="success" size="large">特性需求(FR): {{ relatedRequirements.frCount }}</el-tag>
            <el-tag type="info" size="large">模块需求(MR): {{ relatedRequirements.mrCount }}</el-tag>
          </el-space>
        </div>

        <el-divider />

        <el-descriptions title="需求统计" :column="3" border size="small">
          <el-descriptions-item label="Total">{{ relatedRequirements.frCount }}</el-descriptions-item>
          <el-descriptions-item label="In Progress">{{ relatedRequirements.inProgress }}</el-descriptions-item>
          <el-descriptions-item label="Completed">{{ relatedRequirements.completed }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 版本历史 -->
      <el-card class="section-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Clock /></el-icon>
              版本历史
            </span>
          </div>
        </template>

        <el-timeline>
          <el-timeline-item
            v-for="(version, index) in versionHistory"
            :key="index"
            :timestamp="formatDate(version.date)"
            placement="top"
          >
            <el-card>
              <h4>{{ version.version }}</h4>
              <p>{{ version.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <el-empty v-if="!versionHistory.length" description="暂无版本历史" :image-size="80" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Edit,
  CopyDocument,
  Download,
  InfoFilled,
  TrendCharts,
  Box,
  ShoppingCart,
  Document,
  Clock
} from '@element-plus/icons-vue'
import featuresDataRaw from '@/biz-data/mock/feature/features.json'
import featureRequirementsDataRaw from '@/biz-data/mock/requirement/feature-requirements.json'
import dayjs from 'dayjs'

const route = useRoute()
const router = useRouter()

// 数据
const feature = ref<any>(null)
const loading = ref(false)

// 加载数据
onMounted(() => {
  const featureId = route.params.id as string
  const featuresData = featuresDataRaw.data || featuresDataRaw
  const foundFeature = featuresData.find((f: any) => f.id === featureId)

  if (foundFeature) {
    feature.value = foundFeature
  }
})

// 关联需求统计
const relatedRequirements = computed(() => {
  if (!feature.value) return { frCount: 0, mrCount: 0, inProgress: 0, completed: 0 }

  const frData = featureRequirementsDataRaw.data || featureRequirementsDataRaw
  const relatedFRs = frData.filter((fr: any) => fr.relatedFeatureAssetId === feature.value.id)

  return {
    frCount: relatedFRs.length,
    mrCount: 0, // TODO: 从MR数据中统计
    inProgress: relatedFRs.filter((fr: any) => fr.status === 'in_progress').length,
    completed: relatedFRs.filter((fr: any) => fr.status === 'approved' || fr.status === 'completed').length
  }
})

// 版本历史（示例数据）
const versionHistory = computed(() => {
  if (!feature.value) return []

  return [
    {
      version: feature.value.currentVersion || 'v1.0.0',
      date: feature.value.updatedAt || new Date().toISOString(),
      description: '当前版本'
    }
  ]
})

// 获取复用率
const getReuseRate = (f: any) => {
  const reuseCount = f.reuseCount || 0
  if (reuseCount === 0) return 0
  return Math.min(100, Math.round((reuseCount / 10) * 100))
}

// 获取复用率颜色
const getReuseColor = (f: any) => {
  const rate = getReuseRate(f)
  if (rate >= 60) return '#67C23A'
  if (rate >= 30) return '#E6A23C'
  return '#F56C6C'
}

// 获取业务域标签类型
const getDomainTagType = (domain: string) => {
  const map: Record<string, any> = {
    'ADAS': 'success',
    'IVI': 'primary',
    'BCM': 'warning',
    'PDC': 'danger',
    'Cockpit': 'info'
  }
  return map[domain] || 'info'
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'deprecated': 'danger',
    'planning': 'warning',
    'development': 'primary'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': 'Active',
    'deprecated': 'Deprecated',
    'planning': 'Planning',
    'development': 'Development'
  }
  return map[status] || status
}

// 获取复杂度类型
const getComplexityType = (complexity: string) => {
  const map: Record<string, any> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'success'
  }
  return map[complexity] || 'info'
}

// 获取复杂度文本
const getComplexityText = (complexity: string) => {
  const map: Record<string, string> = {
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  return map[complexity] || complexity
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

// 查看产品
const viewProduct = (productId: string) => {
  ElMessage.info(`查看产品: ${productId}`)
  // router.push(`/products/${productId}`)
}

// 编辑
const handleEdit = () => {
  ElMessage.info('编辑功能开发中...')
}

// 复制
const handleCopy = () => {
  ElMessage.info('复制功能开发中...')
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 返回
const goBack = () => {
  router.push('/assets/features')
}
</script>

<style scoped lang="scss">
.feature-detail-page {
  .page-header {
    margin-bottom: 20px;
  }

  .loading-container {
    padding: 40px;
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
    }
  }

  .info-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;

    :deep(.el-descriptions__label) {
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    :deep(.el-descriptions__content) {
      color: #fff;
    }
  }

  .reuse-stats {
    .stat-item {
      text-align: center;
      padding: 20px;

      .stat-value {
        font-size: 32px;
        font-weight: bold;
        color: #409EFF;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }

    .reuse-chart {
      padding: 20px 0;

      .chart-title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 16px;
      }

      .percentage-text {
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .module-list {
    padding: 10px 0;
  }

  .requirement-stats {
    margin-bottom: 16px;
  }
}
</style>
