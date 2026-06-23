<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商品名称" prop="productName">
              <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="出库数量" prop="quantity">
              <el-input v-model="queryParams.quantity" placeholder="请输入出库数量" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="客户" prop="customer">
              <el-input v-model="queryParams.customer" placeholder="请输入客户" clearable @keyup.enter="handleQuery" />
            </el-form-item>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['wms:stockOut:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['wms:stockOut:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['wms:stockOut:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['wms:stockOut:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="stockOutList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column label="商品名称" align="center" prop="productName" />
        <el-table-column label="出库数量" align="center" prop="quantity" />
        <el-table-column label="客户" align="center" prop="customer" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wms:stockOut:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:stockOut:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改出库管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="stockOutFormRef" :model="form" :rules="rules" label-width="80px">
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
        <el-form-item label="出库数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入出库数量" />
        </el-form-item>
        <el-form-item label="客户" prop="customer">
          <el-input v-model="form.customer" placeholder="请输入客户" />
        </el-form-item>
        <el-form-item label="" prop="remark">
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

<script setup name="StockOut" lang="ts">
import { listStockOut, getStockOut, delStockOut, addStockOut, updateStockOut } from '@/api/wms/stockOut';
import { StockOutVO, StockOutQuery, StockOutForm } from '@/api/wms/stockOut/types';
import { truncate } from 'fs';
import { listProduct } from '@/api/wms/product/index';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const stockOutList = ref<StockOutVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const stockOutFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: StockOutForm = {
  id: undefined,
  productId: undefined,
  productName: undefined,
  quantity: undefined,
  customer: undefined,
  remark: undefined
};
const data = reactive<PageData<StockOutForm, StockOutQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    productId: undefined,
    productName: undefined,
    quantity: undefined,
    customer: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '不能为空', trigger: 'blur' }],
    productId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }],
    productName: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
    quantity: [{ required: true, message: '出库数量不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询出库管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listStockOut(queryParams.value);
  stockOutList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  stockOutFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: StockOutVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加出库管理';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: StockOutVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getStockOut(_id);
  const productRes = await listProduct({ id: res.data.productId, pageNum: 1, pageSize: 10 });
  if (productRes.rows.length > 0) {
    res.data.productName = productRes.rows[0].productName;
  }
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改出库管理';
};

/** 提交按钮 */
const submitForm = () => {
  stockOutFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateStockOut(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addStockOut(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: StockOutVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除出库管理编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delStockOut(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'wms/stockOut/export',
    {
      ...queryParams.value
    },
    `stockOut_${new Date().getTime()}.xlsx`
  );
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
onMounted(() => {
  getList();
});
</script>
