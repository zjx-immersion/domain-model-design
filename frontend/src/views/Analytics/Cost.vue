<template>
  <div class="cost-container">
    <el-card class="header-card">
      <template #header>成本分析</template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in metrics" :key="metric.label">
          <el-statistic :title="metric.label" :value="metric.value" :suffix="metric.suffix" />
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>团队人力成本</template>
          <div ref="teamCostChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>角色成本分布</template>
          <div ref="roleCostChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>基础设施成本</template>
          <div ref="infraChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>成本效率</template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="每故事点成本">¥7,371</el-descriptions-item>
            <el-descriptions-item label="每特性成本">¥57,333</el-descriptions-item>
            <el-descriptions-item label="每缺陷成本">¥20,640</el-descriptions-item>
            <el-descriptions-item label="投资回报率">3.2x</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const metrics = ref([
  { label: '总成本', value: '258', suffix: '万' },
  { label: '人力成本', value: '240', suffix: '万' },
  { label: '基础设施', value: '18', suffix: '万' },
  { label: 'ROI', value: '3.2', suffix: 'x' },
]);

const teamCostChart = ref<HTMLDivElement>();
const roleCostChart = ref<HTMLDivElement>();
const infraChart = ref<HTMLDivElement>();

onMounted(() => {
  if (teamCostChart.value) {
    const chart = echarts.init(teamCostChart.value);
    chart.setOption({
      xAxis: { type: 'category', data: ['感知团队', '规划团队', '控制团队'] },
      yAxis: { type: 'value', name: '万元' },
      series: [{ data: [96, 80, 64], type: 'bar' }],
    });
  }
  if (roleCostChart.value) {
    const chart = echarts.init(roleCostChart.value);
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: '60%',
          data: [
            { value: 150, name: '算法工程师' },
            { value: 80, name: '开发工程师' },
            { value: 30, name: '测试工程师' },
          ],
        },
      ],
    });
  }
  if (infraChart.value) {
    const chart = echarts.init(infraChart.value);
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 8, name: '计算资源' },
            { value: 4.5, name: '存储' },
            { value: 2.5, name: '网络' },
            { value: 3, name: '许可证' },
          ],
        },
      ],
    });
  }
});
</script>

<style scoped lang="scss">
.cost-container {
  padding: 20px;
  .header-card {
    margin-bottom: 20px;
  }
}
</style>

