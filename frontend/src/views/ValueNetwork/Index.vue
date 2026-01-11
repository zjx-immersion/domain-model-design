<template>
  <div class="value-network page-container">
    <!--页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="三层价值网络">
        <template #extra>
          <el-space>
            <el-segmented v-model="currentLevel" :options="levelOptions" size="large" />
            <el-button :icon="Download" @click="exportNetwork">导出</el-button>
            <el-button :icon="FullScreen" @click="toggleFullscreen">全屏</el-button>
          </el-space>
        </template>
      </el-page-header>
    </div>

    <!-- 网络描述 -->
    <el-alert
      :title="currentNetworkData?.name"
      :description="currentNetworkData?.description"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px"
    />

    <!-- 价值网络可视化 -->
    <el-card class="network-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Connection /></el-icon>
            {{ currentNetworkData?.name }}
          </span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="graph">网络图</el-radio-button>
            <el-radio-button label="matrix">矩阵视图</el-radio-button>
            <el-radio-button label="list">列表视图</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <!-- 网络图视图 -->
      <div v-if="viewMode === 'graph'" class="graph-view">
        <div class="network-graph">
          <div
            v-for="node in currentNetworkData?.nodes"
            :key="node.id"
            class="network-node"
            :class="`node-${node.type}`"
            @click="selectNode(node)"
          >
            <div class="node-icon">
              <el-icon size="32">
                <component :is="getNodeIcon(node.type)" />
              </el-icon>
            </div>
            <div class="node-content">
              <div class="node-name">{{ node.name }}</div>
              <div class="node-description">{{ node.description }}</div>
              <div class="node-metrics">
                <el-tag
                  v-for="(value, key) in node.metrics"
                  :key="key"
                  size="small"
                  style="margin: 2px"
                >
                  {{ formatMetricKey(key) }}: {{ value }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 连接线（简化显示） -->
          <div class="network-edges">
            <el-tag
              v-for="edge in currentNetworkData?.edges"
              :key="edge.id"
              type="info"
              size="small"
              class="edge-tag"
            >
              {{ getNodeName(edge.from) }} → {{ getNodeName(edge.to) }} ({{ edge.label }})
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 矩阵视图 -->
      <div v-else-if="viewMode === 'matrix'" class="matrix-view">
        <el-table :data="currentNetworkData?.nodes" style="width: 100%" border>
          <el-table-column prop="name" label="节点" width="150" fixed />
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getNodeTypeTag(row.type)">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column label="关联节点" min-width="300">
            <template #default="{ row }">
              <el-tag
                v-for="edge in getNodeEdges(row.id)"
                :key="edge.id"
                size="small"
                style="margin: 2px"
              >
                {{ edge.label }} → {{ getNodeName(edge.to) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="度量指标" min-width="250">
            <template #default="{ row }">
              <div class="metrics-cell">
                <div v-for="(value, key) in row.metrics" :key="key" class="metric-item">
                  <span class="metric-key">{{ formatMetricKey(key) }}:</span>
                  <span class="metric-value">{{ value }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="selectNode(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 列表视图 -->
      <div v-else class="list-view">
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="node in currentNetworkData?.nodes"
            :key="node.id"
            style="margin-bottom: 20px"
          >
            <el-card shadow="hover" class="node-card" @click="selectNode(node)">
              <template #header>
                <div class="node-card-header">
                  <el-icon size="24">
                    <component :is="getNodeIcon(node.type)" />
                  </el-icon>
                  <span>{{ node.name }}</span>
                </div>
              </template>

              <div class="node-card-body">
                <div class="node-card-description">{{ node.description }}</div>
                <el-divider />
                <div class="node-card-metrics">
                  <div v-for="(value, key) in node.metrics" :key="key" class="metric-row">
                    <span class="metric-label">{{ formatMetricKey(key) }}</span>
                    <el-tag size="small">{{ value }}</el-tag>
                  </div>
                </div>
                <el-divider />
                <div class="node-card-entities">
                  <div class="entities-title">示例实体:</div>
                  <el-tag
                    v-for="(entity, index) in node.entities.slice(0, 3)"
                    :key="index"
                    size="small"
                    style="margin: 2px"
                  >
                    {{ entity }}
                  </el-tag>
                  <span v-if="node.entities.length > 3">...</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 价值流图 -->
    <el-card class="flow-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><TrendCharts /></el-icon>
            价值流向
          </span>
        </div>
      </template>

      <div class="value-flow">
        <div
          v-for="(edge, index) in currentNetworkData?.edges"
          :key="edge.id"
          class="flow-step"
        >
          <div class="flow-item">
            <div class="flow-node">
              <el-tag :type="getFlowNodeType(index)">
                {{ getNodeName(edge.from) }}
              </el-tag>
            </div>
            <div class="flow-arrow">
              <el-icon><Right /></el-icon>
              <span class="flow-label">{{ edge.label }}</span>
            </div>
            <div class="flow-node">
              <el-tag :type="getFlowNodeType(index + 1)">
                {{ getNodeName(edge.to) }}
              </el-tag>
            </div>
          </div>
          <div class="flow-description">{{ edge.description }}</div>
        </div>
      </div>
    </el-card>

    <!-- 节点详情抽屉 -->
    <el-drawer v-model="drawerVisible" :title="selectedNode?.name" size="40%">
      <div v-if="selectedNode" class="node-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="节点ID">{{ selectedNode.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            <el-tag :type="getNodeTypeTag(selectedNode.type)">
              {{ selectedNode.type }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            {{ selectedNode.description }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">度量指标</el-divider>
        <el-row :gutter="20">
          <el-col :span="12" v-for="(value, key) in selectedNode.metrics" :key="key">
            <el-card class="metric-card">
              <el-statistic :title="formatMetricKey(key)" :value="value" />
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">实体列表</el-divider>
        <el-tag
          v-for="(entity, index) in selectedNode.entities"
          :key="index"
          style="margin: 4px"
        >
          {{ entity }}
        </el-tag>

        <el-divider content-position="left">关联关系</el-divider>
        <div class="node-relations">
          <div class="relation-section">
            <div class="relation-title">出边:</div>
            <div
              v-for="edge in getNodeOutEdges(selectedNode.id)"
              :key="edge.id"
              class="relation-item"
            >
              <el-tag type="success" size="small">{{ edge.label }}</el-tag>
              <span>→ {{ getNodeName(edge.to) }}</span>
            </div>
          </div>
          <div class="relation-section">
            <div class="relation-title">入边:</div>
            <div
              v-for="edge in getNodeInEdges(selectedNode.id)"
              :key="edge.id"
              class="relation-item"
            >
              <el-tag type="warning" size="small">{{ edge.label }}</el-tag>
              <span>← {{ getNodeName(edge.from) }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Download,
  FullScreen,
  Connection,
  TrendCharts,
  Right,
  Box,
  Folder,
  Document,
  Files,
  List,
  Cpu,
  User,
  Calendar,
  Monitor,
  Link as LinkIcon
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const currentLevel = ref('L1')
const viewMode = ref<'graph' | 'matrix' | 'list'>('list')
const drawerVisible = ref(false)
const selectedNode = ref<any>(null)

// 层级选项
const levelOptions = [
  { label: 'L1 战略级', value: 'L1' },
  { label: 'L2 执行级', value: 'L2' },
  { label: 'L3 操作级', value: 'L3' }
]

// 价值网络数据
const valueNetworks = ref<any>(null)

// 当前网络数据
const currentNetworkData = computed(() => {
  if (!valueNetworks.value) return null
  const levelMap: Record<string, string> = {
    L1: 'L1_strategic',
    L2: 'L2_execution',
    L3: 'L3_operational'
  }
  return valueNetworks.value[levelMap[currentLevel.value]]
})

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/value-network/value-networks.json')
    const result = await response.json()
    valueNetworks.value = result.data
  } catch (error) {
    ElMessage.error('加载价值网络数据失败')
  } finally {
    loading.value = false
  }
})

// 获取节点图标
const getNodeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    product: Box,
    project: Folder,
    business: TrendCharts,
    customer: User,
    requirement: Document,
    asset: Files,
    backlog: List,
    sprint: Calendar,
    task: List,
    commit: Cpu,
    artifact: Monitor
  }
  return iconMap[type] || Document
}

// 获取节点类型标签
const getNodeTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    product: 'success',
    project: 'primary',
    business: 'warning',
    customer: 'info',
    requirement: 'primary',
    asset: 'success',
    backlog: 'warning',
    sprint: 'info',
    task: 'success',
    commit: '',
    artifact: 'warning'
  }
  return tagMap[type] || 'info'
}

