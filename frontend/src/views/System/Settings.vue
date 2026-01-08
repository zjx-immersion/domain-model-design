<template>
  <div class="settings-container">
    <el-card class="header-card">
      <template #header>系统配置</template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="general">
          <el-form :model="settings.general" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="settings.general.systemName" />
            </el-form-item>
            <el-form-item label="系统版本">
              <el-input v-model="settings.general.version" disabled />
            </el-form-item>
            <el-form-item label="运行环境">
              <el-select v-model="settings.general.environment">
                <el-option label="生产环境" value="production" />
                <el-option label="测试环境" value="staging" />
                <el-option label="开发环境" value="development" />
              </el-select>
            </el-form-item>
            <el-form-item label="时区">
              <el-select v-model="settings.general.timezone">
                <el-option label="Asia/Shanghai" value="Asia/Shanghai" />
                <el-option label="UTC" value="UTC" />
              </el-select>
            </el-form-item>
            <el-form-item label="语言">
              <el-select v-model="settings.general.language">
                <el-option label="简体中文" value="zh-CN" />
                <el-option label="English" value="en-US" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="认证配置" name="authentication">
          <el-form :model="settings.authentication" label-width="120px">
            <el-form-item label="启用SSO">
              <el-switch v-model="settings.authentication.ssoEnabled" />
            </el-form-item>
            <el-form-item label="启用LDAP">
              <el-switch v-model="settings.authentication.ldapEnabled" />
            </el-form-item>
            <el-form-item label="要求MFA">
              <el-switch v-model="settings.authentication.mfaRequired" />
            </el-form-item>
            <el-form-item label="会话超时">
              <el-input-number v-model="settings.authentication.sessionTimeout" :min="300" :max="7200" />
              <span style="margin-left: 10px">秒</span>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="通知配置" name="notifications">
          <el-form :model="settings.notifications" label-width="120px">
            <el-form-item label="邮件通知">
              <el-switch v-model="settings.notifications.emailEnabled" />
            </el-form-item>
            <el-form-item label="短信通知">
              <el-switch v-model="settings.notifications.smsEnabled" />
            </el-form-item>
            <el-form-item label="Webhook">
              <el-switch v-model="settings.notifications.webhookEnabled" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="集成配置" name="integrations">
          <el-form :model="settings.integrations" label-width="120px">
            <el-form-item label="Git类型">
              <el-input v-model="settings.integrations.git.type" />
            </el-form-item>
            <el-form-item label="Git地址">
              <el-input v-model="settings.integrations.git.url" />
            </el-form-item>
            <el-form-item label="CI类型">
              <el-input v-model="settings.integrations.ci.type" />
            </el-form-item>
            <el-form-item label="CI地址">
              <el-input v-model="settings.integrations.ci.url" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave">保存配置</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { SystemSettings } from '@/types/system';

const activeTab = ref('general');
const settings = ref<SystemSettings>({
  general: {
    systemName: 'Auto DevOps Platform',
    version: 'v1.0.0',
    environment: 'production',
    timezone: 'Asia/Shanghai',
    language: 'zh-CN',
  },
  authentication: {
    ssoEnabled: true,
    ldapEnabled: true,
    mfaRequired: false,
    sessionTimeout: 3600,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
    },
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    webhookEnabled: true,
    channels: ['email', 'webhook', 'in-app'],
  },
  integrations: {
    git: { type: 'GitLab', url: 'https://git.company.com' },
    ci: { type: 'Jenkins', url: 'https://jenkins.company.com' },
    sonar: { type: 'SonarQube', url: 'https://sonar.company.com' },
  },
  features: {
    piPlanning: true,
    sprintManagement: true,
    codeReview: true,
    testManagement: true,
    analytics: true,
  },
});

const handleSave = () => {
  ElMessage.success('配置已保存');
};

const handleReset = () => {
  ElMessage.info('配置已重置');
};
</script>

<style scoped lang="scss">
.settings-container {
  padding: 20px;
  .form-actions {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

