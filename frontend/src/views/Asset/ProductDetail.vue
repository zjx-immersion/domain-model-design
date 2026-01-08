<template>
  <div class="product-detail page-container">
    <div class="page-header">
      <div class="header-left">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/assets/products' }">领域产品</el-breadcrumb-item>
          <el-breadcrumb-item>{{ product?.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{ product?.name }}</h1>
        <div class="header-meta">
          <el-tag :type="getStatusType(product?.status)">
            {{ getStatusText(product?.status) }}
          </el-tag>
          <span class="version">v{{ product?.version }}</span>
        </div>
      </div>
      <div class="header-actions">
        <el-button icon="Back" @click="router.back()">返回</el-button>
        <el-button type="primary" icon="Edit">编辑产品</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="产品概览" name="overview">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-card header="产品信息">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="产品编号">{{ product?.code }}</el-descriptions-item>
                <el-descriptions-item label="产品版本">v{{ product?.version }}</el-descriptions-item>
                <el-descriptions-item label="产品线">
                  <el-link type="primary">{{ product?.productLineName }}</el-link>
                </el-descriptions-item>
                <el-descriptions-item label="产品类型">{{ product?.type }}</el-descriptions-item>
                <el-descriptions-item label="产品负责人">{{ product?.ownerName }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ product?.createdAt }}</el-descriptions-item>
                <el-descriptions-item label="计划发布日期">
                  {{ product?.planReleaseDate || product?.releaseDate }}
                </el-descriptions-item>
                <el-descriptions-item label="特性数量">{{ product?.featureCount }}</el-descriptions-item>
                <el-descriptions-item label="模块数量">{{ product?.moduleCount }}</el-descriptions-item>
                <el-descriptions-item label="产品描述" :span="2">
                  {{ product?.description }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card header="产品特性" style="margin-top: 16px">
              <div class="card-header-actions">
              <el-button type="primary" icon="Plus" size="small" @click="addFeature">
                添加特性
              </el-button>
              </div>
              
              <el-table :data="productFeatures" v-loading="loadingFeatures" style="margin-top: 16px">
                <el-table-column prop="code" label="编号" width="120" />
                <el-table-column prop="name" label="特性名称" min-width="180">
                  <template #default="scope">
                    <el-link type="primary" @click="viewFeatureDetail(scope.row.id)">
                      {{ scope.row.name }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" width="100">
                  <template #default="scope">
                    <el-tag :type="getFeatureTypeTag(scope.row.type)" size="small">
                      {{ getFeatureTypeLabel(scope.row.type) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="getFeatureStatusTag(scope.row.status)" size="small">
                      {{ getFeatureStatusLabel(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="moduleCount" label="模块数" width="90" align="center" />
                <el-table-column prop="requirementCount" label="需求数" width="90" align="center">
                  <template #default="scope">
                    <el-link type="primary" @click="viewFeatureRequirements(scope.row.id)">
                      {{ scope.row.requirementCount || 0 }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="viewFeatureDetail(scope.row.id)">
                      查看
                    </el-button>
                    <el-button link type="danger" size="small" @click="removeFeature(scope.row)">
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              
              <el-empty v-if="productFeatures.length === 0 && !loadingFeatures" 
                description="暂无特性，点击上方按钮添加特性" />
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card header="快捷操作">
              <div class="quick-actions">
                <el-button @click="viewFeatures" style="width: 100%">
                  <el-icon><Files /></el-icon> 查看特性
                </el-button>
                <el-button @click="viewModules" style="width: 100%">
                  <el-icon><Box /></el-icon> 查看模块
                </el-button>
                <el-button @click="viewVersions" style="width: 100%">
                  <el-icon><Clock /></el-icon> 版本管理
                </el-button>
                <el-button @click="viewRequirements" style="width: 100%">
                  <el-icon><Document /></el-icon> 关联需求
                </el-button>
              </div>
            </el-card>

            <el-card header="产品统计" style="margin-top: 16px">
              <div class="stats-list">
                <div class="stat-item">
                  <span class="label">特性数量</span>
                  <span class="value">{{ product?.featureCount }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">模块数量</span>
                  <span class="value">{{ product?.moduleCount }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="版本管理" name="versions">
        <!-- 版本与特性包 -->
        <el-card>
          <template #header>
            <div class="card-header-with-action">
              <span>产品版本</span>
              <el-button type="primary" icon="Plus" size="small" @click="createRelease">
                创建版本
              </el-button>
            </div>
          </template>
          
          <el-table :data="productReleases" v-loading="loadingReleases">
            <el-table-column prop="code" label="版本编号" width="150" />
            <el-table-column prop="name" label="版本名称" min-width="200">
              <template #default="scope">
                <el-link type="primary" @click="viewReleaseDetail(scope.row.id)">
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="version" label="版本号" width="120">
              <template #default="scope">
                <el-tag size="small">{{ scope.row.version }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getReleaseStatusType(scope.row.status)" size="small">
                  {{ getReleaseStatusLabel(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="releaseDate" label="发布日期" width="120" />
            <el-table-column prop="ownerName" label="负责人" width="100" />
            <el-table-column label="特性包" width="150">
              <template #default="scope">
                <el-link 
                  v-if="scope.row.featureBaselines && scope.row.featureBaselines.length > 0"
                  type="primary" 
                  @click="viewBaseline(scope.row.featureBaselines[0])"
                >
                  {{ scope.row.featureBaselines.length }}个特性包
                </el-link>
                <span v-else style="color: #909399">未关联</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewReleaseDetail(scope.row.id)">
                  查看
                </el-button>
                <el-button link type="primary" size="small" @click="manageBaseline(scope.row.id)">
                  特性包
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <el-empty v-if="productReleases.length === 0 && !loadingReleases" 
            description="暂无版本，点击上方按钮创建版本" />
        </el-card>

        <!-- 特性包列表 -->
        <el-card style="margin-top: 16px">
          <template #header>
            <div class="card-header-with-action">
              <span>特性包</span>
              <el-button type="primary" icon="Plus" size="small" @click="createBaseline">
                创建特性包
              </el-button>
            </div>
          </template>
          
          <el-table :data="productBaselines" v-loading="loadingBaselines">
            <el-table-column prop="code" label="编号" width="150" />
            <el-table-column prop="name" label="特性包名称" min-width="200">
              <template #default="scope">
                <el-link type="primary" @click="viewBaseline(scope.row.id)">
                  {{ scope.row.name }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="releaseName" label="关联版本" width="150">
              <template #default="scope">
                <el-link type="primary" @click="viewReleaseDetail(scope.row.releaseId)">
                  {{ scope.row.releaseName }}
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
            <el-table-column prop="estimatedStoryPoints" label="工作量" width="100" align="center">
              <template #default="scope">
                {{ scope.row.estimatedStoryPoints }} SP
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getBaselineStatusType(scope.row.status)" size="small">
                  {{ getBaselineStatusLabel(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewBaseline(scope.row.id)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <el-empty v-if="productBaselines.length === 0 && !loadingBaselines" 
            description="暂无特性包，点击上方按钮创建特性包" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import productsData from '@/data/products/domain-products.json'
import releasesData from '@/data/release/releases.json'
import baselinesData from '@/data/release/baselines.json'

const router = useRouter()
const route = useRoute()

const activeTab = ref('overview')
const product = ref<any>(null)
const productFeatures = ref<any[]>([])
const loadingFeatures = ref(false)
const featureRequirementCounts = ref<Record<string, number>>({})

// 版本和特性包相关数据
const productReleases = ref<any[]>([])
const loadingReleases = ref(false)
const productBaselines = ref<any[]>([])
const loadingBaselines = ref(false)

onMounted(async () => {
  const productId = route.params.id as string
  const prod = productsData.find(p => p.id === productId)
  if (prod) {
    product.value = prod
    await loadProductFeatures()
  }
})

// 监听activeTab变化，加载版本和特性包数据
watch(activeTab, (newTab) => {
  if (newTab === 'versions' && productReleases.value.length === 0) {
    loadProductReleases()
    loadProductBaselines()
  }
})

// 加载产品特性列表
async function loadProductFeatures() {
  if (!product.value || !product.value.features) return
  
  loadingFeatures.value = true
  try {
    // 加载特性数据
    const response = await fetch('/biz-data/mock/asset/features.json')
    const result = await response.json()
    const allFeatures = result.data
    
    // 筛选出产品包含的特性
    productFeatures.value = allFeatures.filter((f: any) => 
      product.value.features.includes(f.id)
    )
    
    // 加载特性需求数量
    await loadFeatureRequirementCounts()
  } catch (error) {
    console.error('加载特性列表失败:', error)
    ElMessage.error('加载特性列表失败')
  } finally {
    loadingFeatures.value = false
  }
}

// 加载每个特性的需求数量
async function loadFeatureRequirementCounts() {
  try {
    const response = await fetch('/biz-data/mock/requirement/feature-requirements.json')
    const result = await response.json()
    const requirements = result.data
    
    // 统计每个特性的需求数量
    const counts: Record<string, number> = {}
    requirements.forEach((req: any) => {
      if (req.featureId) {
        counts[req.featureId] = (counts[req.featureId] || 0) + 1
      }
    })
    featureRequirementCounts.value = counts
    
    // 更新特性列表中的需求数量
    productFeatures.value = productFeatures.value.map(f => ({
      ...f,
      requirementCount: counts[f.id] || 0
    }))
  } catch (error) {
    console.error('加载需求数量失败:', error)
  }
}

function getStatusType(status?: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_development: 'primary',
    released: 'success',
  }
  return typeMap[status || ''] || 'info'
}

function getStatusText(status?: string) {
  const textMap: Record<string, string> = {
    planning: '规划中',
    in_development: '开发中',
    released: '已发布',
  }
  return textMap[status || ''] || status
}

function addFeature() {
  ElMessage.info('添加特性功能开发中...')
}

function viewFeatureDetail(featureId: string) {
  router.push(`/assets/features/${featureId}`)
}

function viewFeatureRequirements(featureId: string) {
  router.push({ 
    path: '/requirements/feature', 
    query: { featureId } 
  })
}

function removeFeature(feature: any) {
  ElMessageBox.confirm(
    `确定要从产品中移除特性"${feature.name}"吗？`,
    '移除特性',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success(`已移除特性: ${feature.name}`)
    // 实际应该调用API删除
    productFeatures.value = productFeatures.value.filter(f => f.id !== feature.id)
  }).catch(() => {
    // 用户取消
  })
}

function getFeatureTypeTag(type: string) {
  const typeMap: Record<string, any> = {
    common: 'success',
    variant: 'warning',
    custom: 'info'
  }
  return typeMap[type] || 'info'
}

function getFeatureTypeLabel(type: string) {
  const labelMap: Record<string, string> = {
    common: '通用',
    variant: '变体',
    custom: '定制'
  }
  return labelMap[type] || type
}

function getFeatureStatusTag(status: string) {
  const tagMap: Record<string, any> = {
    active: 'success',
    inactive: 'info',
    deprecated: 'danger'
  }
  return tagMap[status] || 'info'
}

function getFeatureStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    active: '活跃',
    inactive: '不活跃',
    deprecated: '已废弃'
  }
  return labelMap[status] || status
}

function viewFeatures() {
  router.push({ path: '/assets/features', query: { productId: product.value?.id } })
}

function viewModules() {
  router.push({ path: '/assets/modules', query: { productId: product.value?.id } })
}

function viewVersions() {
  router.push(`/assets/products/${product.value?.id}/versions`)
}

function viewRequirements() {
  router.push({ path: '/requirements/feature', query: { productId: product.value?.id } })
}

// 加载产品版本列表
async function loadProductReleases() {
  if (!product.value) return
  
  loadingReleases.value = true
  try {
    productReleases.value = releasesData.data.filter(
      (r: any) => r.productId === product.value.id
    )
  } catch (error) {
    console.error('加载版本列表失败:', error)
    ElMessage.error('加载版本列表失败')
  } finally {
    loadingReleases.value = false
  }
}

// 加载产品特性包列表
async function loadProductBaselines() {
  if (!product.value) return
  
  loadingBaselines.value = true
  try {
    productBaselines.value = baselinesData.data.filter(
      (b: any) => b.productId === product.value.id
    )
  } catch (error) {
    console.error('加载特性包列表失败:', error)
    ElMessage.error('加载特性包列表失败')
  } finally {
    loadingBaselines.value = false
  }
}

// 版本管理相关函数
function createRelease() {
  ElMessage.info('创建版本功能开发中')
}

function viewReleaseDetail(releaseId: string) {
  ElMessage.info(`查看版本详情: ${releaseId}`)
}

function manageBaseline(releaseId: string) {
  // 跳转到特性包管理页面，并筛选该版本的特性包
  router.push({ path: '/baselines/list', query: { releaseId } })
}

function getReleaseStatusType(status: string) {
  const typeMap: Record<string, any> = {
    planning: 'info',
    in_progress: 'warning',
    released: 'success',
    archived: ''
  }
  return typeMap[status] || 'info'
}

function getReleaseStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    planning: '规划中',
    in_progress: '进行中',
    released: '已发布',
    archived: '已归档'
  }
  return labelMap[status] || status
}

// 特性包管理相关函数
function createBaseline() {
  ElMessage.info('创建特性包功能开发中')
}

function viewBaseline(baselineId: string) {
  router.push({ name: 'BaselineDetail', params: { id: baselineId } })
}

function getBaselineStatusType(status: string) {
  const typeMap: Record<string, any> = {
    draft: 'info',
    baseline: 'success',
    frozen: 'warning',
    archived: ''
  }
  return typeMap[status] || 'info'
}

function getBaselineStatusLabel(status: string) {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    baseline: '已基线化',
    frozen: '已冻结',
    archived: '已归档'
  }
  return labelMap[status] || status
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.product-detail {
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

      .header-meta {
        display: flex;
        gap: $spacing-md;
        align-items: center;

        .version {
          font-size: 14px;
          color: $text-secondary;
          font-weight: 600;
        }
      }
    }

    .header-actions {
      display: flex;
      gap: $spacing-sm;
    }
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }

  .stats-list {
    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: $spacing-md 0;
      border-bottom: 1px solid $border-light;

      &:last-child {
        border-bottom: none;
      }

      .label {
        color: $text-secondary;
      }

      .value {
        font-weight: 600;
        font-size: 18px;
      }
    }
  }

  .card-header-actions {
    margin-bottom: $spacing-md;
  }

  .card-header-with-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.el-card__header) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

