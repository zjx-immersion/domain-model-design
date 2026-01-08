<template>
  <div class="test-cases-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>测试用例管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建用例
          </el-button>
        </div>
      </template>

      <!-- 筛选条件 -->
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="模块">
          <el-select v-model="filters.module" placeholder="全部模块" clearable filterable>
            <el-option label="感知模块" value="MOD-001" />
            <el-option label="规划模块" value="MOD-007" />
            <el-option label="控制模块" value="MOD-010" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="filters.priority" placeholder="全部" clearable>
            <el-option label="P0" value="P0" />
            <el-option label="P1" value="P1" />
            <el-option label="P2" value="P2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable>
            <el-option label="通过" value="passed" />
            <el-option label="失败" value="failed" />
            <el-option label="未执行" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 测试用例列表 -->
      <el-table :data="testCases" border v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="caseId" label="用例ID" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)">
              {{ row.caseId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="用例标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="关联模块" width="150">
          <template #default="{ row }">
            <el-link type="primary" @click="goToModule(row.moduleId)">
              {{ row.module }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="关联需求" width="130">
          <template #default="{ row }">
            <el-link 
              v-if="row.requirementId"
              type="primary" 
              @click="goToRequirement(row.requirementId)"
            >
              {{ row.requirementId }}
            </el-link>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="80">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)" size="small">
              {{ row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最近执行" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.lastStatus)" size="small">
              {{ getStatusLabel(row.lastStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastExecutedTime" label="执行时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.lastExecutedTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="executeCase(row)">执行</el-button>
            <el-button link type="primary" @click="viewTraceability(row)">追溯</el-button>
            <el-button link @click="editCase(row)">编辑</el-button>
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

    <!-- 用例详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="测试用例详情" width="70%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用例ID">{{ selectedCase.caseId }}</el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(selectedCase.priority)">
            {{ selectedCase.priority }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="用例标题" :span="2">
          {{ selectedCase.title }}
        </el-descriptions-item>
        <el-descriptions-item label="关联模块">
          <el-link type="primary" @click="goToModule(selectedCase.moduleId)">
            {{ selectedCase.module }}
          </el-link>
        </el-descriptions-item>
        <el-descriptions-item label="关联需求">
          <el-link 
            v-if="selectedCase.requirementId"
            type="primary" 
            @click="goToRequirement(selectedCase.requirementId)"
          >
            {{ selectedCase.requirementId }}
          </el-link>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="测试类型">{{ selectedCase.type }}</el-descriptions-item>
        <el-descriptions-item label="自动化">
          {{ selectedCase.automated ? '是' : '否' }}
        </el-descriptions-item>
        <el-descriptions-item label="最近执行状态">
          <el-tag :type="getStatusType(selectedCase.lastStatus)">
            {{ getStatusLabel(selectedCase.lastStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最近执行时间">
          {{ formatDateTime(selectedCase.lastExecutedTime) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 追溯关系 -->
      <el-divider content-position="left">
        <el-icon><Share /></el-icon>
        追溯关系
      </el-divider>
      <div class="traceability-section">
        <div class="trace-item">
          <div class="trace-label">关联模块</div>
          <el-link type="primary" @click="goToModule(selectedCase.moduleId)">
            {{ selectedCase.module }}
          </el-link>
        </div>
        <div class="trace-item" v-if="selectedCase.requirementId">
          <div class="trace-label">模块需求</div>
          <el-link type="primary" @click="goToRequirement(selectedCase.requirementId)">
            {{ selectedCase.requirementId }}
          </el-link>
        </div>
        <div class="trace-item" v-if="selectedCase.buildVersion">
          <div class="trace-label">测试版本</div>
          <el-link type="primary" @click="goToBuild(selectedCase.buildVersion)">
            {{ selectedCase.buildVersion }}
          </el-link>
        </div>
        <div class="trace-item" v-if="selectedCase.commitId">
          <div class="trace-label">代码提交</div>
          <el-link type="primary" @click="goToCommit(selectedCase.commitId)">
            {{ selectedCase.commitId }}
          </el-link>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="executeCase(selectedCase)">执行测试</el-button>
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
  module: '',
  priority: '',
  status: '',
})

const pagination = ref({
  currentPage: 1,
  pageSize: 20,
})

const total = ref(0)
const testCases = ref<any[]>([])
const detailDialogVisible = ref(false)
const selectedCase = ref<any>({})

const fetchTestCases = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/test/test-cases.json')
    const data = await response.json()
    testCases.value = data.data
    total.value = data.data.length
  } catch (error) {
    ElMessage.error('获取测试用例失败')
  } finally {
    loading.value = false
  }
}

const getPriorityType = (priority: string) => {
  const map: Record<string, any> = {
    P0: 'danger',
    P1: 'warning',
    P2: 'primary',
  }
  return map[priority] || 'info'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    passed: 'success',
    failed: 'danger',
    pending: 'info',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    passed: '通过',
    failed: '失败',
    pending: '未执行',
  }
  return map[status] || status
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const handleSearch = () => fetchTestCases()
const handleReset = () => {
  filters.value = { module: '', priority: '', status: '' }
  fetchTestCases()
}

const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  fetchTestCases()
}

const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val
  fetchTestCases()
}

const handleCreate = () => ElMessage.info('新建测试用例功能开发中')

const viewDetail = (testCase: any) => {
  selectedCase.value = testCase
  detailDialogVisible.value = true
}

const executeCase = (testCase: any) => {
  ElMessage.info(`执行测试用例: ${testCase.caseId}`)
}

const viewTraceability = (testCase: any) => {
  router.push(`/requirements/traceability?testCaseId=${testCase.caseId}`)
}

const editCase = (testCase: any) => {
  ElMessage.info(`编辑测试用例: ${testCase.caseId}`)
}

const goToModule = (moduleId: string) => {
  router.push(`/assets/modules/${moduleId}`)
}

const goToRequirement = (requirementId: string) => {
  router.push(`/requirements/module-detail/${requirementId}`)
}

const goToBuild = (buildVersion: string) => {
  ElMessage.info(`跳转到构建版本: ${buildVersion}`)
}

const goToCommit = (commitId: string) => {
  ElMessage.info(`跳转到代码提交: ${commitId}`)
}

onMounted(() => {
  fetchTestCases()
})
</script>

<style scoped lang="scss">
.test-cases-container {
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

