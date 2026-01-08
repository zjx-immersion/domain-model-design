<template>
  <div class="value-stream-main page-container">
    <div class="page-header">
      <h1>研发价值流 - L1主流程</h1>
      <p class="description">端到端可视化研发价值流，9个阶段全流程管理</p>
    </div>

    <!-- 角色选择 -->
    <div class="role-selector">
      <span class="selector-label">切换视角:</span>
      <el-radio-group v-model="selectedRole" @change="handleRoleChange">
        <el-radio-button label="all">全流程</el-radio-button>
        <el-radio-button label="product">产品经理</el-radio-button>
        <el-radio-button label="project">项目经理</el-radio-button>
        <el-radio-button label="developer">开发工程师</el-radio-button>
        <el-radio-button label="tester">测试工程师</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 价值流阶段 -->
    <div class="value-stream-flow">
      <div
        v-for="(stage, index) in filteredStages"
        :key="stage.id"
        class="stream-stage"
        :class="{ 'active': stage.active, 'completed': stage.completed }"
        @click="viewStage(stage)"
      >
        <div class="stage-number">{{ index + 1 }}</div>
        <div class="stage-icon">
          <el-icon :size="32">
            <component :is="stage.icon" />
          </el-icon>
        </div>
        <h3 class="stage-title">{{ stage.name }}</h3>
        <p class="stage-desc">{{ stage.description }}</p>

        <div class="stage-status">
          <el-tag v-if="stage.completed" type="success" size="small">已完成</el-tag>
          <el-tag v-else-if="stage.active" type="primary" size="small">进行中</el-tag>
          <el-tag v-else type="info" size="small">未开始</el-tag>
        </div>

        <div class="stage-arrow" v-if="index < filteredStages.length - 1">
          <el-icon><Right /></el-icon>
        </div>
      </div>
    </div>

    <!-- 阶段详情说明 -->
    <el-card class="stage-info-card" header="价值流说明">
      <el-collapse v-model="activeStages" accordion>
        <el-collapse-item
          v-for="stage in stages"
          :key="stage.id"
          :title="stage.name"
          :name="stage.id"
        >
          <div class="stage-detail">
            <p><strong>阶段描述:</strong> {{ stage.description }}</p>
            <p><strong>主要活动:</strong></p>
            <ul>
              <li v-for="(activity, idx) in stage.activities" :key="idx">{{ activity }}</li>
            </ul>
            <p><strong>输出产物:</strong></p>
            <ul>
              <li v-for="(output, idx) in stage.outputs" :key="idx">{{ output }}</li>
            </ul>
            <p><strong>负责角色:</strong> {{ stage.roles.join(', ') }}</p>
            <el-button type="primary" size="small" @click="viewStage(stage)">
              进入L2详细流程
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const selectedRole = ref('all')
const activeStages = ref<string[]>([])

// 9个价值流阶段
const stages = ref([
  {
    id: 'product-planning',
    name: '产品规划',
    description: '制定产品战略和路线图',
    icon: 'TrendCharts',
    roles: ['产品总监', '产品经理'],
    active: false,
    completed: true,
    activities: ['市场分析', '竞品研究', '产品路线图规划', '版本计划制定'],
    outputs: ['产品路线图', '版本计划', '产品Backlog'],
    route: '/value-stream/product-planning',
  },
  {
    id: 'requirement-analysis',
    name: '需求分析',
    description: '收集和分析用户需求',
    icon: 'Document',
    roles: ['产品经理', '需求分析师'],
    active: false,
    completed: true,
    activities: ['需求收集', '需求分析', 'PRD编写', '需求评审'],
    outputs: ['用户需求文档', '特性需求文档', '模块需求文档'],
    route: '/value-stream/requirement-analysis',
  },
  {
    id: 'project-planning',
    name: '项目规划(PI Planning)',
    description: 'Program Increment规划',
    icon: 'Calendar',
    roles: ['项目经理', '技术Leader', '产品经理'],
    active: true,
    completed: false,
    activities: ['PI Planning会议', '容量规划', '依赖管理', '风险识别'],
    outputs: ['PI Objectives', '团队Backlog', '依赖清单', '风险列表'],
    route: '/value-stream/project-planning',
  },
  {
    id: 'iteration-rd',
    name: '迭代研发',
    description: 'Sprint开发和协同',
    icon: 'Histogram',
    roles: ['开发工程师', 'Tech Lead'],
    active: false,
    completed: false,
    activities: ['Sprint规划', '代码开发', 'Code Review', '单元测试'],
    outputs: ['代码', '单元测试', '技术文档'],
    route: '/value-stream/iteration-rd',
  },
  {
    id: 'integration',
    name: '集成晋级',
    description: '代码集成和环境晋级',
    icon: 'Connection',
    roles: ['集成工程师', 'DevOps'],
    active: false,
    completed: false,
    activities: ['代码合并', '持续集成', '环境部署', '冒烟测试'],
    outputs: ['集成版本', '部署包', '集成报告'],
    route: '/value-stream/integration',
  },
  {
    id: 'testing',
    name: '测试验证',
    description: '系统测试和验证',
    icon: 'CircleCheck',
    roles: ['测试工程师', '质量工程师'],
    active: false,
    completed: false,
    activities: ['功能测试', '性能测试', '安全测试', '兼容性测试'],
    outputs: ['测试报告', '缺陷列表', '测试用例'],
    route: '/value-stream/testing',
  },
  {
    id: 'acceptance',
    name: '需求验收',
    description: '需求完成度验收',
    icon: 'Select',
    roles: ['产品经理', '需求方'],
    active: false,
    completed: false,
    activities: ['需求验收', 'Demo演示', '验收确认'],
    outputs: ['验收报告', 'Demo记录'],
    route: '/value-stream/acceptance',
  },
  {
    id: 'release',
    name: '发布交付',
    description: '版本发布和交付',
    icon: 'Upload',
    roles: ['发布经理', 'DevOps'],
    active: false,
    completed: false,
    activities: ['发布准备', '发布执行', '发布验证', '上线公告'],
    outputs: ['发布版本', '发布报告', '上线通知'],
    route: '/value-stream/release',
  },
  {
    id: 'retrospective',
    name: '复盘总结',
    description: '项目复盘和改进',
    icon: 'DocumentChecked',
    roles: ['项目经理', '全体成员'],
    active: false,
    completed: false,
    activities: ['复盘会议', '经验总结', '改进计划'],
    outputs: ['复盘报告', '改进Action'],
    route: '/value-stream/retrospective',
  },
])

