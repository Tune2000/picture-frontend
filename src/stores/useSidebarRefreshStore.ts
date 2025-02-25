import { defineStore } from 'pinia';
import { ref } from 'vue';

// 侧边栏菜单的刷新状态记录（用于创建公共空间后刷新侧边栏菜单）
export const useSidebarRefreshStore = defineStore('sidebarRefresh', () => {
  const shouldRefresh = ref(false);

  function setShouldRefresh(value: boolean) {
    shouldRefresh.value = value;
  }

  return {
    shouldRefresh,
    setShouldRefresh
  };
});
