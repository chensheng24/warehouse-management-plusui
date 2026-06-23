<template>
  <el-autocomplete
    ref="autocompleteRef"
    v-model="inputValue"
    :fetch-suggestions="querySearch"
    :placeholder="placeholder"
    clearable
    :popper-class="popperClass"
    :trigger-on-focus="triggerOnFocus"
    :debounce="debounce"
    @select="handleSelect"
    @visible-change="handleVisibleChange"
  >
    <template #default="scope">
      <slot :item="scope.item">{{ scope.item.value }}</slot>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
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
    popperClass?: string;
    debounce?: number;
    triggerOnFocus?: boolean;
    pageSize?: number;
    fetchSuggestions?: (query: string, pageNum: number, pageSize: number) => Promise<FetchResult>;
  }>(),
  {
    modelValue: '',
    placeholder: '请输入',
    popperClass: 'infinite-autocomplete-popper',
    debounce: 300,
    triggerOnFocus: true,
    pageSize: 5
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'select', item: SuggestionItem): void;
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

const autocompleteRef = ref<any>(null);
const currentQuery = ref('');
const currentPage = ref(1);
const hasMore = ref(true);
const loading = ref(false);
const currentSuggestions = ref<SuggestionItem[]>([]);
const suggestionCb = ref<((items: SuggestionItem[]) => void) | null>(null);

const loadSuggestions = async (query = '', page = 1) => {
  if (!props.fetchSuggestions) return [];
  loading.value = true;
  const res = await props.fetchSuggestions(query, page, props.pageSize);
  const rows = Array.isArray(res?.rows) ? res.rows : [];
  const nextList = rows.map((item: any) => ({
    ...item,
    value: item.value ?? item.productName ?? item.name ?? item.label ?? item.id,
    id: item.id ?? item.productId ?? item.value
  }));

  currentPage.value = page;
  hasMore.value = (res.total ?? 0) > page * props.pageSize;
  loading.value = false;
  return nextList;
};

const getSuggestionWrap = () => {
  const popperRef = autocompleteRef.value?.popperRef;
  const popperContent =
    popperRef?.contentRef?.contentRef?.popperContentRef ||
    popperRef?.contentRef?.contentRef ||
    popperRef?.contentRef ||
    popperRef?.popperRef?.contentRef ||
    null;

  const wrap =
    (popperContent as HTMLElement | null)?.querySelector('.el-autocomplete-suggestion__wrap') ||
    (popperContent as HTMLElement | null)?.querySelector('.el-scrollbar__wrap') ||
    document.querySelector(`.${props.popperClass} .el-autocomplete-suggestion__wrap`) ||
    document.querySelector(`.${props.popperClass} .el-scrollbar__wrap`);

  return wrap as HTMLElement | null;
};

const querySearch = (queryString: string, cb: any) => {
  suggestionCb.value = cb;
  currentQuery.value = queryString;
  currentPage.value = 1;
  currentSuggestions.value = [];

  loadSuggestions(queryString, 1).then((rows) => {
    currentSuggestions.value = rows;
    cb(rows);

    nextTick(() => {
      if (autocompleteRef.value) {
        autocompleteRef.value.suggestions = rows;
      }
      attachScroll();
    });
  });
};

const attachScroll = async (retry = 0) => {
  await nextTick();
  const wrap = getSuggestionWrap();
  if (!wrap) {
    if (retry < 8) {
      setTimeout(() => attachScroll(retry + 1), 100);
    }
    return;
  }

  const previousHandler = (wrap as any).__infiniteHandler as (() => Promise<void>) | undefined;
  if (previousHandler) {
    wrap.removeEventListener('scroll', previousHandler);
  }

  const onScroll = async () => {
    if (!hasMore.value || loading.value) return;

    const distanceToBottom = wrap.scrollHeight - wrap.scrollTop - wrap.clientHeight;
    const atBottom = distanceToBottom <= 24;
    if (!atBottom) return;

    const nextPage = currentPage.value + 1;
    const rows = await loadSuggestions(currentQuery.value, nextPage);
    if (!rows.length) return;

    const merged = [...currentSuggestions.value, ...rows];
    currentSuggestions.value = merged;
    if (autocompleteRef.value) {
      autocompleteRef.value.suggestions = merged;
    }
    suggestionCb.value?.(merged);
  };

  wrap.addEventListener('scroll', onScroll, { passive: true });
  (wrap as any).__infiniteBound = true;
  (wrap as any).__infiniteHandler = onScroll;
};

const handleVisibleChange = (visible: boolean) => {
  if (visible) {
    attachScroll();
  }
};

const handleSelect = (item: SuggestionItem) => {
  emit('select', item);
};
</script>

<style scoped>
:deep(.el-autocomplete-suggestion__wrap) {
  max-height: 180px;
  overflow-y: auto;
}
</style>
