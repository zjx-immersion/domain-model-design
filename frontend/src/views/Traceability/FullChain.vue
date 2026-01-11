<template>
  <div class="full-chain-traceability page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="端到端追溯链路">
        <template #extra>
          <el-space>
            <el-select
              v-model="startType"
              placeholder="选择起点类型"
              style="width: 150px"
              @change="handleStartTypeChange"
            >
              <el-option label="用户需求 (UR)" value="UR" />
              <el-option label="特性需求 (FR)" value="FR" />
              <el-option label="模块需求 (MR)" value="MR" />
              <el-option label="任务 (Task)" value="Task" />
              <el-option label="Commit" value="Commit" />
            </el-select>
            <el-select
              v-model="selectedItemId"
              placeholder="选择具体项"
              style="width: 250px"
              filterable
              @change="loadTraceability"
            >
              <el-option
                v-for="item in availableItems"
                :key="item.id"
                :label="`${item.code} - ${item.title}`"
                :value="item.id"
              />
            </el-select>
            <el-button-group>
              <el-button
                :type="direction === 'forward' ? 'primary' : ''"
                @click="direction = 'forward'"
              >
                正向追溯
              </el-button>
              <el-button
                :type="direction === 'backward' ? 'primary' : ''"
                @click="direction = 'backward'"
              >
                反向追溯
              </el-button>
              <el-button
                :type="direction === 'both' ? 'primary' : ''"
                @click="direction = 'both'"
              >
                双向追溯
              </el-button>
            </el-button-group>
            <el-button :icon="Download" @click="exportChain">导出链路</el-button>
          </el-space>
        </template>
      </el-page-header>
    </div>

    <!-- 追溯链路可视化 -->
    <el-card class="chain-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Share /></el-icon>
            追溯链路图
          </span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="horizontal">横向</el-radio-button>
            <el-radio-button label="vertical">纵向</el-radio-button>
            <el-radio-button label="graph">图形</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <!-- 横向视图 -->
      <div v-if="viewMode === 'horizontal'" class="horizontal-chain">
        <div class="chain-flow">
          <!-- UR层 -->
          <div class="chain-level" v-if="showLevel('UR')">
            <div class="level-header">
              <el-icon><Document /></el-icon>
              <span>用户需求 (UR)</span>
            </div>
            <div class="level-items">
              <el-card
                v-for="ur in urItems"
                :key="ur.id"
                shadow="hover"
                class="chain-item"
                :class="{ selected: ur.id === selectedItemId && startType === 'UR' }"
                @click="selectItem('UR', ur.id)"
              >
                <div class="item-code">{{ ur.code }}</div>
                <div class="item-title">{{ ur.title }}</div>
                <div class="item-meta">
                  <el-tag type="primary" size="small">{{ ur.status }}</el-tag>
                  <el-tag size="small">{{ ur.priority }}</el-tag>
                </div>
              </el-card>
            </div>
          </div>

          <el-icon v-if="showLevel('UR') && showLevel('FR')" class="level-arrow">
            <Right />
          </el-icon>

          <!-- FR层 -->
          <div class="chain-level" v-if="showLevel('FR')">
            <div class="level-header">
              <el-icon><Document /></el-icon>
              <span>特性需求 (FR)</span>
            </div>
            <div class="level-items">
              <el-card
                v-for="fr in frItems"
                :key="fr.id"
                shadow="hover"
                class="chain-item"
                :class="{ selected: fr.id === selectedItemId && startType === 'FR' }"
                @click="selectItem('FR', fr.id)"
              >
                <div class="item-code">{{ fr.code }}</div>
                <div class="item-title">{{ fr.title }}</div>
                <div class="item-meta">
                  <el-tag type="warning" size="small">{{ fr.status }}</el-tag>
                  <el-tag v-if="fr.featureAssetId" type="success" size="small">
                    已关联Feature
                  </el-tag>
                </div>
              </el-card>
            </div>
          </div>

          <el-icon v-if="showLevel('FR') && showLevel('MR')" class="level-arrow">
            <Right />
          </el-icon>

          <!-- MR层 -->
          <div class="chain-level" v-if="showLevel('MR')">
            <div class="level-header">
              <el-icon><Files /></el-icon>
              <span>模块需求 (MR)</span>
            </div>
            <div class="level-items">
              <el-card
                v-for="mr in mrItems"
                :key="mr.id"
                shadow="hover"
                class="chain-item"
                :class="{ selected: mr.id === selectedItemId && startType === 'MR' }"
                @click="selectItem('MR', mr.id)"
              >
                <div class="item-code">{{ mr.code }}</div>
                <div class="item-title">{{ mr.title }}</div>
                <div class="item-meta">
                  <el-tag type="info" size="small">{{ mr.status }}</el-tag>
                  <el-tag v-if="mr.assignedTeamId" type="warning" size="small">
                    {{ mr.assignedTeamId }}
                  </el-tag>
                </div>
              </el-card>
            </div>
          </div>

          <el-icon v-if="showLevel('MR') && showLevel('Task')" class="level-arrow">
            <Right />
          </el-icon>

          <!-- Task层 -->
          <div class="chain-level" v-if="showLevel('Task')">
            <div class="level-header">
              <el-icon><List /></el-icon>
              <span>任务 (Task)</span>
            </div>
            <div class="level-items">
              <el-card
                v-for="task in taskItems"
                :key="task.id"
                shadow="hover"
                class="chain-item"
                :class="{ selected: task.id === selectedItemId && startType === 'Task' }"
                @click="selectItem('Task', task.id)"
              >
                <div class="item-code">{{ task.code }}</div>
                <div class="item-title">{{ task.title }}</div>
                <div class="item-meta">
                  <el-tag :type="getTaskTypeTag(task.type)" size="small">
                    {{ task.type }}
                  </el-tag>
                </div>
              </el-card>
            </div>
          </div>

          <el-icon v-if="showLevel('Task') && showLevel('Commit')" class="level-arrow">
            <Right />
          </el-icon>

          <!-- Commit层 -->
          <div class="chain-level" v-if="showLevel('Commit')">
            <div class="level-header">
              <el-icon><Cpu /></el-icon>
              <span>代码提交 (Commit)</span>
            </div>
            <div class="level-items">
              <el-card
                v-for="commit in commitItems"
                :key="commit.id"
                shadow="hover"
                class="chain-item"
                :class="{ selected: commit.id === selectedItemId && startType === 'Commit' }"
                @click="selectItem('Commit', commit.id)"
              >
                <div class="item-code">{{ commit.hash }}</div>
                <div class="item-title">{{ commit.message }}</div>
                <div class="item-meta">
                  <el-tag :type="getCommitTypeTag(commit.type)" size="small">
                    {{ commit.type }}
                  </el-tag>
                  <el-tag size="small">{{ commit.author }}</el-tag>
                </div>
              </el-card>
            </div>
          </div>
        </div>
      </div>

      <!-- 纵向视图 -->
      <div v-else-if="viewMode === 'vertical'" class="vertical-chain">
        <el-timeline>
          <el-timeline-item
            v-for="(level, index) in verticalChainData"
            :key="index"
            :timestamp="level.label"
            placement="top"
          >
            <el-card>
              <div class="timeline-level">
                <div class="timeline-level-header">
                  <el-tag :type="level.tagType">{{ level.label }}</el-tag>
                  <span class="count">({{ level.items.length }})</span>
                </div>
                <div class="timeline-level-items">
                  <el-card
                    v-for="item in level.items"
                    :key="item.id"
                    shadow="hover"
                    class="timeline-item"
                    @click="selectItem(level.type, item.id)"
                  >
                    <div class="timeline-item-code">{{ item.code || item.hash }}</div>
                    <div class="timeline-item-title">{{ item.title || item.message }}</div>
                  </el-card>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 图形视图（使用Cytoscape.js） -->
      <div v-else class="graph-chain">
        <div id="traceability-graph" class="traceability-graph"></div>
      </div>

      <!-- 空状态 -->
      <el-empty
        v-if="!hasData"
        description="请选择起点类型和具体项以查看追溯链路"
        :image-size="150"
      />
    </el-card>

    <!-- 统计信息 -->
    <el-row :gutter="20" v-if="hasData">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="用户需求" :value="urItems.length">
            <template #prefix>
              <el-icon><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="特性需求" :value="frItems.length">
            <template #prefix>
              <el-icon><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="模块需求" :value="mrItems.length">
            <template #prefix>
              <el-icon><Files /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="代码提交" :value="commitItems.length">
            <template #prefix>
              <el-icon><Cpu /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 追溯覆盖率分析 -->
    <el-card class="coverage-card" v-if="hasData">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><DataAnalysis /></el-icon>
            追溯覆盖率分析
          </span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <div class="coverage-item">
            <div class="coverage-label">UR→FR覆盖率</div>
            <el-progress
              :percentage="calculateCoverage('UR', 'FR')"
              :color="getCoverageColor(calculateCoverage('UR', 'FR'))"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="coverage-item">
            <div class="coverage-label">FR→MR覆盖率</div>
            <el-progress
              :percentage="calculateCoverage('FR', 'MR')"
              :color="getCoverageColor(calculateCoverage('FR', 'MR'))"
            />
          </div>
        </el-col>
        <el-col :span="8">
          <div class="coverage-item">
            <div class="coverage-label">MR→Commit覆盖率</div>
            <el-progress
              :percentage="calculateCoverage('MR', 'Commit')"
              :color="getCoverageColor(calculateCoverage('MR', 'Commit'))"
            />
          </div>
        </el-col>
      </el-row>

      <el-divider />

      <div class="coverage-summary">
        <el-alert
          :title="`端到端追溯覆盖率: ${calculateEndToEndCoverage()}%`"
          :type="getAlertType(calculateEndToEndCoverage())"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>追溯完整性评估:</p>
            <ul>
              <li>完整追溯链路: {{ completeChains }}条</li>
              <li>部分追溯链路: {{ partialChains }}条</li>
              <li>缺失追溯: {{ missingLinks }}个环节</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Download,
  Share,
  Document,
  Right,
  Files,
  List,
  Cpu,
  DataAnalysis
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

