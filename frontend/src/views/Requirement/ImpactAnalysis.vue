<template>
  <div class="impact-analysis-page">
    <el-card class="header-card">
      <div class="page-header">
        <div class="title-section">
          <h2>影响分析</h2>
          <p class="subtitle">需求变更影响范围分析与风险评估</p>
        </div>
        <div class="action-section">
          <el-button type="primary" :icon="Download" @click="handleExport">
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>

    <el-card class="query-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="变更源">
          <el-select v-model="queryForm.entityType" placeholder="选择实体类型" style="width: 180px">
            <el-option label="用户需求" value="user_requirement" />
            <el-option label="特性需求" value="feature_requirement" />
            <el-option label="模块需求" value="module_requirement" />
            <el-option label="用户故事" value="story" />
          </el-select>
        </el-form-item>
        <el-form-item label="实体ID">
          <el-input v-model="queryForm.entityId" placeholder="输入实体ID" style="width: 200px" />
        </el-form-item>
        <el-form-item label="变更类型">
          <el-select v-model="queryForm.changeType" placeholder="选择变更类型" style="width: 150px">
            <el-option label="需求变更" value="requirement" />
            <el-option label="设计变更" value="design" />
            <el-option label="实现变更" value="implementation" />
            <el-option label="删除" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleAnalyze">分析影响</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card class="impact-graph-card">
          <template #header>
            <div class="card-header">
              <span>影响传播图</span>
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="tree">树形</el-radio-button>
                <el-radio-button label="network">网络</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <div ref="graphContainer" class="graph-container">
            <div v-if="impactResult" class="impact-visualization">
              <!-- 影响传播可视化 -->
              <div class="source-node">
                <div class="node-card source">
                  <el-tag type="danger" size="large">变更源</el-tag>
                  <h3>{{ impactResult.sourceNode.name }}</h3>
                  <p>{{ impactResult.sourceNode.entityId }}</p>
                </div>
              </div>

              <div class="impact-paths">
                <div
                  v-for="(path, index) in impactResult.impactPaths"
                  :key="index"
                  class="impact-path"
                  :class="`risk-${path.riskLevel}`"
                >
                  <div class="path-header">
                    <span class="path-label">影响路径 {{ index + 1 }}</span>
                    <el-tag :type="getRiskType(path.riskLevel)" size="small">
                      {{ getRiskLabel(path.riskLevel) }}风险
                    </el-tag>
                  </div>
                  <div class="path-nodes">
                    <div
                      v-for="(node, nodeIndex) in path.path"
                      :key="node.id"
                      class="path-node"
                    >
                      <div class="node-card">
                        <el-tag :type="getStatusType(node.status)" size="small">
                          {{ getStatusLabel(node.status) }}
                        </el-tag>
                        <div class="node-name">{{ node.name }}</div>
                        <div class="node-id">{{ node.entityId }}</div>
                        <div class="node-owner">负责人: {{ node.owner }}</div>
                      </div>
                      <div v-if="nodeIndex < path.path.length - 1" class="path-arrow">
                        <el-icon><Right /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <el-empty v-else description="请选择变更源并分析影响" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="risk-assessment-card">
          <template #header>
            <span>风险评估</span>
          </template>

          <div v-if="impactResult" class="risk-content">
            <div class="risk-level">
              <el-result
                :icon="getRiskIcon(impactResult.riskAssessment.level)"
                :title="getRiskLabel(impactResult.riskAssessment.level) + '风险'"
                :sub-title="`影响 ${impactResult.totalImpact} 个实体`"
              >
                <template #icon>
                  <el-icon :size="60" :color="getRiskColor(impactResult.riskAssessment.level)">
                    <component :is="getRiskIcon(impactResult.riskAssessment.level)" />
                  </el-icon>
                </template>
              </el-result>
            </div>

            <el-divider />

            <div class="risk-factors">
              <h4>风险因素</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(factor, index) in impactResult.riskAssessment.factors"
                  :key="index"
                  :timestamp="factor"
                  placement="top"
                >
                  {{ factor }}
                </el-timeline-item>
              </el-timeline>
            </div>

            <el-divider />

            <div class="suggestions">
              <h4>优化建议</h4>
              <el-alert
                v-for="(suggestion, index) in impactResult.riskAssessment.suggestions"
                :key="index"
                :title="suggestion"
                type="info"
                :closable="false"
                style="margin-bottom: 8px"
              />
            </div>
          </div>

          <el-empty v-else description="暂无风险评估结果" />
        </el-card>

        <el-card class="impact-stats-card" style="margin-top: 20px">
          <template #header>
            <span>影响统计</span>
          </template>

          <div v-if="impactResult" class="stats-content">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="总影响实体">
                {{ impactResult.totalImpact }}
              </el-descriptions-item>
              <el-descriptions-item label="影响路径数">
                {{ impactResult.impactPaths.length }}
              </el-descriptions-item>
              <el-descriptions-item label="高风险路径">
                {{ impactResult.impactPaths.filter(p => p.riskLevel === 'high').length }}
              </el-descriptions-item>
              <el-descriptions-item label="中风险路径">
                {{ impactResult.impactPaths.filter(p => p.riskLevel === 'medium').length }}
              </el-descriptions-item>
              <el-descriptions-item label="低风险路径">
                {{ impactResult.impactPaths.filter(p => p.riskLevel === 'low').length }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Search, Right, WarningFilled, Warning, InfoFilled } from '@element-plus/icons-vue'
