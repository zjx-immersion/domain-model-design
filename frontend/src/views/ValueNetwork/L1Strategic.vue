<template>
  <div class="value-network-l1-page">
    <el-card class="header-card">
      <div class="page-header">
        <div class="title-section">
          <h2>L1战略级价值网络</h2>
          <p class="subtitle">端到端研发价值流全景视图</p>
        </div>
        <div class="action-section">
          <el-button type="primary" :icon="Download" @click="handleExport">导出</el-button>
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="项目">
          <el-select v-model="filterForm.projectId" placeholder="选择项目" style="width: 200px">
            <el-option label="NOA v3.1" value="noa-v31" />
            <el-option label="AVP" value="avp" />
          </el-select>
        </el-form-item>
        <el-form-item label="显示模式">
          <el-radio-group v-model="filterForm.displayMode">
            <el-radio-button label="flow">流程图</el-radio-button>
            <el-radio-button label="timeline">时间线</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="filterForm.showCriticalPath">显示关键路径</el-checkbox>
          <el-checkbox v-model="filterForm.showBottlenecks">显示瓶颈</el-checkbox>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="network-card">
      <template #header>
        <div class="card-header">
          <span>价值流网络图</span>
          <div class="legend">
            <span class="legend-item">
              <span class="legend-color completed"></span>已完成
            </span>
            <span class="legend-item">
              <span class="legend-color in-progress"></span>进行中
            </span>
            <span class="legend-item">
              <span class="legend-color draft"></span>未开始
            </span>
            <span class="legend-item">
              <span class="legend-color critical"></span>关键路径
            </span>
          </div>
        </div>
      </template>

      <div class="network-container">
        <div v-if="networkData" class="value-stream-flow">
          <div
            v-for="(node, index) in networkData.nodes"
            :key="node.id"
            class="flow-stage"
          >
            <div
              class="stage-node"
              :class="[
                `status-${node.status}`,
                { 'is-critical': isCriticalNode(node.id) },
                { 'is-bottleneck': isBottleneck(node.id) }
              ]"
              @click="handleNodeClick(node)"
            >
              <div class="node-header">
                <el-tag :type="getStatusType(node.status)" size="small">
                  {{ getStatusLabel(node.status) }}
                </el-tag>
                <span v-if="isBottleneck(node.id)" class="bottleneck-badge">
                  <el-icon><WarningFilled /></el-icon>
                </span>
              </div>
              <h3 class="node-title">{{ node.name }}</h3>
              <div class="node-metrics">
                <el-progress
                  :percentage="node.progress"
                  :status="getProgressStatus(node.status)"
                />
                <div class="metric-item">
                  <span class="label">负责人:</span>
                  <span class="value">{{ node.owner }}</span>
                </div>
                <div class="metric-item">
                  <span class="label">周期:</span>
                  <span class="value">{{ formatDateRange(node.startDate, node.endDate) }}</span>
                </div>
              </div>
            </div>

            <div v-if="index < networkData.nodes.length - 1" class="stage-connector">
              <div class="connector-line" :class="{ 'is-critical': isCriticalConnection(node.id, networkData.nodes[index + 1].id) }">
                <el-icon><Right /></el-icon>
              </div>
              <span class="connector-label">{{ getConnectionLabel(node.id, networkData.nodes[index + 1].id) }}</span>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无网络数据" />
      </div>
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总阶段数" :value="stats.totalNodes" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="平均进度" :value="stats.avgProgress" :precision="0">
            <template #suffix>%</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="关键路径长度" :value="stats.criticalPathLength" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="瓶颈数量" :value="stats.bottleneckCount" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 节点详情对话框 -->
    <el-dialog v-model="nodeDialogVisible" title="阶段详情" width="600px">
      <div v-if="selectedNode">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="阶段名称" :span="2">
            {{ selectedNode.name }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedNode.status)">
              {{ getStatusLabel(selectedNode.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="进度">
            {{ selectedNode.progress }}%
          </el-descriptions-item>
          <el-descriptions-item label="负责团队" :span="2">
            {{ selectedNode.owner }}
          </el-descriptions-item>
          <el-descriptions-item label="开始时间">
            {{ selectedNode.startDate }}
          </el-descriptions-item>
          <el-descriptions-item label="结束时间">
            {{ selectedNode.endDate }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <div class="node-metrics-detail">
          <h4>关键指标</h4>
          <el-table :data="selectedNode.metrics" size="small">
            <el-table-column prop="key" label="指标" />
            <el-table-column prop="value" label="值" />
            <el-table-column prop="unit" label="单位" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh, Right, WarningFilled } from '@element-plus/icons-vue'
import type { ValueNetworkData, ValueNetworkNode } from '@/types/traceability'

// 过滤表单
const filterForm = reactive({
  projectId: 'noa-v31',
  displayMode: 'flow',
  showCriticalPath: true,
  showBottlenecks: true,
})

// 网络数据
const networkData = ref<ValueNetworkData | null>(null)

// 统计信息
const stats = reactive({
  totalNodes: 0,
  avgProgress: 0,
  criticalPathLength: 0,
  bottleneckCount: 0,
})

// 节点详情对话框
const nodeDialogVisible = ref(false)
const selectedNode = ref<ValueNetworkNode | null>(null)

// 加载数据
const loadData = async () => {
  try {
    const response = await fetch('/data/requirements/value-network-sample.json')
    const data = await response.json()
    networkData.value = data.l1

    // 更新统计
    if (networkData.value?.metrics) {
      stats.totalNodes = networkData.value.metrics.totalNodes
      stats.avgProgress = networkData.value.metrics.avgProgress
      stats.criticalPathLength = networkData.value.metrics.criticalPathLength
      stats.bottleneckCount = networkData.value.metrics.bottleneckCount
    }

    ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  }
}

// 判断是否关键节点
const isCriticalNode = (nodeId: string) => {
  if (!filterForm.showCriticalPath) return false
  return networkData.value?.criticalPath?.includes(nodeId) || false
}

// 判断是否瓶颈
const isBottleneck = (nodeId: string) => {
  if (!filterForm.showBottlenecks) return false
  return networkData.value?.bottlenecks?.includes(nodeId) || false
}

// 判断是否关键连接
const isCriticalConnection = (sourceId: string, targetId: string) => {
  if (!filterForm.showCriticalPath) return false
  const criticalPath = networkData.value?.criticalPath || []
  const sourceIndex = criticalPath.indexOf(sourceId)
  const targetIndex = criticalPath.indexOf(targetId)
  return sourceIndex !== -1 && targetIndex === sourceIndex + 1
}

// 获取连接标签
const getConnectionLabel = (sourceId: string, targetId: string) => {
  const connection = networkData.value?.connections.find(
    c => c.source === sourceId && c.target === targetId
  )
  return connection?.label || ''
}

// 节点点击
const handleNodeClick = (node: ValueNetworkNode) => {
  selectedNode.value = node
  nodeDialogVisible.value = true
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 刷新
const handleRefresh = () => {
  loadData()
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    in_progress: 'warning',
    completed: 'success',
    blocked: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    blocked: '阻塞',
  }
  return labelMap[status] || status
}

// 获取进度状态
const getProgressStatus = (status: string) => {
  if (status === 'completed') return 'success'
  if (status === 'blocked') return 'exception'
  return undefined
}

// 格式化日期范围
const formatDateRange = (start: string, end: string) => {
  return `${start} ~ ${end}`
}

// 组件挂载
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.value-network-l1-page {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-section {
        h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
          font-weight: 600;
        }

        .subtitle {
          margin: 0;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
      }

      .action-section {
        display: flex;
        gap: 12px;
      }
    }
  }

  .filter-card {
    margin-bottom: 20px;
  }

  .network-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .legend {
        display: flex;
        gap: 16px;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;

          .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 2px;

            &.completed {
              background-color: #67c23a;
            }

            &.in-progress {
              background-color: #e6a23c;
            }

            &.draft {
              background-color: #909399;
            }

            &.critical {
              background-color: #f56c6c;
              border: 2px solid #f56c6c;
            }
          }
        }
      }
    }

    .network-container {
      min-height: 400px;
      overflow-x: auto;

      .value-stream-flow {
        display: flex;
        align-items: center;
        padding: 40px 20px;
        min-width: max-content;

        .flow-stage {
          display: flex;
          align-items: center;

          .stage-node {
            padding: 20px;
            border-radius: 8px;
            border: 2px solid var(--el-border-color);
            background-color: white;
            min-width: 240px;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            &.status-completed {
              border-color: #67c23a;
              background-color: #f0f9ff;
            }

            &.status-in_progress {
              border-color: #e6a23c;
              background-color: #fef0e6;
            }

            &.status-draft {
              border-color: #909399;
              background-color: #f5f7fa;
            }

            &.is-critical {
              border-color: #f56c6c;
              border-width: 3px;
              box-shadow: 0 0 12px rgba(245, 108, 108, 0.3);
            }

            &.is-bottleneck {
              position: relative;

              .bottleneck-badge {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background-color: #f56c6c;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
              }
            }

            .node-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
            }

            .node-title {
              margin: 0 0 16px 0;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
            }

            .node-metrics {
              .metric-item {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 12px;

                .label {
                  color: var(--el-text-color-secondary);
                }

                .value {
                  font-weight: 500;
                }
              }
            }
          }

          .stage-connector {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 16px;

            .connector-line {
              font-size: 24px;
              color: var(--el-text-color-secondary);

              &.is-critical {
                color: #f56c6c;
                font-weight: bold;
              }
            }

            .connector-label {
              margin-top: 4px;
              font-size: 11px;
              color: var(--el-text-color-placeholder);
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

  .stats-row {
    margin-top: 20px;
  }

  .node-metrics-detail {
    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
    }
  }
}
</style>

