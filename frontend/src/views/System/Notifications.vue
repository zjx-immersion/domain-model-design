<template>
  <div class="notifications-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>通知中心</span>
          <div class="header-actions">
            <el-button @click="handleMarkAllRead">全部已读</el-button>
            <el-button @click="handleClearAll">清空通知</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all">
          <div class="notification-list">
            <el-empty v-if="allNotifications.length === 0" description="暂无通知" />
            <div
              v-for="notif in allNotifications"
              :key="notif.id"
              :class="['notification-item', notif.status === 'unread' ? 'unread' : '']"
            >
              <div class="notification-header">
                <el-tag :type="getPriorityType(notif.priority)" size="small">{{ notif.priority }}</el-tag>
                <span class="notification-time">{{ formatTime(notif.createdAt) }}</span>
              </div>
              <div class="notification-title">{{ notif.title }}</div>
              <div class="notification-content">{{ notif.content }}</div>
              <div class="notification-actions">
                <el-button v-if="notif.status === 'unread'" link type="primary" size="small" @click="handleRead(notif.id)">
                  标记已读
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(notif.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="未读" name="unread">
          <div class="notification-list">
            <el-empty v-if="unreadNotifications.length === 0" description="暂无通知" />
            <div
              v-for="notif in unreadNotifications"
              :key="notif.id"
              :class="['notification-item', notif.status === 'unread' ? 'unread' : '']"
            >
              <div class="notification-header">
                <el-tag :type="getPriorityType(notif.priority)" size="small">{{ notif.priority }}</el-tag>
                <span class="notification-time">{{ formatTime(notif.createdAt) }}</span>
              </div>
              <div class="notification-title">{{ notif.title }}</div>
              <div class="notification-content">{{ notif.content }}</div>
              <div class="notification-actions">
                <el-button v-if="notif.status === 'unread'" link type="primary" size="small" @click="handleRead(notif.id)">
                  标记已读
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(notif.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="系统" name="system">
          <div class="notification-list">
            <el-empty v-if="systemNotifications.length === 0" description="暂无通知" />
            <div
              v-for="notif in systemNotifications"
              :key="notif.id"
              :class="['notification-item', notif.status === 'unread' ? 'unread' : '']"
            >
              <div class="notification-header">
                <el-tag :type="getPriorityType(notif.priority)" size="small">{{ notif.priority }}</el-tag>
                <span class="notification-time">{{ formatTime(notif.createdAt) }}</span>
              </div>
              <div class="notification-title">{{ notif.title }}</div>
              <div class="notification-content">{{ notif.content }}</div>
              <div class="notification-actions">
                <el-button v-if="notif.status === 'unread'" link type="primary" size="small" @click="handleRead(notif.id)">
                  标记已读
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(notif.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="项目" name="sprint">
          <div class="notification-list">
            <el-empty v-if="sprintNotifications.length === 0" description="暂无通知" />
            <div
              v-for="notif in sprintNotifications"
              :key="notif.id"
              :class="['notification-item', notif.status === 'unread' ? 'unread' : '']"
            >
              <div class="notification-header">
                <el-tag :type="getPriorityType(notif.priority)" size="small">{{ notif.priority }}</el-tag>
                <span class="notification-time">{{ formatTime(notif.createdAt) }}</span>
              </div>
              <div class="notification-title">{{ notif.title }}</div>
              <div class="notification-content">{{ notif.content }}</div>
              <div class="notification-actions">
                <el-button v-if="notif.status === 'unread'" link type="primary" size="small" @click="handleRead(notif.id)">
                  标记已读
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(notif.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="缺陷" name="defect">
          <div class="notification-list">
            <el-empty v-if="defectNotifications.length === 0" description="暂无通知" />
            <div
              v-for="notif in defectNotifications"
              :key="notif.id"
              :class="['notification-item', notif.status === 'unread' ? 'unread' : '']"
            >
              <div class="notification-header">
                <el-tag :type="getPriorityType(notif.priority)" size="small">{{ notif.priority }}</el-tag>
                <span class="notification-time">{{ formatTime(notif.createdAt) }}</span>
              </div>
              <div class="notification-title">{{ notif.title }}</div>
              <div class="notification-content">{{ notif.content }}</div>
              <div class="notification-actions">
                <el-button v-if="notif.status === 'unread'" link type="primary" size="small" @click="handleRead(notif.id)">
                  标记已读
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(notif.id)">
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Notification } from '@/types/system';

const formatTime = (time: string) => {
  const now = new Date();
  const notifTime = new Date(time);
  const diff = now.getTime() - notifTime.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return `${days}天前`;
};

const getPriorityType = (priority: string) => {
  const types: Record<string, any> = { high: 'danger', medium: 'warning', low: 'info' };
  return types[priority] || '';
};

const activeTab = ref('all');

const notifications = ref<Notification[]>([
  { id: 'NOTIF-001', type: 'system', title: '系统升级通知', content: '系统将于今晚22:00进行升级维护', priority: 'high', status: 'unread', createdAt: '2025-01-05T09:00:00Z', recipient: 'all' },
  { id: 'NOTIF-002', type: 'sprint', title: 'Sprint 1即将结束', content: 'Sprint 1将于明天结束，请及时完成任务', priority: 'medium', status: 'unread', createdAt: '2025-01-05T10:00:00Z', recipient: 'TEAM-001' },
  { id: 'NOTIF-003', type: 'defect', title: '发现高优先级缺陷', content: 'DEFECT-001需要立即处理', priority: 'high', status: 'read', createdAt: '2025-01-05T11:00:00Z', recipient: '算法工程师C' },
  { id: 'NOTIF-004', type: 'review', title: '代码审查请求', content: 'PR-002等待你的审查', priority: 'medium', status: 'unread', createdAt: '2025-01-05T12:00:00Z', recipient: '张三' },
  { id: 'NOTIF-005', type: 'build', title: '构建失败通知', content: 'BUILD-002构建失败', priority: 'high', status: 'read', createdAt: '2025-01-05T13:00:00Z', recipient: '李四' },
]);

const allNotifications = computed(() => notifications.value);
const unreadNotifications = computed(() => notifications.value.filter(n => n.status === 'unread'));
const systemNotifications = computed(() => notifications.value.filter(n => n.type === 'system'));
const sprintNotifications = computed(() => notifications.value.filter(n => n.type === 'sprint'));
const defectNotifications = computed(() => notifications.value.filter(n => n.type === 'defect'));

const handleMarkAllRead = () => {
  notifications.value.forEach(n => (n.status = 'read'));
  ElMessage.success('已全部标记为已读');
};

const handleClearAll = () => {
  ElMessageBox.confirm('确认清空所有通知？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    notifications.value = [];
    ElMessage.success('已清空所有通知');
  });
};

const handleRead = (id: string) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) {
    notif.status = 'read';
    ElMessage.success('已标记为已读');
  }
};

const handleDelete = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
    ElMessage.success('已删除通知');
  }
};
</script>

<style scoped lang="scss">
.notifications-container {
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
  .notification-list {
    .notification-item {
      padding: 15px;
      border-bottom: 1px solid #eee;
      &.unread {
        background-color: #f0f9ff;
      }
      .notification-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        .notification-time {
          font-size: 12px;
          color: #999;
        }
      }
      .notification-title {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .notification-content {
        color: #666;
        margin-bottom: 10px;
      }
      .notification-actions {
        display: flex;
        gap: 10px;
      }
    }
  }
}
</style>

