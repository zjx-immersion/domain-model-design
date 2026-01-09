<template>
  <div class="product-overview page-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>📦 产品资产全景</h2>
        <p class="page-description">一页查看产品线、产品、版本、特性、模块及其在项目中的状态</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus">创建产品</el-button>
        <el-button :icon="Download" @click="exportReport">导出报告</el-button>
        <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-bar">
      <el-input
        v-model="searchText"
        placeholder="搜索产品线/产品/版本..."
        :prefix-icon="Search"
        clearable
        style="width: 300px"
        @input="handleSearch"
      />
      <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 150px" @change="applyFilter">
        <el-option label="全部" value="" />
        <el-option label="活跃" value="active" />
        <el-option label="进行中" value="in_progress" />
        <el-option label="已发布" value="released" />
        <el-option label="计划中" value="planned" />
      </el-select>
      <el-select v-model="filterProductLine" placeholder="产品线" clearable style="width: 200px" @change="applyFilter">
        <el-option label="全部产品线" value="" />
        <el-option v-for="line in productLinesData" :key="line.id" :label="line.name" :value="line.id" />
      </el-select>
    </div>

    <!-- 区域1：产品线卡片区 -->
    <section class="section product-lines-section">
      <div class="section-title">
        <h3>产品线概览</h3>
      </div>
      <div class="product-lines-cards">
        <el-card
          v-for="line in filteredProductLines"
          :key="line.id"
          class="product-line-card"
          shadow="hover"
          :class="{ selected: selectedProductLineId === line.id }"
          @click="selectProductLine(line)"
        >
          <div class="card-icon">
            {{ getProductLineIcon(line.code) }}
          </div>
          <h4>{{ line.name }}</h4>
          <div class="card-stats">
            <div class="stat-item">
              <span class="label">产品:</span>
              <span class="value">{{ line.products?.length || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">版本:</span>
              <span class="value">{{ line.versions?.length || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="label">特性:</span>
              <span class="value">{{ line.metrics?.totalFeatures || 0 }}</span>
            </div>
          </div>
          <div class="health-indicator">
            <span>健康度:</span>
            <el-progress
              :percentage="calculateHealth(line)"
              :color="getHealthColor(calculateHealth(line))"
              :stroke-width="8"
            />
          </div>
          <div class="health-score">{{ calculateHealth(line) }}分</div>
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
                  placeholder="搜索..."
                  :prefix-icon="Search"
                  clearable
                  size="small"
                  style="width: 180px"
                />
              </div>
            </template>
            <el-tree
              :data="productTreeData"
              :props="treeProps"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="treeRef"
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
                <el-button-group v-if="selectedNode">
                  <el-button type="primary" size="small" :icon="View">查看详情</el-button>
                  <el-button size="small" :icon="Edit">编辑</el-button>
                </el-button-group>
              </div>
            </template>
            <div v-if="!selectedNode" class="empty-state">
              <el-empty description="请从左侧选择要查看的产品、版本或特性" />
            </div>
            <div v-else class="detail-content">
              <!-- 产品线详情 -->
              <div v-if="selectedNode.type === 'line'" class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="产品线名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="代码">{{ selectedNode.data.code }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="负责人">{{ selectedNode.data.owner }}</el-descriptions-item>
                  <el-descriptions-item label="产品数量" :span="2">{{ selectedNode.data.products?.length || 0 }}</el-descriptions-item>
                </el-descriptions>
                <div class="detail-subsection">
                  <h4>产品描述</h4>
                  <p>{{ selectedNode.data.description }}</p>
                </div>
                <div class="detail-subsection">
                  <h4>关键指标</h4>
                  <el-row :gutter="16">
                    <el-col :span="6">
                      <el-statistic title="特性总数" :value="selectedNode.data.metrics?.totalFeatures || 0" />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic title="活跃特性" :value="selectedNode.data.metrics?.activeFeatures || 0" />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic title="复用率" :value="(selectedNode.data.metrics?.reuseRate || 0) * 100" suffix="%" />
                    </el-col>
                    <el-col :span="6">
                      <el-statistic title="模块数" :value="selectedNode.data.modules || 0" />
                    </el-col>
                  </el-row>
                </div>
              </div>

              <!-- 版本详情 -->
              <div v-else-if="selectedNode.type === 'version'" class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="版本号">{{ selectedNode.data.code }}</el-descriptions-item>
                  <el-descriptions-item label="版本名称">{{ selectedNode.data.name }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="负责人">{{ selectedNode.data.ownerName }}</el-descriptions-item>
                  <el-descriptions-item label="计划发布日期">{{ selectedNode.data.plannedReleaseDate }}</el-descriptions-item>
                  <el-descriptions-item label="进度">
                    <el-progress :percentage="Math.round((selectedNode.data.progress || 0) * 100)" />
                  </el-descriptions-item>
                </el-descriptions>

                <div class="detail-subsection">
                  <h4>版本特性 ({{ selectedNode.data.features?.length || 0 }})</h4>
                  <el-table :data="selectedNode.data.features" size="small" stripe>
                    <el-table-column prop="featureName" label="特性名称" />
                    <el-table-column prop="featureCode" label="代码" width="100" />
                    <el-table-column label="状态" width="100">
                      <template #default="{ row }">
                        <el-tag :type="getFeatureStatusType(row.status)" size="small">
                          {{ getFeatureStatusText(row.status) }}
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="进度" width="120">
                      <template #default="{ row }">
                        <el-progress :percentage="Math.round((row.progress || 0) * 100)" :stroke-width="6" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>

                <div class="detail-subsection">
                  <h4>质量指标</h4>
                  <el-row :gutter="16">
                    <el-col :span="8">
                      <el-statistic title="需求完成" :value="`${selectedNode.data.completedRequirements}/${selectedNode.data.totalRequirements}`" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="测试覆盖率" :value="Math.round((selectedNode.data.testCoverage || 0) * 100)" suffix="%" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="缺陷数" :value="selectedNode.data.defectCount || 0" />
                    </el-col>
                  </el-row>
                </div>
              </div>

              <!-- 其他类型详情 -->
              <div v-else class="detail-section">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="名称">{{ selectedNode.label }}</el-descriptions-item>
                  <el-descriptions-item label="类型">{{ getTypeLabel(selectedNode.type) }}</el-descriptions-item>
                  <el-descriptions-item v-if="selectedNode.data.status" label="状态">
                    <el-tag :type="getStatusType(selectedNode.data.status)">
                      {{ getStatusText(selectedNode.data.status) }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item v-if="selectedNode.data.owner" label="负责人">{{ selectedNode.data.owner }}</el-descriptions-item>
                </el-descriptions>
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
        <el-table :data="matrixData" stripe border style="width: 100%">
          <el-table-column prop="productName" label="产品" width="180" fixed />
          <el-table-column
            v-for="project in projectsInMatrix"
            :key="project.id"
            :label="project.name"
            width="150"
            align="center"
          >
            <template #default="{ row }">
              <div v-if="row[project.id]" class="matrix-cell" :class="`status-${row[project.id].status}`">
                <el-tooltip :content="getMatrixTooltip(row[project.id])" placement="top">
                  <div>
                    <div class="version">{{ row[project.id].version }}</div>
                    <el-progress
                      :percentage="row[project.id].progress"
                      :stroke-width="4"
                      :show-text="false"
                      :color="getProgressColor(row[project.id].status)"
                    />
                    <div class="status-text">{{ getMatrixStatusText(row[project.id].status) }}</div>
                  </div>
                </el-tooltip>
              </div>
              <div v-else class="matrix-cell empty">-</div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </section>

    <!-- 区域4：资产健康度仪表盘 -->
    <section class="section dashboard-section">
      <div class="section-title">
        <h3>资产健康度仪表盘</h3>
      </div>
      <el-row :gutter="20" class="metrics-row">
        <el-col :span="6" v-for="metric in metrics" :key="metric.label">
          <el-card class="metric-card" shadow="hover">
            <el-statistic :title="metric.label" :value="metric.value">
              <template #prefix>
                <el-icon :style="{ color: metric.color, fontSize: '24px' }">
                  <component :is="metric.icon" />
                </el-icon>
              </template>
              <template #suffix v-if="metric.suffix">{{ metric.suffix }}</template>
            </el-statistic>
            <div v-if="metric.trend" class="trend">
              <el-icon :color="metric.trend > 0 ? '#67c23a' : '#f56c6c'">
                <component :is="metric.trend > 0 ? TopRight : BottomRight" />
              </el-icon>
              <span>{{ Math.abs(metric.trend) }}%</span>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="charts-row">
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>版本状态分布</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="饼图展示位置" :image-size="100" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <span>资产复用情况 (Top 10)</span>
            </template>
            <div class="chart-placeholder">
              <el-empty description="条形图展示位置" :image-size="100" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Download, Refresh, Search, Box, Document, Star, Grid, View, Edit, TopRight, BottomRight } from '@element-plus/icons-vue'

// 导入数据
import productLinesDataRaw from '@/biz-data/mock/asset/product-lines.json'
import releasesDataRaw from '@/biz-data/mock/release/releases.json'
import domainProjectsDataRaw from '@/biz-data/mock/project/domain-projects.json'

// 解析数据
const productLinesData = ref((productLinesDataRaw as any).data || [])
const releasesData = ref((releasesDataRaw as any).data || [])
const domainProjectsData = ref((domainProjectsDataRaw as any).data || [])

// 筛选和搜索
const searchText = ref('')
const treeSearchText = ref('')
const filterStatus = ref('')
const filterProductLine = ref('')
const selectedProductLineId = ref('')
const selectedNode = ref<any>(null)
const treeRef = ref<any>(null)

// 树配置
const treeProps = {
  children: 'children',
  label: 'label',
}

// 计算过滤后的产品线
const filteredProductLines = computed(() => {
  let filtered = productLinesData.value

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter((line: any) =>
      line.name.toLowerCase().includes(search) ||
      line.code.toLowerCase().includes(search)
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter((line: any) => line.status === filterStatus.value)
  }

  if (filterProductLine.value) {
    filtered = filtered.filter((line: any) => line.id === filterProductLine.value)
  }

  return filtered
})

// 构建产品树数据
const productTreeData = computed(() => {
  return filteredProductLines.value.map((line: any) => {
    // 获取该产品线的所有版本
    const lineReleases = releasesData.value.filter((rel: any) =>
      line.products && line.products.includes(rel.productId)
    )

    // 按产品分组版本
    const productGroups: any = {}
    lineReleases.forEach((rel: any) => {
      if (!productGroups[rel.productId]) {
        productGroups[rel.productId] = {
          id: rel.productId,
          label: rel.productName,
          type: 'product',
          data: {
            productId: rel.productId,
            productName: rel.productName,
          },
          children: []
        }
      }
      productGroups[rel.productId].children.push({
        id: rel.id,
        label: `${rel.code} - ${rel.name}`,
        type: 'version',
        status: rel.status,
        data: rel
      })
    })

    return {
      id: line.id,
      label: line.name,
      type: 'line',
      status: line.status,
      data: line,
      children: Object.values(productGroups)
    }
  })
})

// 构建产品-项目矩阵数据
const projectsInMatrix = computed(() => {
  return domainProjectsData.value.slice(0, 5).map((p: any) => ({
    id: p.id,
    name: p.name
  }))
})

const matrixData = computed(() => {
  // 获取所有产品
  const products = new Map<string, any>()
  releasesData.value.forEach((rel: any) => {
    if (!products.has(rel.productId)) {
      products.set(rel.productId, {
        productId: rel.productId,
        productName: rel.productName
      })
    }
  })

  // 为每个产品构建在各项目中的状态
  return Array.from(products.values()).map(product => {
    const row: any = {
      productId: product.productId,
      productName: product.productName
    }

    // 遍历项目，查找该产品的应用情况
    domainProjectsData.value.forEach((project: any) => {
      const projectVersion = project.projectVersions?.find(
        (pv: any) => pv.productId === product.productId || pv.productName === product.productName
      )

      if (projectVersion) {
        row[project.id] = {
          version: projectVersion.version,
          status: projectVersion.status,
          progress: getProgressValue(projectVersion.status),
          features: projectVersion.features?.length || 0
        }
      }
    })

    return row
  }).slice(0, 10) // 只显示前10个产品
})

// 指标数据
const metrics = computed(() => {
  const totalProducts = new Set(releasesData.value.map((r: any) => r.productId)).size
  const totalVersions = releasesData.value.length
  const totalFeatures = productLinesData.value.reduce((sum: number, line: any) =>
    sum + (line.metrics?.totalFeatures || 0), 0
  )
  const avgReuseRate = productLinesData.value.reduce((sum: number, line: any) =>
    sum + (line.metrics?.reuseRate || 0), 0
  ) / (productLinesData.value.length || 1)

  return [
    {
      label: '产品数量',
      value: totalProducts,
      icon: Box,
      color: '#409EFF',
      trend: 5
    },
    {
      label: '版本数量',
      value: totalVersions,
      icon: Document,
      color: '#67C23A',
      trend: 8
    },
    {
      label: '特性数量',
      value: totalFeatures,
      icon: Star,
      color: '#E6A23C',
      trend: -2
    },
    {
      label: '资产复用率',
      value: Math.round(avgReuseRate * 100),
      icon: Grid,
      color: '#F56C6C',
      suffix: '%',
      trend: 3
    }
  ]
})

// 方法实现
const getProductLineIcon = (code: string) => {
  const iconMap: Record<string, string> = {
    'ADS-Platform': '🚗',
    'ICS-Platform': '📱',
    'IoV-Platform': '🌐'
  }
  return iconMap[code] || '📦'
}

const calculateHealth = (line: any) => {
  if (!line.metrics) return 60
  const { reuseRate = 0.6, totalFeatures = 20, activeFeatures = 15 } = line.metrics
  const activeRate = totalFeatures > 0 ? activeFeatures / totalFeatures : 0.75
  return Math.round((reuseRate * 0.4 + activeRate * 0.6) * 100)
}

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
    released: 'success',
    testing: 'warning',
    planned: 'info',
  }
  return typeMap[status] || ''
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    active: '活跃',
    in_progress: '开发中',
    released: '已发布',
    testing: '测试中',
    planned: '计划中',
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

const getFeatureStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    new: 'success',
    updated: 'warning',
    unchanged: 'info',
    deprecated: 'danger'
  }
  return typeMap[status] || ''
}

const getFeatureStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    new: '新增',
    updated: '更新',
    unchanged: '不变',
    deprecated: '废弃'
  }
  return textMap[status] || status
}

