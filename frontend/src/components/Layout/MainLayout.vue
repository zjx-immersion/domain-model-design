<template>
  <el-container class="main-layout">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
      <div class="logo" @click="router.push('/')">
        <el-icon v-if="!isCollapse"><Box /></el-icon>
        <span v-if="!isCollapse" class="logo-text">Auto DevOps</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>

        <el-sub-menu index="value-stream">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>研发价值流</span>
          </template>
          <el-menu-item index="/value-stream/main">L1主价值流</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="pi-planning">
          <template #title>
            <el-icon><Calendar /></el-icon>
            <span>PI Planning</span>
          </template>
          <el-menu-item index="/pi-planning">PI列表</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/releases/list">
          <el-icon><Memo /></el-icon>
          <template #title>版本管理</template>
        </el-menu-item>

        <el-menu-item index="/baselines/list">
          <el-icon><Collection /></el-icon>
          <template #title>特性包管理</template>
        </el-menu-item>

        <el-sub-menu index="projects">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>项目管理</span>
          </template>
          <el-menu-item index="/projects">项目列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="assets">
          <template #title>
            <el-icon><Files /></el-icon>
            <span>资产管理</span>
          </template>
          <el-menu-item index="/assets/products">领域产品</el-menu-item>
          <el-menu-item index="/assets/features">领域特性</el-menu-item>
          <el-menu-item index="/assets/modules">软件模块</el-menu-item>
          <el-menu-item index="/assets/library">资产库</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="requirements">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>需求管理</span>
          </template>
          <el-menu-item index="/requirements/user">用户需求</el-menu-item>
          <el-menu-item index="/requirements/feature">特性需求</el-menu-item>
          <el-menu-item index="/requirements/module">模块需求</el-menu-item>
          <el-menu-item index="/requirements/traceability">需求追溯</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="sprints">
          <template #title>
            <el-icon><Histogram /></el-icon>
            <span>迭代协同</span>
          </template>
          <el-menu-item index="/sprints">Sprint列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="devops">
          <template #title>
            <el-icon><SetUp /></el-icon>
            <span>DevOps</span>
          </template>
          <el-menu-item index="/devops/builds">构建管理</el-menu-item>
          <el-menu-item index="/devops/releases">发布管理</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>

      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
      </div>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-badge :value="3" class="notification">
            <el-icon><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32" :src="userStore.currentUser?.avatar" />
              <span class="user-name">{{ userStore.userName }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isCollapse = ref(false)
const activeMenu = ref(route.path)

// 面包屑
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  return matched.map(item => ({
    path: item.path,
    title: item.meta.title as string,
  }))
})

watch(
  () => route.path,
  (newPath) => {
    activeMenu.value = newPath
  }
)

function handleMenuSelect(index: string) {
  router.push(index)
}

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('退出成功')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.main-layout {
  height: 100vh;
}

.sidebar {
  background: #001529;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    gap: 8px;

    .logo-text {
      white-space: nowrap;
    }
  }

  :deep(.el-menu) {
    border-right: none;
    background-color: transparent;
    flex: 1;
    overflow-y: auto;

    // 菜单项文字和图标颜色 - 提高对比度
    .el-menu-item,
    .el-sub-menu__title {
      color: rgba(255, 255, 255, 0.85);
      
      .el-icon {
        color: rgba(255, 255, 255, 0.85);
      }

      &:hover {
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
        
        .el-icon {
          color: #fff;
        }
      }
    }

    // 激活状态
    .el-menu-item.is-active {
      color: #fff;
      background-color: $primary;
      
      .el-icon {
        color: #fff;
      }
    }

    // 子菜单项
    .el-menu-item {
      &:not(.is-active) {
        background-color: transparent;
      }
    }

    // 子菜单标题展开状态
    .el-sub-menu.is-opened > .el-sub-menu__title {
      color: #fff;
      
      .el-icon {
        color: #fff;
      }
    }

    // 子菜单箭头图标
    .el-sub-menu__icon-arrow {
      color: rgba(255, 255, 255, 0.65);
    }
  }

  .collapse-btn {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.header {
  background: #fff;
  border-bottom: 1px solid $border-light;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    flex: 1;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 24px;

    .notification {
      cursor: pointer;
      font-size: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      .user-name {
        font-size: 14px;
      }
    }
  }
}

.main-content {
  padding: 0;
  background: $bg-secondary;
  overflow-y: auto;
}
</style>

