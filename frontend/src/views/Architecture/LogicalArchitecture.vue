<template>
  <div class="logical-architecture page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="逻辑架构设计">
        <template #extra>
          <el-space>
            <el-select
              v-model="selectedArchId"
              placeholder="选择架构"
              style="width: 250px"
              @change="loadArchitecture"
            >
              <el-option
                v-for="arch in architectures"
                :key="arch.id"
                :label="`${arch.name} (${arch.version})`"
                :value="arch.id"
              />
            </el-select>
            <el-button :icon="Download" @click="exportArchitecture">导出</el-button>
          </el-space>
        </template>
      </el-page-header>
    </div>

    <!-- 架构信息 -->
    <el-card class="info-card" v-if="currentArch" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><InfoFilled /></el-icon>
            架构信息
          </span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="架构名称">{{ currentArch.name }}</el-descriptions-item>
        <el-descriptions-item label="产品">{{ currentArch.product }}</el-descriptions-item>
        <el-descriptions-item label="版本">
          <el-tag>{{ currentArch.version }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="层级数量">
          {{ currentArch.layers.length }}层
        </el-descriptions-item>
        <el-descriptions-item label="描述" :span="2">
          {{ currentArch.description }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 分层架构视图 -->
    <el-card class="layers-card" v-if="currentArch">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Grid /></el-icon>
            分层架构
          </span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="layers">分层视图</el-radio-button>
            <el-radio-button label="modules">模块视图</el-radio-button>
            <el-radio-button label="deployment">部署视图</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <!-- 分层视图 -->
      <div v-if="viewMode === 'layers'" class="layers-view">
        <div
          v-for="layer in sortedLayers"
          :key="layer.id"
          class="architecture-layer"
          :class="`layer-${layer.level}`"
        >
          <div class="layer-header">
            <div class="layer-info">
              <el-tag :type="getLayerType(layer.level)" size="large">
                Layer {{ layer.level }}
              </el-tag>
              <span class="layer-name">{{ layer.name }}</span>
            </div>
            <div class="layer-stats">
              <el-tag size="small">{{ layer.modules.length }} 个模块</el-tag>
            </div>
          </div>
          <div class="layer-description">{{ layer.description }}</div>
          <div class="layer-modules">
            <el-card
              v-for="module in layer.modules"
              :key="module.id"
              shadow="hover"
              class="module-card"
              @click="selectModule(module)"
            >
              <div class="module-header">
                <span class="module-name">{{ module.name }}</span>
                <el-tag size="small">{{ module.team }}</el-tag>
              </div>
              <div class="module-description">{{ module.description }}</div>
              <div class="module-meta">
                <div class="meta-item">
                  <span class="meta-label">Features:</span>
                  <el-tag size="small">{{ module.features.length }}</el-tag>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Dependencies:</span>
                  <el-tag size="small">{{ module.dependencies.length }}</el-tag>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </div>

      <!-- 模块视图 -->
      <div v-else-if="viewMode === 'modules'" class="modules-view">
        <el-table :data="allModules" style="width: 100%" border>
          <el-table-column prop="name" label="模块名称" width="200" fixed />
          <el-table-column prop="description" label="描述" min-width="250" />
          <el-table-column label="所属层级" width="150">
            <template #default="{ row }">
              <el-tag :type="getLayerType(row.layer)">
                {{ getLayerName(row.layer) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="team" label="负责团队" width="150">
            <template #default="{ row }">
              <el-tag type="success">{{ row.team }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Features" width="100" align="center">
            <template #default="{ row }">
              {{ row.features.length }}
            </template>
          </el-table-column>
          <el-table-column label="依赖" width="100" align="center">
            <template #default="{ row }">
              {{ row.dependencies.length }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="selectModule(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 部署视图 -->
      <div v-else class="deployment-view">
        <el-row :gutter="20">
          <el-col
            :span="8"
            v-for="node in currentArch.deploymentView.nodes"
            :key="node.id"
          >
            <el-card class="deployment-node">
              <template #header>
                <div class="node-header">
                  <el-icon size="24"><Monitor /></el-icon>
                  <span>{{ node.name }}</span>
                </div>
              </template>

              <div class="node-info">
                <div class="info-item">
                  <span class="info-label">类型:</span>
                  <el-tag size="small">{{ node.type }}</el-tag>
                </div>
                <div class="info-item">
                  <span class="info-label">平台:</span>
                  <el-tag type="success" size="small">{{ node.platform }}</el-tag>
                </div>
              </div>

              <el-divider />

              <div class="deployed-modules">
                <div class="modules-title">部署的模块 ({{ node.deployedModules.length }}):</div>
                <el-tag
                  v-for="moduleId in node.deployedModules"
                  :key="moduleId"
                  size="small"
                  style="margin: 4px"
                >
                  {{ getModuleName(moduleId) }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 横切关注点 -->
    <el-card class="concerns-card" v-if="currentArch">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Operation /></el-icon>
            横切关注点
          </span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col
          :span="8"
          v-for="concern in currentArch.crossCuttingConcerns"
          :key="concern.id"
        >
          <el-card class="concern-card">
            <div class="concern-name">{{ concern.name }}</div>
            <div class="concern-description">{{ concern.description }}</div>
            <el-divider />
            <div class="concern-layers">
              <span class="concern-label">影响层级:</span>
              <el-tag
                v-for="layerId in concern.affectedLayers"
                :key="layerId"
                size="small"
                style="margin: 2px"
              >
                {{ getLayerNameById(layerId) }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 质量属性 -->
    <el-card class="quality-card" v-if="currentArch">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Checked /></el-icon>
            质量属性
          </span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6" v-for="(attrs, category) in currentArch.qualityAttributes" :key="category">
          <el-card class="quality-category">
            <template #header>
              <div class="category-header">
                {{ formatCategoryName(category) }}
              </div>
            </template>
            <div class="quality-attrs">
              <div v-for="(value, key) in attrs" :key="key" class="quality-item">
                <div class="quality-key">{{ formatQualityKey(key) }}:</div>
                <div class="quality-value">{{ value }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 模块详情抽屉 -->
    <el-drawer v-model="drawerVisible" :title="selectedModule?.name" size="40%">
      <div v-if="selectedModule" class="module-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="模块ID">{{ selectedModule.id }}</el-descriptions-item>
          <el-descriptions-item label="模块名称">{{ selectedModule.name }}</el-descriptions-item>
          <el-descriptions-item label="所属层级">
            <el-tag :type="getLayerType(selectedModule.layer)">
              {{ getLayerName(selectedModule.layer) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="负责团队">
            <el-tag type="success">{{ selectedModule.team }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            {{ selectedModule.description }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">Features</el-divider>
        <el-tag
          v-for="featureId in selectedModule.features"
          :key="featureId"
          style="margin: 4px"
        >
          {{ featureId }}
        </el-tag>

        <el-divider content-position="left">依赖模块</el-divider>
        <div v-if="selectedModule.dependencies.length > 0">
          <el-tag
            v-for="depId in selectedModule.dependencies"
            :key="depId"
            type="warning"
            style="margin: 4px"
          >
            {{ getModuleName(depId) }}
          </el-tag>
        </div>
        <span v-else>无依赖</span>
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
  InfoFilled,
  Grid,
  Monitor,
  Operation,
  Checked
} from '@element-plus/icons-vue'

const router = useRouter()
const loading = ref(false)
const selectedArchId = ref('')
const viewMode = ref<'layers' | 'modules' | 'deployment'>('layers')
const drawerVisible = ref(false)
const selectedModule = ref<any>(null)

// 架构数据
const architectures = ref<any[]>([])
const currentArch = ref<any>(null)

// 排序后的层级
const sortedLayers = computed(() => {
  if (!currentArch.value) return []
  return [...currentArch.value.layers].sort((a, b) => a.level - b.level)
})

// 所有模块
const allModules = computed(() => {
  if (!currentArch.value) return []
  return currentArch.value.layers.flatMap((layer: any) =>
    layer.modules.map((module: any) => ({ ...module, layer: layer.level, layerName: layer.name }))
  )
})

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/architecture/logical-architectures.json')
    const result = await response.json()
    architectures.value = result.data || result

    if (architectures.value.length > 0) {
      selectedArchId.value = architectures.value[0].id
      await loadArchitecture()
    }
  } catch (error) {
    ElMessage.error('加载架构数据失败')
  } finally {
    loading.value = false
  }
})

// 加载架构
const loadArchitecture = async () => {
  loading.value = true
  try {
    currentArch.value = architectures.value.find((arch: any) => arch.id === selectedArchId.value)
  } catch (error) {
    ElMessage.error('加载架构失败')
  } finally {
    loading.value = false
  }
}

// 获取层级类型
const getLayerType = (level: number) => {
  const types = ['primary', 'success', 'warning']
  return types[level - 1] || 'info'
}

// 获取层级名称
const getLayerName = (level: number) => {
  const layer = currentArch.value?.layers.find((l: any) => l.level === level)
  return layer?.name || `Layer ${level}`
}

// 获取层级名称（根据ID）
const getLayerNameById = (layerId: string) => {
  const layer = currentArch.value?.layers.find((l: any) => l.id === layerId)
  return layer?.name || layerId
}

// 获取模块名称
const getModuleName = (moduleId: string) => {
  for (const layer of currentArch.value?.layers || []) {
    const module = layer.modules.find((m: any) => m.id === moduleId)
    if (module) return module.name
  }
  return moduleId
}

// 格式化分类名称
const formatCategoryName = (category: string) => {
  const map: Record<string, string> = {
    performance: '性能',
    reliability: '可靠性',
    scalability: '可扩展性',
    security: '安全性'
  }
  return map[category] || category
}

// 格式化质量属性键
const formatQualityKey = (key: string) => {
  const map: Record<string, string> = {
    latency: '延迟',
    throughput: '吞吐量',
    availability: '可用性',
    mtbf: 'MTBF',
    modularity: '模块化',
    extensibility: '可扩展性',
    encryption: '加密',
    authentication: '认证'
  }
  return map[key] || key
}

// 选择模块
const selectModule = (module: any) => {
  selectedModule.value = module
  drawerVisible.value = true
}

// 导出架构
const exportArchitecture = () => {
  ElMessage.info('导出功能开发中...')
}

// 返回
const goBack = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.logical-architecture {
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

  .info-card,
  .layers-card,
  .concerns-card,
  .quality-card {
    margin-bottom: 20px;
  }

  .layers-view {
    padding: 20px;

    .architecture-layer {
      margin: 30px 0;
      padding: 20px;
      border: 2px solid #E4E7ED;
      border-radius: 8px;
      background: #FAFAFA;

      &.layer-1 {
        border-color: #409EFF;
        background: #ECF5FF;
      }

      &.layer-2 {
        border-color: #67C23A;
        background: #F0F9FF;
      }

      &.layer-3 {
        border-color: #E6A23C;
        background: #FDF6EC;
      }

      .layer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .layer-info {
          display: flex;
          align-items: center;
          gap: 12px;

          .layer-name {
            font-size: 18px;
            font-weight: 500;
          }
        }
      }

      .layer-description {
        color: #606266;
        margin-bottom: 20px;
        padding: 12px;
        background: white;
        border-radius: 4px;
      }

      .layer-modules {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;

        .module-card {
          cursor: pointer;
          transition: all 0.3s;
          background: white;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .module-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .module-name {
              font-size: 14px;
              font-weight: 500;
            }
          }

          .module-description {
            font-size: 12px;
            color: #606266;
            margin-bottom: 12px;
            line-height: 1.6;
          }

          .module-meta {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .meta-item {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .meta-label {
                font-size: 12px;
                color: #909399;
              }
            }
          }
        }
      }
    }
  }

  .modules-view {
    padding: 20px;
  }

  .deployment-view {
    padding: 20px;

    .deployment-node {
      margin-bottom: 20px;

      .node-header {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        font-weight: 500;
      }

      .node-info {
        margin-bottom: 16px;

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 8px 0;

          .info-label {
            font-size: 13px;
            color: #606266;
          }
        }
      }

      .deployed-modules {
        .modules-title {
          font-size: 13px;
          color: #606266;
          margin-bottom: 8px;
        }
      }
    }
  }

  .concerns-card {
    .concern-card {
      .concern-name {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 8px;
      }

      .concern-description {
        font-size: 12px;
        color: #606266;
        line-height: 1.6;
      }

      .concern-layers {
        .concern-label {
          font-size: 12px;
          color: #909399;
          margin-right: 8px;
        }
      }
    }
  }

  .quality-card {
    .quality-category {
      .category-header {
        font-size: 14px;
        font-weight: 500;
      }

      .quality-attrs {
        .quality-item {
          margin: 12px 0;
          padding: 8px;
          background: #F5F7FA;
          border-radius: 4px;

          .quality-key {
            font-size: 12px;
            color: #606266;
            margin-bottom: 4px;
          }

          .quality-value {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
          }
        }
      }
    }
  }
}
</style>

