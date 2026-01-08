<template>
  <div class="module-requirements-container">
    <el-row class="search-bar" :gutter="20">
      <el-col :span="8"><el-input v-model="searchText" placeholder="搜索模块需求" clearable @input="handleSearch" prefix-icon="Search" /></el-col>
      <el-col :span="6">
        <el-select v-model="filterStatus" placeholder="状态筛选" clearable>
          <el-option label="全部" value="" /><el-option label="已规划" value="planned" /><el-option label="开发中" value="in_development" /><el-option label="评审中" value="in_review" /><el-option label="已完成" value="completed" />
        </el-select>
      </el-col>
      <el-col :span="6"><el-select v-model="filterPriority" placeholder="优先级筛选" clearable><el-option label="全部" value="" /><el-option label="P0" value="P0" /><el-option label="P1" value="P1" /></el-select></el-col>
      <el-col :span="4" class="text-right"><el-button type="primary" @click="handleCreate">新建</el-button></el-col>
    </el-row>

    <el-table :data="filteredData" v-loading="loading" style="width: 100%">
      <el-table-column prop="code" label="编号" width="120" />
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="featureRequirementTitle" label="特性需求" width="200" show-overflow-tooltip />
      <el-table-column prop="moduleName" label="模块" width="150" />
      <el-table-column prop="priority" label="优先级" width="80"><template #default="scope"><el-tag :type="getPriorityType(scope.row.priority)">{{ scope.row.priority }}</el-tag></template></el-table-column>
      <el-table-column prop="status" label="状态" width="100"><template #default="scope"><el-tag :type="getStatusType(scope.row.status)">{{ getStatusLabel(scope.row.status) }}</el-tag></template></el-table-column>
      <el-table-column prop="progress" label="进度" width="120"><template #default="scope"><el-progress :percentage="Math.round(scope.row.progress * 100)" /></template></el-table-column>
      <el-table-column label="操作" width="150" fixed="right"><template #default="scope"><el-button link type="primary" @click="handleView(scope.row)">查看</el-button></template></el-table-column>
    </el-table>

    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ModuleRequirement } from '@/types/requirement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const rawData = ref<ModuleRequirement[]>([])
const searchText = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/requirement/module-requirements.json')
    rawData.value = (await response.json()).data
  } catch (error) { ElMessage.error('加载数据失败') } finally { loading.value = false }
}

const filteredData = computed(() => {
  let data = rawData.value
  if (searchText.value) data = data.filter(item => item.title?.toLowerCase().includes(searchText.value.toLowerCase()) || item.code?.toLowerCase().includes(searchText.value.toLowerCase()))
  if (filterStatus.value) data = data.filter(item => item.status === filterStatus.value)
  if (filterPriority.value) data = data.filter(item => item.priority === filterPriority.value)
  return data.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const total = computed(() => rawData.value.length)
const handleSearch = () => { currentPage.value = 1 }
const handleView = (row: ModuleRequirement) => { router.push({ name: 'ModuleRequirementDetail', params: { id: row.id } }) }
const handleCreate = () => ElMessage.info('新建功能待实现')
const getStatusType = (status: string) => ({planned: 'info', in_development: 'warning', in_review: 'primary', completed: 'success'}[status] || 'info')
const getStatusLabel = (status: string) => ({planned: '已规划', in_development: '开发中', in_review: '评审中', completed: '已完成'}[status] || status)
const getPriorityType = (priority: string) => ({P0: 'danger', P1: 'warning', P2: 'info'}[priority] || 'info')

onMounted(() => loadData())
</script>

<style scoped lang="scss">
.module-requirements-container { padding: 20px; }
.search-bar { margin-bottom: 20px; }
.text-right { text-align: right; }
</style>

