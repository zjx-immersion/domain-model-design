<template>
  <div class="feature-bom-detail page-container">
    <el-skeleton :loading="loading" animated :rows="8" v-if="loading" />

    <div v-else-if="bom">
      <!-- 页头 -->
      <div class="page-header">
        <el-page-header @back="goBack" :content="`Feature BOM - ${bom.productName} ${bom.versionName}`">
          <template #extra>
            <el-space>
              <el-button
                v-if="!isEditing"
                type="primary"
                :icon="Edit"
                @click="startEdit"
              >
                编辑配置
              </el-button>
              <el-button
                v-if="isEditing"
                type="success"
                :icon="Check"
                @click="saveEdit"
              >
                保存
              </el-button>
              <el-button
                v-if="isEditing"
                :icon="Close"
                @click="cancelEdit"
              >
                取消
              </el-button>
              <el-button :icon="CopyDocument" @click="handleCopy">
                复制BOM
              </el-button>
              <el-button :icon="Download" @click="handleExport">
                导出
              </el-button>
            </el-space>
          </template>
        </el-page-header>
      </div>

      <!-- 基本信息 -->
      <el-card class="info-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><InfoFilled /></el-icon>
              基本信息
            </span>
            <el-tag :type="getStatusTagType(bom.status)">
              {{ getStatusText(bom.status) }}
            </el-tag>
          </div>
        </template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="产品名称">{{ bom.productName }}</el-descriptions-item>
              <el-descriptions-item label="版本名称">
                <el-tag :type="getVersionType(bom.versionName)">
                  {{ bom.versionName }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="版本编码">{{ bom.versionCode }}</el-descriptions-item>
              <el-descriptions-item label="BOM版本">{{ bom.bomVersion }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="发布日期">{{ bom.releaseDate }}</el-descriptions-item>
              <el-descriptions-item label="创建人">{{ bom.createdBy }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ formatDate(bom.createdAt) }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ formatDate(bom.updatedAt) }}</el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </el-card>

      <!-- 统计信息 -->
      <el-row :gutter="20" class="stats-section">
        <el-col :span="6">
          <el-card>
            <el-statistic title="Feature总数" :value="editableBOM.statistics.totalFeatures">
              <template #prefix>
                <el-icon><Box /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <el-statistic title="核心Feature" :value="editableBOM.statistics.coreFeatures">
              <template #prefix>
                <el-icon color="#67C23A"><StarFilled /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <el-statistic title="估算成本" :value="(editableBOM.statistics.totalCost / 10000).toFixed(1)" suffix="万元">
              <template #prefix>
                <el-icon color="#E6A23C"><Money /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <el-statistic title="估算工时" :value="editableBOM.statistics.totalEffort" suffix="小时">
              <template #prefix>
                <el-icon color="#409EFF"><Clock /></el-icon>
              </template>
            </el-statistic>
          </el-card>
        </el-col>
      </el-row>

      <!-- Feature列表 -->
      <el-card class="features-card">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><List /></el-icon>
              Feature配置 ({{ editableBOM.features.length }})
            </span>
            <el-button
              v-if="isEditing"
              type="primary"
              size="small"
              :icon="Plus"
              @click="addFeature"
            >
              添加Feature
            </el-button>
          </div>
        </template>

        <el-table
          :data="editableBOM.features"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="#" width="60" />
          <el-table-column prop="featureCode" label="Feature编码" width="140" />
          <el-table-column prop="featureName" label="Feature名称" min-width="200" />
          <el-table-column label="配置类型" width="120">
            <template #default="{ row, $index }">
              <el-select
                v-if="isEditing"
                v-model="row.configType"
                size="small"
                @change="updateFeatureConfig($index)"
              >
                <el-option label="核心配置" value="core" />
                <el-option label="可选配置" value="optional" />
              </el-select>
              <el-tag v-else :type="row.configType === 'core' ? 'success' : 'info'">
                {{ row.configType === 'core' ? '核心配置' : '可选配置' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否可选" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.isOptional ? 'warning' : 'success'" size="small">
                {{ row.isOptional ? '可选' : '必选' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="关联模块" width="120" align="center">
            <template #default="{ row }">
              <el-tag type="primary">{{ row.modules?.length || 0 }} 个</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="估算成本" width="120" align="right">
            <template #default="{ row }">
              ¥{{ (row.estimatedCost / 10000).toFixed(1) }}万
            </template>
          </el-table-column>
          <el-table-column label="估算工时" width="120" align="right">
            <template #default="{ row }">
              {{ row.estimatedEffort }} 小时
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getPriorityType(row.priority)" size="small">
                {{ row.priority }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200">
            <template #default="{ row }">
              <span class="notes">{{ row.notes }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="isEditing" label="操作" width="150" fixed="right">
            <template #default="{ row, $index }">
              <el-space>
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="viewFeatureDetail(row.featureId)"
                >
                  详情
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="removeFeature($index)"
                >
                  移除
                </el-button>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- Feature选择对话框 -->
      <el-dialog
        v-model="featureSelectorVisible"
        title="选择Feature"
        width="70%"
        :close-on-click-modal="false"
      >
        <div class="feature-selector">
          <el-input
            v-model="featureSearchKeyword"
            placeholder="搜索Feature名称或编码"
            :prefix-icon="Search"
            clearable
            style="margin-bottom: 16px"
          />

          <el-table
            ref="featureTableRef"
            :data="availableFeatures"
            stripe
            @selection-change="handleFeatureSelectionChange"
            height="400"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="code" label="编码" width="140" />
            <el-table-column prop="name" label="名称" min-width="200" />
            <el-table-column prop="domain" label="业务域" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.domain }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="模块数" width="100" align="center">
              <template #default="{ row }">
                {{ row.moduleIds?.length || 0 }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
                  {{ row.status === 'active' ? 'Active' : 'Inactive' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <template #footer>
          <el-space>
            <el-button @click="featureSelectorVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmAddFeatures">
              确定添加 ({{ selectedFeatures.length }})
            </el-button>
          </el-space>
        </template>
      </el-dialog>
    </div>

    <el-empty v-else description="Feature BOM不存在" :image-size="200" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Edit,
  Check,
  Close,
  CopyDocument,
  Download,
  InfoFilled,
  Box,
  StarFilled,
  Money,
  Clock,
  List,
  Plus,
  Search
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import featureBOMDataRaw from '@/biz-data/mock/feature/feature-bom.json'
import featuresDataRaw from '@/biz-data/mock/asset/features.json'

const route = useRoute()
const router = useRouter()

// 数据
const bom = ref<any>(null)
const editableBOM = ref<any>({
  features: [],
  statistics: {
    totalFeatures: 0,
    coreFeatures: 0,
    optionalFeatures: 0,
    totalModules: 0,
    totalCost: 0,
    totalEffort: 0
  }
})
const loading = ref(false)
const isEditing = ref(false)

// Feature选择器
const featureSelectorVisible = ref(false)
const featureSearchKeyword = ref('')
const selectedFeatures = ref<any[]>([])
const featureTableRef = ref()

// 加载数据
onMounted(() => {
  const bomId = route.params.id as string
  const bomsData = featureBOMDataRaw.data || featureBOMDataRaw
  const foundBOM = bomsData.find((b: any) => b.id === bomId)
  
  if (foundBOM) {
    bom.value = foundBOM
    editableBOM.value = JSON.parse(JSON.stringify(foundBOM))
  }
})

// 可用的Feature列表
const availableFeatures = computed(() => {
  const allFeatures = featuresDataRaw.data || featuresDataRaw
  const usedFeatureIds = editableBOM.value.features.map((f: any) => f.featureId)
  
  let features = allFeatures.filter((f: any) => !usedFeatureIds.includes(f.id))

  if (featureSearchKeyword.value) {
    const keyword = featureSearchKeyword.value.toLowerCase()
    features = features.filter(
      (f: any) =>
        f.name.toLowerCase().includes(keyword) ||
        f.code.toLowerCase().includes(keyword)
    )
  }

  return features
})

// 格式化日期
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  const map: Record<string, any> = {
    'released': 'success',
    'planning': 'warning',
    'archived': 'info'
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    'released': '已发布',
    'planning': '规划中',
    'archived': '已归档'
  }
  return map[status] || status
}

// 获取版本类型
const getVersionType = (versionName: string) => {
  const map: Record<string, any> = {
    '旗舰版': 'danger',
    '高配版': 'warning',
    '标准版': 'info',
    '2026款': 'success'
  }
  return map[versionName] || 'primary'
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const map: Record<string, any> = {
    'P0': 'danger',
    'P1': 'warning',
    'P2': 'info'
  }
  return map[priority] || 'info'
}

// 开始编辑
const startEdit = () => {
  isEditing.value = true
  ElMessage.info('进入编辑模式')
}

// 取消编辑
const cancelEdit = () => {
  ElMessageBox.confirm('确定取消编辑吗？未保存的更改将丢失。', '确认', {
    type: 'warning'
  })
    .then(() => {
      editableBOM.value = JSON.parse(JSON.stringify(bom.value))
      isEditing.value = false
      ElMessage.info('已取消编辑')
    })
    .catch(() => {})
}

// 保存编辑
const saveEdit = () => {
  // 重新计算统计信息
  recalculateStatistics()

  ElMessage.success('BOM配置已保存')
  bom.value = JSON.parse(JSON.stringify(editableBOM.value))
  isEditing.value = false
}

// 重新计算统计信息
const recalculateStatistics = () => {
  const features = editableBOM.value.features
  editableBOM.value.statistics = {
    totalFeatures: features.length,
    coreFeatures: features.filter((f: any) => f.configType === 'core').length,
    optionalFeatures: features.filter((f: any) => f.configType === 'optional').length,
    totalModules: [...new Set(features.flatMap((f: any) => f.modules || []))].length,
    totalCost: features.reduce((sum: number, f: any) => sum + (f.estimatedCost || 0), 0),
    totalEffort: features.reduce((sum: number, f: any) => sum + (f.estimatedEffort || 0), 0)
  }
}

// 更新Feature配置
const updateFeatureConfig = (index: number) => {
  const feature = editableBOM.value.features[index]
  feature.isOptional = feature.configType === 'optional'
  recalculateStatistics()
}

// 添加Feature
const addFeature = () => {
  featureSelectorVisible.value = true
  selectedFeatures.value = []
}

// Feature选择变更
const handleFeatureSelectionChange = (selection: any[]) => {
  selectedFeatures.value = selection
}

// 确认添加Feature
const confirmAddFeatures = () => {
  selectedFeatures.value.forEach(feature => {
    editableBOM.value.features.push({
      featureId: feature.id,
      featureName: feature.name,
      featureCode: feature.code,
      configType: 'optional',
      isOptional: true,
      quantity: 1,
      modules: feature.moduleIds || [],
      estimatedCost: feature.estimatedCost || 5000,
      estimatedEffort: feature.estimatedEffort || 100,
      priority: 'P1',
      addedDate: dayjs().format('YYYY-MM-DD'),
      notes: '新增Feature'
    })
  })

  recalculateStatistics()
  featureSelectorVisible.value = false
  ElMessage.success(`已添加 ${selectedFeatures.value.length} 个Feature`)
}

// 移除Feature
const removeFeature = (index: number) => {
  ElMessageBox.confirm('确定移除该Feature吗？', '确认', {
    type: 'warning'
  })
    .then(() => {
      editableBOM.value.features.splice(index, 1)
      recalculateStatistics()
      ElMessage.success('已移除Feature')
    })
    .catch(() => {})
}

// 查看Feature详情
const viewFeatureDetail = (featureId: string) => {
  router.push(`/assets/features/${featureId}`)
}

// 复制BOM
const handleCopy = () => {
  ElMessage.info('复制BOM功能开发中...')
}

// 导出
const handleExport = () => {
  ElMessage.success('导出BOM功能开发中...')
}

// 返回
const goBack = () => {
  router.push('/assets/feature-bom')
}
</script>

<style scoped lang="scss">
.feature-bom-detail {
  .page-header {
    margin-bottom: 20px;
  }

  .info-card {
    margin-bottom: 20px;

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
  }

  .stats-section {
    margin-bottom: 20px;

    .el-card {
      text-align: center;
    }
  }

  .features-card {
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

    .notes {
      color: #909399;
      font-size: 13px;
    }
  }

  .feature-selector {
    :deep(.el-table) {
      font-size: 14px;
    }
  }
}
</style>

