<template>
  <div class="quality-container">
    <el-card class="header-card">
      <template #header>质量分析</template>
      <el-row :gutter="20">
        <el-col :span="6" v-for="metric in metrics" :key="metric.label">
          <el-statistic :title="metric.label" :value="metric.value" :suffix="metric.suffix" />
        </el-col>
      </el-row>
    </el-card>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>缺陷趋势</template>
          <div ref="defectChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>测试覆盖率</template>
          <div ref="coverageChart" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>代码质量</template>
          <div ref="qualityChart" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>构建成功率</template>
          <div class="build-stats">
            <el-progress type="dashboard" :percentage="92.5" :color="progressColor" />
            <div class="build-info">
              <p>总构建次数: 1025</p>
              <p>成功: 948 | 失败: 77</p>
              <p>平均构建时长: 12.5分钟</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const metrics = ref([
  { label: '缺陷总数', value: 125, suffix: '个' },
  { label: '已修复', value: 105, suffix: '个' },
  { label: '测试覆盖率', value: 85.5, suffix: '%' },
  { label: '代码质量', value: 8.2, suffix: '分' },
]);

const progressColor = ref('#67c23a');
const defectChart = ref<HTMLDivElement>();
const coverageChart = ref<HTMLDivElement>();
const qualityChart = ref<HTMLDivElement>();

onMounted(() => {
  if (defectChart.value) {
    const chart = echarts.init(defectChart.value);
    chart.setOption({
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value' },
      series: [{ data: [15, 18, 12, 10, 14, 16, 11, 9, 8, 6, 4, 2], type: 'line', smooth: true }],
    });
  }
  if (coverageChart.value) {
    const chart = echarts.init(coverageChart.value);
    chart.setOption({
      xAxis: { type: 'category', data: ['单元测试', '集成测试', '系统测试', '整体覆盖'] },
      yAxis: { type: 'value', max: 100 },
      series: [{ data: [88.5, 75.2, 82.0, 85.5], type: 'bar' }],
    });
  }
  if (qualityChart.value) {
    const chart = echarts.init(qualityChart.value);
    chart.setOption({
      radar: {
        indicator: [
          { name: '可维护性', max: 10 },
          { name: '可靠性', max: 10 },
          { name: '安全性', max: 10 },
          { name: '代码重复', max: 10 },
          { name: '复杂度', max: 10 },
        ],
      },
      series: [{ type: 'radar', data: [{ value: [8.5, 8.0, 9.0, 6.5, 7.2] }] }],
    });
  }
});
</script>

<style scoped lang="scss">
.quality-container {
  padding: 20px;
  .header-card {
    margin-bottom: 20px;
  }
  .build-stats {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 20px;
    .build-info p {
      margin: 5px 0;
    }
  }
}
</style>

