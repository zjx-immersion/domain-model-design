import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Home/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/Layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '工作台', icon: 'Odometer' },
      },
      // 价值流页面
      {
        path: 'value-stream',
        name: 'ValueStream',
        meta: { title: '研发价值流', icon: 'TrendCharts' },
        children: [
          {
            path: 'main',
            name: 'ValueStreamMain',
            component: () => import('@/views/ValueStream/MainFlow.vue'),
            meta: { title: 'L1主价值流' },
          },
          {
            path: 'product-planning',
            name: 'ProductPlanning',
            component: () => import('@/views/ValueStream/ProductPlanning.vue'),
            meta: { title: 'L2产品规划' },
          },
          {
            path: 'requirement-analysis',
            name: 'RequirementAnalysis',
            component: () => import('@/views/ValueStream/RequirementAnalysis.vue'),
            meta: { title: 'L2需求分析' },
          },
          {
            path: 'project-planning',
            name: 'ProjectPlanning',
            component: () => import('@/views/ValueStream/ProjectPlanning.vue'),
            meta: { title: 'L2项目规划' },
          },
          {
            path: 'iteration-rd',
            name: 'IterationRD',
            component: () => import('@/views/ValueStream/IterationRD.vue'),
            meta: { title: 'L2迭代研发' },
          },
          {
            path: 'integration',
            name: 'Integration',
            component: () => import('@/views/ValueStream/Integration.vue'),
            meta: { title: 'L2集成晋级' },
          },
          {
            path: 'testing',
            name: 'Testing',
            component: () => import('@/views/ValueStream/Testing.vue'),
            meta: { title: 'L2测试验证' },
          },
          {
            path: 'acceptance',
            name: 'Acceptance',
            component: () => import('@/views/ValueStream/Acceptance.vue'),
            meta: { title: 'L2需求验收' },
          },
          {
            path: 'release',
            name: 'Release',
            component: () => import('@/views/ValueStream/Release.vue'),
            meta: { title: 'L2发布交付' },
          },
        ],
      },
      // 项目管理
      {
        path: 'pi-planning',
        name: 'PIPlanning',
        meta: { title: 'PI Planning', icon: 'Calendar' },
        children: [
          {
            path: '',
            name: 'PIPlanningList',
            component: () => import('@/views/PIPlanning/List.vue'),
            meta: { title: 'PI列表' },
          },
          {
            path: ':id',
            name: 'PIPlanningWorkspace',
            component: () => import('@/views/PIPlanning/Workspace.vue'),
            meta: { title: 'PI工作区' },
          },
          {
            path: ':id/board',
            name: 'PIPlanningBoard',
            component: () => import('@/views/PIPlanning/Board.vue'),
            meta: { title: 'PI看板' },
          },
        ],
      },
      {
        path: 'projects',
        name: 'Projects',
        meta: { title: '项目管理', icon: 'Box' },
        children: [
          {
            path: '',
            name: 'ProjectList',
            component: () => import('@/views/Project/List.vue'),
            meta: { title: '项目列表' },
          },
          {
            path: ':id',
            name: 'ProjectDetail',
            component: () => import('@/views/Project/Detail.vue'),
            meta: { title: '项目详情' },
          },
          {
            path: ':id/board',
            name: 'ProjectBoard',
            component: () => import('@/views/Project/Board.vue'),
            meta: { title: '项目看板' },
          },
        ],
      },
      // 资产管理
      {
        path: 'assets',
        name: 'Assets',
        meta: { title: '资产管理', icon: 'Files' },
        children: [
          {
            path: 'products',
            name: 'Products',
            component: () => import('@/views/Asset/Products.vue'),
            meta: { title: '领域产品' },
          },
          {
            path: 'products/:id',
            name: 'ProductDetail',
            component: () => import('@/views/Asset/ProductDetail.vue'),
            meta: { title: '产品详情' },
          },
          {
            path: 'features',
            name: 'Features',
            component: () => import('@/views/Asset/Features.vue'),
            meta: { title: '领域特性' },
          },
          {
            path: 'features/:id',
            name: 'FeatureDetail',
            component: () => import('@/views/Asset/FeatureDetail.vue'),
            meta: { title: '特性详情' },
          },
          {
            path: 'modules',
            name: 'Modules',
            component: () => import('@/views/Asset/Modules.vue'),
            meta: { title: '软件模块' },
          },
          {
            path: 'library',
            name: 'AssetLibrary',
            component: () => import('@/views/Asset/Library.vue'),
            meta: { title: '资产库' },
          },
        ],
      },
      // 需求管理
      {
        path: 'requirements',
        name: 'Requirements',
        meta: { title: '需求管理', icon: 'Document' },
        children: [
          {
            path: 'user',
            name: 'UserRequirements',
            component: () => import('@/views/Requirement/UserRequirements.vue'),
            meta: { title: '用户需求' },
          },
          {
            path: 'user/:id',
            name: 'UserRequirementDetail',
            component: () => import('@/views/Requirement/UserRequirementDetail.vue'),
            meta: { title: '用户需求详情' },
          },
          {
            path: 'feature',
            name: 'FeatureRequirements',
            component: () => import('@/views/Requirement/FeatureRequirements.vue'),
            meta: { title: '特性需求' },
          },
          {
            path: 'feature/:id',
            name: 'FeatureRequirementDetail',
            component: () => import('@/views/Requirement/FeatureRequirementDetail.vue'),
            meta: { title: '特性需求详情' },
          },
          {
            path: 'feature/:id/prd',
            name: 'PRDEditor',
            component: () => import('@/views/Requirement/PRDEditor.vue'),
            meta: { title: 'PRD编写' },
          },
          {
            path: 'traceability',
            name: 'Traceability',
            component: () => import('@/views/Requirement/Traceability.vue'),
            meta: { title: '需求追溯' },
          },
        ],
      },
      // Sprint协同
      {
        path: 'sprints',
        name: 'Sprints',
        meta: { title: '迭代协同', icon: 'Histogram' },
        children: [
          {
            path: '',
            name: 'SprintList',
            component: () => import('@/views/Sprint/List.vue'),
            meta: { title: 'Sprint列表' },
          },
          {
            path: ':id',
            name: 'SprintDetail',
            component: () => import('@/views/Sprint/Detail.vue'),
            meta: { title: 'Sprint详情' },
          },
          {
            path: ':id/board',
            name: 'SprintBoard',
            component: () => import('@/views/Sprint/Board.vue'),
            meta: { title: 'Sprint看板' },
          },
        ],
      },
      // DevOps
      {
        path: 'devops',
        name: 'DevOps',
        meta: { title: 'DevOps', icon: 'SetUp' },
        children: [
          {
            path: 'builds',
            name: 'Builds',
            component: () => import('@/views/DevOps/Builds.vue'),
            meta: { title: '构建管理' },
          },
          {
            path: 'releases',
            name: 'Releases',
            component: () => import('@/views/DevOps/Releases.vue'),
            meta: { title: '发布管理' },
          },
        ],
      },
      // 系统设置
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Settings/index.vue'),
        meta: { title: '系统设置', icon: 'Setting' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth !== false && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router

