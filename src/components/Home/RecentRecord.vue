<template>
  <el-card>
    <template #header>
      <span>最近库存流水</span>
    </template>

    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="productName" label="商品" />

      <el-table-column prop="changeType" label="类型">
        <template #default="scope">
          <dict-tag :options="stock_change_type" :value="scope.row.changeType" />
        </template>
      </el-table-column>

      <el-table-column prop="quantity" label="数量" />

      <el-table-column prop="beforeQty" label="变动前" />

      <el-table-column prop="afterQty" label="变动后" />

      <el-table-column prop="createTime" label="时间" width="180" />
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRecentRecords } from '@/api/wms/home/index';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { stock_change_type, store_biz_type } = toRefs<any>(proxy?.useDict('stock_change_type', 'store_biz_type'));
const list = ref([]);

const loadData = async () => {
  const res = await getRecentRecords();
  list.value = res.data;
};

onMounted(() => {
  loadData();
});
</script>
