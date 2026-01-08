<template>
  <div class="logs-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>操作日志</span>
          <div class="header-actions">
            <el-input v-model="searchText" placeholder="搜索日志" style="width: 200px" clearable />
            <el-select v-model="filterAction" placeholder="操作类型" style="width: 120px" clearable>
              <el-option label="创建" value="create" />
              <el-option label="更新" value="update" />
              <el-option label="删除" value="delete" />
              <el-option label="登录" value="login" />
              <el-option label="配置" value="config" />
            </el-select>
            <el-date-picker v-model="dateRange" type="daterange" placeholder="选择时间范围" />
          </div>
        </div>
      </template>

      <el-table :data="filteredLogs" style="width: 100%">
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column prop="user" label="操作用户" width="120" />
        <el-table-column prop="action" label="操作类型" width="100">
          <template #default="{ row }">
            <el-tag :type="getActionType(row.action)">{{ getActionLabel(row.action) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="resource" label="资源类型" width="120" />
        <el-table-column prop="resourceId" label="资源ID" width="120" />
        <el-table-column prop="details" label="操作详情" />
        <el-table-column prop="ipAddress" label="IP地址" width="140" />
        <el-table-column prop="result" label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === 'success' ? 'success' : 'danger'">
              {{ row.result === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleViewDetail(row)">详情</el-button>
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
import type { AuditLog } from '@/types/system';

const searchText = ref('');
const filterAction = ref('');
const dateRange = ref<[Date, Date]>();
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(100);

const logs = ref<AuditLog[]>([
  { id: 'LOG-001', timestamp: '2025-01-05T10:30:00Z', user: '张三', action: 'create', resource: 'Sprint', resourceId: 'SPRINT-001', details: '创建Sprint 1', ipAddress: '192.168.1.100', result: 'success' },
  { id: 'LOG-002', timestamp: '2025-01-05T11:00:00Z', user: '李四', action: 'update', resource: 'Story', resourceId: 'STORY-001', details: '更新Story状态为完成', ipAddress: '192.168.1.101', result: 'success' },
  { id: 'LOG-003', timestamp: '2025-01-05T11:30:00Z', user: '王五', action: 'delete', resource: 'Task', resourceId: 'TASK-005', details: '删除重复任务', ipAddress: '192.168.1.102', result: 'success' },
  { id: 'LOG-004', timestamp: '2025-01-05T12:00:00Z', user: '赵六', action: 'login', resource: 'System', details: '用户登录', ipAddress: '192.168.1.103', result: 'success' },
  { id: 'LOG-005', timestamp: '2025-01-05T14:00:00Z', user: 'admin', action: 'config', resource: 'System', details: '修改系统配置', ipAddress: '192.168.1.10', result: 'success' },
]);

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    if (searchText.value && !log.details.includes(searchText.value)) return false;
    if (filterAction.value && log.action !== filterAction.value) return false;
    return true;
  });
});

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN');
};

const getActionType = (action: string) => {
  const types: Record<string, any> = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    login: 'info',
    config: 'primary',
  };
  return types[action] || '';
};

const getActionLabel = (action: string) => {
  const labels: Record<string, string> = {
    create: '创建',
    update: '更新',
    delete: '删除',
    login: '登录',
    logout: '登出',
    config: '配置',
  };
  return labels[action] || action;
};

const handleViewDetail = (log: AuditLog) => {
  console.log('View log detail:', log);
};
</script>

<style scoped lang="scss">
.logs-container {
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

