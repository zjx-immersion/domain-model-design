import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import usersData from '@/data/users/users.json'

export const useUserStore = defineStore(
  'user',
  () => {
    const currentUser = ref<User | null>(null)
    const token = ref<string>('')

    const isLoggedIn = computed(() => !!currentUser.value && !!token.value)
    const userRole = computed(() => currentUser.value?.role || '')
    const userName = computed(() => currentUser.value?.name || '')

    // 检查认证状态
    function checkAuth() {
      // 从localStorage读取（由pinia-plugin-persistedstate自动处理）
      // 这里只需要验证token是否有效
      if (token.value && !currentUser.value) {
        // Token存在但用户信息不存在，清除token
        logout()
      }
    }

    // 登录
    function login(username: string, password: string) {
      // 模拟登录：在实际应用中这里应该调用API
      const user = usersData.find(u => u.username === username)
      
      if (user && password === '123456') {
        currentUser.value = user as User
        token.value = `mock_token_${Date.now()}`
        return { success: true, message: '登录成功' }
      }
      
      return { success: false, message: '用户名或密码错误' }
    }

    // 登出
    function logout() {
      currentUser.value = null
      token.value = ''
    }

    // 更新用户信息
    function updateUserInfo(userInfo: Partial<User>) {
      if (currentUser.value) {
        currentUser.value = { ...currentUser.value, ...userInfo }
      }
    }

    return {
      currentUser,
      token,
      isLoggedIn,
      userRole,
      userName,
      checkAuth,
      login,
      logout,
      updateUserInfo,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['currentUser', 'token'],
    },
  }
)

