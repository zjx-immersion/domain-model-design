<template>
  <div class="decomposition-flow page-container">
    <!-- 页头 -->
    <div class="page-header">
      <el-page-header @back="goBack" content="需求分解流程">
        <template #extra>
          <el-space>
            <el-button type="primary" :icon="Plus" @click="startDecomposition">
              新建分解
            </el-button>
            <el-button :icon="Download" @click="exportFlow">
              导出流程图
            </el-button>
          </el-space>
        </template>
      </el-page-header>
    </div>

    <!-- 流程图展示区 -->
    <el-card class="flow-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Share /></el-icon>
            UR → FR → MR 分解流程
          </span>
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="graph">流程图</el-radio-button>
            <el-radio-button label="tree">树形</el-radio-button>
            <el-radio-button label="timeline">时间线</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <!-- 流程图视图 -->
      <div v-if="viewMode === 'graph'" class="flow-graph">
        <div class="flow-steps">
          <!-- UR层 -->
          <div class="flow-step">
            <div class="step-header">
              <el-icon><DocumentCopy /></el-icon>
              <span>用户需求 (UR)</span>
            </div>
            <div class="step-content">
              <el-select
                v-model="selectedUR"
                placeholder="选择UR"
                filterable
                style="width: 100%"
                @change="handleURChange"
              >
                <el-option
                  v-for="ur in urList"
                  :key="ur.id"
                  :label="`${ur.code} - ${ur.title}`"
                  :value="ur.id"
                />
              </el-select>
              <div v-if="selectedUR" class="selected-item">
                <el-card shadow="hover">
                  <div class="item-code">{{ currentUR?.code }}</div>
                  <div class="item-title">{{ currentUR?.title }}</div>
                  <el-tag type="primary" size="small">{{ currentUR?.status }}</el-tag>
                </el-card>
              </div>
            </div>
          </div>

          <el-icon class="arrow-icon"><Right /></el-icon>

          <!-- FR层 -->
          <div class="flow-step">
            <div class="step-header">
              <el-icon><Document /></el-icon>
              <span>特性需求 (FR)</span>
              <el-button
                v-if="selectedUR"
                type="primary"
                size="small"
                :icon="Plus"
                circle
                @click="addFR"
              />
            </div>
            <div class="step-content">
              <div v-if="frList.length === 0" class="empty-hint">
                <el-empty description="请先选择UR，然后添加FR" :image-size="60" />
              </div>
              <div v-else class="items-list">
                <el-card
                  v-for="fr in frList"
                  :key="fr.id"
                  shadow="hover"
                  class="item-card"
                  :class="{ selected: selectedFR === fr.id }"
                  @click="selectFR(fr.id)"
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
          </div>

          <el-icon class="arrow-icon"><Right /></el-icon>

          <!-- MR层 -->
          <div class="flow-step">
            <div class="step-header">
              <el-icon><Files /></el-icon>
              <span>模块需求 (MR)</span>
              <el-button
                v-if="selectedFR"
                type="primary"
                size="small"
                :icon="Plus"
                circle
                @click="addMR"
              />
            </div>
            <div class="step-content">
              <div v-if="mrList.length === 0" class="empty-hint">
                <el-empty description="请先选择FR，然后添加MR" :image-size="60" />
              </div>
              <div v-else class="items-list">
                <el-card
                  v-for="mr in mrList"
                  :key="mr.id"
                  shadow="hover"
                  class="item-card"
                  :class="{ selected: selectedMR === mr.id }"
                  @click="selectMR(mr.id)"
                >
                  <div class="item-code">{{ mr.code }}</div>
                  <div class="item-title">{{ mr.title }}</div>
                  <div class="item-meta">
                    <el-tag type="info" size="small">{{ mr.status }}</el-tag>
                    <el-tag v-if="mr.moduleId" type="success" size="small">
                      已关联Module
                    </el-tag>
                    <el-tag v-if="mr.assignedTeamId" type="warning" size="small">
                      {{ mr.assignedTeamId }}
                    </el-tag>
                  </div>
                </el-card>
              </div>
            </div>
          </div>

          <el-icon class="arrow-icon"><Right /></el-icon>

          <!-- Task层 -->
          <div class="flow-step">
            <div class="step-header">
              <el-icon><List /></el-icon>
              <span>任务 (Task)</span>
            </div>
            <div class="step-content">
              <div v-if="taskList.length === 0" class="empty-hint">
                <el-empty description="请先选择MR查看关联的Task" :image-size="60" />
              </div>
              <div v-else class="items-list">
                <el-card
                  v-for="task in taskList"
                  :key="task.id"
                  shadow="hover"
                  class="item-card small"
                >
                  <div class="item-code">{{ task.code }}</div>
                  <div class="item-title">{{ task.title }}</div>
                  <el-tag :type="getTaskTypeTag(task.type)" size="small">
                    {{ task.type }}
                  </el-tag>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 树形视图 -->
      <div v-else-if="viewMode === 'tree'" class="tree-view">
        <el-tree
          :data="treeData"
          :props="{ label: 'title', children: 'children' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <el-tag :type="getNodeType(data.type)" size="small">{{ data.type }}</el-tag>
              <span class="node-code">{{ data.code }}</span>
              <span class="node-title">{{ data.title }}</span>
              <el-tag v-if="data.status" size="small">{{ data.status }}</el-tag>
            </div>
          </template>
        </el-tree>
      </div>

      <!-- 时间线视图 -->
      <div v-else class="timeline-view">
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in timelineData"
            :key="index"
            :timestamp="item.timestamp"
            placement="top"
          >
            <el-card>
              <div class="timeline-item-header">
                <el-tag :type="getNodeType(item.type)">{{ item.type }}</el-tag>
                <span class="timeline-item-code">{{ item.code }}</span>
              </div>
              <div class="timeline-item-body">
                <p class="timeline-item-title">{{ item.title }}</p>
                <p class="timeline-item-desc">{{ item.description }}</p>
              </div>
              <div class="timeline-item-footer">
                <span>负责人: {{ item.owner }}</span>
                <el-tag size="small">{{ item.status }}</el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>

    <!-- 影响分析区 -->
    <el-card class="impact-card" v-if="selectedMR">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Warning /></el-icon>
            影响分析
          </span>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="影响的Team" :value="impactAnalysis.affectedTeams">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="影响的Sprint" :value="impactAnalysis.affectedSprints">
            <template #prefix>
              <el-icon><Calendar /></el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="影响的Module" :value="impactAnalysis.affectedModules">
            <template #prefix>
              <el-icon><Box /></el-icon>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <el-divider />

      <div class="impact-details">
        <el-alert
          title="需求变更影响"
          type="warning"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>该MR的变更将影响:</p>
            <ul>
              <li>{{ impactAnalysis.affectedTeams }} 个团队的工作安排</li>
              <li>{{ impactAnalysis.affectedSprints }} 个Sprint的规划</li>
              <li>{{ impactAnalysis.affectedModules }} 个Module的开发进度</li>
              <li>预计增加 {{ impactAnalysis.estimatedDelay }} 个工作日</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- 分解历史 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Clock /></el-icon>
            分解历史
          </span>
        </div>
      </template>

      <el-table :data="decompositionHistory" style="width: 100%">
        <el-table-column prop="timestamp" label="时间" width="180" />
        <el-table-column prop="type" label="操作类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.type)" size="small">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="from" label="源需求" width="150" />
        <el-table-column prop="to" label="目标需求" width="150" />
        <el-table-column prop="operator" label="操作人" width="100" />
        <el-table-column prop="description" label="说明" min-width="200" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Plus,
  Download,
  Share,
  Right,
  DocumentCopy,
  Document,
  Files,
  List,
  Warning,
  User,
  Calendar,
  Box,
  Clock
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()