import type { ImpactAnalysisResult, TraceNode } from '@/types/traceability'

// 查询表单
const queryForm = reactive({
  entityType: 'user_requirement',
  entityId: 'UR-NOA-001',
  changeType: 'requirement',
})

// 视图模式
const viewMode = ref<'tree' | 'network'>('tree')

// 影响分析结果
const impactResult = ref<ImpactAnalysisResult | null>(null)

// 图谱容器
const graphContainer = ref<HTMLElement>()

// 分析影响
const handleAnalyze = async () => {
  try {
    // 模拟分析结果
    const sampleResult: ImpactAnalysisResult = {
      sourceNode: {
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
      impactedNodes: [],
      impactPaths: [
        {
          path: [
            {
              id: 'fr-001',
              entityType: 'feature_requirement',
              entityId: 'FR-NOA-001',
              name: '实时路径规划算法',
              status: 'in_progress',
              layer: 2,
              owner: '李明',
              createdAt: '2025-01-02T00:00:00Z',
              updatedAt: '2025-01-04T00:00:00Z',
            },
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
              id: 'code-001',
              entityType: 'code',
              entityId: 'path_planner.cpp',
              name: '路径规划器实现',
              status: 'completed',
              layer: 5,
              owner: '赵强',
              createdAt: '2025-01-05T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
          links: [],
          riskLevel: 'high',
        },
        {
          path: [
            {
              id: 'fr-002',
              entityType: 'feature_requirement',
              entityId: 'FR-NOA-002',
              name: '路径优化策略',
              status: 'in_progress',
              layer: 2,
              owner: '王芳',
              createdAt: '2025-01-02T00:00:00Z',
              updatedAt: '2025-01-04T00:00:00Z',
            },
            {
              id: 'story-002',
              entityType: 'story',
              entityId: 'STORY-002',
              name: '实现路径优化算法',
              status: 'in_progress',
              layer: 4,
              owner: '孙丽',
              createdAt: '2025-01-04T00:00:00Z',
              updatedAt: '2025-01-10T00:00:00Z',
            },
          ],
          links: [],
          riskLevel: 'medium',
        },
      ],
      totalImpact: 5,
      riskAssessment: {
        level: 'high',
        factors: [
          '影响已完成的代码实现',
          '涉及核心算法模块',
          '多个团队成员受影响',
          '可能需要重新测试',
        ],
        suggestions: [
          '建议召开技术评审会议',
          '评估代码重构工作量',
          '更新相关测试用例',
          '通知所有相关人员',
        ],
      },
    }

    impactResult.value = sampleResult
    ElMessage.success('影响分析完成')
  } catch (error) {
    console.error('分析失败:', error)
    ElMessage.error('分析失败')
  }
}

// 重置
const handleReset = () => {
  queryForm.entityType = 'user_requirement'
  queryForm.entityId = ''
  queryForm.changeType = 'requirement'
  impactResult.value = null
}

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 获取风险类型
const getRiskType = (level: string) => {
  const typeMap: Record<string, any> = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
  }
  return typeMap[level] || 'info'
}

// 获取风险标签
const getRiskLabel = (level: string) => {
  const labelMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
  }
  return labelMap[level] || level
}

