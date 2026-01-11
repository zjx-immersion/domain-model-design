<template>
  <div class="commit-detail page-container">
    <!-- 页头 -->
    <el-page-header @back="goBack" :title="commit?.hash || 'Commit'">
      <template #content>
        <div class="header-content">
          <el-tag :type="getTypeTag(commit?.type)" size="large">
            {{ getTypeLabel(commit?.type) }}
          </el-tag>
          <span class="commit-message">{{ commit?.message }}</span>
        </div>
      </template>
      <template #extra>
        <el-space>
          <el-button :icon="CopyDocument" @click="copyHash">复制Hash</el-button>
          <el-button :icon="Download" @click="downloadDiff">下载Diff</el-button>
          <el-button type="primary" :icon="Link" @click="viewInGit">
            在Git中查看
          </el-button>
        </el-space>
      </template>
    </el-page-header>

    <!-- 基本信息卡片 -->
    <el-card class="info-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><InfoFilled /></el-icon>
            基本信息
          </span>
          <el-tag :type="getStatusType(commit?.status)">
            {{ getStatusLabel(commit?.status) }}
          </el-tag>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Commit Hash">
              <el-tag>{{ commit?.hash }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="作者">
              {{ commit?.author }} ({{ commit?.authorEmail }})
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">
              {{ formatDate(commit?.date) }}
            </el-descriptions-item>
            <el-descriptions-item label="分支">
              <el-tag type="success">{{ commit?.branch }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="标签">
              <el-tag
                v-for="tag in commit?.tags"
                :key="tag"
                size="small"
                style="margin-right: 4px"
              >
                {{ tag }}
              </el-tag>
              <span v-if="!commit?.tags || commit.tags.length === 0">-</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>

        <el-col :span="12">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="构建状态">
              <el-tag :type="getBuildStatusType(commit?.buildStatus)">
                {{ getBuildStatusLabel(commit?.buildStatus) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="测试覆盖率">
              <div v-if="commit?.testCoverage !== null" class="coverage-display">
                <el-progress
                  :percentage="commit?.testCoverage"
                  :color="getCoverageColor(commit?.testCoverage)"
                  :stroke-width="16"
                />
              </div>
              <span v-else>-</span>
            </el-descriptions-item>
            <el-descriptions-item label="审阅人">
              <el-tag
                v-for="reviewer in commit?.reviewers"
                :key="reviewer"
                type="info"
                size="small"
                style="margin-right: 4px"
              >
                {{ reviewer }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="批准人">
              <el-tag type="success">{{ commit?.approvedBy }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="合并时间">
              {{ commit?.mergedAt ? formatDate(commit.mergedAt) : '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

      <el-divider />

      <div class="description-section">
        <div class="section-title">详细描述</div>
        <div class="description-content">{{ commit?.description }}</div>
      </div>
    </el-card>

    <!-- 追溯链路卡片 -->
    <el-card class="traceability-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Share /></el-icon>
            追溯链路
          </span>
        </div>
      </template>

      <div class="traceability-flow">
        <div class="flow-item" v-if="commit?.urCode" @click="goToUR">
          <div class="flow-icon">
            <el-icon size="24"><Document /></el-icon>
          </div>
          <div class="flow-content">
            <div class="flow-label">用户需求 (UR)</div>
            <div class="flow-code">{{ commit.urCode }}</div>
          </div>
          <el-icon class="flow-arrow"><Right /></el-icon>
        </div>

        <div class="flow-item" v-if="commit?.frCode" @click="goToFR">
          <div class="flow-icon">
            <el-icon size="24"><Document /></el-icon>
          </div>
          <div class="flow-content">
            <div class="flow-label">特性需求 (FR)</div>
            <div class="flow-code">{{ commit.frCode }}</div>
          </div>
          <el-icon class="flow-arrow"><Right /></el-icon>
        </div>

        <div class="flow-item" v-if="commit?.mrCode" @click="goToMR">
          <div class="flow-icon">
            <el-icon size="24"><Files /></el-icon>
          </div>
          <div class="flow-content">
            <div class="flow-label">模块需求 (MR)</div>
            <div class="flow-code">{{ commit.mrCode }}</div>
            <div class="flow-title">{{ commit.mrTitle }}</div>
          </div>
          <el-icon class="flow-arrow"><Right /></el-icon>
        </div>

        <div class="flow-item" v-if="commit?.taskCode" @click="goToTask">
          <div class="flow-icon">
            <el-icon size="24"><List /></el-icon>
          </div>
          <div class="flow-content">
            <div class="flow-label">任务 (Task)</div>
            <div class="flow-code">{{ commit.taskCode }}</div>
            <div class="flow-title">{{ commit.taskTitle }}</div>
          </div>
          <el-icon class="flow-arrow"><Right /></el-icon>
        </div>

        <div class="flow-item active">
          <div class="flow-icon">
            <el-icon size="24"><Cpu /></el-icon>
          </div>
          <div class="flow-content">
            <div class="flow-label">代码提交 (Commit)</div>
            <div class="flow-code">{{ commit?.hash }}</div>
            <div class="flow-title">{{ commit?.message }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 代码变更统计 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic title="变更文件" :value="commit?.files || 0">
            <template #prefix>
              <el-icon><Document /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic title="新增行数" :value="commit?.additions || 0">
            <template #prefix>
              <el-icon style="color: #67C23A"><Plus /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <el-statistic title="删除行数" :value="commit?.deletions || 0">
            <template #prefix>
              <el-icon style="color: #F56C6C"><Minus /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 文件变更列表 -->
    <el-card class="files-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Folder /></el-icon>
            文件变更 ({{ commit?.changedFiles?.length || 0 }})
          </span>
        </div>
      </template>

      <el-table :data="commit?.changedFiles" style="width: 100%">
        <el-table-column prop="path" label="文件路径" min-width="300">
          <template #default="{ row }">
            <el-icon style="margin-right: 8px"><Document /></el-icon>
            <span class="file-path">{{ row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="变更类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getFileChangeType(row.type)" size="small">
              {{ getFileChangeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="additions" label="新增" width="100" align="center">
          <template #default="{ row }">
            <span style="color: #67C23A">+{{ row.additions }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deletions" label="删除" width="100" align="center">
          <template #default="{ row }">
            <span style="color: #F56C6C">-{{ row.deletions }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变更量" width="180">
          <template #default="{ row }">
            <div class="change-bar">
              <div
                class="additions-bar"
                :style="{ width: getChangePercentage(row.additions, row) + '%' }"
              ></div>
              <div
                class="deletions-bar"
                :style="{ width: getChangePercentage(row.deletions, row) + '%' }"
              ></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDiff(row)">
              查看Diff
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- CI/CD信息 -->
    <el-card class="cicd-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Connection /></el-icon>
            CI/CD信息
          </span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="CI/CD Pipeline">
          <el-tag type="info">{{ commit?.cicdPipeline }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="构建状态">
          <el-tag :type="getBuildStatusType(commit?.buildStatus)">
            {{ getBuildStatusLabel(commit?.buildStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="部署环境">
          <el-tag
            v-for="env in commit?.deployedTo"
            :key="env"
            :type="getEnvType(env)"
            size="small"
            style="margin-right: 4px"
          >
            {{ env.toUpperCase() }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Sprint">
          <el-link type="primary" @click="goToSprint">
            {{ commit?.sprintName }}
          </el-link>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 关联Commits -->
    <el-card class="related-card" v-if="relatedCommits.length > 0">
      <template #header>
        <div class="card-header">
          <span class="card-title">
            <el-icon><Connection /></el-icon>
            关联Commits ({{ relatedCommits.length }})
          </span>
        </div>
      </template>

      <div class="related-commits">
        <el-card
          v-for="relatedCommit in relatedCommits"
          :key="relatedCommit.id"
          shadow="hover"
          class="related-commit-card"
          @click="viewCommit(relatedCommit.id)"
        >
          <div class="related-commit-header">
            <el-tag :type="getTypeTag(relatedCommit.type)" size="small">
              {{ getTypeLabel(relatedCommit.type) }}
            </el-tag>
            <el-tag size="small">{{ relatedCommit.hash }}</el-tag>
          </div>
          <div class="related-commit-message">{{ relatedCommit.message }}</div>
          <div class="related-commit-meta">
            <span>{{ relatedCommit.author }}</span>
            <span>{{ formatDate(relatedCommit.date) }}</span>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  CopyDocument,
  Download,
  Link,
  InfoFilled,
  Share,
  Document,
  Right,
  Files,
  List,
  Cpu,
  Plus,
  Minus,
  Folder,
  Connection
} from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const commit = ref<any>(null)
const allCommits = ref<any[]>([])

// 关联的Commits
const relatedCommits = computed(() => {
  if (!commit.value?.relatedCommits) return []
  return allCommits.value.filter(c => commit.value.relatedCommits.includes(c.id))
})

// 加载数据
onMounted(async () => {
  loading.value = true
  try {
    const commitId = route.params.id as string
    const response = await fetch('/biz-data/mock/sprint/commits.json')
    const result = await response.json()
    allCommits.value = result.data || result
    commit.value = allCommits.value.find((c: any) => c.id === commitId)

    if (!commit.value) {
      ElMessage.error('Commit不存在')
      router.back()
    }
  } catch (error) {
    ElMessage.error('加载Commit数据失败')
  } finally {
    loading.value = false
  }
})

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss')
}

// 获取类型标签
const getTypeTag = (type: string) => {
  const map: Record<string, any> = {
    feature: 'primary',
    bugfix: 'danger',
    refactor: 'warning',
    test: 'info',
    docs: 'success',
    performance: 'warning'
  }
  return map[type] || 'info'
}

// 获取类型标签文本
const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    feature: 'Feature',
    bugfix: 'Bugfix',
    refactor: 'Refactor',
    test: 'Test',
    docs: 'Docs',
    performance: 'Performance'
  }
  return map[type] || type
}

// 获取状态类型
const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    merged: 'success',
    pending: 'warning',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    merged: '已合并',
    pending: '待审核',
    rejected: '已拒绝'
  }
  return map[status] || status
}

// 获取构建状态类型
const getBuildStatusType = (status: string) => {
  const map: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    running: 'warning'
  }
  return map[status] || 'info'
}

// 获取构建状态标签
const getBuildStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '运行中'
  }
  return map[status] || status
}

// 获取覆盖率颜色
const getCoverageColor = (coverage: number) => {
  if (coverage >= 80) return '#67C23A'
  if (coverage >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 获取文件变更类型
const getFileChangeType = (type: string) => {
  const map: Record<string, any> = {
    new: 'success',
    modified: 'warning',
    deleted: 'danger'
  }
  return map[type] || 'info'
}

// 获取文件变更标签
const getFileChangeLabel = (type: string) => {
  const map: Record<string, string> = {
    new: '新增',
    modified: '修改',
    deleted: '删除'
  }
  return map[type] || type
}

// 获取变更百分比
const getChangePercentage = (value: number, row: any) => {
  const total = row.additions + row.deletions
  if (total === 0) return 0
  return (value / total) * 100
}

// 获取环境类型
const getEnvType = (env: string) => {
  const map: Record<string, any> = {
    dev: 'info',
    test: 'warning',
    uat: 'primary',
    prod: 'success'
  }
  return map[env] || 'info'
}

// 操作函数
const goBack = () => {
  router.back()
}

const copyHash = () => {
  if (commit.value?.hash) {
    navigator.clipboard.writeText(commit.value.hash)
    ElMessage.success('已复制Hash')
  }
}

const downloadDiff = () => {
  ElMessage.info('下载Diff功能开发中...')
}

const viewInGit = () => {
  ElMessage.info('跳转到Git功能开发中...')
}

const viewDiff = (file: any) => {
  ElMessage.info(`查看${file.path}的Diff...`)
}

const viewCommit = (commitId: string) => {
  router.push(`/commits/${commitId}`)
}

const goToUR = () => {
  if (commit.value?.urId) {
    router.push(`/requirements/user/${commit.value.urId}`)
  }
}

const goToFR = () => {
  if (commit.value?.frId) {
    router.push(`/requirements/feature/${commit.value.frId}`)
  }
}

const goToMR = () => {
  if (commit.value?.mrId) {
    router.push(`/requirements/module/${commit.value.mrId}`)
  }
}

const goToTask = () => {
  if (commit.value?.taskId) {
    ElMessage.info('跳转到Task详情功能开发中...')
  }
}

const goToSprint = () => {
  if (commit.value?.sprintId) {
    ElMessage.info('跳转到Sprint详情功能开发中...')
  }
}
</script>

<style scoped lang="scss">
.commit-detail {
  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;

    .commit-message {
      font-size: 16px;
      font-weight: 500;
    }
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

  .info-card {
    margin: 20px 0;

    .description-section {
      margin-top: 20px;

      .section-title {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        margin-bottom: 12px;
      }

      .description-content {
        color: #606266;
        line-height: 1.8;
        padding: 16px;
        background: #F5F7FA;
        border-radius: 4px;
      }
    }

    .coverage-display {
      width: 100%;
    }
  }

  .traceability-card {
    margin: 20px 0;

    .traceability-flow {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #F5F7FA;
      border-radius: 4px;
      overflow-x: auto;

      .flow-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: white;
        border-radius: 8px;
        border: 2px solid #E4E7ED;
        cursor: pointer;
        transition: all 0.3s;
        min-width: 200px;
        flex-shrink: 0;

        &:hover {
          border-color: #409EFF;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
          transform: translateY(-2px);
        }

        &.active {
          border-color: #409EFF;
          background: #ECF5FF;
        }

        .flow-icon {
          color: #409EFF;
        }

        .flow-content {
          flex: 1;

          .flow-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }

          .flow-code {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .flow-title {
            font-size: 12px;
            color: #606266;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .flow-arrow {
          color: #909399;
          font-size: 20px;
          flex-shrink: 0;
        }
      }
    }
  }

  .stat-card {
    margin: 20px 0;
  }

  .files-card {
    margin: 20px 0;

    .file-path {
      font-family: monospace;
      font-size: 13px;
    }

    .change-bar {
      display: flex;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      background: #EBEEF5;

      .additions-bar {
        background: #67C23A;
      }

      .deletions-bar {
        background: #F56C6C;
      }
    }
  }

  .cicd-card {
    margin: 20px 0;
  }

  .related-card {
    margin: 20px 0;

    .related-commits {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;

      .related-commit-card {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .related-commit-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .related-commit-message {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .related-commit-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #909399;
        }
      }
    }
  }
}
</style>