// 选择状态
const startType = ref<'UR' | 'FR' | 'MR' | 'Task' | 'Commit'>('UR')
const selectedItemId = ref('')
const direction = ref<'forward' | 'backward' | 'both'>('forward')
const viewMode = ref<'horizontal' | 'vertical' | 'graph'>('horizontal')

// 数据
const urList = ref<any[]>([])
const frList = ref<any[]>([])
const mrList = ref<any[]>([])
const taskList = ref<any[]>([])
const commitList = ref<any[]>([])

// 追溯数据
const urItems = ref<any[]>([])
const frItems = ref<any[]>([])
const mrItems = ref<any[]>([])
const taskItems = ref<any[]>([])
const commitItems = ref<any[]>([])

// 可用项列表
const availableItems = computed(() => {
  const map: Record<string, any[]> = {
    UR: urList.value,
    FR: frList.value,
    MR: mrList.value,
    Task: taskList.value,
    Commit: commitList.value
  }
  return map[startType.value] || []
})

// 是否有数据
const hasData = computed(() => {
  return urItems.value.length > 0 ||
    frItems.value.length > 0 ||
    mrItems.value.length > 0 ||
    taskItems.value.length > 0 ||
    commitItems.value.length > 0
})

// 纵向链路数据
const verticalChainData = computed(() => {
  const data: any[] = []
  if (urItems.value.length > 0) {
    data.push({ type: 'UR', label: '用户需求 (UR)', tagType: 'primary', items: urItems.value })
  }
  if (frItems.value.length > 0) {
    data.push({ type: 'FR', label: '特性需求 (FR)', tagType: 'warning', items: frItems.value })
  }
  if (mrItems.value.length > 0) {
    data.push({ type: 'MR', label: '模块需求 (MR)', tagType: 'info', items: mrItems.value })
  }
  if (taskItems.value.length > 0) {
    data.push({ type: 'Task', label: '任务 (Task)', tagType: 'success', items: taskItems.value })
  }
  if (commitItems.value.length > 0) {
    data.push({ type: 'Commit', label: '代码提交 (Commit)', tagType: '', items: commitItems.value })
  }
  return data
})