// 获取风险图标
const getRiskIcon = (level: string) => {
  const iconMap: Record<string, any> = {
    low: InfoFilled,
    medium: Warning,
    high: WarningFilled,
  }
  return iconMap[level] || InfoFilled
}

// 获取风险颜色
const getRiskColor = (level: string) => {
  const colorMap: Record<string, string> = {
    low: '#67c23a',
    medium: '#e6a23c',
    high: '#f56c6c',
  }
  return colorMap[level] || '#909399'
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
</script>

<style scoped lang="scss">
.impact-analysis-page {
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

  .query-card {
    margin-bottom: 20px;
  }

  .impact-graph-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .graph-container {
      min-height: 600px;

      .impact-visualization {
        .source-node {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;

          .node-card.source {
            padding: 20px;
            border: 2px solid var(--el-color-danger);
            border-radius: 8px;
            background-color: var(--el-color-danger-light-9);
            text-align: center;

            h3 {
              margin: 12px 0 8px 0;
              font-size: 18px;
            }

            p {
              margin: 0;
              color: var(--el-text-color-secondary);
            }
          }
        }

        .impact-paths {
          display: flex;
          flex-direction: column;
          gap: 24px;

          .impact-path {
            padding: 16px;
            border-radius: 8px;
            border: 2px solid var(--el-border-color);

            &.risk-high {
              border-color: var(--el-color-danger);
              background-color: var(--el-color-danger-light-9);
            }

            &.risk-medium {
              border-color: var(--el-color-warning);
              background-color: var(--el-color-warning-light-9);
            }

            &.risk-low {
              border-color: var(--el-color-success);
              background-color: var(--el-color-success-light-9);
            }

            .path-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 16px;

              .path-label {
                font-weight: 600;
                font-size: 14px;
              }
            }

            .path-nodes {
              display: flex;
              align-items: center;
              gap: 12px;
              overflow-x: auto;

              .path-node {
                display: flex;
                align-items: center;
                gap: 12px;

                .node-card {
                  padding: 12px;
                  border: 1px solid var(--el-border-color);
                  border-radius: 6px;
                  background-color: white;
                  min-width: 160px;

                  .node-name {
                    margin: 8px 0 4px 0;
                    font-weight: 600;
                    font-size: 13px;
                  }

                  .node-id {
                    margin: 4px 0;
                    font-size: 12px;
                    color: var(--el-text-color-secondary);
                  }

                  .node-owner {
                    margin: 4px 0 0 0;
                    font-size: 11px;
                    color: var(--el-text-color-placeholder);
                  }
                }

                .path-arrow {
                  font-size: 20px;
                  color: var(--el-text-color-secondary);
                }
              }
            }
          }
        }
      }
    }
  }

  .risk-assessment-card {
    .risk-content {
      .risk-level {
        text-align: center;
      }

      .risk-factors,
      .suggestions {
        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
  }

  .impact-stats-card {
    .stats-content {
      font-size: 13px;
    }
  }
}
</style>

