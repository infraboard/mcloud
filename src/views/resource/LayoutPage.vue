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
  <a-layout class="system">
    <a-layout-sider collapsible class="sidebar" breakpoint="xl">
      <a-menu
        :default-open-keys="['ResourceList']"
        :default-selected-keys="['ResourceSearch']"
        :selected-keys="[app.menu.resource]"
        breakpoint="xl"
        auto-open
        auto-open-selected
        @menu-item-click="menuItemClickHandler"
      >
        <a-menu-item key="ResourceSearch">
          <template #icon><icon-search /></template>
          <span class="menu-title">资源检索</span>
        </a-menu-item>
        <a-sub-menu key="IaaSResourceList">
          <template #icon><icon-storage /></template>
          <template #title><span class="menu-title">基础资源</span></template>
          <a-menu-item key="HostList">主机</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="ResourceSync">
          <template #icon><icon-relation /></template>
          <template #title><span class="menu-title">资源同步</span></template>
          <a-menu-item key="ResourceSecretList">账号管理</a-menu-item>
          <a-menu-item key="ResourceTaskList">任务列表</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="ConsoleAudit">
          <template #icon><icon-video-camera /></template>
          <template #title><span class="menu-title">登录审计</span></template>
          <a-menu-item key="PodAudit">容器登录</a-menu-item>
        </a-sub-menu>
      </a-menu>
      <template #trigger="{ collapsed }">
        <icon-menu-unfold class="collapsed-icon" v-if="collapsed" />
        <icon-menu-fold class="collapsed-icon" v-else />
      </template>
    </a-layout-sider>
    <layout-content class="main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </layout-content>
  </a-layout>
</template>
