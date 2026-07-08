<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="商品名称" prop="recordNo" label-width="100px">
              <el-input v-model="queryParams.recordNo" placeholder="请输入单据编号" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="商品名称" prop="productName" label-width="100px">
              <el-input v-model="queryParams.productName" placeholder="请输入商品名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="变动类型" prop="changeType" label-width="100px">
              <el-select v-model="queryParams.changeType" placeholder="请选择变动类型" clearable>
                <el-option v-for="dict in stock_change_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="变动数量" prop="quantity" label-width="100px">
              <!-- <el-input v-model="queryParams.quantity" placeholder="请输入变动数量" clearable @keyup.enter="handleQuery" /> -->
              <NumberRange v-model="numberRangeQuantity" :valueRange="[0, 1000]" />
            </el-form-item>
            <el-form-item label="变动前库存" prop="beforeQty" label-width="100px">
              <!-- <el-input v-model="queryParams.beforeQty" placeholder="请输入变动前库存" clearable @keyup.enter="handleQuery" /> -->
              <NumberRange v-model="numberRangeBeforeQty" :valueRange="[0, 1000]" />
            </el-form-item>
            <el-form-item label="变动后库存" prop="afterQty" label-width="100px">
              <!-- <el-input v-model="queryParams.afterQty" placeholder="请输入变动后库存" clearable @keyup.enter="handleQuery" /> -->
              <NumberRange v-model="numberRangeAfterQty" :valueRange="[0, 1000]" />
            </el-form-item>
            <el-form-item label="业务ID" prop="bizId" label-width="100px">
              <el-input v-model="queryParams.bizId" placeholder="请输入业务ID(入库/出库单ID)" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="业务日期" style="width: 308px">
              <el-date-picker
                v-model="dateRangeBusinessTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeCreateTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['wms:stockRecord:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['wms:stockRecord:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['wms:stockRecord:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['wms:stockRecord:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="stockRecordList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="单据编号" align="center" prop="recordNo" />
        <el-table-column label="商品名称" align="center" prop="productName" />
        <el-table-column label="变动类型" align="center" prop="changeType">
          <template #default="scope">
            <dict-tag :options="stock_change_type" :value="scope.row.changeType" />
          </template>
        </el-table-column>
        <el-table-column label="变动数量" align="center" prop="quantity" />
        <el-table-column label="变动前库存" align="center" prop="beforeQty" />
        <el-table-column label="变动后库存" align="center" prop="afterQty" />
        <el-table-column label="业务ID(入库/出库单ID)" align="center" prop="bizId" />
        <el-table-column label="业务日期" align="center" prop="businessTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.businessTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['wms:stockRecord:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['wms:stockRecord:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column> -->
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改库存流水对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="stockRecordFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="productId">
          <el-input v-model="form.productId" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="变动类型" prop="changeType">
          <el-select v-model="form.changeType" placeholder="请选择变动类型(IN/OUT)">
            <el-option v-for="dict in stock_change_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变动数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入变动数量" />
        </el-form-item>
        <el-form-item label="变动前库存" prop="beforeQty">
          <el-input v-model="form.beforeQty" placeholder="请输入变动前库存" />
        </el-form-item>
        <el-form-item label="变动后库存" prop="afterQty">
          <el-input v-model="form.afterQty" placeholder="请输入变动后库存" />
        </el-form-item>
        <el-form-item label="业务ID(入库/出库单ID)" prop="bizId">
          <el-input v-model="form.bizId" placeholder="请输入业务ID(入库/出库单ID)" />
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

<script setup name="StockRecord" lang="ts">
import { listStockRecord, getStockRecord, delStockRecord, addStockRecord, updateStockRecord } from '@/api/wms/stockRecord/index';
import { StockRecordVO, StockRecordQuery, StockRecordForm } from '@/api/wms/stockRecord/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { stock_change_type, store_biz_type } = toRefs<any>(proxy?.useDict('stock_change_type', 'store_biz_type'));
const stockRecordList = ref<StockRecordVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const numberRangeBeforeQty = ref<[number, number]>([null, null]);
const numberRangeQuantity = ref<[number, number]>([null, null]);
const numberRangeAfterQty = ref<[number, number]>([null, null]);
const dateRangeCreateTime = ref<[string, string]>(['', '']);
const dateRangeBusinessTime = ref<[string, string]>(['', '']);
const queryFormRef = ref<ElFormInstance>();
const stockRecordFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: StockRecordForm = {
  id: undefined,
  productId: undefined,
  changeType: undefined,
  quantity: undefined,
  beforeQty: undefined,
  afterQty: undefined,
  bizId: undefined
};
const data = reactive<PageData<StockRecordForm, StockRecordQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    recordNo: undefined,
    productId: undefined,
    productName: undefined,
    changeType: undefined,
    quantity: undefined,
    beforeQty: undefined,
    afterQty: undefined,
    bizId: undefined,
    params: {
      createTime: undefined,
      businessTime: undefined
    }
  },
  rules: {
    id: [{ required: true, message: '不能为空', trigger: 'blur' }],
    productId: [{ required: true, message: '商品ID不能为空', trigger: 'blur' }],
    changeType: [{ required: true, message: '变动类型(IN/OUT)不能为空', trigger: 'change' }],
    quantity: [{ required: true, message: '变动数量不能为空', trigger: 'blur' }],
    beforeQty: [{ required: true, message: '变动前库存不能为空', trigger: 'blur' }],
    afterQty: [{ required: true, message: '变动后库存不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询库存流水列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeCreateTime.value, 'CreateTime');
  proxy?.addDateRange(queryParams.value, dateRangeBusinessTime.value, 'BusinessTime');
  proxy?.addNumberRange(queryParams.value, numberRangeQuantity.value, 'Quantity');
  proxy?.addNumberRange(queryParams.value, numberRangeBeforeQty.value, 'BeforeQty');
  proxy?.addNumberRange(queryParams.value, numberRangeAfterQty.value, 'AfterQty');

  const res = await listStockRecord(queryParams.value);
  stockRecordList.value = res.rows;
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
  stockRecordFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeCreateTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: StockRecordVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加库存流水';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: StockRecordVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getStockRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改库存流水';
};

/** 提交按钮 */
const submitForm = () => {
  stockRecordFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateStockRecord(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addStockRecord(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: StockRecordVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除库存流水编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delStockRecord(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'wms/stockRecord/export',
    {
      ...queryParams.value
    },
    `stockRecord_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
