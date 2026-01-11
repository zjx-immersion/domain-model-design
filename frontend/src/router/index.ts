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
        redirect: '/value-stream/main',
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
        redirect: '/pi-planning/list',
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
      // 版本管理
      {
        path: 'releases',
        name: 'Releases',
        redirect: '/releases/list',
        meta: { title: '版本管理', icon: 'Histogram' },
        children: [
          {
            path: 'list',
            name: 'ReleaseList',
            component: () => import('@/views/Release/ReleaseList.vue'),
            meta: { title: '版本列表' },
          },
          {
            path: ':id',
            name: 'ReleaseDetail',
            component: () => import('@/views/Release/ReleaseDetail.vue'),
            meta: { title: '版本详情' },
          },
        ],
      },
      // 特性包管理
      {
        path: 'baselines',
        name: 'Baselines',
        redirect: '/baselines/list',
        meta: { title: '特性包管理', icon: 'CollectionTag' },
        children: [
          {
            path: 'list',
            name: 'BaselineList',
            component: () => import('@/views/Release/BaselineList.vue'),
            meta: { title: '特性包列表' },
          },
          {
            path: ':id',
            name: 'BaselineDetail',
            component: () => import('@/views/Release/BaselineDetail.vue'),
            meta: { title: '特性包详情' },
          },
        ],
      },
      {
        path: 'projects',
        name: 'Projects',
        redirect: '/projects/overview',
        meta: { title: '项目中心', icon: 'Box' },
        children: [
          // 项目全景图 - 核心一页视图
          {
            path: 'overview',
            name: 'ProjectOverview',
            component: () => import('@/views/Project/Overview.vue'),
            meta: { title: '项目全景图' },
          },
          // 车型项目
          {
            path: 'vehicle',
            name: 'VehicleProjects',
            component: () => import('@/views/Project/VehicleProjectList.vue'),
            meta: { title: '车型项目' },
          },
          {
            path: 'vehicle/:id',
            name: 'VehicleProjectDetail',
            component: () => import('@/views/Project/VehicleProjectDetail.vue'),
            meta: { title: '车型项目详情' },
          },
          // 领域项目
          {
            path: 'domain',
            name: 'DomainProjects',
            component: () => import('@/views/Project/DomainProjectList.vue'),
            meta: { title: '领域项目' },
          },
          {
            path: 'domain/:id',
            name: 'DomainProjectDetail',
            component: () => import('@/views/Project/DomainProjectDetail.vue'),
            meta: { title: '领域项目详情' },
          },
          // 原有路由保留兼容性
          {
            path: 'list',
            name: 'ProjectList',
            component: () => import('@/views/Project/List.vue'),
            meta: { title: '项目列表（旧）' },
          },
          {
            path: ':id',
            name: 'ProjectDetail',
            component: () => import('@/views/Project/Detail.vue'),
            meta: { title: '项目详情（旧）' },
          },
          {
            path: ':id/board',
            name: 'ProjectBoard',
            component: () => import('@/views/Project/Board.vue'),
            meta: { title: '项目看板' },
          },
        ],
      },
      // Backlog 管理
      {
        path: 'backlog',
        name: 'Backlog',
        meta: { title: 'Backlog管理', icon: 'List' },
        children: [
          // 项目待办列表
          {
            path: 'project',
            name: 'ProjectBacklogList',
            component: () => import('@/views/Backlog/ProjectBacklogList.vue'),
            meta: { title: '项目待办' },
          },
          {
            path: 'project/:id',
            name: 'ProjectBacklogDetail',
            component: () => import('@/views/Backlog/ProjectBacklog.vue'),
            meta: { title: '项目待办详情' },
          },
          // 团队待办列表
          {
            path: 'team',
            name: 'TeamBacklogList',
            component: () => import('@/views/Backlog/TeamBacklogList.vue'),
            meta: { title: '团队待办' },
          },
          {
            path: 'team/:id',
            name: 'TeamBacklogDetail',
            component: () => import('@/views/Backlog/TeamBacklog.vue'),
            meta: { title: '团队待办详情' },
          },
        ],
      },
      // 产品中心（原资产管理）
      {
        path: 'products',
        name: 'ProductCenter',
        redirect: '/products/overview',
        meta: { title: '产品中心', icon: 'Files' },
        children: [
          // 产品资产全景 - 核心一页视图
          {
            path: 'overview',
            name: 'ProductOverview',
            component: () => import('@/views/Product/Overview.vue'),
            meta: { title: '产品资产全景' },
          },
          {
            path: 'lines',
            name: 'ProductLines',
            component: () => import('@/views/Asset/ProductLines.vue'),
            meta: { title: '产品线管理' },
          },
          {
            path: 'lines/:id',
            name: 'ProductLineDetail',
            component: () => import('@/views/Asset/ProductLineDetail.vue'),
            meta: { title: '产品线详情' },
          },
          {
            path: 'list',
            name: 'Products',
            component: () => import('@/views/Asset/Products.vue'),
            meta: { title: '领域产品管理' },
          },
          {
            path: 'list/:id',
            name: 'ProductDetail',
            component: () => import('@/views/Asset/ProductDetail.vue'),
            meta: { title: '产品详情' },
          },
          {
            path: 'features',
            name: 'Features',
            component: () => import('@/views/Asset/Features.vue'),
            meta: { title: '领域特性管理' },
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
            meta: { title: '软件模块管理' },
          },
          {
            path: 'modules/:id',
            name: 'ModuleDetail',
            component: () => import('@/views/Asset/ModuleDetail.vue'),
            meta: { title: '模块详情' },
          },
        ],
      },
      // 资产库（独立路由）
      {
        path: 'assets',
        name: 'Assets',
        redirect: '/assets/library',
        meta: { title: '资产库', icon: 'Files' },
        children: [
          {
            path: 'library',
            name: 'AssetLibrary',
            component: () => import('@/views/Asset/Relationship.vue'),
            meta: { title: '资产库' },
          },
          {
            path: 'features',
            name: 'FeatureAssetList',
            component: () => import('@/views/Asset/FeatureList.vue'),
            meta: { title: 'Feature列表' },
          },
          {
            path: 'features/:id',
            name: 'FeatureAssetDetail',
            component: () => import('@/views/Asset/FeatureDetail.vue'),
            meta: { title: 'Feature详情' },
          },
          {
            path: 'feature-bom',
            name: 'FeatureBOMList',
            component: () => import('@/views/Asset/FeatureBOMList.vue'),
            meta: { title: 'Feature BOM管理' },
          },
          {
            path: 'feature-bom/:id',
            name: 'FeatureBOMDetail',
            component: () => import('@/views/Asset/FeatureBOMDetail.vue'),
            meta: { title: 'Feature BOM详情' },
          },
        ],
      },
      // Platform管理
      {
        path: 'platforms',
        name: 'Platforms',
        redirect: '/platforms',
        meta: { title: 'Platform管理', icon: 'Monitor' },
        children: [
          {
            path: '',
            name: 'PlatformList',
            component: () => import('@/views/Platform/List.vue'),
            meta: { title: 'Platform列表' },
          },
          {
            path: ':id',
            name: 'PlatformDetail',
            component: () => import('@/views/Platform/Detail.vue'),
            meta: { title: 'Platform详情' },
          },
        ],
      },
      // 需求管理
      {
        path: 'requirements',
        name: 'Requirements',
        redirect: '/requirements/user',
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
            path: 'module',
            name: 'ModuleRequirements',
            component: () => import('@/views/Requirement/ModuleRequirements.vue'),
            meta: { title: '模块需求' },
          },
          {
            path: 'module/:id',
            name: 'ModuleRequirementDetail',
            component: () => import('@/views/Requirement/ModuleRequirementDetail.vue'),
            meta: { title: '模块需求详情' },
          },
          {
            path: 'changes',
            name: 'Changes',
            component: () => import('@/views/Requirement/Changes.vue'),
            meta: { title: '需求变更' },
          },
          {
            path: 'changes/:id',
            name: 'ChangeDetail',
            component: () => import('@/views/Requirement/ChangeDetail.vue'),
            meta: { title: '变更详情' },
          },
          {
            path: 'kanban',
            name: 'RequirementKanban',
            component: () => import('@/views/Requirement/Kanban.vue'),
            meta: { title: '需求看板' },
          },
          {
            path: 'traceability',
            name: 'Traceability',
            component: () => import('@/views/Requirement/Traceability.vue'),
            meta: { title: '需求追溯' },
          },
          {
            path: 'traceability/matrix',
            name: 'TraceabilityMatrix',
            component: () => import('@/views/Requirement/TraceabilityMatrix.vue'),
            meta: { title: '追溯矩阵' },
          },
          {
            path: 'traceability/impact',
            name: 'ImpactAnalysis',
            component: () => import('@/views/Requirement/ImpactAnalysis.vue'),
            meta: { title: '影响分析' },
          },
          {
            path: 'traceability/graph',
            name: 'TraceabilityGraph',
            component: () => import('@/views/Requirement/TraceabilityGraph.vue'),
            meta: { title: '追溯关系图谱' },
          },
        ],
      },
      // 团队工作台 - 新增核心视角
      {
        path: 'team',
        name: 'Team',
        redirect: '/team/workspace',
        meta: { title: '团队工作台', icon: 'User' },
        children: [
          // 团队工作全景 - 核心一页视图
          {
            path: 'workspace',
            name: 'TeamWorkspace',
            component: () => import('@/views/Team/Workspace.vue'),
            meta: { title: '团队工作全景' },
          },
          {
            path: 'work-items',
            name: 'TeamWorkItems',
            component: () => import('@/views/WorkItem/List.vue'),
            meta: { title: '工作项管理' },
          },
          {
            path: 'work-items/:id',
            name: 'WorkItemDetail',
            component: () => import('@/views/WorkItem/Detail.vue'),
            meta: { title: '工作项详情' },
          },
          {
            path: 'bugs',
            name: 'TeamBugs',
            component: () => import('@/views/Team/Bugs.vue'),
            meta: { title: '缺陷管理' },
          },
          {
            path: 'tech-debt',
            name: 'TeamTechDebt',
            component: () => import('@/views/Team/TechDebt.vue'),
            meta: { title: '技术债管理' },
          },
          {
            path: 'metrics',
            name: 'TeamMetrics',
            component: () => import('@/views/Team/Metrics.vue'),
            meta: { title: '团队效能' },
          },
        ],
      },
      // 价值网络
      {
        path: 'value-network',
        name: 'ValueNetwork',
        redirect: '/value-network/map',
        meta: { title: '价值网络', icon: 'Share' },
        children: [
          {
            path: 'l1',
            name: 'ValueNetworkL1',
            component: () => import('@/views/ValueNetwork/L1Strategic.vue'),
            meta: { title: 'L1战略级网络' },
          },
          {
            path: 'l2',
            name: 'ValueNetworkL2',
            component: () => import('@/views/ValueNetwork/L2Execution.vue'),
            meta: { title: 'L2执行级网络' },
          },
          {
            path: 'l3',
            name: 'ValueNetworkL3',
            component: () => import('@/views/ValueNetwork/L3Operational.vue'),
            meta: { title: 'L3操作级网络' },
          },
        ],
      },
      // Sprint协同
      {
        path: 'sprints',
        name: 'Sprints',
        redirect: '/sprints/list',
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
      // 团队管理 ⭐ 新增
      {
        path: 'teams',
        name: 'Teams',
        redirect: '/teams/list',
        meta: { title: '团队管理', icon: 'UserFilled' },
        children: [
          {
            path: '',
            name: 'TeamList',
            component: () => import('@/views/Team/List.vue'),
            meta: { title: '团队列表' },
          },
          {
            path: ':id',
            name: 'TeamDetail',
            component: () => import('@/views/Team/Detail.vue'),
            meta: { title: '团队详情' },
          },
          {
            path: ':id/modules',
            name: 'TeamModuleConfig',
            component: () => import('@/views/Team/ModuleConfig.vue'),
            meta: { title: '模块配置' },
          },
        ],
      },
      // DevOps
      {
        path: 'devops',
        name: 'DevOps',
        redirect: '/devops/builds',
        meta: { title: 'DevOps', icon: 'SetUp' },
        children: [
          {
            path: 'builds',
            name: 'Builds',
            component: () => import('@/views/DevOps/Builds.vue'),
            meta: { title: '构建管理' },
          },
          {
            path: 'pipeline',
            name: 'Pipeline',
            component: () => import('@/views/DevOps/Pipeline.vue'),
            meta: { title: '流水线' },
          },
          {
            path: 'environments',
            name: 'Environments',
            component: () => import('@/views/DevOps/Environments.vue'),
            meta: { title: '环境管理' },
          },
          {
            path: 'releases',
            name: 'DevOpsReleases',
            component: () => import('@/views/DevOps/Releases.vue'),
            meta: { title: '发布管理' },
          },
          {
            path: 'release-board',
            name: 'ReleaseBoard',
            component: () => import('@/views/DevOps/ReleaseBoard.vue'),
            meta: { title: '发布看板' },
          },
          {
            path: 'metrics',
            name: 'DevOpsMetrics',
            component: () => import('@/views/DevOps/Metrics.vue'),
            meta: { title: 'DevOps指标' },
          },
        ],
      },
      // 测试管理
      {
        path: 'test',
        name: 'Test',
        redirect: '/test/cases',
        meta: { title: '测试管理', icon: 'Operation' },
        children: [
          {
            path: 'cases',
            name: 'TestCases',
            component: () => import('@/views/Test/Cases.vue'),
            meta: { title: '测试用例' },
          },
          {
            path: 'plans',
            name: 'TestPlans',
            component: () => import('@/views/Test/Plans.vue'),
            meta: { title: '测试计划' },
          },
          {
            path: 'defects',
            name: 'Defects',
            component: () => import('@/views/Test/Defects.vue'),
            meta: { title: '缺陷管理' },
          },
          {
            path: 'reports',
            name: 'TestReports',
            component: () => import('@/views/Test/Reports.vue'),
            meta: { title: '测试报告' },
          },
          {
            path: 'coverage',
            name: 'TestCoverage',
            component: () => import('@/views/Test/Coverage.vue'),
            meta: { title: '测试覆盖率' },
          },
          {
            path: 'automation',
            name: 'TestAutomation',
            component: () => import('@/views/Test/Automation.vue'),
            meta: { title: '自动化测试' },
          },
        ],
      },
      // 数据分析
      {
        path: 'analytics',
        name: 'Analytics',
        redirect: '/analytics/value-stream',
        meta: { title: '数据分析', icon: 'DataAnalysis' },
        children: [
          {
            path: 'value-stream',
            name: 'ValueStreamAnalytics',
            component: () => import('@/views/Analytics/ValueStream.vue'),
            meta: { title: '价值流分析' },
          },
          {
            path: 'efficiency',
            name: 'EfficiencyAnalytics',
            component: () => import('@/views/Analytics/Efficiency.vue'),
            meta: { title: '效能分析' },
          },
          {
            path: 'quality',
            name: 'QualityAnalytics',
            component: () => import('@/views/Analytics/Quality.vue'),
            meta: { title: '质量分析' },
          },
          {
            path: 'cost',
            name: 'CostAnalytics',
            component: () => import('@/views/Analytics/Cost.vue'),
            meta: { title: '成本分析' },
          },
        ],
      },
      // 系统管理
      {
        path: 'system',
        name: 'System',
        redirect: '/system/settings',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
      {
        path: 'settings',
            name: 'SystemSettings',
            component: () => import('@/views/System/Settings.vue'),
            meta: { title: '系统配置' },
          },
          {
            path: 'users',
            name: 'SystemUsers',
            component: () => import('@/views/System/Users.vue'),
            meta: { title: '用户管理' },
          },
          {
            path: 'logs',
            name: 'SystemLogs',
            component: () => import('@/views/System/Logs.vue'),
            meta: { title: '操作日志' },
          },
          {
            path: 'notifications',
            name: 'SystemNotifications',
            component: () => import('@/views/System/Notifications.vue'),
            meta: { title: '通知中心' },
          },
        ],
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

