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
  
  cy = cytoscape({
    container: graphContainer.value,
    elements: {
      nodes: data.nodes,
      edges: data.edges
    },
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#409eff',
          'label': 'data(label)',
          'color': '#fff',
          'text-valign': 'center',
          'text-halign': 'center'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10
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

