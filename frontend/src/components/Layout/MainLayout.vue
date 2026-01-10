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
        <!-- 工作台 -->
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>工作台</template>
        </el-menu-item>

        <!-- 产品中心 - 新增核心视角 -->
        <el-sub-menu index="products">
          <template #title>
            <el-icon><Box /></el-icon>
            <span>产品中心</span>
          </template>
          <el-menu-item index="/products/overview">📊 产品资产全景</el-menu-item>
          <el-menu-item index="/products/lines">产品线管理</el-menu-item>
          <el-menu-item index="/products/list">领域产品管理</el-menu-item>
          <el-menu-item index="/releases/list">产品版本管理</el-menu-item>
          <el-menu-item index="/products/features">领域特性管理</el-menu-item>
          <el-menu-item index="/products/modules">软件模块管理</el-menu-item>
          <el-menu-item index="/baselines/list">特性包管理</el-menu-item>
          <el-menu-item index="/assets/library">资产库</el-menu-item>
        </el-sub-menu>

        <!-- 项目中心 - 新增核心视角 -->
        <el-sub-menu index="projects">
          <template #title>
            <el-icon><Histogram /></el-icon>
            <span>项目中心</span>
          </template>
          <el-menu-item index="/projects/overview">📊 项目全景图</el-menu-item>
          <el-menu-item index="/projects/vehicle">车型项目管理</el-menu-item>
          <el-menu-item index="/projects/domain">领域项目管理</el-menu-item>
          <el-menu-item index="/pi-planning">PI Planning管理</el-menu-item>
          <el-menu-item index="/backlog/project">项目待办管理</el-menu-item>
          <el-menu-item index="/backlog/team">团队待办管理</el-menu-item>
        </el-sub-menu>

        <!-- 团队工作台 - 新增核心视角 -->
        <el-sub-menu index="team">
          <template #title>
            <el-icon><User /></el-icon>
            <span>团队工作台</span>
          </template>
          <el-menu-item index="/team/workspace">📊 团队工作全景</el-menu-item>
          <el-menu-item index="/sprints">Sprint管理</el-menu-item>
          <el-menu-item index="/team/work-items">工作项管理</el-menu-item>
          <el-menu-item index="/team/bugs">缺陷管理</el-menu-item>
          <el-menu-item index="/team/tech-debt">技术债管理</el-menu-item>
          <el-menu-item index="/team/metrics">团队效能</el-menu-item>
        </el-sub-menu>

        <!-- 需求管理 - 保留但调整 -->
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

        <!-- 研发价值流 - 保留 -->
        <el-sub-menu index="value-stream">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>研发价值流</span>
          </template>
          <el-menu-item index="/value-stream/main">L1主价值流</el-menu-item>
          <el-menu-item index="/value-stream/product-planning">L2产品规划</el-menu-item>
          <el-menu-item index="/value-stream/requirement-analysis">L2需求分析</el-menu-item>
          <el-menu-item index="/value-stream/project-planning">L2项目规划</el-menu-item>
          <el-menu-item index="/value-stream/iteration-rd">L2迭代研发</el-menu-item>
          <el-menu-item index="/value-stream/integration">L2集成晋级</el-menu-item>
          <el-menu-item index="/value-stream/testing">L2测试验证</el-menu-item>
          <el-menu-item index="/value-stream/acceptance">L2需求验收</el-menu-item>
          <el-menu-item index="/value-stream/release">L2发布交付</el-menu-item>
        </el-sub-menu>

        <!-- DevOps - 保留 -->
        <el-sub-menu index="devops">
          <template #title>
            <el-icon><SetUp /></el-icon>
            <span>DevOps</span>
          </template>
          <el-menu-item index="/devops/builds">构建管理</el-menu-item>
          <el-menu-item index="/devops/releases">发布管理</el-menu-item>
          <el-menu-item index="/devops/tests">测试管理</el-menu-item>
          <el-menu-item index="/devops/artifacts">制品管理</el-menu-item>
        </el-sub-menu>

        <!-- 系统设置 - 保留 -->
        <el-sub-menu index="settings">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </template>
          <el-menu-item index="/settings/organization">组织架构</el-menu-item>
          <el-menu-item index="/settings/users">用户管理</el-menu-item>
          <el-menu-item index="/settings/notifications">通知设置</el-menu-item>
          <el-menu-item index="/settings/monitor">系统监控</el-menu-item>
        </el-sub-menu>
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
  padding: 24px;
  background: $bg-secondary;
  overflow-y: auto;
  height: calc(100vh - 60px);
  
  // 确保内容区域有最大宽度，防止超宽屏幕下布局问题
  > * {
    max-width: 1600px;
    margin: 0 auto;
  }
  
  // 优化滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    
    &:hover {
      background: #a8a8a8;
    }
  }
}
</style>

