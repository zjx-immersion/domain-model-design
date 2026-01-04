<template>
  <div class="traceability-matrix-page">
    <el-card class="header-card">
      <div class="page-header">
        <div class="title-section">
          <h2>追溯矩阵视图</h2>
          <p class="subtitle">需求到实现的完整追溯矩阵</p>
        </div>
        <div class="action-section">
          <el-button type="primary" :icon="Download" @click="handleExport">
            导出矩阵
          </el-button>
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="config-card">
      <el-form :model="matrixConfig" inline>
        <el-form-item label="行维度">
          <el-select v-model="matrixConfig.rowType" placeholder="选择行维度" style="width: 180px">
            <el-option label="用户需求" value="user_requirement" />
            <el-option label="特性需求" value="feature_requirement" />
            <el-option label="模块需求" value="module_requirement" />
          </el-select>
        </el-form-item>
        <el-form-item label="列维度">
          <el-select v-model="matrixConfig.colType" placeholder="选择列维度" style="width: 180px">
            <el-option label="用户故事" value="story" />
            <el-option label="代码" value="code" />
            <el-option label="测试用例" value="test_case" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="matrixConfig.projectId" placeholder="选择项目" style="width: 200px">
            <el-option label="NOA v3.1" value="noa-v31" />
            <el-option label="AVP" value="avp" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleGenerate">生成矩阵</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="matrix-card">
      <template #header>
        <div class="card-header">
          <span>追溯矩阵</span>
          <div class="legend">
            <span class="legend-item">
              <span class="legend-color has-trace"></span>
              有追溯
            </span>
            <span class="legend-item">
              <span class="legend-color no-trace"></span>
              无追溯
            </span>
            <span class="legend-item">
              <span class="legend-color multiple-trace"></span>
              多重追溯
            </span>
          </div>
        </div>
      </template>

      <div class="matrix-container">
        <table class="trace-matrix">
          <thead>
            <tr>
              <th class="corner-cell">
                <div class="corner-content">
                  <span class="row-label">{{ getTypeLabel(matrixConfig.rowType) }}</span>
                  <span class="col-label">{{ getTypeLabel(matrixConfig.colType) }}</span>
                </div>
              </th>
              <th v-for="col in matrixData.columns" :key="col.id" class="column-header">
                <div class="header-content">
                  <el-tooltip :content="col.name" placement="top">
                    <span class="header-text">{{ col.entityId }}</span>
                  </el-tooltip>
                  <el-tag :type="getStatusType(col.status)" size="small">
                    {{ getStatusLabel(col.status) }}
                  </el-tag>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in matrixData.rows" :key="row.id">
              <td class="row-header">
                <div class="header-content">
                  <el-tooltip :content="row.name" placement="right">
                    <span class="header-text">{{ row.entityId }}</span>
                  </el-tooltip>
                  <el-tag :type="getStatusType(row.status)" size="small">
                    {{ getStatusLabel(row.status) }}
                  </el-tag>
                </div>
              </td>
              <td
                v-for="col in matrixData.columns"
                :key="`${row.id}-${col.id}`"
                :class="getCellClass(row.id, col.id)"
                @click="handleCellClick(row.id, col.id)"
              >
                <div class="cell-content">
                  <span v-if="getCellLinks(row.id, col.id).length > 0" class="link-count">
                    {{ getCellLinks(row.id, col.id).length }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <el-empty v-if="matrixData.rows.length === 0" description="暂无矩阵数据，请配置并生成" />
      </div>
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总需求数" :value="stats.totalRequirements" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="已追溯需求" :value="stats.tracedRequirements" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="追溯覆盖率" :value="stats.coverageRate" :precision="1">
            <template #suffix>%</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="追溯关系数" :value="stats.totalLinks" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 单元格详情对话框 -->
    <el-dialog v-model="cellDialogVisible" title="追溯关系详情" width="600px">
      <div v-if="selectedCell">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="源节点">
            {{ getNodeName(selectedCell.rowId) }}
          </el-descriptions-item>
          <el-descriptions-item label="目标节点">
            {{ getNodeName(selectedCell.colId) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h4>追溯关系列表</h4>
        <el-table :data="selectedCellLinks" size="small">
          <el-table-column prop="relationType" label="关系类型" width="120">
            <template #default="{ row }">
              <el-tag size="small">{{ getRelationTypeLabel(row.relationType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="createdBy" label="创建人" width="100" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh } from '@element-plus/icons-vue'
import type { TraceNode, TraceLink, TraceMatrixData } from '@/types/traceability'

// 矩阵配置
const matrixConfig = reactive({
  rowType: 'user_requirement',
  colType: 'story',
  projectId: 'noa-v31',
})

// 矩阵数据
const matrixData = reactive<TraceMatrixData>({
  rows: [],
  columns: [],
  cells: [],
})

// 统计信息
const stats = reactive({
  totalRequirements: 0,
  tracedRequirements: 0,
  coverageRate: 0,
  totalLinks: 0,
})

// 单元格对话框
const cellDialogVisible = ref(false)
const selectedCell = ref<{ rowId: string; colId: string } | null>(null)
const selectedCellLinks = ref<TraceLink[]>([])

// 生成矩阵
const handleGenerate = async () => {
  try {
    // 模拟数据
    const sampleRows: TraceNode[] = [
      {
        id: 'ur-001',
        entityType: 'user_requirement',
        entityId: 'UR-NOA-001',
        name: '自动驾驶路径规划优化',
        status: 'in_progress',
        layer: 1,
        owner: '张伟',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
      },
      {
        id: 'ur-002',
        entityType: 'user_requirement',
        entityId: 'UR-NOA-002',
        name: '感知融合算法优化',
        status: 'in_progress',
        layer: 1,
        owner: '李明',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
      },
      {
        id: 'ur-003',
        entityType: 'user_requirement',
        entityId: 'UR-NOA-003',
        name: '决策规划模块重构',
        status: 'completed',
        layer: 1,
        owner: '王芳',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z',
      },
    ]

    const sampleCols: TraceNode[] = [
      {
        id: 'story-001',
        entityType: 'story',
        entityId: 'STORY-001',
        name: '实现A*路径搜索算法',
        status: 'completed',
        layer: 4,
        owner: '赵强',
        createdAt: '2025-01-04T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      },
      {
        id: 'story-002',
        entityType: 'story',
        entityId: 'STORY-002',
        name: '实现多传感器融合',
        status: 'in_progress',
        layer: 4,
        owner: '孙丽',
        createdAt: '2025-01-04T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      },
      {
        id: 'story-003',
        entityType: 'story',
        entityId: 'STORY-003',
        name: '重构决策规划架构',
        status: 'completed',
        layer: 4,
        owner: '周杰',
        createdAt: '2025-01-04T00:00:00Z',
        updatedAt: '2025-01-10T00:00:00Z',
      },
    ]

    const sampleCells = [
      {
        rowId: 'ur-001',
        colId: 'story-001',
        links: [
          {
            id: 'link-001',
            sourceId: 'ur-001',
            targetId: 'story-001',
            relationType: 'implement_by',
            description: '需求由Story实现',
            createdAt: '2025-01-04T00:00:00Z',
            createdBy: '赵强',
          },
        ],
        hasRelation: true,
      },
      {
        rowId: 'ur-002',
        colId: 'story-002',
        links: [
          {
            id: 'link-002',
            sourceId: 'ur-002',
            targetId: 'story-002',
            relationType: 'implement_by',
            description: '需求由Story实现',
            createdAt: '2025-01-04T00:00:00Z',
            createdBy: '孙丽',
          },
        ],
        hasRelation: true,
      },
      {
        rowId: 'ur-003',
        colId: 'story-003',
        links: [
          {
            id: 'link-003',
            sourceId: 'ur-003',
            targetId: 'story-003',
            relationType: 'implement_by',
            description: '需求由Story实现',
            createdAt: '2025-01-04T00:00:00Z',
            createdBy: '周杰',
          },
        ],
        hasRelation: true,
      },
    ]

    matrixData.rows = sampleRows
    matrixData.columns = sampleCols
    matrixData.cells = sampleCells

    // 更新统计
    stats.totalRequirements = sampleRows.length
    stats.tracedRequirements = sampleRows.length
    stats.coverageRate = 100
    stats.totalLinks = sampleCells.reduce((sum, cell) => sum + cell.links.length, 0)

    ElMessage.success('矩阵生成成功')
  } catch (error) {
    console.error('生成矩阵失败:', error)
    ElMessage.error('生成矩阵失败')
  }
}

// 获取单元格链接
const getCellLinks = (rowId: string, colId: string) => {
  const cell = matrixData.cells.find(c => c.rowId === rowId && c.colId === colId)
  return cell?.links || []
}

// 获取单元格样式类
const getCellClass = (rowId: string, colId: string) => {
  const links = getCellLinks(rowId, colId)
  if (links.length === 0) return 'cell no-trace'
  if (links.length === 1) return 'cell has-trace'
  return 'cell multiple-trace'
}

// 单元格点击
const handleCellClick = (rowId: string, colId: string) => {
  const links = getCellLinks(rowId, colId)
  if (links.length > 0) {
    selectedCell.value = { rowId, colId }
    selectedCellLinks.value = links
    cellDialogVisible.value = true
  }
}

// 获取节点名称
const getNodeName = (nodeId: string) => {
  const node = [...matrixData.rows, ...matrixData.columns].find(n => n.id === nodeId)
  return node ? `${node.entityId} - ${node.name}` : nodeId
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 刷新
const handleRefresh = () => {
  handleGenerate()
}

// 获取类型标签
const getTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    user_requirement: '用户需求',
    feature_requirement: '特性需求',
    module_requirement: '模块需求',
    story: '用户故事',
    code: '代码',
    test_case: '测试用例',
  }
  return labelMap[type] || type
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    in_progress: 'warning',
    completed: 'success',
    blocked: 'danger',
    cancelled: 'info',
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '草稿',
    in_progress: '进行中',
    completed: '已完成',
    blocked: '阻塞',
    cancelled: '已取消',
  }
  return labelMap[status] || status
}

// 获取关系类型标签
const getRelationTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    derive_from: '派生自',
    realize_by: '实现于',
    implement_by: '实现通过',
    test_by: '测试于',
    deliver_in: '交付于',
  }
  return labelMap[type] || type
}
</script>

<style scoped lang="scss">
.traceability-matrix-page {
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

  .config-card {
    margin-bottom: 20px;
  }

  .matrix-card {
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
            border: 1px solid var(--el-border-color);

            &.has-trace {
              background-color: #67c23a;
            }

            &.no-trace {
              background-color: #f5f7fa;
            }

            &.multiple-trace {
              background-color: #409eff;
            }
          }
        }
      }
    }

    .matrix-container {
      overflow-x: auto;

      .trace-matrix {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;

        th,
        td {
          border: 1px solid var(--el-border-color);
          padding: 8px;
          text-align: center;
        }

        .corner-cell {
          background-color: var(--el-fill-color-light);
          min-width: 120px;

          .corner-content {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .row-label {
              font-weight: 600;
            }

            .col-label {
              font-size: 11px;
              color: var(--el-text-color-secondary);
            }
          }
        }

        .column-header,
        .row-header {
          background-color: var(--el-fill-color-light);
          font-weight: 600;
          min-width: 100px;

          .header-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
            align-items: center;

            .header-text {
              font-size: 12px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 100px;
            }
          }
        }

        .cell {
          cursor: pointer;
          transition: all 0.2s;
          min-width: 60px;
          height: 60px;

          &.no-trace {
            background-color: #f5f7fa;
          }

          &.has-trace {
            background-color: #67c23a;
            color: white;

            &:hover {
              background-color: #529b2e;
            }
          }

          &.multiple-trace {
            background-color: #409eff;
            color: white;

            &:hover {
              background-color: #337ecc;
            }
          }

          .cell-content {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;

            .link-count {
              font-weight: 600;
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .stats-row {
    margin-top: 20px;
  }
}
</style>