// 统计数据
const completeChains = computed(() => {
  // 简化计算：假设有完整UR→FR→MR→Commit链路的数量
  return Math.min(urItems.value.length, frItems.value.length, mrItems.value.length, commitItems.value.length)
})

const partialChains = computed(() => {
  return Math.max(urItems.value.length, frItems.value.length, mrItems.value.length, commitItems.value.length) - completeChains.value
})

const missingLinks = computed(() => {
  let missing = 0
  // 简化计算
  if (urItems.value.length > frItems.value.length) missing += urItems.value.length - frItems.value.length
  if (frItems.value.length > mrItems.value.length) missing += frItems.value.length - mrItems.value.length
  if (mrItems.value.length > commitItems.value.length) missing += mrItems.value.length - commitItems.value.length
  return missing
})

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const [urRes, frRes, mrRes, commitRes] = await Promise.all([
      fetch('/biz-data/mock/requirement/user-requirements.json'),
      fetch('/biz-data/mock/requirement/feature-requirements.json'),
      fetch('/biz-data/mock/requirement/module-requirements.json'),
      fetch('/biz-data/mock/sprint/commits.json')
    ])

    const [urData, frData, mrData, commitData] = await Promise.all([
      urRes.json(),
      frRes.json(),
      mrRes.json(),
      commitRes.json()
    ])

    urList.value = urData.data || urData
    frList.value = frData.data || frData
    mrList.value = mrData.data || mrData
    commitList.value = commitData.data || commitData

    // 从路由参数加载
    if (route.params.type && route.params.id) {
      startType.value = route.params.type as any
      selectedItemId.value = route.params.id as string
      await loadTraceability()
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
})