// 视图模式
const viewMode = ref<'graph' | 'tree' | 'timeline'>('graph')

// 选中的需求
const selectedUR = ref('')
const selectedFR = ref('')
const selectedMR = ref('')

// 需求数据
const urList = ref<any[]>([])
const frList = ref<any[]>([])
const mrList = ref<any[]>([])
const taskList = ref<any[]>([])

// 当前选中的UR
const currentUR = computed(() => {
  return urList.value.find(ur => ur.id === selectedUR.value)
})

// 树形数据
const treeData = computed(() => {
  if (!currentUR.value) return []

  return [
    {
      id: currentUR.value.id,
      type: 'UR',
      code: currentUR.value.code,
      title: currentUR.value.title,
      status: currentUR.value.status,
      children: frList.value.map(fr => ({
        id: fr.id,
        type: 'FR',
        code: fr.code,
        title: fr.title,
        status: fr.status,
        children: mrList.value
          .filter(mr => mr.parentFRId === fr.id)
          .map(mr => ({
            id: mr.id,
            type: 'MR',
            code: mr.code,
            title: mr.title,
            status: mr.status,
            children: taskList.value
              .filter(task => task.parentMRId === mr.id)
              .map(task => ({
                id: task.id,
                type: 'Task',
                code: task.code,
                title: task.title,
                status: task.status
              }))
          }))
      }))
    }
  ]
})

