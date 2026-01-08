<template>
  <div class="test-reports-container">
    <el-card>
      <template #header>
        <span>测试报告</span>
      </template>

      <el-table :data="reports" border v-loading="loading">
        <el-table-column prop="reportId" label="报告ID" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)">
              {{ row.reportId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="报告名称" min-width="200" />
        <el-table-column label="测试计划" width="130">
          <template #default="{ row }">
            <el-link type="primary" @click="goToPlan(row.planId)">
              {{ row.planId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="测试版本" width="110">
          <template #default="{ row }">
            <el-link type="primary" @click="goToBuild(row.buildVersion)">
              {{ row.buildVersion }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="通过率" width="150">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.round((row.passedCount / row.totalCount) * 100)" 
              :status="row.passedCount === row.totalCount ? 'success' : undefined"
            />
          </template>
        </el-table-column>
        <el-table-column prop="executionTime" label="执行时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.executionTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="tester" label="测试人" width="90" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="exportReport(row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const reports = ref<any[]>([])

const fetchReports = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/test/test-reports.json')
    const data = await response.json()
    reports.value = data.data
  } catch (error) {
    ElMessage.error('获取测试报告失败')
  } finally {
    loading.value = false
  }
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const viewDetail = (row: any) => ElMessage.info(`查看测试报告: ${row.reportId}`)
const exportReport = (row: any) => ElMessage.info(`导出测试报告: ${row.reportId}`)
const goToPlan = (planId: string) => ElMessage.info(`跳转到测试计划: ${planId}`)
const goToBuild = (buildVersion: string) => ElMessage.info(`跳转到构建版本: ${buildVersion}`)

onMounted(() => {
  fetchReports()
})
</script>

<style scoped lang="scss">
.test-reports-container {
  padding: 20px;
}
</style>

