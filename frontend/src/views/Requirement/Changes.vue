<template>
  <div class="changes-container">
    <el-row class="search-bar" :gutter="20">
      <el-col :span="8"><el-input v-model="searchText" placeholder="搜索变更记录" clearable @input="handleSearch" prefix-icon="Search" /></el-col>
      <el-col :span="6">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable>
          <el-option label="全部" value="" /><el-option label="待审批" value="in_review" /><el-option label="已批准" value="approved" /><el-option label="已拒绝" value="rejected" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-select v-model="filterType" placeholder="类型筛选" clearable>
          <el-option label="全部" value="" /><el-option label="范围变更" value="scope_change" /><el-option label="技术方案" value="technical_solution" /><el-option label="进度变更" value="schedule_change" />
        </el-select>
      </el-col>
      <el-col :span="4" class="text-right"><el-button type="primary" @click="handleCreate">新建变更</el-button></el-col>
    </el-row>

    <el-table :data="filteredData" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="title" label="变更标题" min-width="200" />
      <el-table-column prop="changeType" label="变更类型" width="120"><template #default="scope"><el-tag>{{ getChangeTypeLabel(scope.row.changeType) }}</el-tag></template></el-table-column>
      <el-table-column prop="targetTitle" label="目标" width="200" show-overflow-tooltip />
      <el-table-column prop="priority" label="优先级" width="80"><template #default="scope"><el-tag :type="getPriorityType(scope.row.priority)">{{ scope.row.priority }}</el-tag></template></el-table-column>
      <el-table-column prop="status" label="状态" width="100"><template #default="scope"><el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag></template></el-table-column>
      <el-table-column prop="proposer" label="提出人" width="100" />
      <el-table-column label="操作" width="150" fixed="right"><template #default="scope"><el-button link type="primary" @click="handleView(scope.row)">查看</el-button></template></el-table-column>
    </el-table>

    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { RequirementChange } from '@/types/requirement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const rawData = ref<RequirementChange[]>([])
const searchText = ref('')
const filterStatus = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/requirement/requirement-changes.json')
    rawData.value = (await response.json()).data
  } catch (error) { ElMessage.error('加载数据失败') } finally { loading.value = false }
}

const filteredData = computed(() => {
  let data = rawData.value
  if (searchText.value) data = data.filter(item => item.title?.toLowerCase().includes(searchText.value.toLowerCase()) || item.code?.toLowerCase().includes(searchText.value.toLowerCase()))
  if (filterStatus.value) data = data.filter(item => item.status === filterStatus.value)
  if (filterType.value) data = data.filter(item => item.changeType === filterType.value)
  return data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const total = computed(() => rawData.value.length)
const handleSearch = () => { currentPage.value = 1 }
const handleView = (row: RequirementChange) => { router.push({ name: 'ChangeDetail', params: { id: row.id } }) }
const handleCreate = () => ElMessage.info('新建功能待实现')

const getChangeTypeLabel = (type: string) => ({scope_change: '范围变更', technical_solution: '技术方案', schedule_change: '进度变更', requirement_change: '需求变更', ux_optimization: 'UX优化', security_enhancement: '安全增强'}[type] || type)
const getStatusType = (status: string) => ({pending: 'info', in_review: 'warning', approved: 'success', rejected: 'danger'}[status] || 'info')
const getStatusLabel = (status: string) => ({pending: '待处理', in_review: '评审中', approved: '已批准', rejected: '已拒绝'}[status] || status)
const getPriorityType = (priority: string) => ({P0: 'danger', P1: 'warning', P2: 'info'}[priority] || 'info')

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.changes-container { padding: 20px; }
.search-bar { margin-bottom: 20px; }
.text-right { text-align: right; }
</style>