// 时间线数据
const timelineData = computed(() => {
  const events: any[] = []

  if (currentUR.value) {
    events.push({
      type: 'UR',
      code: currentUR.value.code,
      title: currentUR.value.title,
      description: currentUR.value.description,
      owner: currentUR.value.owner,
      status: currentUR.value.status,
      timestamp: currentUR.value.createdAt
    })

    frList.value.forEach(fr => {
      events.push({
        type: 'FR',
        code: fr.code,
        title: fr.title,
        description: fr.description,
        owner: fr.owner,
        status: fr.status,
        timestamp: fr.createdAt
      })
    })

    mrList.value.forEach(mr => {
      events.push({
        type: 'MR',
        code: mr.code,
        title: mr.title,
        description: mr.description,
        owner: mr.owner,
        status: mr.status,
        timestamp: mr.createdAt
      })
    })
  }

  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
})

// 影响分析
const impactAnalysis = ref({
  affectedTeams: 2,
  affectedSprints: 3,
  affectedModules: 5,
  estimatedDelay: 4
})

// 分解历史
const decompositionHistory = ref([
  {
    timestamp: '2026-01-10 14:30:00',
    type: 'UR→FR',
    from: 'UR-001',
    to: 'FR-001, FR-002',
    operator: '张三',
    description: 'AVP用户需求分解为2个特性需求'
  },
  {
    timestamp: '2026-01-10 15:20:00',
    type: 'FR→MR',
    from: 'FR-001',
    to: 'MR-001, MR-002, MR-003',
    operator: '李四',
    description: '自动泊车特性分解为3个模块需求'
  }
])

// 加载数据
onMounted(async () => {
  try {
    const urResponse = await fetch('/biz-data/mock/requirement/user-requirements.json')
    const urData = await urResponse.json()
    urList.value = urData.data || urData

    const frResponse = await fetch('/biz-data/mock/requirement/feature-requirements.json')
    const frData = await frResponse.json()
    frList.value = frData.data || frData

    const mrResponse = await fetch('/biz-data/mock/requirement/module-requirements.json')
    const mrData = await mrResponse.json()
    mrList.value = mrData.data || mrData
  } catch (error) {
    ElMessage.error('加载需求数据失败')
  }
})

// UR变更处理
const handleURChange = (urId: string) => {
  // 加载该UR下的FR
  frList.value = frList.value.filter(fr => fr.parentURId === urId)
  selectedFR.value = ''
  selectedMR.value = ''
  mrList.value = []
  taskList.value = []
}

