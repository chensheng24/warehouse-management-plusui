<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="入库数量" prop="quantity">
              <el-input v-model="queryParams.quantity" placeholder="请输入入库数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="queryParams.supplier" placeholder="请输入供应商" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <!-- <el-form-item label="" prop="remark">
              <el-input v-model="queryParams.remark" placeholder="请输入" clearable @keyup.enter="handleQuery" />
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['wms:stockIn:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['wms:stockIn:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['wms:stockIn:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['wms:stockIn:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="stockInList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="入库单据" align="center" prop="stockInNo" />
        <el-table-column label="商品ID" align="center" prop="productId" />
        <el-table-column label="商品名称" align="center" prop="productName" />
        <el-table-column label="入库数量" align="center" prop="quantity" />
        <el-table-column label="供应商" align="center" prop="supplier" />
        <el-table-column label="入库时间" align="center" prop="stockInTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.stockInTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:stockIn:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改入库管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="stockInFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <PaginatedAutocomplete
            v-model="form.productName"
            :fetch-suggestions="fetchProducts"
            clearable
            class="w-50"
            placeholder="请输入商品名称"
            @select="handleSelect"
            :popper-append-to-body="false"
            style="width: 360px"
          />
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入入库数量" min="1" />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="form.supplier" placeholder="请输入供应商" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="StockIn" lang="ts">
import { listStockIn, getStockIn, delStockIn, addStockIn, updateStockIn } from '@/api/wms/stockIn/index';
import { listProduct } from '@/api/wms/product/index';
import { StockInVO, StockInQuery, StockInForm } from '@/api/wms/stockIn/types';
import { ref, computed, reactive, toRefs, onMounted, getCurrentInstance, ComponentInternalInstance } from 'vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const stockInList = ref<StockInVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const queryFormRef = ref<ElFormInstance>();
const stockInFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: StockInForm = {
  id: undefined,
  stockInNo: undefined,
  productId: undefined,
  productName: undefined,
  quantity: undefined,
  supplier: undefined,
  stockInTime: undefined,
  remark: undefined
};
const data = reactive<PageData<StockInForm, StockInQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    id: undefined,
    stockInNo: undefined,
    productId: undefined,
    quantity: undefined,
    supplier: undefined,
    remark: undefined,
    stockInTime: undefined,
    productName: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '不能为空', trigger: 'blur' }],
    stockInNo: [{ required: true, message: '入库单据不能为空', trigger: 'blur' }],
    productId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }],
    quantity: [{ required: true, message: '入库数量不能为空', trigger: 'blur', pattern: /^[0-9]+$/ }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询入库管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listStockIn(queryParams.value);
  stockInList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

const fetchProducts = async (productName: string, pageNum: number, pageSize: number) => {
  const res = await listProduct({ productName: productName || '', pageNum, pageSize });
  return {
    rows: res.rows,
    total: res.total
  };
};

const handleSelect = (item: { value: any; id: any }) => {
  form.value.productId = item.id;
};
/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  stockInFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: StockInVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加入库管理';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: StockInVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getStockIn(_id);
  const productRes = await listProduct({ id: res.data.productId, pageNum: 1, pageSize: 10 });
  if (productRes.rows.length > 0) {
    res.data.productName = productRes.rows[0].productName;
  }
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改入库管理';
};

/** 提交按钮 */
const submitForm = () => {
  stockInFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateStockIn(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addStockIn(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: StockInVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除入库管理编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delStockIn(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'wms/stockIn/export',
    {
      ...queryParams.value
    },
    `stockIn_${new Date().getTime()}.xlsx`
  );
};
// const handleLoadMore = async () => {
//   if (loadingMore.value || !hasMore.value) return;

//   loadingMore.value = true;
//   page.value++;

//   try {
//     const newItems = await fetchData(keyword.value);

//     // Element Plus 内部的 suggestions 可能是非响应式的数组，先读取并重新赋值以触发视图更新
//     const suggestions = autocompleteRef.value?.suggestions || [];
//     const merged = suggestions.concat(newItems || []);
//     if (autocompleteRef.value) {
//       autocompleteRef.value.suggestions = merged;
//     }
//     await nextTick();
//   } catch (error) {
//     console.error('加载更多失败:', error);
//   } finally {
//     loadingMore.value = false;
//   }
// };
onMounted(() => {
  getList();
});
</script>
