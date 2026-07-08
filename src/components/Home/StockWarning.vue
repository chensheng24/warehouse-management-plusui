<template>
  <el-card>
    <template #header>
      <span>库存预警</span>
    </template>

    <el-table :data="list" border>
      <el-table-column prop="productName" label="商品名称" />

      <el-table-column prop="stockQty" label="当前库存">
        <template #default="scope">
          <el-tag :type="getType(scope.row.stockQty)">
            {{ scope.row.stockQty }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getLowStock } from '@/api/wms/home';

const list = ref([]);

const loadData = async () => {
  const res = await getLowStock();
  list.value = res.data;
};

const getType = (qty: number) => {
  if (qty <= 10) return 'danger';
  if (qty <= 50) return 'warning';
  return 'success';
};

onMounted(() => {
  loadData();
});
</script>
