<template>
  <div class="number-range" :class="{ 'is-disabled': disabled }">
    <div class="range-input-group" :class="{ 'is-focus': isFocus }">
      <el-input-number
        v-model="minValue"
        :disabled="disabled"
        :min="minRange"
        :max="maxRange"
        :precision="precision"
        :controls="false"
        placeholder="最小值"
        class="range-input"
        @focus="isFocus = true"
        @blur="onBlur"
        @change="handleChange"
      />
      <span class="range-separator">-</span>
      <el-input-number
        v-model="maxValue"
        :disabled="disabled"
        :min="minRange"
        :max="maxRange"
        :precision="precision"
        :controls="false"
        placeholder="最大值"
        class="range-input"
        @focus="isFocus = true"
        @blur="onBlur"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [null, null] },
  disabled: Boolean,
  precision: { type: Number, default: 0 },
  minRange: { type: Number, default: -Infinity },
  maxRange: { type: Number, default: Infinity }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isFocus = ref(false);

// ⚠️ 初始化必须和 props 一致，否则首屏渲染错乱
const minValue = ref(props.modelValue[0]);
const maxValue = ref(props.modelValue[1]);

// ⚠️ 必须用箭头函数包裹属性访问，watch(props) 是无效的
watch(
  () => props.modelValue,
  (newVal) => {
    minValue.value = newVal[0];
    maxValue.value = newVal[1];
  }
);

let blurTimer: ReturnType<typeof setTimeout> | null = null;
const onBlur = () => {
  blurTimer = setTimeout(() => {
    isFocus.value = false;
  }, 200);
};

const handleChange = () => {
  if (minValue.value !== null && maxValue.value !== null && minValue.value > maxValue.value) {
    maxValue.value = minValue.value;
  }
  emit('update:modelValue', [minValue.value, maxValue.value]);
  emit('change', [minValue.value, maxValue.value]);
};
</script>

<style scoped>
.number-range {
  display: inline-block;
  width: 180px;
}

.range-input-group {
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 8px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.range-input-group:hover:not(.is-disabled) {
  border-color: #c0c4cc;
}

.range-input-group.is-focus {
  border-color: #409eff;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2);
}

.number-range.is-disabled .range-input-group {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  cursor: not-allowed;
}

.range-input {
  flex: 1;
  min-width: 0;
}

.range-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.range-input :deep(.el-input__inner) {
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.range-input :deep(.el-input__inner::placeholder) {
  color: #c0c4cc;
}

.range-separator {
  flex-shrink: 0;
  padding: 0 4px;
  color: #c0c4cc;
  font-size: 14px;
  user-select: none;
}
</style>
