<template>
  <div class="release-container">
    <el-card class="header-card">
      <template #header>
        <div class="stage-header">
          <div class="stage-info">
            <el-icon :size="32" color="#409EFF"><Upload /></el-icon>
            <div class="stage-text">
              <h2>L2发布交付</h2>
              <p>版本发布 → 生产部署 → 用户交付</p>
            </div>
          </div>
          <el-tag type="primary" size="large">价值流阶段 8/8</el-tag>
        </div>
      </template>

      <el-descriptions :column="4" border>
        <el-descriptions-item label="当前版本">v2.5.0</el-descriptions-item>
        <el-descriptions-item label="发布时间">2026-01-05</el-descriptions-item>
        <el-descriptions-item label="包含需求">24个</el-descriptions-item>
        <el-descriptions-item label="阶段状态">
          <el-tag type="success">已发布</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><Calendar /></el-icon> 发布时间线</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="event in releaseTimeline"
              :key="event.id"
              :timestamp="event.time"
              :type="event.type"
            >
              <h4>{{ event.title }}</h4>
              <p>{{ event.description }}</p>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <span><el-icon><Odometer /></el-icon> 发布统计</span>
          </template>
          <div class="release-stats">
            <div class="stat-item">
              <div class="stat-label">包含需求数</div>
              <div class="stat-value">24个</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">代码提交数</div>
              <div class="stat-value">156次</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">功能增强</div>
              <div class="stat-value">18项</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Bug修复</div>
              <div class="stat-value">32个</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><List /></el-icon> 发布清单</span>
      </template>
      <el-table :data="releaseItems" border>
        <el-table-column prop="id" label="需求ID" width="120">
          <template #default="{ row }">
            <el-link type="primary">{{ row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="需求标题" min-width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column label="业务价值" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.businessValue" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag type="success" size="small">已发布</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header>
        <span><el-icon><Document /></el-icon> 发布说明</span>
      </template>
      <div class="release-notes">
        <h3>v2.5.0 发布说明</h3>
        <h4>新增功能</h4>
        <ul>
          <li>激光雷达点云处理算法优化，检测距离提升20%</li>
          <li>相机图像融合算法，多传感器协同感知</li>
          <li>障碍物识别准确率提升至95%以上</li>
        </ul>
        <h4>功能增强</h4>
        <ul>
          <li>路径规划算法性能优化，响应时间降低30%</li>
          <li>控制精度提升，横向控制误差减少50%</li>
        </ul>
        <h4>Bug修复</h4>
        <ul>
          <li>修复紧急刹车在特定场景下失效的问题</li>
          <li>修复车道线识别在夜间准确率下降的问题</li>
        </ul>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="io-card input-card">
          <template #header>
            <span><el-icon><Download /></el-icon> 阶段输入</span>
          </template>
          <el-tag v-for="input in stageInputs" :key="input" type="info" style="margin: 5px">
            {{ input }}
          </el-tag>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="io-card output-card">
          <template #header>
            <span><el-icon><Upload /></el-icon> 阶段输出</span>
          </template>
          <el-tag v-for="output in stageOutputs" :key="output" type="success" style="margin: 5px">
            {{ output }}
          </el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px">
      <el-alert
        title="价值流完成"
        type="success"
        description="恭喜！本次研发价值流已全部完成，产品已成功交付给用户。"
        show-icon
        :closable="false"
      />
      <el-button type="primary" size="large" @click="goToMainFlow" style="width: 100%; margin-top: 15px">
        <el-icon><Back /></el-icon>
        返回主价值流
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const releaseTimeline = ref([
  {
    id: 1,
    title: '发布准备',
    description: '完成发布前检查，准备发布材料',
    time: '2026-01-05 10:00',
    type: 'primary',
  },
  {
    id: 2,
    title: '预发布环境部署',
    description: '部署到预发布环境，进行最后验证',
    time: '2026-01-05 14:00',
    type: 'primary',
  },
  {
    id: 3,
    title: '生产环境发布',
    description: '正式部署到生产环境',
    time: '2026-01-05 16:00',
    type: 'success',
  },
  {
    id: 4,
    title: '用户交付',
    description: '交付给客户，提供培训和文档',
    time: '2026-01-05 18:00',
    type: 'success',
  },
])

const releaseItems = ref([
  { id: 'UR-001', title: '提升感知精度', type: '功能增强', module: '感知模块', businessValue: 5 },
  { id: 'FR-005', title: '激光雷达融合算法', type: '功能增强', module: '感知模块', businessValue: 5 },
  { id: 'MR-025', title: '路径规划优化', type: '性能优化', module: '规划模块', businessValue: 4 },
  { id: 'DEF-001', title: '紧急刹车控制修复', type: 'Bug修复', module: '控制模块', businessValue: 5 },
])

const stageInputs = ref([
  '验收报告',
  '发布许可',
  '用户培训',
  '操作手册',
])

const stageOutputs = ref([
  '发布版本',
  '部署记录',
  '发布说明',
  '用户反馈',
  '价值交付确认',
])

const getTypeTag = (type: string) => {
  const map: Record<string, any> = {
    功能增强: 'primary',
    性能优化: 'success',
    'Bug修复': 'warning',
  }
  return map[type] || 'info'
}

const goToMainFlow = () => {
  router.push('/value-stream/main')
}
</script>

<style scoped lang="scss">
.release-container {
  padding: 20px;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .stage-info {
    display: flex;
    align-items: center;
    gap: 15px;

    .stage-text {
      h2 {
        margin: 0 0 5px 0;
        font-size: 24px;
      }

      p {
        margin: 0;
        color: #909399;
        font-size: 14px;
      }
    }
  }
}

.release-stats {
  .stat-item {
    margin-bottom: 20px;

    .stat-label {
      font-size: 14px;
      color: #909399;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: #303133;
    }
  }
}

.release-notes {
  line-height: 1.8;

  h3 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  h4 {
    font-size: 16px;
    margin-top: 15px;
    margin-bottom: 10px;
    color: #409EFF;
  }

  ul {
    margin-left: 20px;
  }

  li {
    margin-bottom: 5px;
  }
}

.io-card {
  min-height: 200px;

  &.input-card {
    border-left: 4px solid #409EFF;
  }

  &.output-card {
    border-left: 4px solid #67C23A;
  }
}
</style>

