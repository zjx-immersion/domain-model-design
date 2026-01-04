<template>
  <div id="app" class="auto-devops-platform">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // 初始化用户信息
  userStore.checkAuth()
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.auto-devops-platform {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}
</style>

