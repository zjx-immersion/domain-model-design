<template>
  <div class="value-stream-container">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <span>价值流分析</span>
          <el-date-picker v-model="dateRange" type="daterange" placeholder="选择时间范围" />
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in summary" :key="metric.label">
          <el-statistic :title="metric.label" :value="metric.value" :suffix="metric.suffix" />
        </el-col>
      </el-row>
    </el-card>

    <el-card class="chart-card">
      <template #header>价值流阶段分析</template>
      <div ref="stageChart" style="height: 400px"></div>
    </el-card>

    <el-card class="table-card">
      <template #header>瓶颈识别</template>
      <el-table :data="bottlenecks" style="width: 100%">
        <el-table-column prop="stage" label="阶段" />
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="impact" label="影响程度">
          <template #default="{ row }">
            <el-tag :type="getImpactType(row.impact)">{{ row.impact }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import type { ValueStreamAnalysis } from '@/types/analytics';

const dateRange = ref<[Date, Date]>();
const summary = ref([
  { label: '总周期时间', value: 85, suffix: '天' },
  { label: '总价值时间', value: 65.5, suffix: '天' },
  { label: '总等待时间', value: 19.5, suffix: '天' },
  { label: '整体效率', value: 77, suffix: '%' },
]);

const bottlenecks = ref([
  { stage: '迭代研发', reason: '开发资源不足', impact: 'high' },
  { stage: '产品规划', reason: '决策周期长', impact: 'medium' },
]);

const stageChart = ref<HTMLDivElement>();

const getImpactType = (impact: string) => {
  const types: Record<string, any> = { high: 'danger', medium: 'warning', low: 'success' };
  return types[impact] || '';
};

onMounted(() => {
  if (stageChart.value) {
    const chart = echarts.init(stageChart.value);
    chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['产品规划', '需求分析', '项目规划', '迭代研发', '集成晋级', '测试验证', '需求验收', '发布交付'] },
      yAxis: { type: 'value', name: '天数' },
      series: [
        { name: '周期时间', type: 'bar', data: [15, 10, 8, 30, 5, 12, 3, 2] },
        { name: '价值时间', type: 'bar', data: [10, 7, 6, 25, 4, 10, 2, 1.5] },
      ],
    });
  }
});
</script>

<style scoped lang="scss">
.value-stream-container {
  padding: 20px;
  .header-card, .chart-card, .table-card {
    margin-bottom: 20px;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>