// 显示层级
const showLevel = (level: string) => {
  const levels = ['UR', 'FR', 'MR', 'Task', 'Commit']
  const currentIndex = levels.indexOf(startType.value)
  const levelIndex = levels.indexOf(level)

  if (direction.value === 'forward') {
    return levelIndex >= currentIndex
  } else if (direction.value === 'backward') {
    return levelIndex <= currentIndex
  } else {
    return true
  }
}

// 加载追溯链路
const loadTraceability = async () => {
  if (!selectedItemId.value) return

  loading.value = true
  try {
    // 根据起点类型和方向加载追溯链路
    if (startType.value === 'UR') {
      const ur = urList.value.find(u => u.id === selectedItemId.value)
      if (ur) {
        urItems.value = [ur]
        // 正向：加载关联的FR
        if (direction.value === 'forward' || direction.value === 'both') {
          frItems.value = frList.value.filter(fr => fr.parentURId === ur.id)
          const frIds = frItems.value.map(fr => fr.id)
          mrItems.value = mrList.value.filter(mr => frIds.includes(mr.parentFRId))
          const mrIds = mrItems.value.map(mr => mr.id)
          commitItems.value = commitList.value.filter(c => mrIds.includes(c.mrId))
        }
      }
    } else if (startType.value === 'Commit') {
      const commit = commitList.value.find(c => c.id === selectedItemId.value)
      if (commit) {
        commitItems.value = [commit]
        // 反向：加载关联的MR、FR、UR
        if (direction.value === 'backward' || direction.value === 'both') {
          const mr = mrList.value.find(m => m.id === commit.mrId)
          if (mr) {
            mrItems.value = [mr]
            const fr = frList.value.find(f => f.id === mr.parentFRId)
            if (fr) {
              frItems.value = [fr]
              const ur = urList.value.find(u => u.id === fr.parentURId)
              if (ur) {
                urItems.value = [ur]
              }
            }
          }
        }
      }
    }
    // 可以扩展其他起点类型的逻辑
  } catch (error) {
    ElMessage.error('加载追溯链路失败')
  } finally {
    loading.value = false
  }
}

// 处理起点类型变更
const handleStartTypeChange = () => {
  selectedItemId.value = ''
  urItems.value = []
  frItems.value = []
  mrItems.value = []
  taskItems.value = []
  commitItems.value = []
}

// 选择项
const selectItem = (type: string, id: string) => {
  startType.value = type as any
  selectedItemId.value = id
  loadTraceability()
}