// 格式化度量指标键
const formatMetricKey = (key: string) => {
  const keyMap: Record<string, string> = {
    productCount: '产品数',
    totalFeatures: 'Feature总数',
    avgReuseRate: '平均复用率',
    projectCount: '项目数',
    activeProjects: '活跃项目',
    avgProgress: '平均进度',
    strategicGoals: '战略目标数',
    achievementRate: '达成率',
    customerRequirements: '客户需求数',
    satisfactionRate: '满意度',
    totalUR: 'UR总数',
    activeUR: '活跃UR',
    decomposedUR: '已分解UR',
    totalFR: 'FR总数',
    activeFR: '活跃FR',
    linkedFeatures: '关联Feature',
    totalMR: 'MR总数',
    activeMR: '活跃MR',
    linkedModules: '关联Module',
    activeFeatures: '活跃Feature',
    totalModules: 'Module总数',
    activeModules: '活跃Module',
    avgComplexity: '平均复杂度',
    projectBacklogs: '项目Backlog数',
    teamBacklogs: '团队Backlog数',
    totalWorkItems: '总工作项',
    totalSprints: 'Sprint总数',
    activeSprints: '活跃Sprint',
    avgVelocity: '平均速度',
    totalTasks: '任务总数',
    activeTasks: '活跃任务',
    completedTasks: '已完成任务',
    totalCommits: 'Commit总数',
    avgCoverage: '平均覆盖率',
    buildSuccessRate: '构建成功率',
    totalArtifacts: '制品总数',
    deployedArtifacts: '已部署制品',
    promotionRate: '晋级率'
  }
  return keyMap[key] || key
}

