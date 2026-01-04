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
              <el-button type="primary" icon="Plus" size="small" @click="addFeature">
                添加特性
              </el-button>
              <el-empty description="特性列表功能开发中" style="margin-top: 16px" />
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

      <el-tab-pane label="版本历史" name="versions">
        <el-card>
          <el-empty description="版本历史功能开发中" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import productsData from '@/data/products/domain-products.json'

const router = useRouter()
const route = useRoute()

const activeTab = ref('overview')
const product = ref<any>(null)

onMounted(() => {
  const productId = route.params.id as string
  const prod = productsData.find(p => p.id === productId)
  if (prod) {
    product.value = prod
  }
})

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
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

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
}
</style>

