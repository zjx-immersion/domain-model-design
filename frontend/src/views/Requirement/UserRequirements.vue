<template>
  <div class="user-requirements page-container">
    <div class="page-header">
      <h1>用户需求管理</h1>
      <p class="description">管理和跟踪所有用户需求</p>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="searchKey"
        placeholder="搜索需求标题或编号"
        prefix-icon="Search"
        style="width: 300px"
        clearable
      />
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable style="width: 150px">
        <el-option label="草稿" value="draft" />
        <el-option label="评审中" value="in_review" />
        <el-option label="已批准" value="approved" />
        <el-option label="开发中" value="in_development" />
        <el-option label="已完成" value="completed" />
      </el-select>
      <el-select v-model="priorityFilter" placeholder="优先级筛选" clearable style="width: 150px">
        <el-option label="高" value="high" />
        <el-option label="中" value="medium" />
        <el-option label="低" value="low" />
      </el-select>
      <el-button type="primary" icon="Plus" @click="handleCreate">创建用户需求</el-button>
    </div>

    <el-table :data="requirements" stripe @row-click="viewRequirement">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="code" label="需求编号" width="150" fixed="left" />
      <el-table-column prop="title" label="需求标题" min-width="250" fixed="left">
        <template #default="{ row }">
          <div class="requirement-title">
            <strong>{{ row.title }}</strong>
            <div class="tags">
              <el-tag v-for="tag in row.tags" :key="tag" size="small" effect="plain">
                {{ tag }}
              </el-tag>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="priority" label="优先级" width="100">
        <template #default="{ row }">
          <el-tag :type="getPriorityType(row.priority)" size="small">
            {{ row.priority }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="productName" label="关联产品" width="180" />
      <el-table-column prop="owner" label="负责人" width="120" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />

      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" size="small" @click.stop="viewRequirement(row)">
            查看
          </el-button>
          <el-button text type="primary" size="small" @click.stop="decompose(row)">
            拆解
          </el-button>
          <el-dropdown @command="(cmd) => handleCommand(cmd, row)">
            <el-button text icon="More" size="small" @click.stop />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="review">提交评审</el-dropdown-item>
                <el-dropdown-item command="trace">需求追溯</el-dropdown-item>
                <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="requirements.length === 0" description="暂无需求" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const searchKey = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// 模拟需求数据
const requirements = ref([
  {
    id: 'UR001',
    code: 'UR-NOA-001',
    title: 'NOA系统需支持高速公路自动驾驶',
    status: 'approved',
    priority: '高',
    productName: 'NOA v3.1',
    owner: '李明',
    tags: ['核心功能', '高速场景'],
    createdAt: '2024-06-01 10:00:00',
  },
  {
    id: 'UR002',
    code: 'UR-NOA-002',
    title: '提升感知系统准确率到95%',
    status: 'in_development',
    priority: '高',
    productName: 'NOA v3.1',
    owner: '张伟',
    tags: ['性能优化', '感知'],
    createdAt: '2024-06-05 14:30:00',
  },
  {
    id: 'UR003',
    code: 'UR-NOA-003',
    title: '支持复杂交通场景识别',
    status: 'in_review',
    priority: '中',
    productName: 'NOA v3.1',
    owner: '王芳',
    tags: ['场景扩展'],
    createdAt: '2024-06-10 09:15:00',
  },
])

function getStatusType(status: string) {
  const typeMap: Record<string, any> = {
    draft: 'info',
    in_review: 'warning',
    approved: 'success',
    in_development: 'primary',
    completed: 'success',
  }
  return typeMap[status] || 'info'
}

function getStatusText(status: string) {
  const textMap: Record<string, string> = {
    draft: '草稿',
    in_review: '评审中',
    approved: '已批准',
    in_development: '开发中',
    completed: '已完成',
  }
  return textMap[status] || status
}

function getPriorityType(priority: string) {
  const typeMap: Record<string, any> = {
    高: 'danger',
    中: 'warning',
    低: 'info',
  }
  return typeMap[priority] || 'info'
}

function viewRequirement(row: any) {
  router.push(`/requirements/user/${row.id}`)
}

function decompose(row: any) {
  ElMessage.info(`拆解需求: ${row.title}`)
  router.push({ path: '/requirements/feature', query: { userRequirementId: row.id } })
}

function handleCreate() {
  ElMessage.info('创建用户需求功能开发中...')
}

function handleCommand(command: string, row: any) {
  switch (command) {
    case 'edit':
      ElMessage.info(`编辑需求: ${row.title}`)
      break
    case 'review':
      ElMessage.success(`提交评审: ${row.title}`)
      break
    case 'trace':
      router.push({ path: '/requirements/traceability', query: { requirementId: row.id } })
      break
    case 'delete':
      ElMessageBox.confirm(`确定删除需求 ${row.title} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        ElMessage.success('删除成功')
      })
      break
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.user-requirements {
  .filter-bar {
    display: flex;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    align-items: center;
  }

  .requirement-title {
    strong {
      display: block;
      margin-bottom: 4px;
    }

    .tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }

  :deep(.el-table__row) {
    cursor: pointer;

    &:hover {
      background-color: $bg-hover;
    }
  }
}
</style>

