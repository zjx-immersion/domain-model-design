<template>
  <div class="traceability-graph-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>追溯关系图谱</span>
          <div class="header-actions">
            <el-select v-model="selectedNode" placeholder="选择起点" filterable clearable style="width: 250px; margin-right: 10px">
              <el-option-group label="模块需求">
                <el-option
                  v-for="req in moduleRequirements"
                  :key="req.id"
                  :label="`${req.id} - ${req.title}`"
                  :value="req.id"
                />
              </el-option-group>
              <el-option-group label="软件模块">
                <el-option
                  v-for="mod in modules"
                  :key="mod.id"
                  :label="`${mod.id} - ${mod.name}`"
                  :value="mod.id"
                />
              </el-option-group>
              <el-option-group label="构建版本">
                <el-option
                  v-for="build in builds"
                  :key="build.id"
                  :label="`#${build.buildNumber} - ${build.module}`"
                  :value="build.id"
                />
              </el-option-group>
            </el-select>
            <el-button type="primary" @click="loadGraph" :disabled="!selectedNode">
              加载追溯图
            </el-button>
            <el-button @click="resetGraph">重置</el-button>
            <el-button @click="exportGraph">导出</el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="20">
        <!-- 图谱区域 -->
        <el-col :span="18">
          <div class="graph-controls">
            <el-button-group>
              <el-button size="small" @click="fitGraph">
                <el-icon><FullScreen /></el-icon>
                适应窗口
              </el-button>
              <el-button size="small" @click="zoomIn">
                <el-icon><ZoomIn /></el-icon>
                放大
              </el-button>
              <el-button size="small" @click="zoomOut">
                <el-icon><ZoomOut /></el-icon>
                缩小
              </el-button>
            </el-button-group>

            <el-radio-group v-model="layoutType" size="small" @change="changeLayout" style="margin-left: 15px">
              <el-radio-button label="hierarchical">层次布局</el-radio-button>
              <el-radio-button label="force">力导向</el-radio-button>
              <el-radio-button label="circle">环形</el-radio-button>
              <el-radio-button label="grid">网格</el-radio-button>
            </el-radio-group>

            <el-checkbox v-model="showLabels" @change="toggleLabels" style="margin-left: 15px">
              显示标签
            </el-checkbox>
          </div>

          <div ref="graphContainer" class="graph-container" v-loading="loading"></div>

          <!-- 图例 -->
          <div class="legend">
            <div class="legend-item">
              <span class="legend-dot" style="background: #409EFF"></span>
              <span>模块需求</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #67C23A"></span>
              <span>软件模块</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #E6A23C"></span>
              <span>工作项</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #F56C6C"></span>
              <span>代码提交</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #909399"></span>
              <span>构建记录</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background: #B88230"></span>
              <span>测试用例</span>
            </div>
          </div>
        </el-col>

        <!-- 详情面板 -->
        <el-col :span="6">
          <el-card class="detail-panel" v-if="selectedNodeData">
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <span>节点详情</span>
                <el-tag :type="getNodeTypeTag(selectedNodeData.type)" size="small">
                  {{ getNodeTypeLabel(selectedNodeData.type) }}
                </el-tag>
              </div>
            </template>

            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="ID">
                {{ selectedNodeData.id }}
              </el-descriptions-item>
              <el-descriptions-item label="名称">
                {{ selectedNodeData.label }}
              </el-descriptions-item>
              <el-descriptions-item label="类型">
                {{ getNodeTypeLabel(selectedNodeData.type) }}
              </el-descriptions-item>
              <el-descriptions-item label="状态" v-if="selectedNodeData.status">
                <el-tag :type="getStatusType(selectedNodeData.status)" size="small">
                  {{ selectedNodeData.status }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>

            <el-divider />

            <div class="connections">
              <h4>关联关系</h4>
              <div class="connection-section">
                <div class="section-title">上游（依赖于）</div>
                <div v-if="upstreamNodes.length > 0">
                  <el-link
                    v-for="node in upstreamNodes"
                    :key="node.id"
                    type="primary"
                    @click="focusNode(node.id)"
                    style="display: block; margin: 5px 0"
                  >
                    {{ node.label }}
                  </el-link>
                </div>
                <el-empty v-else description="无上游节点" :image-size="60" />
              </div>

              <div class="connection-section" style="margin-top: 15px">
                <div class="section-title">下游（被依赖）</div>
                <div v-if="downstreamNodes.length > 0">
                  <el-link
                    v-for="node in downstreamNodes"
                    :key="node.id"
                    type="success"
                    @click="focusNode(node.id)"
                    style="display: block; margin: 5px 0"
                  >
                    {{ node.label }}
                  </el-link>
                </div>
                <el-empty v-else description="无下游节点" :image-size="60" />
              </div>
            </div>

            <el-divider />

            <div class="actions">
              <el-button type="primary" size="small" @click="viewNodeDetail">查看详情</el-button>
              <el-button size="small" @click="expandNode">展开关系</el-button>
              <el-button size="small" @click="highlightPath">高亮路径</el-button>
            </div>
          </el-card>

          <el-card class="stats-panel" v-else>
            <template #header>
              <span>图谱统计</span>
            </template>
            <el-statistic title="节点总数" :value="graphStats.nodes" />
            <el-statistic title="关系总数" :value="graphStats.edges" style="margin-top: 15px" />
            <el-statistic title="追溯深度" :value="graphStats.depth" style="margin-top: 15px" />
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 路径高亮对话框 -->
    <el-dialog v-model="pathDialogVisible" title="追溯路径" width="600px">
      <div class="path-list">
        <el-steps direction="vertical" :active="tracePaths.length">
          <el-step
            v-for="(step, index) in tracePaths"
            :key="index"
            :title="step.label"
            :description="`${step.type} - ${step.id}`"
          >
            <template #icon>
              <el-icon :color="getNodeColor(step.type)">
                <component :is="getNodeIcon(step.type)" />
              </el-icon>
            </template>
          </el-step>
        </el-steps>
      </div>
      <template #footer>
        <el-button @click="pathDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportPath">导出路径</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import cytoscape from 'cytoscape'
// @ts-ignore
import dagre from 'cytoscape-dagre'

// 注册dagre布局
cytoscape.use(dagre)

const router = useRouter()
const loading = ref(false)
const graphContainer = ref<HTMLElement>()
let cy: any = null

// 数据源
const selectedNode = ref('')
const moduleRequirements = ref<any[]>([])
const modules = ref<any[]>([])
const builds = ref<any[]>([])

// 图谱配置
const layoutType = ref('hierarchical')
const showLabels = ref(true)

// 选中节点
const selectedNodeData = ref<any>(null)
const upstreamNodes = ref<any[]>([])
const downstreamNodes = ref<any[]>([])

// 路径追溯
const pathDialogVisible = ref(false)
const tracePaths = ref<any[]>([])

// 图谱统计
const graphStats = reactive({
  nodes: 0,
  edges: 0,
  depth: 0,
})

// 加载数据源
const loadDataSources = async () => {
  try {
    const [reqRes, modRes, buildRes] = await Promise.all([
      fetch('/biz-data/mock/requirement/module-requirements.json'),
      fetch('/biz-data/mock/asset/modules.json'),
      fetch('/biz-data/mock/devops/builds.json'),
    ])

    const reqData = await reqRes.json()
    const modData = await modRes.json()
    const buildData = await buildRes.json()

    moduleRequirements.value = reqData.data || []
    modules.value = modData.data || []
    builds.value = buildData.data || []
  } catch (error) {
    ElMessage.error('加载数据源失败')
  }
}

// 节点颜色映射
const getNodeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    requirement: '#409EFF',
    module: '#67C23A',
    workitem: '#E6A23C',
    commit: '#F56C6C',
    build: '#909399',
    testcase: '#B88230',
  }
  return colorMap[type] || '#909399'
}