// 选择FR
const selectFR = (frId: string) => {
  selectedFR.value = frId
  // 加载该FR下的MR
  mrList.value = mrList.value.filter(mr => mr.parentFRId === frId)
  selectedMR.value = ''
  taskList.value = []
}

// 选择MR
const selectMR = (mrId: string) => {
  selectedMR.value = mrId
  // 加载该MR下的Task（模拟）
  taskList.value = [
    { id: '1', code: 'TASK-001', title: '实现自动泊车算法', type: 'technical_task', status: 'in_progress' },
    { id: '2', code: 'TASK-002', title: '编写单元测试', type: 'test_task', status: 'todo' }
  ]
}

// 添加FR
const addFR = () => {
  ElMessage.info('添加FR功能开发中...')
}

// 添加MR
const addMR = () => {
  ElMessage.info('添加MR功能开发中...')
}

// 新建分解
const startDecomposition = () => {
  ElMessage.info('新建分解功能开发中...')
}

// 导出流程图
const exportFlow = () => {
  ElMessage.success('导出流程图功能开发中...')
}

// 获取节点类型颜色
const getNodeType = (type: string) => {
  const map: Record<string, any> = {
    'UR': 'primary',
    'FR': 'warning',
    'MR': 'info',
    'Task': 'success'
  }
  return map[type] || 'info'
}

// 获取Task类型标签
const getTaskTypeTag = (type: string) => {
  const map: Record<string, any> = {
    'task': 'success',
    'technical_task': 'warning',
    'test_task': 'info',
    'bug': 'danger'
  }
  return map[type] || 'info'
}

// 获取操作类型
const getActionType = (type: string) => {
  const map: Record<string, any> = {
    'UR→FR': 'primary',
    'FR→MR': 'warning',
    'MR→Task': 'success'
  }
  return map[type] || 'info'
}

// 返回
const goBack = () => {
  router.push('/requirements')
}
</script>

<style scoped lang="scss">
.decomposition-flow {
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

  .flow-card {
    margin-bottom: 20px;

    .flow-graph {
      .flow-steps {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        overflow-x: auto;

        .arrow-icon {
          font-size: 32px;
          color: #409EFF;
          margin-top: 60px;
          flex-shrink: 0;
        }

        .flow-step {
          flex: 1;
          min-width: 280px;
          border: 2px solid #E4E7ED;
          border-radius: 8px;
          padding: 16px;
          background: #FAFAFA;

          .step-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #E4E7ED;
          }

          .step-content {
            .selected-item {
              margin-top: 12px;

              .item-code {
                font-size: 12px;
                color: #909399;
                margin-bottom: 4px;
              }

              .item-title {
                font-size: 14px;
                font-weight: 500;
                margin-bottom: 8px;
              }
            }

            .empty-hint {
              padding: 20px 0;
            }

            .items-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
              max-height: 400px;
              overflow-y: auto;

              .item-card {
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

                &.small {
                  padding: 8px;

                  :deep(.el-card__body) {
                    padding: 8px;
                  }
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
    }

    .tree-view {
      padding: 20px;

      .tree-node {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;

        .node-code {
          color: #909399;
        }

        .node-title {
          flex: 1;
          font-weight: 500;
        }
      }
    }

    .timeline-view {
      padding: 20px;

      .timeline-item-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;

        .timeline-item-code {
          font-weight: 500;
        }
      }

      .timeline-item-body {
        margin: 12px 0;

        .timeline-item-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .timeline-item-desc {
          color: #606266;
          line-height: 1.6;
        }
      }

      .timeline-item-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #EBEEF5;
        color: #909399;
        font-size: 13px;
      }
    }
  }

  .impact-card {
    margin-bottom: 20px;

    .impact-details {
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

  .history-card {
    margin-bottom: 20px;
  }
}
</style>

