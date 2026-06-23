export default {
  mounted(el, binding) {
    // 获取实际滚动的容器
    const wrapDom = el.querySelector('.el-autocomplete-suggestion__wrap');
    if (!wrapDom) return;

    // 保存引用，方便解绑
    el._scrollHandler = () => {
      const { clientHeight, scrollTop, scrollHeight } = wrapDom;
      if (clientHeight + scrollTop >= scrollHeight - 1) {
        // 提前 1px 触发更流畅
        binding.value(); // 执行传入的加载函数
      }
    };

    el._wrapDom = wrapDom;
    wrapDom.addEventListener('scroll', el._scrollHandler, false);
  },
  unmounted(el) {
    if (el._wrapDom && el._scrollHandler) {
      el._wrapDom.removeEventListener('scroll', el._scrollHandler, false);
    }
  }
};
