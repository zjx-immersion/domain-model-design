<template>
  <div class="product-overview page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>📦 产品资产全景</h2>
      <p class="page-description">一页查看产品线、产品、版本、特性、模块及其在项目中的状态</p>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">创建产品</el-button>
        <el-button :icon="Download">导出报告</el-button>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 区域1：产品线卡片区 -->
    <section class="section product-lines-section">
      <div class="section-title">
        <h3>产品线概览</h3>
      </div>
      <div class="product-lines-cards">
        <el-card
          v-for="line in productLines"
          :key="line.id"
          class="product-line-card"
          shadow="hover"
          @click="selectProductLine(line)"
        >
          <div class="card-icon">🚗</div>
          <h4>{{ line.name }}</h4>
          <div class="card-stats">
            <div class="stat-item">
              <span class="label">产品:</span>
              <span class="value">{{ line.productCount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">版本:</span>
              <span class="value">{{ line.versionCount }}</span>
            </div>
            <div class="stat-item">
              <span class="label">特性:</span>
              <span class="value">{{ line.featureCount }}</span>
            </div>
          </div>
          <div class="health-indicator">
            <span>健康度:</span>
            <el-progress
              :percentage="line.health"
              :color="getHealthColor(line.health)"
              :stroke-width="8"
            />
          </div>
        </el-card>
      </div>
    </section>

    <!-- 区域2：产品树视图 + 详情面板 -->
    <section class="section tree-detail-section">
      <div class="section-title">
        <h3>产品资产结构</h3>
      </div>
      <el-row :gutter="20">
        <!-- 左侧：产品树 (40%) -->
        <el-col :span="10">
          <el-card class="tree-card">
            <template #header>
              <div class="card-header">
                <span>产品树</span>
                <el-input
                  v-model="treeSearchText"
                  placeholder="搜索产品/版本/特性..."
                  :prefix-icon="Search"
                  clearable
                  size="small"
                  style="width: 200px"
                />
              </div>
            </template>
            <el-tree
              :data="productTreeData"
              :props="treeProps"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="tree-node">
                  <el-icon>
                    <component :is="getNodeIcon(data.type)" />
                  </el-icon>
                  <span>{{ node.label }}</span>
                  <el-tag v-if="data.status" :type="getStatusType(data.status)" size="small">
                    {{ getStatusText(data.status) }}
                  </el-tag>
                </span>
              </template>
            </el-tree>
          </el-card>
        </el-col>

        <!-- 右侧：详情面板 (60%) -->
        <el-col :span="14">
          <el-card class="detail-card">
            <template #header>
              <div class="card-header">
                <span>{{ selectedNode?.label || '请选择产品、版本或特性' }}</span>
                <el-button v-if="selectedNode" type="primary" size="small">编辑</el-button>
              </div>
            </template>
            <div v-if="!selectedNode" class="empty-state">
              <el-empty description="请从左侧选择要查看的产品、版本或特性" />
            </div>
            <div v-else class="detail-content">
              <el-descriptions :column="2" border>
                <el-descriptions-item label="名称">{{ selectedNode.label }}</el-descriptions-item>
                <el-descriptions-item label="类型">{{ getTypeLabel(selectedNode.type) }}</el-descriptions-item>
                <el-descriptions-item label="状态">
                  <el-tag :type="getStatusType(selectedNode.status)">
                    {{ getStatusText(selectedNode.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="负责人">{{ selectedNode.owner || '-' }}</el-descriptions-item>
              </el-descriptions>

              <div class="detail-section">
                <h4>关联信息</h4>
                <p class="placeholder-text">这里将显示关联的项目、需求、工作项等信息...</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 区域3：产品-项目状态矩阵 -->
    <section class="section matrix-section">
      <div class="section-title">
        <h3>产品-项目状态矩阵</h3>
        <p class="subtitle">快速查看产品在不同项目中的应用情况</p>
      </div>
      <el-card>
        <div class="matrix-placeholder">
          <el-empty description="产品-项目状态矩阵将在这里显示" />
          <p class="hint">矩阵将展示产品版本在各项目中的状态、进度和风险</p>
        </div>
      </el-card>
    </section>

    <!-- 区域4：资产健康度仪表盘 -->
    <section class="section dashboard-section">
      <div class="section-title">
        <h3>资产健康度仪表盘</h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in metrics" :key="metric.label">
          <el-card class="metric-card">
            <el-statistic :title="metric.label" :value="metric.value">
              <template #prefix>
                <el-icon :style="{ color: metric.color }">
                  <component :is="metric.icon" />
                </el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Download, Refresh, Search, Box, Document, Star, Grid } from '@element-plus/icons-vue'

// 产品线数据
const productLines = ref([
  {
    id: 'line-1',
    name: '智能驾驶',
    productCount: 3,
    versionCount: 12,
    featureCount: 45,
    health: 80,
  },
  {
    id: 'line-2',
    name: '智能座舱',
    productCount: 2,
    versionCount: 8,
    featureCount: 32,
    health: 75,
  },
  {
    id: 'line-3',
    name: '电子电器',
    productCount: 4,
    versionCount: 16,
    featureCount: 58,
    health: 85,
  },
])

// 产品树数据
const productTreeData = ref([
  {
    id: '1',
    label: '智能驾驶',
    type: 'line',
    children: [
      {
        id: '1-1',
        label: '智能驾驶OS',
        type: 'product',
        status: 'active',
        children: [
          {
            id: '1-1-1',
            label: 'v3.0.0',
            type: 'version',
            status: 'in_progress',
          },
          {
            id: '1-1-2',
            label: 'v2.5.0',
            type: 'version',
            status: 'released',
          },
        ],
      },
    ],
  },
])

const treeSearchText = ref('')
const selectedNode = ref<any>(null)

const treeProps = {
  children: 'children',
  label: 'label',
}

// 指标数据
const metrics = ref([
  { label: '产品数量', value: 11, icon: Box, color: '#409EFF' },
  { label: '版本数量', value: 45, icon: Document, color: '#67C23A' },
  { label: '特性数量', value: 87, icon: Star, color: '#E6A23C' },
  { label: '资产复用率', value: 78, icon: Grid, color: '#F56C6C' },
])

// 方法
const getHealthColor = (health: number) => {
  if (health >= 80) return '#67c23a'
  if (health >= 60) return '#e6a23c'
  return '#f56c6c'
}

const getNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    line: Box,
    product: Box,
    version: Document,
    feature: Star,
  }
  return iconMap[type] || Box
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    active: 'success',
    in_progress: '',
    released: 'info',
    planned: 'info',
  }
  return typeMap[status] || ''
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '活跃',
    in_progress: '开发中',
    released: '已发布',
    planned: '规划中',
  }
  return textMap[status] || status
}