// 节点图标映射
const getNodeIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    requirement: 'Document',
    module: 'Files',
    workitem: 'Ticket',
    commit: 'Edit',
    build: 'SetUp',
    testcase: 'Operation',
  }
  return iconMap[type] || 'Grid'
}

// 加载追溯图
const loadGraph = async () => {
  if (!selectedNode.value) {
    ElMessage.warning('请选择起点')
    return
  }

  loading.value = true

  try {
    // 构造追溯图数据
    const graphData = await buildTraceGraph(selectedNode.value)
    
    // 初始化Cytoscape
    if (cy) {
      cy.destroy()
    }

    cy = cytoscape({
      container: graphContainer.value,
      elements: graphData,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': showLabels.value ? 'data(label)' : '',
            'width': 60,
            'height': 60,
            'font-size': '12px',
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 5,
            'border-width': 2,
            'border-color': '#fff',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'text-rotation': 'autorotate',
          },
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#FF6B6B',
          },
        },
      ],
      layout: getLayoutConfig(),
    })

    // 绑定事件
    cy.on('tap', 'node', (evt: any) => {
      const node = evt.target
      handleNodeClick(node)
    })

    cy.on('tap', (evt: any) => {
      if (evt.target === cy) {
        selectedNodeData.value = null
      }
    })

    // 更新统计
    updateGraphStats()

    ElMessage.success('追溯图加载成功')
  } catch (error) {
    ElMessage.error('加载追溯图失败')
  } finally {
    loading.value = false
  }
}

