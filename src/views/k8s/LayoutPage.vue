<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.k8s = routeName
  router.push({ name: routeName, params: {id: app.value.menu.k8s_dashboard} })
}

onMounted(() => {
  app.value.menu.k8s = router.currentRoute.value.name
})
</script>

<template>
  <div class="system">
    <!-- 菜单导航区 -->
    <div class="sidebar">
      <a-menu
        :style="{ width: '200px', height: '100%', marginRight: '16px' }"
        :default-open-keys="['ResourceList']"
        :default-selected-keys="['ResourceSearch']"
        show-collapse-button
        breakpoint="xl"
        auto-open
        auto-open-selected
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="K8sNamespaceList">
          <template #icon><icon-storage /></template>
          <template #title><span class="menu-title">集群管理</span></template>
          <a-menu-item key="HostList">命名空间</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <!-- 内容操作区 -->
    <div class="main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
