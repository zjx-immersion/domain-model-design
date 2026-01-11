<template>
  <el-card class="asset-link-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">
          <el-icon><Link /></el-icon>
          关联资产
        </span>
      </div>
    </template>

    <!-- UR关联Product -->
    <div v-if="requirementType === 'UR' && productAssets.length > 0" class="asset-section">
      <div class="section-title">
        <el-icon><Box /></el-icon>
        关联产品 ({{ productAssets.length }})
      </div>
      <el-row :gutter="16" class="asset-list">
        <el-col :span="8" v-for="product in productAssets" :key="product.id">
          <el-card shadow="hover" class="asset-item" @click="goToProduct(product.id)">
            <div class="asset-item-header">
              <el-tag type="success">Product</el-tag>
              <el-tag v-if="product.isPrimary" type="warning" size="small">主力产品</el-tag>
            </div>
            <div class="asset-item-body">
              <div class="asset-code">{{ product.code }}</div>
              <div class="asset-name">{{ product.name }}</div>
              <div class="asset-meta">
                <span>产品线: {{ product.productLine }}</span>
              </div>
            </div>
            <div class="asset-item-footer">
              <el-button type="primary" link size="small">查看详情</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- FR关联Feature -->
    <div v-if="requirementType === 'FR' && featureAssets.length > 0" class="asset-section">
      <div class="section-title">
        <el-icon><Cpu /></el-icon>
        关联Feature资产 ({{ featureAssets.length }})
      </div>
      <el-row :gutter="16" class="asset-list">
        <el-col :span="8" v-for="feature in featureAssets" :key="feature.id">
          <el-card shadow="hover" class="asset-item" @click="goToFeature(feature.id)">
            <div class="asset-item-header">
              <el-tag type="warning">Feature</el-tag>
              <el-tag v-if="feature.reuseCount > 0" type="info" size="small">
                复用{{ feature.reuseCount }}次
              </el-tag>
            </div>
            <div class="asset-item-body">
              <div class="asset-code">{{ feature.code }}</div>
              <div class="asset-name">{{ feature.name }}</div>
              <div class="asset-meta">
                <span>业务域: {{ feature.domain }}</span>
                <span>版本: {{ feature.version }}</span>
              </div>
            </div>
            <div class="asset-item-footer">
              <el-progress
                :percentage="getFeatureReuseRate(feature)"
                :color="getFeatureReuseColor(feature)"
                :stroke-width="6"
                :show-text="false"
              />
              <el-button type="primary" link size="small">查看详情</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- MR关联Module -->
    <div v-if="requirementType === 'MR' && moduleAssets.length > 0" class="asset-section">
      <div class="section-title">
        <el-icon><Files /></el-icon>
        关联软件模块 ({{ moduleAssets.length }})
      </div>
      <el-row :gutter="16" class="asset-list">
        <el-col :span="8" v-for="module in moduleAssets" :key="module.id">
          <el-card shadow="hover" class="asset-item" @click="goToModule(module.id)">
            <div class="asset-item-header">
              <el-tag type="info">Module</el-tag>
              <el-tag v-if="module.responsibleTeam" type="success" size="small">
                {{ module.responsibleTeam }}
              </el-tag>
            </div>
            <div class="asset-item-body">
              <div class="asset-code">{{ module.code }}</div>
              <div class="asset-name">{{ module.name }}</div>
              <div class="asset-meta">
                <span>类型: {{ module.type }}</span>
                <span v-if="module.platform">平台: {{ module.platform }}</span>
              </div>
            </div>
            <div class="asset-item-footer">
              <el-tag :type="module.status === 'active' ? 'success' : 'info'" size="small">
                {{ module.status === 'active' ? 'Active' : 'Inactive' }}
              </el-tag>
              <el-button type="primary" link size="small">查看详情</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 空状态 -->
    <el-empty
      v-if="productAssets.length === 0 && featureAssets.length === 0 && moduleAssets.length === 0"
      description="暂无关联资产"
      :image-size="100"
    />

    <!-- 追溯链路 -->
    <div v-if="showTraceability" class="traceability-section">
      <el-divider content-position="left">
        <el-icon><Share /></el-icon>
        追溯链路
      </el-divider>
      <div class="traceability-path">
        <el-tag v-if="requirementType === 'UR'" type="primary">UR</el-tag>
        <el-icon><Right /></el-icon>
        <el-tag v-if="requirementType === 'UR' || requirementType === 'FR'" type="warning">FR</el-tag>
        <el-icon v-if="requirementType === 'UR' || requirementType === 'FR'"><Right /></el-icon>
        <el-tag type="info">MR</el-tag>
        <el-icon><Right /></el-icon>
        <el-tag type="success">Task</el-tag>
        <el-icon><Right /></el-icon>
        <el-tag>Commit</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Link, Box, Cpu, Files, Share, Right } from '@element-plus/icons-vue'

interface Props {
  requirementType: 'UR' | 'FR' | 'MR'
  productAssets?: any[]
  featureAssets?: any[]
  moduleAssets?: any[]
  showTraceability?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  productAssets: () => [],
  featureAssets: () => [],
  moduleAssets: () => [],
  showTraceability: true
})

const router = useRouter()

// 获取Feature复用率
const getFeatureReuseRate = (feature: any) => {
  if (!feature.reuseCount) return 0
  return Math.min(100, (feature.reuseCount / 10) * 100)
}

// 获取Feature复用率颜色
const getFeatureReuseColor = (feature: any) => {
  const rate = getFeatureReuseRate(feature)
  if (rate >= 60) return '#67C23A'
  if (rate >= 30) return '#E6A23C'
  return '#F56C6C'
}

// 导航函数
const goToProduct = (id: string) => {
  router.push(`/products/list/${id}`)
}

const goToFeature = (id: string) => {
  router.push(`/assets/features/${id}`)
}

const goToModule = (id: string) => {
  router.push(`/products/modules/${id}`)
}
</script>

<style scoped lang="scss">
.asset-link-card {
  margin-top: 20px;

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

  .asset-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #EBEEF5;
    }

    .asset-list {
      .asset-item {
        cursor: pointer;
        transition: all 0.3s;
        height: 100%;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .asset-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .asset-item-body {
          .asset-code {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }

          .asset-name {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .asset-meta {
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 12px;
            color: #606266;
          }
        }

        .asset-item-footer {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #EBEEF5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }

  .traceability-section {
    margin-top: 24px;

    .traceability-path {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #F5F7FA;
      border-radius: 4px;

      .el-icon {
        color: #909399;
        font-size: 16px;
      }
    }
  }
}
</style>