const filteredStages = computed(() => {
  if (selectedRole.value === 'all') {
    return stages.value
  } else if (selectedRole.value === 'product') {
    return stages.value.filter(s => 
      ['product-planning', 'requirement-analysis', 'acceptance'].includes(s.id)
    )
  } else if (selectedRole.value === 'project') {
    return stages.value.slice(2) // 从项目规划开始
  } else if (selectedRole.value === 'developer') {
    return stages.value.filter(s => 
      ['iteration-rd', 'integration', 'testing'].includes(s.id)
    )
  } else if (selectedRole.value === 'tester') {
    return stages.value.filter(s => 
      ['testing', 'acceptance', 'release'].includes(s.id)
    )
  }
  return stages.value
})

function handleRoleChange() {
  const roleNames: Record<string, string> = {
    all: '全流程',
    product: '产品经理',
    project: '项目经理',
    developer: '开发工程师',
    tester: '测试工程师',
  }
  ElMessage.success(`已切换到: ${roleNames[selectedRole.value]}视角`)
}

function viewStage(stage: any) {
  if (stage.route) {
    router.push(stage.route)
  } else {
    ElMessage.info(`${stage.name}详细流程开发中...`)
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.value-stream-main {
  .role-selector {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-xl;
    padding: $spacing-md;
    background: $bg-primary;
    border-radius: $radius-md;

    .selector-label {
      font-weight: 600;
    }
  }

  .value-stream-flow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-xl;
    padding: $spacing-xl;
    background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
    border-radius: $radius-lg;
    overflow-x: auto;

    .stream-stage {
      position: relative;
      flex: 1;
      min-width: 150px;
      padding: $spacing-lg;
      background: $bg-primary;
      border: 2px solid $border-color;
      border-radius: $radius-md;
      text-align: center;
      cursor: pointer;
      transition: all $transition-base;

      &:hover {
        border-color: $primary;
        box-shadow: $shadow-md;
        transform: translateY(-4px);
      }

      &.active {
        border-color: $primary;
        background: lighten($primary, 48%);
      }

      &.completed {
        border-color: $success;
        background: lighten($success, 52%);
      }

      .stage-number {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%);
        width: 24px;
        height: 24px;
        line-height: 24px;
        background: $primary;
        color: white;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 600;
      }

      .stage-icon {
        color: $primary;
        margin: $spacing-md 0;
      }

      .stage-title {
        margin: $spacing-sm 0;
        font-size: 16px;
        font-weight: 600;
      }

      .stage-desc {
        font-size: 12px;
        color: $text-secondary;
        margin-bottom: $spacing-sm;
      }

      .stage-status {
        margin-top: $spacing-md;
      }

      .stage-arrow {
        position: absolute;
        right: -20px;
        top: 50%;
        transform: translateY(-50%);
        color: $primary;
        font-size: 24px;
        z-index: 1;
      }
    }
  }

  .stage-info-card {
    .stage-detail {
      p {
        margin: $spacing-sm 0;
      }

      ul {
        margin: $spacing-xs 0;
        padding-left: 20px;

        li {
          margin: 4px 0;
        }
      }
    }
  }
}
</style>

