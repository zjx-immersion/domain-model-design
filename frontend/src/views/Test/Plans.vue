<template>
  <div class="test-plans-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>测试计划</span>
          <el-button type="primary" icon="Plus" @click="handleCreate">
            新建计划
          </el-button>
        </div>
      </template>

      <el-table :data="testPlans" border v-loading="loading">
        <el-table-column prop="planId" label="计划ID" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="viewDetail(row)">
              {{ row.planId }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="计划名称" min-width="200" />
        <el-table-column label="关联版本" width="120">
          <template #default="{ row }">
            <el-link type="primary" @click="goToBuild(row.buildVersion)">
              {{ row.buildVersion }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="关联需求" width="130">
          <template #default="{ row }">
            <el-popover placement="top" :width="300" trigger="hover" v-if="row.requirements?.length">
              <template #reference>
                <el-tag>{{ row.requirements.length }}个需求</el-tag>
              </template>
              <div v-for="req in row.requirements" :key="req" style="margin: 4px 0">
                <el-link type="primary" size="small" @click="goToRequirement(req)">
                  {{ req }}
                </el-link>
              </div>
            </el-popover>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="200">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.round((row.passedCount / row.totalCount) * 100)" 
              :status="row.passedCount === row.totalCount ? 'success' : undefined"
            />
            <div style="font-size: 12px; color: #909399; margin-top: 4px">
              {{ row.passedCount }}/{{ row.totalCount }} 通过
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" width="110" />
        <el-table-column prop="endDate" label="结束日期" width="110" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button link type="primary" @click="execute(row)">执行</el-button>
            <el-button link type="primary" @click="viewReport(row)">报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const testPlans = ref<any[]>([])

const fetchTestPlans = async () => {
  loading.value = true
  try {
    const response = await fetch('/biz-data/mock/test/test-plans.json')
    const data = await response.json()
    testPlans.value = data.data
  } catch (error) {
    ElMessage.error('获取测试计划失败')
  } finally {
    loading.value = false
  }
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    completed: 'success',
    in_progress: 'warning',
    pending: 'info',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    completed: '已完成',
    in_progress: '进行中',
    pending: '未开始',
  }
  return map[status] || status
}

const handleCreate = () => ElMessage.info('新建测试计划功能开发中')
const viewDetail = (row: any) => ElMessage.info(`查看测试计划: ${row.planId}`)
const execute = (row: any) => ElMessage.info(`执行测试计划: ${row.planId}`)
const viewReport = (row: any) => router.push(`/test/reports?planId=${row.planId}`)
const goToBuild = (buildVersion: string) => ElMessage.info(`跳转到构建版本: ${buildVersion}`)
const goToRequirement = (reqId: string) => router.push(`/requirements/module-detail/${reqId}`)

onMounted(() => {
  fetchTestPlans()
})
</script>

<style scoped lang="scss">
.test-plans-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

