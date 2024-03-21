<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.resource = routeName
  router.push({ name: routeName })
}

onMounted(() => {
  app.value.menu.resource = router.currentRoute.value.name
})
</script>

<template>
  <TopMenu />
  <div class="sidebar">
    <!-- 菜单导航区 -->
    <div class="sidebar-menu">
      <a-menu
        :style="{ width: '200px', height: '100%' }"
        :default-open-keys="['ResourceList']"
        :default-selected-keys="['ResourceSearch']"
        :selected-keys="[app.menu.resource]"
        show-collapse-button
        breakpoint="xl"
        auto-open
        auto-open-selected
        @menu-item-click="menuItemClickHandler"
      >
        <a-menu-item key="ResourceSearch">
          <template #icon><icon-search /></template>
          资源检索
        </a-menu-item>
        <a-sub-menu key="IaaSResourceList">
          <template #icon><icon-storage /></template>
          <template #title>基础资源</template>
          <a-menu-item key="HostList">主机</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="PaaSResourceList">
          <template #icon><icon-layers /></template>
          <template #title>平台资源</template>
          <a-menu-item key="K8sClusterList">K8s集群</a-menu-item>
          <a-menu-item key="GatewayList">网关</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="ResourceSync">
          <template #icon><icon-relation /></template>
          <template #title>资源同步</template>
          <a-menu-item key="ResourceTaskList">任务列表</a-menu-item>
          <a-menu-item key="ResourceSecretList">账号管理</a-menu-item>
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
