<template>
  <div class="automation-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>自动化测试</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建自动化测试
          </el-button>
        </div>
      </template>

      <el-table :data="automationTests" border v-loading="loading">
        <el-table-column prop="testId" label="测试ID" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)">
              {{ row.testId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="测试名称" min-width="200" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ getTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联模块" width="130">
          <template #default="{ row }">
            <el-link type="primary" @click="goToModule(row.moduleId)">
              {{ row.module }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="最近执行" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.lastStatus)" size="small">
              {{ getStatusLabel(row.lastStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成功率" width="150">
          <template #default="{ row }">
            <el-progress :percentage="row.successRate" />
          </template>
        </el-table-column>
        <el-table-column prop="executionCount" label="执行次数" width="100" align="center" />
        <el-table-column prop="lastExecutionTime" label="最后执行时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.lastExecutionTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="runTest(row)">执行</el-button>
            <el-button link @click="editTest(row)">编辑</el-button>
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

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>自动化覆盖率</span>
          </template>
          <div ref="automationCoverageChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span>执行成功率趋势</span>
          </template>
          <div ref="successRateTrendChartRef" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const router = useRouter()
const loading = ref(false)

const pagination = ref({
  currentPage: 1,
  pageSize: 20,
})

const total = ref(0)
const automationTests = ref<any[]>([])
const automationCoverageChartRef = ref<HTMLElement>()
const successRateTrendChartRef = ref<HTMLElement>()

const fetchAutomationTests = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/test/automation.json')
    const data = await response.json()
    automationTests.value = data.data
    total.value = data.data.length
  } catch (error) {
    ElMessage.error('获取自动化测试失败')
  } finally {
    loading.value = false
  }
}

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    unit: '单元测试',
    integration: '集成测试',
    e2e: '端到端测试',
    performance: '性能测试',
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    passed: 'success',
    failed: 'danger',
    running: 'warning',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    passed: '通过',
    failed: '失败',
    running: '进行中',
  }
  return map[status] || status
}

const formatDateTime = (dateStr: string) => {
  return dateStr ? new Date(dateStr).toLocaleString('zh-CN') : '-'
}

const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  fetchAutomationTests()
}

const handleCurrentChange = (val: number) => {
  pagination.value.currentPage = val
  fetchAutomationTests()
}

const handleCreate = () => ElMessage.info('新建自动化测试功能开发中')
const viewDetail = (row: any) => ElMessage.info(`查看自动化测试: ${row.testId}`)
const runTest = (row: any) => ElMessage.info(`执行自动化测试: ${row.testId}`)
const editTest = (row: any) => ElMessage.info(`编辑自动化测试: ${row.testId}`)
const goToModule = (moduleId: string) => router.push(`/products/modules/${moduleId}`)

const initCharts = () => {
  if (automationCoverageChartRef.value) {
    const chart = echarts.init(automationCoverageChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left' },
      series: [
        {
          name: '自动化覆盖率',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 456, name: '单元测试' },
            { value: 234, name: '集成测试' },
            { value: 128, name: '端到端测试' },
            { value: 89, name: '性能测试' },
          ],
        },
      ],
    })
  }

  if (successRateTrendChartRef.value) {
    const chart = echarts.init(successRateTrendChartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
      },
      yAxis: { type: 'value', name: '成功率(%)' },
      series: [
        {
          name: '成功率',
          type: 'line',
          data: [85, 88, 90, 92, 91, 93],
          smooth: true,
          areaStyle: { opacity: 0.3 },
        },
      ],
    })
  }
}

onMounted(async () => {
  await fetchAutomationTests()
  await nextTick()
  initCharts()
})
</script>

<style scoped lang="scss">
.automation-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>