const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    line: '产品线',
    product: '产品',
    version: '版本',
    feature: '特性',
  }
  return labelMap[type] || type
}

const selectProductLine = (line: any) => {
  console.log('选中产品线:', line)
}

const handleNodeClick = (data: any) => {
  selectedNode.value = data
  console.log('选中节点:', data)
}

const refreshData = () => {
  console.log('刷新数据')
}
</script>

<style scoped lang="scss">
.product-overview {
  .page-header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    h2 {
      margin: 0 0 8px 0;
      font-size: 24px;
      font-weight: 600;
    }

    .page-description {
      margin: 0;
      color: #909399;
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .section {
    margin-bottom: 24px;

    .section-title {
      margin-bottom: 16px;

      h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        font-weight: 600;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .product-lines-cards {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 8px;

    .product-line-card {
      min-width: 240px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      .card-icon {
        font-size: 32px;
        text-align: center;
        margin-bottom: 12px;
      }

      h4 {
        margin: 0 0 12px 0;
        font-size: 16px;
        text-align: center;
      }

      .card-stats {
        display: flex;
        justify-content: space-around;
        margin-bottom: 12px;

        .stat-item {
          text-align: center;

          .label {
            display: block;
            font-size: 12px;
            color: #909399;
          }

          .value {
            display: block;
            font-size: 20px;
            font-weight: 600;
            color: #303133;
          }
        }
      }

      .health-indicator {
        span {
          font-size: 12px;
          color: #909399;
          margin-right: 8px;
        }
      }
    }
  }

  .tree-detail-section {
    .tree-card,
    .detail-card {
      height: 500px;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      :deep(.el-card__body) {
        height: calc(100% - 60px);
        overflow-y: auto;
      }
    }

    .tree-node {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .detail-content {
      .detail-section {
        margin-top: 24px;

        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .placeholder-text {
          color: #909399;
          font-size: 14px;
        }
      }
    }
  }

  .matrix-section {
    .matrix-placeholder {
      padding: 40px;
      text-align: center;

      .hint {
        margin-top: 12px;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .metric-card {
    :deep(.el-statistic) {
      .el-statistic__head {
        font-size: 14px;
        color: #909399;
      }

      .el-statistic__content {
        font-size: 28px;
        font-weight: 600;
      }
    }
  }
}
</style>