// 计算覆盖率
const calculateCoverage = (from: string, to: string) => {
  const fromMap: Record<string, any[]> = {
    UR: urItems.value,
    FR: frItems.value,
    MR: mrItems.value,
    Commit: commitItems.value
  }
  const toMap: Record<string, any[]> = {
    FR: frItems.value,
    MR: mrItems.value,
    Commit: commitItems.value
  }

  const fromItems = fromMap[from] || []
  const toItems = toMap[to] || []

  if (fromItems.length === 0) return 0
  const coverage = (toItems.length / fromItems.length) * 100
  return Math.min(100, Math.round(coverage))
}

// 计算端到端覆盖率
const calculateEndToEndCoverage = () => {
  if (urItems.value.length === 0) return 0
  const coverage = (commitItems.value.length / urItems.value.length) * 100
  return Math.min(100, Math.round(coverage))
}

// 获取覆盖率颜色
const getCoverageColor = (percentage: number) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 获取Alert类型
const getAlertType = (percentage: number) => {
  if (percentage >= 80) return 'success'
  if (percentage >= 60) return 'warning'
  return 'error'
}

// 获取Task类型标签
const getTaskTypeTag = (type: string) => {
  const map: Record<string, any> = {
    task: 'success',
    technical_task: 'warning',
    test_task: 'info',
    bug: 'danger'
  }
  return map[type] || 'info'
}

// 获取Commit类型标签
const getCommitTypeTag = (type: string) => {
  const map: Record<string, any> = {
    feature: 'primary',
    bugfix: 'danger',
    refactor: 'warning'
  }
  return map[type] || 'info'
}

// 操作函数
const goBack = () => {
  router.back()
}

const exportChain = () => {
  ElMessage.info('导出追溯链路功能开发中...')
}

// 监听direction变化
watch(direction, () => {
  if (selectedItemId.value) {
    loadTraceability()
  }
})
</script>

<style scoped lang="scss">
.full-chain-traceability {
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

  .chain-card {
    margin-bottom: 20px;
    min-height: 500px;

    .horizontal-chain {
      .chain-flow {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        overflow-x: auto;

        .level-arrow {
          font-size: 32px;
          color: #409EFF;
          margin-top: 60px;
          flex-shrink: 0;
        }

        .chain-level {
          flex: 1;
          min-width: 280px;

          .level-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 2px solid #E4E7ED;
          }

          .level-items {
            display: flex;
            flex-direction: column;
            gap: 12px;
            max-height: 500px;
            overflow-y: auto;

            .chain-item {
              cursor: pointer;
              transition: all 0.3s;
              border: 2px solid transparent;

              &:hover {
                border-color: #409EFF;
                box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
              }

              &.selected {
                border-color: #409EFF;
                background: #ECF5FF;
              }

              .item-code {
                font-size: 12px;
                color: #909399;
                margin-bottom: 4px;
              }

              .item-title {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .item-meta {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
              }
            }
          }
        }
      }
    }

    .vertical-chain {
      padding: 20px;

      .timeline-level {
        .timeline-level-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;

          .count {
            font-size: 14px;
            color: #909399;
          }
        }

        .timeline-level-items {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 12px;

          .timeline-item {
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .timeline-item-code {
              font-size: 12px;
              color: #909399;
              margin-bottom: 4px;
            }

            .timeline-item-title {
              font-size: 14px;
              font-weight: 500;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }

    .graph-chain {
      .traceability-graph {
        width: 100%;
        height: 600px;
        border: 1px solid #EBEEF5;
        border-radius: 4px;
      }
    }
  }

  .stat-card {
    margin-bottom: 20px;
  }

  .coverage-card {
    margin-bottom: 20px;

    .coverage-item {
      margin-bottom: 20px;

      .coverage-label {
        font-size: 14px;
        color: #606266;
        margin-bottom: 8px;
      }
    }

    .coverage-summary {
      margin-top: 20px;

      ul {
        margin: 12px 0 0 24px;

        li {
          margin: 8px 0;
          color: #606266;
        }
      }
    }
  }
}
</style>