// 获取节点名称
const getNodeName = (nodeId: string) => {
  const node = currentNetworkData.value?.nodes.find((n: any) => n.id === nodeId)
  return node?.name || nodeId
}

// 获取节点边
const getNodeEdges = (nodeId: string) => {
  return currentNetworkData.value?.edges.filter((e: any) => e.from === nodeId) || []
}

// 获取节点出边
const getNodeOutEdges = (nodeId: string) => {
  return currentNetworkData.value?.edges.filter((e: any) => e.from === nodeId) || []
}

// 获取节点入边
const getNodeInEdges = (nodeId: string) => {
  return currentNetworkData.value?.edges.filter((e: any) => e.to === nodeId) || []
}

// 获取流程节点类型
const getFlowNodeType = (index: number) => {
  const types = ['primary', 'success', 'warning', 'info', 'danger']
  return types[index % types.length]
}

// 选择节点
const selectNode = (node: any) => {
  selectedNode.value = node
  drawerVisible.value = true
}

// 导出网络
const exportNetwork = () => {
  ElMessage.info('导出功能开发中...')
}

// 全屏切换
const toggleFullscreen = () => {
  ElMessage.info('全屏功能开发中...')
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.value-network {
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

  .network-card {
    margin-bottom: 20px;
    min-height: 500px;

    .graph-view {
      .network-graph {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;

        .network-node {
          padding: 20px;
          border: 2px solid #E4E7ED;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          background: white;

          &:hover {
            border-color: #409EFF;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
            transform: translateY(-4px);
          }

          &.node-product {
            border-color: #67C23A;
          }

          &.node-project {
            border-color: #409EFF;
          }

          &.node-business {
            border-color: #E6A23C;
          }

          .node-icon {
            text-align: center;
            color: #409EFF;
            margin-bottom: 12px;
          }

          .node-content {
            .node-name {
              font-size: 16px;
              font-weight: 500;
              margin-bottom: 8px;
              text-align: center;
            }

            .node-description {
              font-size: 12px;
              color: #606266;
              margin-bottom: 12px;
              text-align: center;
            }

            .node-metrics {
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
              justify-content: center;
            }
          }
        }

        .network-edges {
          grid-column: 1 / -1;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 20px;
          background: #F5F7FA;
          border-radius: 4px;
          margin-top: 20px;

          .edge-tag {
            font-size: 12px;
          }
        }
      }
    }

    .matrix-view {
      padding: 20px;

      .metrics-cell {
        .metric-item {
          margin: 4px 0;
          font-size: 12px;

          .metric-key {
            color: #909399;
            margin-right: 8px;
          }

          .metric-value {
            font-weight: 500;
          }
        }
      }
    }

    .list-view {
      padding: 20px;

      .node-card {
        cursor: pointer;
        height: 100%;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .node-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 500;
        }

        .node-card-body {
          .node-card-description {
            color: #606266;
            line-height: 1.6;
            margin-bottom: 16px;
          }

          .node-card-metrics {
            .metric-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin: 8px 0;

              .metric-label {
                font-size: 13px;
                color: #606266;
              }
            }
          }

          .node-card-entities {
            .entities-title {
              font-size: 13px;
              color: #909399;
              margin-bottom: 8px;
            }
          }
        }
      }
    }
  }

  .flow-card {
    margin-bottom: 20px;

    .value-flow {
      padding: 20px;

      .flow-step {
        margin: 20px 0;

        .flow-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: #F5F7FA;
          border-radius: 8px;

          .flow-node {
            padding: 8px 16px;
            background: white;
            border-radius: 4px;
          }

          .flow-arrow {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #409EFF;

            .flow-label {
              font-size: 12px;
              color: #606266;
            }
          }
        }

        .flow-description {
          margin-top: 8px;
          padding-left: 16px;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }

  .node-detail {
    .metric-card {
      margin-bottom: 16px;
    }

    .node-relations {
      .relation-section {
        margin: 16px 0;

        .relation-title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .relation-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 8px 0;
          padding: 8px;
          background: #F5F7FA;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>

