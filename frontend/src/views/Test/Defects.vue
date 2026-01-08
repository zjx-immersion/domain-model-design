<template>
  <div class="defects-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>缺陷管理</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建缺陷
          </el-button>
        </div>
      </template>

      <!-- 筛选条件 -->
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="严重程度">
          <el-select v-model="filters.severity" placeholder="全部" clearable>
            <el-option label="致命" value="critical" />
            <el-option label="严重" value="major" />
            <el-option label="一般" value="minor" />
            <el-option label="轻微" value="trivial" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="全部" clearable>
            <el-option label="待修复" value="open" />
            <el-option label="修复中" value="in_progress" />
            <el-option label="待验证" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 缺陷列表 -->
      <el-table :data="defects" border v-loading="loading">
        <el-table-column prop="defectId" label="缺陷ID" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)">
              {{ row.defectId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="缺陷标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="严重程度" width="100">
          <template #default="{ row }">
            <el-tag :type="getSeverityType(row.severity)" size="small">
              {{ getSeverityLabel(row.severity) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联模块" width="130">
          <template #default="{ row }">
            <el-link type="primary" @click="goToModule(row.moduleId)">
              {{ row.module }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="关联需求" width="120">
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
        <el-table-column label="测试版本" width="110">
          <template #default="{ row }">
            <el-link type="primary" @click="goToBuild(row.buildVersion)">
              {{ row.buildVersion }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="reportedBy" label="报告人" width="90" />
        <el-table-column prop="assignedTo" label="指派给" width="90" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="viewTraceability(row)">追溯</el-button>
            <el-button link @click="updateStatus(row)">更新状态</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)

const filters = ref({
  severity: '',
  status: '',
})

const pagination = ref({
  currentPage: 1,
  pageSize: 20,
})

const total = ref(0)
const defects = ref<any[]>([])

const fetchDefects = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/test/defects.json')
    const data = await response.json()
    defects.value = data.data
    total.value = data.data.length
  } catch (error) {
    ElMessage.error('获取缺陷列表失败')
  } finally {
    loading.value = false
  }
}

const getSeverityType = (severity: string) => {
  const map: Record<string, any> = {
    critical: 'danger',
    major: 'warning',
    minor: 'primary',
    trivial: 'info',
  }
  return map[severity] || 'info'
}

const getSeverityLabel = (severity: string) => {
  const map: Record<string, string> = {
    critical: '致命',
    major: '严重',
    minor: '一般',
    trivial: '轻微',
  }
  return map[severity] || severity
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    open: 'danger',
    in_progress: 'warning',
    resolved: 'primary',
    closed: 'success',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    open: '待修复',
    in_progress: '修复中',
    resolved: '待验证',
    closed: '已关闭',
  }
  return map[status] || status
}

const handleSearch = () => fetchDefects()
const handleReset = () => {
  filters.value = { severity: '', status: '' }
  fetchDefects()
}

const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  fetchDefects()
}

const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val
  fetchDefects()
}

const handleCreate = () => ElMessage.info('新建缺陷功能开发中')
const viewDetail = (row: any) => ElMessage.info(`查看缺陷: ${row.defectId}`)
const viewTraceability = (row: any) => {
  router.push(`/requirements/traceability?defectId=${row.defectId}`)
}
const updateStatus = (row: any) => ElMessage.info(`更新缺陷状态: ${row.defectId}`)
const goToModule = (moduleId: string) => router.push(`/assets/modules/${moduleId}`)
const goToRequirement = (reqId: string) => router.push(`/requirements/module-detail/${reqId}`)
const goToBuild = (buildVersion: string) => ElMessage.info(`跳转到构建版本: ${buildVersion}`)

onMounted(() => {
  fetchDefects()
})
</script>

<style scoped lang="scss">
.defects-container {
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
</style>

