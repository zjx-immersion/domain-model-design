<template>
  <div class="value-network-l3-page">
    <el-card class="header-card">
      <div class="page-header">
        <div class="title-section">
          <h2>L3操作级价值网络</h2>
          <p class="subtitle">资源投入与产出分析</p>
        </div>
        <div class="action-section">
          <el-button type="primary" :icon="Download" @click="handleExport">导出</el-button>
          <el-button :icon="Refresh" @click="handleRefresh">刷新</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="filter-card">
      <el-form :model="filterForm" inline>
        <el-form-item label="选择活动">
          <el-select v-model="filterForm.activityId" placeholder="选择活动" style="width: 200px">
            <el-option label="代码实现" value="act-4" />
            <el-option label="单元测试" value="act-5" />
            <el-option label="代码评审" value="act-6" />
          </el-select>
        </el-form-item>
        <el-form-item label="视图">
          <el-radio-group v-model="filterForm.viewType">
            <el-radio-button label="resources">资源投入</el-radio-button>
            <el-radio-button label="outputs">产出物</el-radio-button>
            <el-radio-button label="analysis">投入产出比</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="resources-card">
          <template #header>
            <span>资源投入</span>
          </template>

          <div class="resources-content">
            <div class="resource-section">
              <h4><el-icon><User /></el-icon> 人员投入</h4>
              <el-table :data="resources.personnel" size="small">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="role" label="角色" />
                <el-table-column prop="workload" label="工作量">
                  <template #default="{ row }">
                    {{ row.workload }}人天
                  </template>
                </el-table-column>
                <el-table-column prop="utilization" label="利用率">
                  <template #default="{ row }">
                    <el-progress :percentage="row.utilization" :width="60" type="circle" />
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-divider />

            <div class="resource-section">
              <h4><el-icon><Tools /></el-icon> 工具使用</h4>
              <el-table :data="resources.tools" size="small">
                <el-table-column prop="name" label="工具名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="usage" label="使用时长">
                  <template #default="{ row }">
                    {{ row.usage }}小时
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-divider />

            <div class="resource-section">
              <h4><el-icon><DataLine /></el-icon> 数据资源</h4>
              <el-table :data="resources.data" size="small">
                <el-table-column prop="name" label="数据名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="size" label="大小">
                  <template #default="{ row }">
                    {{ row.size }}MB
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="outputs-card">
          <template #header>
            <span>产出物</span>
          </template>

          <div class="outputs-content">
            <div class="output-section">
              <h4><el-icon><Document /></el-icon> 文档产出</h4>
              <el-table :data="outputs.documents" size="small">
                <el-table-column prop="name" label="文档名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="status" label="状态">
                  <template #default="{ row }">
                    <el-tag :type="getStatusType(row.status)" size="small">
                      {{ getStatusLabel(row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-divider />

            <div class="output-section">
              <h4><el-icon><Tickets /></el-icon> 代码产出</h4>
              <el-table :data="outputs.code" size="small">
                <el-table-column prop="name" label="文件名" />
                <el-table-column prop="lines" label="代码行数" />
                <el-table-column prop="coverage" label="测试覆盖率">
                  <template #default="{ row }">
                    {{ row.coverage }}%
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-divider />

            <div class="output-section">
              <h4><el-icon><Checked /></el-icon> 测试产出</h4>
              <el-table :data="outputs.tests" size="small">
                <el-table-column prop="name" label="测试名称" />
                <el-table-column prop="cases" label="用例数" />
                <el-table-column prop="passRate" label="通过率">
                  <template #default="{ row }">
                    {{ row.passRate }}%
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 投入产出分析 -->
    <el-card class="analysis-card">
      <template #header>
        <span>投入产出分析</span>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="总投入(人天)" :value="analysis.totalInput" :precision="1" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="产出物数量" :value="analysis.totalOutput" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="效率指数" :value="analysis.efficiency" :precision="2" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="质量指数" :value="analysis.quality" :precision="2" />
        </el-col>
      </el-row>

      <el-divider />

      <div class="optimization-suggestions">
        <h4>优化建议</h4>
        <el-alert
          v-for="(suggestion, index) in analysis.suggestions"
          :key="index"
          :title="suggestion.title"
          :description="suggestion.description"
          :type="suggestion.type"
          :closable="false"
          style="margin-bottom: 12px"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Refresh, User, Tools, DataLine, Document, Tickets, Checked } from '@element-plus/icons-vue'

// 过滤表单
const filterForm = reactive({
  activityId: 'act-4',
  viewType: 'resources',
})

// 资源数据
const resources = reactive({
  personnel: [
    { name: '赵强', role: '开发工程师', workload: 8, utilization: 85 },
    { name: '孙丽', role: '测试工程师', workload: 5, utilization: 75 },
    { name: '周杰', role: '评审专家', workload: 2, utilization: 60 },
  ],
  tools: [
    { name: 'VS Code', type: 'IDE', usage: 160 },
    { name: 'Git', type: '版本控制', usage: 40 },
    { name: 'Jenkins', type: 'CI/CD', usage: 20 },
  ],
  data: [
    { name: '需求文档', type: 'PDF', size: 2.5 },
    { name: '设计文档', type: 'Markdown', size: 1.2 },
    { name: '测试数据', type: 'JSON', size: 5.8 },
  ],
})

// 产出数据
const outputs = reactive({
  documents: [
    { name: '详细设计文档', type: 'Markdown', status: 'completed' },
    { name: '接口文档', type: 'Swagger', status: 'completed' },
    { name: '用户手册', type: 'PDF', status: 'in_progress' },
  ],
  code: [
    { name: 'path_planner.cpp', lines: 850, coverage: 92 },
    { name: 'path_optimizer.cpp', lines: 620, coverage: 88 },
    { name: 'utils.cpp', lines: 340, coverage: 95 },
  ],
  tests: [
    { name: '单元测试', cases: 45, passRate: 95.6 },
    { name: '集成测试', cases: 28, passRate: 92.8 },
    { name: '性能测试', cases: 12, passRate: 100 },
  ],
})

// 分析数据
const analysis = reactive({
  totalInput: 15,
  totalOutput: 15,
  efficiency: 1.2,
  quality: 0.92,
  suggestions: [
    {
      title: '提高代码复用率',
      description: '建议将通用功能抽取为公共模块，减少重复开发',
      type: 'success',
    },
    {
      title: '优化测试覆盖率',
      description: '部分模块测试覆盖率偏低，建议补充测试用例',
      type: 'warning',
    },
    {
      title: '加强文档管理',
      description: '文档更新不及时，建议建立文档同步机制',
      type: 'info',
    },
  ],
})

// 导出
const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 刷新
const handleRefresh = () => {
  ElMessage.success('数据已刷新')
}

// 获取状态类型
const getStatusType = (status: string) => {
  const typeMap: Record<string, any> = {
    draft: 'info',
    in_progress: 'warning',
    completed: 'success',
    blocked: 'danger',
  }
  return typeMap[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    draft: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    blocked: '阻塞',
  }
  return labelMap[status] || status
}
</script>

<style scoped lang="scss">
.value-network-l3-page {
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

  .resources-card,
  .outputs-card {
    margin-bottom: 20px;

    .resources-content,
    .outputs-content {
      .resource-section,
      .output-section {
        h4 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      }
    }
  }

  .analysis-card {
    .optimization-suggestions {
      h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 600;
      }
    }
  }
}
</style>

