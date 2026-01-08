/**
 * 系统管理类型定义
 */

// 系统配置
export interface SystemSettings {
  general: {
    systemName: string;
    version: string;
    environment: string;
    timezone: string;
    language: string;
  };
  authentication: {
    ssoEnabled: boolean;
    ldapEnabled: boolean;
    mfaRequired: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
      expiryDays: number;
    };
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    webhookEnabled: boolean;
    channels: string[];
  };
  integrations: {
    git: { type: string; url: string };
    ci: { type: string; url: string };
    sonar: { type: string; url: string };
  };
  features: {
    piPlanning: boolean;
    sprintManagement: boolean;
    codeReview: boolean;
    testManagement: boolean;
    analytics: boolean;
  };
}

// 审计日志
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'config';
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress: string;
  result: 'success' | 'failure';
}

// 通知
export interface Notification {
  id: string;
  type: 'system' | 'sprint' | 'defect' | 'review' | 'build';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  status: 'read' | 'unread';
  createdAt: string;
  recipient: string;
}

