<template>
  <div class="traceability-page">
    <el-card class="header-card">
      <div class="page-header">
        <div class="title-section">
          <h2>需求追溯管理</h2>
          <p class="subtitle">端到端需求追溯链可视化与影响分析</p>
        </div>
        <div class="action-section">
          <el-button type="primary" :icon="Plus" @click="handleCreateLink">
            创建追溯关系
          </el-button>
          <el-button :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="实体类型">
          <el-select v-model="queryForm.entityType" placeholder="选择实体类型" style="width: 200px">
            <el-option label="用户需求" value="user_requirement" />
            <el-option label="特性需求" value="feature_requirement" />
            <el-option label="模块需求" value="module_requirement" />
            <el-option label="用户故事" value="story" />
            <el-option label="代码" value="code" />
            <el-option label="测试用例" value="test_case" />
          </el-select>
        </el-form-item>
        <el-form-item label="实体ID">
          <el-input v-model="queryForm.entityId" placeholder="输入实体ID" style="width: 200px" />
        </el-form-item>
        <el-form-item label="追溯方向">
          <el-select v-model="queryForm.direction" placeholder="选择方向" style="width: 150px">
            <el-option label="正向追溯" value="forward" />
            <el-option label="反向追溯" value="backward" />
            <el-option label="横向追溯" value="horizontal" />
            <el-option label="影响追溯" value="impact" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大深度">
          <el-input-number v-model="queryForm.maxDepth" :min="1" :max="7" style="width: 120px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="tree-card">
          <template #header>
            <div class="card-header">
              <span>追溯树视图</span>
              <div class="header-actions">
                <el-radio-group v-model="viewMode" size="small">
                  <el-radio-button label="tree">树形</el-radio-button>
                  <el-radio-button label="graph">图谱</el-radio-button>
                </el-radio-group>
                <el-button size="small" :icon="Refresh" @click="handleRefresh" />
              </div>
            </div>
          </template>
          
          <div v-if="viewMode === 'tree'" class="tree-view">
            <el-tree
              v-if="treeData.length > 0"
              :data="treeData"
              :props="treeProps"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <div class="tree-node">
                  <el-tag :type="getStatusType(data.status)" size="small">
                    {{ getStatusLabel(data.status) }}
                  </el-tag>
                  <span class="node-name">{{ data.name }}</span>
                  <el-tag size="small" effect="plain">{{ getLayerLabel(data.layer) }}</el-tag>
                </div>
              </template>
            </el-tree>
            <el-empty v-else description="暂无追溯数据，请先查询" />
          </div>

          <div v-else class="graph-view">
            <div ref="graphContainer" class="graph-container">
              <!-- 图谱视图将在这里渲染 -->
              <el-empty v-if="treeData.length === 0" description="暂无追溯数据" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="detail-card">
          <template #header>
            <span>节点详情</span>
          </template>
          
          <div v-if="selectedNode" class="node-detail">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="节点ID">
                {{ selectedNode.id }}
              </el-descriptions-item>
              <el-descriptions-item label="实体类型">
                {{ getEntityTypeLabel(selectedNode.entityType) }}
              </el-descriptions-item>
              <el-descriptions-item label="实体ID">
                {{ selectedNode.entityId }}
              </el-descriptions-item>
              <el-descriptions-item label="名称">
                {{ selectedNode.name }}
              </el-descriptions-item>
              <el-descriptions-item label="状态">
                <el-tag :type="getStatusType(selectedNode.status)">
                  {{ getStatusLabel(selectedNode.status) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="层级">
                {{ getLayerLabel(selectedNode.layer) }}
              </el-descriptions-item>
              <el-descriptions-item label="负责人">
                {{ selectedNode.owner || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="创建时间">
                {{ formatDate(selectedNode.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="更新时间">
                {{ formatDate(selectedNode.updatedAt) }}
              </el-descriptions-item>
            </el-descriptions>

            <el-divider />

            <div class="node-actions">
              <el-button type="primary" size="small" @click="handleViewDetail">
                查看详情
              </el-button>
              <el-button size="small" @click="handleImpactAnalysis">
                影响分析
              </el-button>
            </div>

            <el-divider />

            <div class="related-links">
              <h4>关联关系</h4>
              <el-table :data="selectedNodeLinks" size="small" max-height="300">
                <el-table-column prop="relationType" label="关系类型" width="120">
                  <template #default="{ row }">
                    <el-tag size="small">{{ getRelationTypeLabel(row.relationType) }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" />
              </el-table>
            </div>
          </div>

          <el-empty v-else description="请选择一个节点查看详情" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 统计信息 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总节点数" :value="stats.totalNodes">
            <template #suffix>个</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="最大深度" :value="stats.maxDepth">
            <template #suffix>层</template>
          </el-statistic>
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
          <el-statistic title="关键路径长度" :value="stats.criticalPathLength">
            <template #suffix>个节点</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Download, Search, Refresh } from '@element-plus/icons-vue'
import type { TraceNode, TraceLink, TraceTreeNode, TraceDirection, TraceEntityType } from '@/types/traceability'

// 查询表单
const queryForm = reactive({
  entityType: 'user_requirement' as TraceEntityType,
  entityId: 'UR-NOA-001',
  direction: 'forward' as TraceDirection,
  maxDepth: 7,
})

// 视图模式
const viewMode = ref<'tree' | 'graph'>('tree')

// 树形数据
const treeData = ref<TraceTreeNode[]>([])
const treeProps = {
  children: 'children',
  label: 'name',
}

// 选中的节点
const selectedNode = ref<TraceNode | null>(null)
const selectedNodeLinks = ref<TraceLink[]>([])

// 统计信息
const stats = reactive({
  totalNodes: 0,
  maxDepth: 0,
  coverageRate: 0,
  criticalPathLength: 0,
})

// 图谱容器
const graphContainer = ref<HTMLElement>()

// 加载示例数据
const loadSampleData = async () => {
  try {
    const response = await fetch('/biz-data/mock/requirement/traceability.json')
    const result = await response.json()
    
    // 从追溯链数据构建树形结构
    const forwardTraces = result.forwardTraces || []
    if (forwardTraces.length === 0) {
      ElMessage.warning('暂无追溯数据')
      return
    }
    
    // 构建节点和链接
    const nodes: TraceNode[] = []
    const links: TraceLink[] = []
    
    forwardTraces.forEach((trace: any) => {
      // 用户需求节点
      nodes.push({
        id: trace.urId,
        entityType: 'user_requirement',
        entityId: trace.urId,
        name: trace.urTitle,
        status: 'in_progress',
        layer: 1,
        owner: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      
      // 特性需求节点
      trace.frs?.forEach((fr: any) => {
        nodes.push({
          id: fr.frId,
          entityType: 'feature_requirement',
          entityId: fr.frId,
          name: fr.frTitle,
          status: 'in_progress',
          layer: 2,
          owner: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        
        // 创建用户需求到特性需求的链接
        links.push({
          id: `link-${trace.urId}-${fr.frId}`,
          sourceId: trace.urId,
          targetId: fr.frId,
          linkType: 'satisfy',
          status: 'active',
        })
        
        // 模块需求节点
        fr.mrs?.forEach((mr: any) => {
          nodes.push({
            id: mr.mrId,
            entityType: 'module_requirement',
            entityId: mr.mrId,
            name: mr.mrTitle,
            status: 'in_progress',
            layer: 3,
            owner: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          
          // 创建特性需求到模块需求的链接
          links.push({
            id: `link-${fr.frId}-${mr.mrId}`,
            sourceId: fr.frId,
            targetId: mr.mrId,
            linkType: 'decompose',
            status: 'active',
          })
        })
      })
    })
    
    // 找到根节点（L1层）
    const rootNodes = nodes.filter(n => n.layer === 1)
    
    // 递归构建树
    const buildTree = (node: TraceNode): TraceTreeNode => {
      const nodeLinks = links.filter(l => l.sourceId === node.id)
      const children = nodeLinks
        .map(link => {
          const childNode = nodes.find(n => n.id === link.targetId)
          return childNode ? buildTree(childNode) : null
        })
        .filter(Boolean) as TraceTreeNode[]
      
      return {
        ...node,
        children,
        links: nodeLinks,
      }
    }
    
    treeData.value = rootNodes.map(buildTree)
    
    // 更新统计信息
    stats.totalNodes = nodes.length
    stats.maxDepth = Math.max(...nodes.map(n => n.layer))
    stats.coverageRate = 95.5
    stats.criticalPathLength = 7
    
    ElMessage.success('数据加载成功')
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  }
}

// 查询追溯
const handleQuery = () => {
  ElMessage.info(`查询 ${queryForm.entityId} 的${queryForm.direction}追溯...`)
  loadSampleData()
}

// 重置
const handleReset = () => {
  queryForm.entityType = 'user_requirement'
  queryForm.entityId = ''
  queryForm.direction = 'forward'
  queryForm.maxDepth = 7
  treeData.value = []
  selectedNode.value = null
}

// 刷新
const handleRefresh = () => {
  handleQuery()
}

// 节点点击
const handleNodeClick = (data: TraceTreeNode) => {
  selectedNode.value = data
  selectedNodeLinks.value = data.links || []
}

// 创建追溯关系
const handleCreateLink = () => {
  ElMessage.info('创建追溯关系功能开发中...')
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 查看详情
const handleViewDetail = () => {
  if (selectedNode.value) {
    ElMessage.info(`查看 ${selectedNode.value.name} 的详情...`)
  }
}

// 影响分析
const handleImpactAnalysis = () => {
  if (selectedNode.value) {
    ElMessage.info(`分析 ${selectedNode.value.name} 的影响...`)
  }
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

// 获取层级标签
const getLayerLabel = (layer: number) => {
  const labelMap: Record<number, string> = {
    0: 'L0-战略',
    1: 'L1-需求',
    2: 'L2-特性',
    3: 'L3-模块',
    4: 'L4-任务',
    5: 'L5-实现',
    6: 'L6-验证',
    7: 'L7-交付',
  }
  return labelMap[layer] || `L${layer}`
}

// 获取实体类型标签
const getEntityTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    user_requirement: '用户需求',
    feature_requirement: '特性需求',
    module_requirement: '模块需求',
    story: '用户故事',
    task: '任务',
    code: '代码',
    test_case: '测试用例',
    release: '发布版本',
  }
  return labelMap[type] || type
}

// 获取关系类型标签
const getRelationTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    derive_from: '派生自',
    realize_by: '实现于',
    implement_by: '实现通过',
    test_by: '测试于',
    deliver_in: '交付于',
    trace_to: '追溯至',
    satisfy: '满足',
    verify: '验证',
    depend_on: '依赖于',
    relate_to: '关联于',
  }
  return labelMap[type] || type
}

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 组件挂载
onMounted(() => {
  loadSampleData()
})
</script>

<style scoped lang="scss">
.traceability-page {
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

  .tree-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .header-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }

    .tree-view {
      min-height: 500px;

      .tree-node {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;

        .node-name {
          flex: 1;
          margin: 0 8px;
        }
      }
    }

    .graph-view {
      .graph-container {
        min-height: 500px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .detail-card {
    margin-bottom: 20px;

    .node-detail {
      .node-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }

      .related-links {
        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
  }

  .stats-row {
    margin-top: 20px;
  }
}
</style>

