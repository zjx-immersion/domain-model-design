<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <el-icon :size="48" color="#1890ff"><Box /></el-icon>
        <h1>Auto DevOps Platform</h1>
        <p>端到端智能研发协同平台</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            size="large"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <el-alert
          title="测试账号"
          type="info"
          :closable="false"
        >
          <template #default>
            <div style="line-height: 1.8;">
              <div><strong>管理员：</strong>admin / admin123</div>
              <div><strong>开发人员：</strong>zhangsan / 123456 或 lisi / 123456</div>
              <div><strong>测试人员：</strong>wangwu / 123456</div>
              <div><strong>产品经理：</strong>zhaoliu / 123456</div>
            </div>
          </template>
        </el-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'admin',
  password: 'admin123',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

async function handleLogin() {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      setTimeout(() => {
        const result = userStore.login(loginForm.username, loginForm.password)
        loading.value = false

        if (result.success) {
          ElMessage.success(result.message)
          router.push('/dashboard')
        } else {
          ElMessage.error(result.message)
        }
      }, 500)
    }
  })
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: $radius-lg;
  padding: 40px;
  box-shadow: $shadow-lg;

  .login-header {
    text-align: center;
    margin-bottom: 40px;

    h1 {
      font-size: 24px;
      font-weight: 600;
      margin: 16px 0 8px;
      color: $text-primary;
    }

    p {
      font-size: 14px;
      color: $text-secondary;
    }
  }

  .login-form {
    margin-bottom: 24px;
  }

  .login-tips {
    :deep(.el-alert__description) {
      font-size: 12px;
      line-height: 1.8;
    }
    
    :deep(.el-alert__content) {
      strong {
        color: $primary;
        font-weight: 600;
      }
    }
  }
}
</style>