// 构建追溯图数据
const buildTraceGraph = async (startNodeId: string) => {
  // 示例数据结构
  const nodes = [
    { data: { id: 'MR-001', label: 'MR-001\n激光雷达点云', type: 'requirement', color: getNodeColor('requirement') } },
    { data: { id: 'MOD-001', label: 'MOD-001\n感知模块', type: 'module', color: getNodeColor('module') } },
    { data: { id: 'WI-001', label: 'WI-001\n点云优化', type: 'workitem', color: getNodeColor('workitem') } },
    { data: { id: 'COMMIT-001', label: 'a7f8b9c1\n优化算法', type: 'commit', color: getNodeColor('commit') } },
    { data: { id: 'BUILD-001', label: 'BUILD-2024\n构建成功', type: 'build', color: getNodeColor('build') } },
    { data: { id: 'TC-001', label: 'TC-001\n点云测试', type: 'testcase', color: getNodeColor('testcase') } },
  ]

  const edges = [
    { data: { source: 'MR-001', target: 'MOD-001', label: '属于' } },
    { data: { source: 'MR-001', target: 'WI-001', label: '转换为' } },
    { data: { source: 'WI-001', target: 'COMMIT-001', label: '实现于' } },
    { data: { source: 'COMMIT-001', target: 'BUILD-001', label: '触发' } },
    { data: { source: 'MOD-001', target: 'BUILD-001', label: '构建' } },
    { data: { source: 'MR-001', target: 'TC-001', label: '测试' } },
    { data: { source: 'TC-001', target: 'BUILD-001', label: '验证' } },
  ]

  return [...nodes, ...edges]
}

// 获取布局配置
const getLayoutConfig = () => {
  const configs: Record<string, any> = {
    hierarchical: {
      name: 'dagre',
      rankDir: 'TB',
      nodeSep: 50,
      rankSep: 100,
    },
    force: {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      randomize: false,
    },
    circle: {
      name: 'circle',
      radius: 200,
    },
    grid: {
      name: 'grid',
      rows: 3,
      cols: 3,
    },
  }
  return configs[layoutType.value] || configs.hierarchical
}

// 处理节点点击
const handleNodeClick = (node: any) => {
  selectedNodeData.value = node.data()
  
  // 获取上下游节点
  const predecessors = node.predecessors('node')
  const successors = node.successors('node')
  
  upstreamNodes.value = predecessors.map((n: any) => n.data())
  downstreamNodes.value = successors.map((n: any) => n.data())
}

// 更新图谱统计
const updateGraphStats = () => {
  if (cy) {
    graphStats.nodes = cy.nodes().length
    graphStats.edges = cy.edges().length
    // 计算最大深度
    graphStats.depth = calculateMaxDepth()
  }
}

// 计算最大深度
const calculateMaxDepth = () => {
  // 简化实现，实际应该进行图遍历
  return 3
}

