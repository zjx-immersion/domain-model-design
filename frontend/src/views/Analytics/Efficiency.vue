<template>
  <div class="efficiency-container">
    <el-card class="header-card">
      <template #header>效能分析</template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in metrics" :key="metric.label">
          <el-statistic :title="metric.label" :value="metric.value" :suffix="metric.suffix" />
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>速率趋势</template>
          <div ref="velocityChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>团队速率对比</template>
          <div ref="teamChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="throughput-card">
      <template #header>吞吐量分析</template>
      <el-row :gutter="20">
        <el-col :span="8" v-for="item in throughput" :key="item.type">
          <div class="throughput-item">
            <h4>{{ item.type }}</h4>
            <el-progress :percentage="item.percentage" :color="item.color" />
            <div class="throughput-stats">
              <span>已完成: {{ item.completed }}</span>
              <span>进行中: {{ item.inProgress }}</span>
              <span>计划中: {{ item.planned }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const metrics = ref([
  { label: '当前速率', value: 35, suffix: 'SP' },
  { label: '目标速率', value: 40, suffix: 'SP' },
  { label: '代码提交', value: 2340, suffix: '次' },
  { label: '代码评审', value: 1024, suffix: '次' },
]);

const throughput = ref([
  { type: '特性', completed: 45, inProgress: 12, planned: 23, percentage: 56, color: '#409eff' },
  { type: '故事', completed: 280, inProgress: 45, planned: 95, percentage: 67, color: '#67c23a' },
  { type: '任务', completed: 1250, inProgress: 180, planned: 350, percentage: 70, color: '#e6a23c' },
]);

const velocityChart = ref<HTMLDivElement>();
const teamChart = ref<HTMLDivElement>();

onMounted(() => {
  if (velocityChart.value) {
    const chart = echarts.init(velocityChart.value);
    chart.setOption({
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value' },
      series: [{ data: [30, 32, 34, 35, 36, 35, 34, 36, 35, 37, 35, 35], type: 'line', smooth: true }],
    });
  }
  if (teamChart.value) {
    const chart = echarts.init(teamChart.value);
    chart.setOption({
      xAxis: { type: 'category', data: ['感知团队', '规划团队', '控制团队'] },
      yAxis: { type: 'value' },
      series: [{ data: [35, 32, 26], type: 'bar' }],
    });
  }
});
</script>

<style scoped lang="scss">
.efficiency-container {
  padding: 20px;
  .header-card, .throughput-card {
    margin-bottom: 20px;
  }
  .throughput-item {
    text-align: center;
    .throughput-stats {
      display: flex;
      justify-content: space-around;
      margin-top: 10px;
      font-size: 12px;
    }
  }
}
</style>