const getProgressValue = (status: string) => {
  const valueMap: Record<string, number> = {
    'in-progress': 60,
    'testing': 80,
    'completed': 100,
    'planned': 0
  }
  return valueMap[status] || 50
}

const getProgressColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'in-progress': '#409eff',
    'testing': '#e6a23c',
    'completed': '#67c23a',
    'planned': '#909399'
  }
  return colorMap[status] || '#909399'
}

const getMatrixStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'in-progress': '开发中',
    'testing': '测试中',
    'completed': '已完成',
    'planned': '计划中'
  }
  return textMap[status] || status
}

const getMatrixTooltip = (cell: any) => {
  return `版本: ${cell.version}\n状态: ${getMatrixStatusText(cell.status)}\n进度: ${cell.progress}%\n特性数: ${cell.features}`
}

const selectProductLine = (line: any) => {
  selectedProductLineId.value = line.id
  filterProductLine.value = line.id
  applyFilter()
  ElMessage.success(`已选中产品线: ${line.name}`)
}

const handleNodeClick = (data: any) => {
  selectedNode.value = data
}

const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase())
}

const handleSearch = () => {
  // 搜索逻辑已在 computed 中实现
}

const applyFilter = () => {
  // 筛选逻辑已在 computed 中实现
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
  // 实际项目中这里会重新请求数据
}

