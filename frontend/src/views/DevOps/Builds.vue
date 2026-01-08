<template>
  <div class="builds-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>构建管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建构建
          </el-button>
        </div>
      </template>

      <!-- 筛选条件 -->
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="构建状态">
          <el-select v-model="filters.status" placeholder="全部" clearable>
            <el-option label="成功" value="success" />
            <el-option label="失败" value="failed" />
            <el-option label="进行中" value="running" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="模块">
          <el-select v-model="filters.module" placeholder="全部模块" clearable filterable>
            <el-option label="感知模块" value="MOD-001" />
            <el-option label="规划模块" value="MOD-007" />
            <el-option label="控制模块" value="MOD-010" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 构建列表 -->
      <el-table :data="builds" border v-loading="loading">
        <el-table-column prop="buildNumber" label="构建号" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="viewBuildDetail(row)">
              #{{ row.buildNumber }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="module" label="模块" width="150">
          <template #default="{ row }">
            <el-link type="primary" @click="goToModule(row.moduleId)">
              {{ row.module }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="branch" label="分支" width="120" />
        
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="代码提交" width="180">
          <template #default="{ row }">
            <el-tooltip :content="row.commitMessage" placement="top">
              <el-link type="primary" @click="goToCommit(row.commitId)">
                {{ row.commitId?.substring(0, 8) }}
              </el-link>
            </el-tooltip>
            <div class="commit-author">{{ row.commitAuthor }}</div>
          </template>
        </el-table-column>
        
        <el-table-column label="关联需求" width="120">
          <template #default="{ row }">
            <el-link 
              v-if="row.moduleRequirementId" 
              type="primary" 
              @click="goToRequirement(row.moduleRequirementId)"
            >
              {{ row.moduleRequirementId }}
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="duration" label="耗时" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        
        <el-table-column prop="startTime" label="开始时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.startTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewBuildDetail(row)">
              详情
            </el-button>
            <el-button link type="primary" @click="viewLogs(row)">
              日志
            </el-button>
            <el-button link type="primary" @click="viewTraceability(row)">
              追溯
            </el-button>
            <el-button 
              v-if="row.status === 'failed'"
              link 
              type="warning" 
              @click="rebuild(row)"
            >
              重建
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </el-card>

    <!-- 构建详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="构建详情" width="70%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="构建号">
          #{{ selectedBuild.buildNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(selectedBuild.status)">
            {{ getStatusLabel(selectedBuild.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="模块">
          <el-link type="primary" @click="goToModule(selectedBuild.moduleId)">
            {{ selectedBuild.module }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="分支">
          {{ selectedBuild.branch }}
        </el-descriptions-item>
        <el-descriptions-item label="代码提交" :span="2">
          <el-link type="primary" @click="goToCommit(selectedBuild.commitId)">
            {{ selectedBuild.commitId }}
          </el-link>
          <div style="margin-top: 4px; color: #909399">
            {{ selectedBuild.commitMessage }}
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="关联模块需求">
          <el-link 
            v-if="selectedBuild.moduleRequirementId"
            type="primary" 
            @click="goToRequirement(selectedBuild.moduleRequirementId)"
          >
            {{ selectedBuild.moduleRequirementId }}
          </el-link>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="触发方式">
          {{ getTriggerLabel(selectedBuild.trigger) }}
        </el-descriptions-item>
        <el-descriptions-item label="构建耗时">
          {{ formatDuration(selectedBuild.duration) }}
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ formatDateTime(selectedBuild.startTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ formatDateTime(selectedBuild.endTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="构建人">
          {{ selectedBuild.triggerBy }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 追溯关系 -->
      <el-divider content-position="left">
        <el-icon><Share /></el-icon>
        追溯关系
      </el-divider>
      <div class="traceability-section">
        <div class="trace-item">
          <div class="trace-label">代码提交</div>
          <el-link type="primary" @click="goToCommit(selectedBuild.commitId)">
            {{ selectedBuild.commitId?.substring(0, 8) }} - {{ selectedBuild.commitMessage }}
          </el-link>
        </div>
        <div class="trace-item">
          <div class="trace-label">关联模块</div>
          <el-link type="primary" @click="goToModule(selectedBuild.moduleId)">
            {{ selectedBuild.module }}
          </el-link>
        </div>
        <div class="trace-item" v-if="selectedBuild.moduleRequirementId">
          <div class="trace-label">模块需求</div>
          <el-link type="primary" @click="goToRequirement(selectedBuild.moduleRequirementId)">
            {{ selectedBuild.moduleRequirementId }}
          </el-link>
        </div>
        <div class="trace-item" v-if="selectedBuild.workItemId">
          <div class="trace-label">关联工作项</div>
          <el-link type="primary" @click="goToWorkItem(selectedBuild.workItemId)">
            {{ selectedBuild.workItemId }}
          </el-link>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="viewLogs(selectedBuild)">查看日志</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)

const filters = ref({
  status: '',
  module: '',
  dateRange: null,
})

const pagination = ref({
  currentPage: 1,
  pageSize: 20,
})

const total = ref(0)
const builds = ref<any[]>([])
const detailDialogVisible = ref(false)
const selectedBuild = ref<any>({})

const fetchBuilds = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/devops/builds.json')
    const data = await response.json()
    builds.value = data.data
    total.value = data.data.length
  } catch (error) {
    ElMessage.error('获取构建列表失败')
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    success: 'success',
    failed: 'danger',
    running: 'warning',
    cancelled: 'info',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '进行中',
    cancelled: '已取消',
  }
  return map[status] || status
}

const getTriggerLabel = (trigger: string) => {
  const map: Record<string, string> = {
    manual: '手动触发',
    auto: '自动触发',
    schedule: '定时触发',
    webhook: 'Webhook触发',
  }
  return map[trigger] || trigger
}

const formatDuration = (seconds: number) => {
  if (!seconds) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('zh-CN')
}

const handleSearch = () => {
  fetchBuilds()
}

const handleReset = () => {
  filters.value = { status: '', module: '', dateRange: null }
  fetchBuilds()
}

const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  fetchBuilds()
}

const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val
  fetchBuilds()
}

const handleCreate = () => {
  ElMessage.info('新建构建功能开发中')
}

const viewBuildDetail = (build: any) => {
  selectedBuild.value = build
  detailDialogVisible.value = true
}

const viewLogs = (build: any) => {
  ElMessage.info(`查看构建 #${build.buildNumber} 的日志`)
}

const viewTraceability = (build: any) => {
  router.push(`/requirements/traceability?buildId=${build.id}`)
}

const rebuild = (build: any) => {
  ElMessage.info(`重新构建 #${build.buildNumber}`)
}

const goToCommit = (commitId: string) => {
  ElMessage.info(`跳转到代码提交: ${commitId}`)
}

const goToModule = (moduleId: string) => {
  router.push(`/assets/modules/${moduleId}`)
}

const goToRequirement = (requirementId: string) => {
  router.push(`/requirements/module-detail/${requirementId}`)
}

const goToWorkItem = (workItemId: string) => {
  router.push(`/work-items/${workItemId}`)
}

onMounted(() => {
  fetchBuilds()
})
</script>

<style scoped lang="scss">
.builds-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-form {
  margin-bottom: 20px;
}

.commit-author {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.traceability-section {
  margin-top: 20px;
  
  .trace-item {
    margin-bottom: 12px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
    
    .trace-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }
  }
}
</style>

