<template>
  <div class="relationship-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>资产关系图</span>
          <div>
            <el-radio-group v-model="viewLevel" @change="handleLevelChange">
              <el-radio-button label="product-line">产品线视图</el-radio-button>
              <el-radio-button label="feature">特性视图</el-radio-button>
              <el-radio-button label="module">模块视图</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      
      <div ref="graphContainer" class="graph-container" v-loading="loading"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import cytoscape from 'cytoscape'

const loading = ref(false)
const graphContainer = ref<HTMLElement | null>(null)
const viewLevel = ref('product-line')
let cy: any = null

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/asset/relationships.json')
    const result = await response.json()
    
    if (graphContainer.value) {
      initGraph(result.data)
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const initGraph = (data: any) => {
  if (!graphContainer.value) return
  
  // 转换数据格式为 Cytoscape.js 所需的格式
  const elements = {
    nodes: data.nodes.map((node: any) => ({
      data: { ...node }
    })),
    edges: data.edges.map((edge: any) => ({
      data: { ...edge }
    }))
  }
  
  cy = cytoscape({
    container: graphContainer.value,
    elements: elements,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#409eff',
          'label': 'data(label)',
          'color': '#fff',
          'text-valign': 'center',
          'text-halign': 'center',
          'width': '60px',
          'height': '60px',
          'font-size': '12px',
          'text-wrap': 'wrap',
          'text-max-width': '80px'
        }
      },
      {
        selector: 'node[type="productLine"]',
        style: {
          'background-color': '#67C23A',
          'shape': 'rectangle',
          'width': '80px',
          'height': '40px'
        }
      },
      {
        selector: 'node[type="feature"]',
        style: {
          'background-color': '#409EFF',
          'shape': 'roundrectangle'
        }
      },
      {
        selector: 'node[type="module"]',
        style: {
          'background-color': '#E6A23C',
          'shape': 'ellipse',
          'width': '50px',
          'height': '50px'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier',
          'label': 'data(label)',
          'font-size': '10px',
          'text-rotation': 'autorotate',
          'text-margin-y': -10
        }
      },
      {
        selector: 'edge[type="depends"]',
        style: {
          'line-color': '#F56C6C',
          'target-arrow-color': '#F56C6C',
          'line-style': 'dashed'
        }
      }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 20,
      spacingFactor: 1.5
    }
  })
  
  cy.on('tap', 'node', (evt: any) => {
    const node = evt.target
    ElMessage.info(`点击节点: ${node.data('label')}`)
  })
}

const handleLevelChange = () => {
  ElMessage.info(`切换到${viewLevel.value}视图`)
  // 重新加载数据并更新图
  loadData()
}

onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  if (cy) {
    cy.destroy()
  }
})
</script>

<style scoped lang="scss">
.relationship-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.graph-container {
  width: 100%;
  height: 600px;
  border: 1px solid #eee;
}
</style>

