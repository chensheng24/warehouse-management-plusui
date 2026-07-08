<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          商品总数
          <div class="num">{{ stats.productCount }}</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          库存总量
          <div class="num">{{ stats.stockTotal }}</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          今日入库
          <div class="num">{{ stats.todayIn }}</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          今日出库
          <div class="num">{{ stats.todayOut }}</div>
        </el-card>
      </el-col>
    </el-row>
    <div ref="chartRef" style="height: 400px"></div>

    <RecentRecord />
    <StockWarning />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { getHomeStats } from '@/api/wms/home/index';
import * as echarts from 'echarts';

const stats = reactive({
  productCount: 0,
  stockTotal: 0,
  todayIn: 0,
  todayOut: 0
});
const chartRef = ref();
onMounted(async () => {
  const res = await getHomeStats();
  Object.assign(stats, res.data);

  const chart = echarts.init(chartRef.value);
  chart.setOption({
    xAxis: {
      type: 'category',
      data: res.data.top10.map((i) => i.name)
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: res.data.top10.map((i) => i.value)
      }
    ]
  });
});
</script>
<style scoped lang="scss">
.home-page {
  padding: 20px;
  .num {
    font-size: 24px;
    font-weight: bold;
    margin-top: 10px;
  }
}
</style>
