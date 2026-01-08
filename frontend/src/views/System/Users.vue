<template>
  <div class="users-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-input v-model="searchText" placeholder="搜索用户" style="width: 200px" clearable />
            <el-button type="primary" @click="handleAdd">新增用户</el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)">{{ row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="team" label="所属团队" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" width="180">
          <template #default="{ row }">
            {{ row.lastLogin ? formatTime(row.lastLogin) : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" @click="handleResetPassword(row)">重置密码</el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  team: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const searchText = ref('');
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(50);

const users = ref<User[]>([
  { id: 'U001', username: 'zhangsan', name: '张三', email: 'zhangsan@company.com', role: '算法工程师', team: '感知团队', status: 'active', lastLogin: '2025-01-05T10:30:00Z' },
  { id: 'U002', username: 'lisi', name: '李四', email: 'lisi@company.com', role: '开发工程师', team: '规划团队', status: 'active', lastLogin: '2025-01-05T09:15:00Z' },
  { id: 'U003', username: 'wangwu', name: '王五', email: 'wangwu@company.com', role: '测试工程师', team: '控制团队', status: 'active', lastLogin: '2025-01-05T08:00:00Z' },
  { id: 'U004', username: 'zhaoliu', name: '赵六', email: 'zhaoliu@company.com', role: '产品经理', team: '产品团队', status: 'active', lastLogin: '2025-01-04T18:30:00Z' },
  { id: 'U005', username: 'admin', name: '管理员', email: 'admin@company.com', role: '系统管理员', team: '管理团队', status: 'active', lastLogin: '2025-01-05T14:00:00Z' },
]);

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    if (searchText.value) {
      return user.name.includes(searchText.value) || user.username.includes(searchText.value) || user.email.includes(searchText.value);
    }
    return true;
  });
});

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN');
};

const getRoleType = (role: string) => {
  const types: Record<string, any> = {
    '系统管理员': 'danger',
    '产品经理': 'warning',
    '算法工程师': 'success',
    '开发工程师': 'primary',
    '测试工程师': 'info',
  };
  return types[role] || '';
};

const handleAdd = () => {
  ElMessage.info('新增用户功能');
};

const handleEdit = (user: User) => {
  ElMessage.info(`编辑用户: ${user.name}`);
};

const handleResetPassword = (user: User) => {
  ElMessageBox.confirm(`确认重置 ${user.name} 的密码？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('密码已重置');
  });
};

const handleDelete = (user: User) => {
  ElMessageBox.confirm(`确认删除用户 ${user.name}？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('用户已删除');
  });
};
</script>

<style scoped lang="scss">
.users-container {
  padding: 20px;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-actions {
      display: flex;
      gap: 10px;
    }
  }
}
</style>