const exportReport = () => {
  ElMessage.success('报告导出功能开发中...')
  // 实际项目中这里会导出Excel或PDF
}

// 监听树搜索文本变化
watch(treeSearchText, (val) => {
  treeRef.value?.filter(val)
})
</script>

<style scoped lang="scss">
.product-overview {
  .page-header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    .header-left {
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
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }

  .filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
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

      &.selected {
        border-color: #409eff;
        box-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
        margin-bottom: 8px;

        span {
          font-size: 12px;
          color: #909399;
          margin-right: 8px;
        }
      }

      .health-score {
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        color: #409eff;
      }
    }
  }

  .tree-detail-section {
    .tree-card,
    .detail-card {
      height: 600px;

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
        margin-bottom: 20px;
      }

      .detail-subsection {
        margin-top: 20px;

        h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }

        p {
          margin: 0;
          color: #606266;
          line-height: 1.6;
        }
      }
    }
  }

  .matrix-section {
    .matrix-cell {
      padding: 8px 4px;

      &.empty {
        color: #c0c4cc;
      }

      &.status-in-progress {
        background: #ecf5ff;
      }

      &.status-testing {
        background: #fdf6ec;
      }

      &.status-completed {
        background: #f0f9ff;
      }

      &.status-planned {
        background: #f4f4f5;
      }

      .version {
        font-weight: 600;
        font-size: 12px;
        margin-bottom: 4px;
      }

      .status-text {
        font-size: 11px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }

  .metrics-row {
    margin-bottom: 20px;

    .metric-card {
      :deep(.el-statistic) {
        .el-statistic__head {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .el-statistic__content {
          font-size: 28px;
          font-weight: 600;
        }
      }

      .trend {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 8px;
        font-size: 12px;
      }
    }
  }

  .charts-row {
    .chart-card {
      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
      }
    }
  }
}
</style>
