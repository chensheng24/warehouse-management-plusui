<template>
  <el-autocomplete
    ref="autocompleteRef"
    v-model="inputValue"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    :clearable="clearable"
    :popper-class="popperClass"
    :trigger-on-focus="triggerOnFocus"
    :debounce="debounce"
    :popper-append-to-body="popperAppendToBody"
    @select="handleSelect"
  >
    <template #default="scope">
      <slot name="item" :item="scope.item">{{ scope.item.value }}</slot>
    </template>

    <template #loading>
      <slot name="loading">
        <div class="loading-area">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>搜索中...</span>
        </div>
      </slot>
    </template>

    <template #footer>
      <div class="footer-actions" v-if="hasPrevious || hasNext">
        <div class="page-side page-side-left">
          <a class="page-link" href="javascript:void(0)" @click.prevent="goPreviousPage" :class="{ disabled: !hasPrevious }">上一页</a>
        </div>
        <div class="page-side page-side-right">
          <a class="page-link" href="javascript:void(0)" @click.prevent="goNextPage" :class="{ disabled: !hasNext }">下一页</a>
        </div>
      </div>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

interface SuggestionItem {
  value: string;
  [key: string]: any;
}

interface FetchResult {
  rows: any[];
  total?: number;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    clearable?: boolean;
    pageSize?: number;
    debounce?: number;
    triggerOnFocus?: boolean;
    popperAppendToBody?: boolean;
    popperClass?: string;
    fetchSuggestions: (query: string, pageNum: number, pageSize: number) => Promise<FetchResult>;
    labelKey?: string;
    idKey?: string;
  }>(),
  {
    modelValue: '',
    placeholder: '请输入',
    clearable: true,
    pageSize: 5,
    debounce: 300,
    triggerOnFocus: true,
    popperAppendToBody: false,
    popperClass: 'paginated-autocomplete-popper',
    labelKey: 'productName',
    idKey: 'id'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', item: SuggestionItem): void;
}>();

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value)
});

const autocompleteRef = ref<any>(null);
const keyword = ref('');
const currentPage = ref(1);
const total = ref(0);
const loading = ref(false);
const suggestions = ref<SuggestionItem[]>([]);
const suggestionCb = ref<((items: SuggestionItem[]) => void) | null>(null);

const hasPrevious = computed(() => currentPage.value > 1);
const hasNext = computed(() => currentPage.value * props.pageSize < total.value);

const formatSuggestion = (item: any): SuggestionItem => ({
  ...item,
  value: String(item[props.labelKey] ?? item.value ?? item.label ?? item.name ?? ''),
  id: item[props.idKey] ?? item.id ?? item.productId
});

const loadPage = async (pageNum: number, query: string) => {
  loading.value = true;
  const result = await props.fetchSuggestions(query, pageNum, props.pageSize);
  const rows = Array.isArray(result?.rows) ? result.rows : [];
  total.value = result?.total ?? rows.length;
  currentPage.value = pageNum;
  const items = rows.map(formatSuggestion);
  suggestions.value = items;
  if (suggestionCb.value) {
    suggestionCb.value(items);
  }
  if (autocompleteRef.value) {
    autocompleteRef.value.suggestions = items;
  }
  loading.value = false;
  return items;
};

const querySearch = (queryString: string, cb: (items: SuggestionItem[]) => void) => {
  suggestionCb.value = cb;
  keyword.value = queryString || '';
  currentPage.value = 1;
  loadPage(1, keyword.value).then((items) => {
    if (cb) {
      cb(items);
    }
    nextTick(() => {
      if (autocompleteRef.value) {
        autocompleteRef.value.suggestions = items;
      }
    });
  });
};

const goNextPage = async () => {
  if (!hasNext.value || loading.value) return;
  await loadPage(currentPage.value + 1, keyword.value);
};

const goPreviousPage = async () => {
  if (!hasPrevious.value || loading.value) return;
  await loadPage(currentPage.value - 1, keyword.value);
};

const handleSelect = (item: SuggestionItem) => {
  emit('select', item);
};
</script>

<style scoped>
.loading-area {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 20px 0;
  color: #909399;
  font-size: 13px;
}

.footer-actions {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background-color: #fff;
  border-top: 1px solid #f0f0f0;
}

.page-side {
  flex: 1;
  display: flex;
  align-items: center;
}

.page-side-left {
  justify-content: flex-start;
}

.page-side-right {
  justify-content: flex-end;
}

.page-link {
  color: #409eff;
  font-size: 13px;
  text-decoration: none;
}

.page-link.disabled {
  color: #c0c4cc;
  pointer-events: none;
}

.page-link:hover:not(.disabled) {
  color: #337ecc;
  text-decoration: underline;
}
</style>
