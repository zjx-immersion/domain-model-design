<template>
  <div class="platform-detail page-container">
    <el-skeleton :loading="loading" animated :rows="8" v-if="loading" />

    <div v-else-if="platform">
      <!-- 页头 -->
      <div class="page-header">
        <el-page-header @back="goBack" :content="`Platform - ${platform.name}`">
          <template #extra>
            <el-space>
              <el-button type="primary" :icon="Edit">编辑</el-button>
              <el-button :icon="DocumentCopy">复制</el-button>
              <el-button :icon="Download">导出</el-button>
            </el-space>
          </template>
        </el-page-header>
      </div>

      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </span>
            <el-tag :type="getStatusTagType(platform.status)">
              {{ getStatusText(platform.status) }}
            </el-tag>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Platform编码">{{ platform.code }}</el-descriptions-item>
              <el-descriptions-item label="Platform名称">{{ platform.name }}</el-descriptions-item>
              <el-descriptions-item label="类型">
                <el-tag :type="getTypeTagType(platform.type)">
                  {{ getTypeText(platform.type) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="供应商">{{ platform.vendor }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="版本">{{ platform.version }}</el-descriptions-item>
              <el-descriptions-item label="发布日期">{{ platform.releaseDate }}</el-descriptions-item>
              <el-descriptions-item label="是否主力平台">
                <el-tag :type="platform.isPrimary ? 'success' : 'info'">
                  {{ platform.isPrimary ? '是' : '否' }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="兼容性评分">
                <el-progress
                  :percentage="getCompatibilityScore(platform)"
                  :color="getCompatibilityColor(platform)"
                  :stroke-width="12"
                />
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <el-divider content-position="left">详细描述</el-divider>
        <div class="description-content">
          {{ platform.description }}
        </div>
      </el-card>

      <!-- 技术规格 -->
      <el-card class="spec-card" v-if="platform.specifications">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Cpu /></el-icon>
              技术规格
            </span>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12" v-if="platform.type === 'hardware'">
            <el-descriptions title="硬件规格" :column="1" border>
              <el-descriptions-item label="处理器">
                {{ platform.specifications.processor || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="内存">
                {{ platform.specifications.memory || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="存储">
                {{ platform.specifications.storage || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="GPU">
                {{ platform.specifications.gpu || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="接口">
                {{ platform.specifications.interfaces?.join(', ') || 'N/A' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12" v-if="platform.type === 'software'">
            <el-descriptions title="软件规格" :column="1" border>
              <el-descriptions-item label="内核版本">
                {{ platform.specifications.kernelVersion || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="支持架构">
                {{ platform.specifications.supportedArchitectures?.join(', ') || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="许可证">
                {{ platform.specifications.license || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="包管理">
                {{ platform.specifications.packageManager || 'N/A' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions title="性能指标" :column="1" border>
              <el-descriptions-item label="CPU性能">
                {{ platform.specifications.performance?.cpu || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="内存带宽">
                {{ platform.specifications.performance?.memoryBandwidth || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="功耗">
                {{ platform.specifications.performance?.powerConsumption || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="工作温度">
                {{ platform.specifications.performance?.operatingTemp || 'N/A' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 部署的模块 -->
      <el-card class="modules-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Box /></el-icon>
              部署的模块 ({{ platform.deployedModules?.length || 0 }})
            </span>
          </div>
        </template>

        <el-table
          :data="platform.deployedModules"
          stripe
          v-if="platform.deployedModules && platform.deployedModules.length > 0"
        >
          <el-table-column prop="moduleId" label="模块ID" width="150" />
          <el-table-column prop="moduleName" label="模块名称" min-width="200" />
          <el-table-column prop="deploymentType" label="部署类型" width="120">
            <template #default="{ row }">
              <el-tag :type="row.deploymentType === 'native' ? 'success' : 'info'" size="small">
                {{ row.deploymentType === 'native' ? '原生' : '容器' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="version" label="版本" width="120" />
          <el-table-column label="兼容性" width="150">
            <template #default="{ row }">
              <el-tag :type="row.compatibility === 'full' ? 'success' : 'warning'" size="small">
                {{ row.compatibility === 'full' ? '完全兼容' : '部分兼容' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deploymentDate" label="部署日期" width="120" />
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="viewModuleDetail(row.moduleId)">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else description="暂无部署的模块" :image-size="100" />
      </el-card>

      <!-- 使用该Platform的产品 -->
      <el-card class="products-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Goods /></el-icon>
              使用该Platform的产品 ({{ platform.usedInProducts?.length || 0 }})
            </span>
          </div>
        </template>

        <div v-if="platform.usedInProducts && platform.usedInProducts.length > 0" class="products-list">
          <el-space wrap>
            <el-tag
              v-for="product in platform.usedInProducts"
              :key="product"
              type="primary"
              size="large"
            >
              {{ product }}
            </el-tag>
          </el-space>
        </div>
        <el-empty v-else description="暂无产品使用该Platform" :image-size="80" />
      </el-card>

      <!-- 迁移建议 -->
      <el-card class="migration-card" v-if="platform.migrationSuggestions">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Promotion /></el-icon>
              迁移建议
            </span>
          </div>
        </template>

        <el-alert
          v-for="(suggestion, index) in platform.migrationSuggestions"
          :key="index"
          :title="suggestion.title"
          :description="suggestion.description"
          :type="suggestion.priority === 'high' ? 'warning' : 'info'"
          show-icon
          :closable="false"
          style="margin-bottom: 12px"
        />
      </el-card>
    </div>

    <el-empty v-else description="Platform不存在" :image-size="200" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Edit,
  DocumentCopy,
  Download,
  InfoFilled,
  Cpu,
  Box,
  Goods,
  Promotion
} from '@element-plus/icons-vue'
import platformsDataRaw from '@/biz-data/mock/asset/platforms.json'

const route = useRoute()
const router = useRouter()

// 数据
const platform = ref<any>(null)
const loading = ref(false)

// 加载数据
onMounted(() => {
  const platformId = route.params.id as string
  const platformsData = platformsDataRaw.data || platformsDataRaw
  const foundPlatform = platformsData.find((p: any) => p.id === platformId)
  
  if (foundPlatform) {
    platform.value = foundPlatform
  }
})

// 获取类型标签类型
const getTypeTagType = (type: string) => {
  return type === 'hardware' ? 'primary' : 'success'
}

// 获取类型文本
const getTypeText = (type: string) => {
  const map: Record<string, string> = {
    'hardware': '硬件平台',
    'software': '软件平台'
  }
  return map[type] || type
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'active': 'success',
    'deprecated': 'warning',
    'eol': 'danger'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'active': 'Active',
    'deprecated': 'Deprecated',
    'eol': 'EOL'
  }
  return map[status] || status
}

// 获取兼容性得分
const getCompatibilityScore = (platform: any) => {
  return platform.compatibilityScore || 85
}

// 获取兼容性颜色
const getCompatibilityColor = (platform: any) => {
  const score = getCompatibilityScore(platform)
  if (score >= 90) return '#67C23A'
  if (score >= 70) return '#E6A23C'
  return '#F56C6C'
}

// 查看模块详情
const viewModuleDetail = (moduleId: string) => {
  router.push(`/products/modules/${moduleId}`)
}

// 返回
const goBack = () => {
  router.push('/platforms')
}
</script>

<style scoped lang="scss">
.platform-detail {
  .page-header {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .info-card,
  .spec-card,
  .modules-card,
  .products-card,
  .migration-card {
    margin-bottom: 20px;
  }

  .description-content {
    padding: 12px 0;
    line-height: 1.8;
    color: #606266;
  }

  .products-list {
    padding: 12px 0;
  }
}
</style>