// 图谱操作
const fitGraph = () => {
  if (cy) cy.fit()
}

const zoomIn = () => {
  if (cy) cy.zoom(cy.zoom() * 1.2)
}

const zoomOut = () => {
  if (cy) cy.zoom(cy.zoom() * 0.8)
}

const changeLayout = () => {
  if (cy) {
    cy.layout(getLayoutConfig()).run()
  }
}

const toggleLabels = () => {
  if (cy) {
    cy.style().selector('node').style({
      'label': showLabels.value ? 'data(label)' : '',
    }).update()
  }
}

const resetGraph = () => {
  selectedNode.value = ''
  selectedNodeData.value = null
  if (cy) {
    cy.destroy()
    cy = null
  }
  graphStats.nodes = 0
  graphStats.edges = 0
  graphStats.depth = 0
}

const exportGraph = () => {
  if (cy) {
    const png = cy.png()
    const link = document.createElement('a')
    link.download = 'traceability-graph.png'
    link.href = png
    link.click()
    ElMessage.success('导出成功')
  }
}

// 节点操作
const viewNodeDetail = () => {
  if (selectedNodeData.value) {
    const id = selectedNodeData.value.id
    const type = selectedNodeData.value.type
    
    if (type === 'requirement') {
      router.push(`/requirements/module-detail/${id}`)
    } else if (type === 'module') {
      router.push(`/assets/modules/${id}`)
    } else if (type === 'workitem') {
      router.push(`/work-items/${id}`)
    }
  }
}

const focusNode = (nodeId: string) => {
  if (cy) {
    const node = cy.getElementById(nodeId)
    if (node) {
      cy.animate({
        center: { eles: node },
        zoom: 1.5,
      }, {
        duration: 500,
      })
      handleNodeClick(node)
    }
  }
}

const expandNode = () => {
  ElMessage.info('展开关系功能开发中')
}

const highlightPath = () => {
  if (selectedNodeData.value) {
    // 示例路径数据
    tracePaths.value = [
      { id: 'MR-001', label: '激光雷达点云处理', type: 'requirement' },
      { id: 'MOD-001', label: '感知模块', type: 'module' },
      { id: 'WI-001', label: '点云优化工作项', type: 'workitem' },
      { id: 'COMMIT-001', label: '代码提交', type: 'commit' },
      { id: 'BUILD-2024', label: '构建记录', type: 'build' },
    ]
    pathDialogVisible.value = true
  }
}

const exportPath = () => {
  ElMessage.success('路径导出功能开发中')
}

// 类型标签
const getNodeTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    requirement: '模块需求',
    module: '软件模块',
    workitem: '工作项',
    commit: '代码提交',
    build: '构建记录',
    testcase: '测试用例',
  }
  return labelMap[type] || type
}

const getNodeTypeTag = (type: string) => {
  const tagMap: Record<string, any> = {
    requirement: 'primary',
    module: 'success',
    workitem: 'warning',
    commit: 'danger',
    build: 'info',
    testcase: 'warning',
  }
  return tagMap[type] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    completed: 'success',
    in_progress: 'warning',
    pending: 'info',
    failed: 'danger',
  }
  return map[status] || 'info'
}

onMounted(() => {
  loadDataSources()
})

onUnmounted(() => {
  if (cy) {
    cy.destroy()
  }
})
</script>

<style scoped lang="scss">
.traceability-graph-container {
  padding: 20px;
  height: calc(100vh - 100px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-actions {
    display: flex;
    align-items: center;
  }
}

.graph-controls {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.graph-container {
  width: 100%;
  height: 600px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
}

.legend {
  display: flex;
  gap: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;

    .legend-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
    }
  }
}

.detail-panel,
.stats-panel {
  height: 700px;
  overflow-y: auto;

  .connections {
    .section-title {
      font-size: 13px;
      font-weight: 600;
      color: #606266;
      margin-bottom: 8px;
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .el-button {
      width: 100%;
    }
  }
}

.path-list {
  max-height: 400px;
  overflow-y: auto;
}
</style>

