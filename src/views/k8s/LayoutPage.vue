<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.k8s = routeName
  router.push({ name: routeName, params: { id: app.value.menu.k8s_dashboard } })
}

onMounted(() => {
  app.value.menu.k8s = router.currentRoute.value.name
})
</script>

<template>
  <a-layout class="system">
    <a-layout-sider collapsible class="sidebar" breakpoint="xl">
      <a-menu
        :style="{ width: '100%', height: '100%' }"
        :default-open-keys="['K8sNamespaceList']"
        :default-selected-keys="['K8sNamespaceList']"
        breakpoint="xl"
        auto-open
        auto-open-selected
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="K8sNodeList">
          <template #icon><icon-settings /></template>
          <template #title><span class="menu-title">集群管理</span></template>
          <a-menu-item key="K8sNodeList">节点管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="K8sNamespaceList">
          <template #icon><icon-lock /></template>
          <template #title><span class="menu-title">访问控制</span></template>
          <a-menu-item key="K8sNamespaceList">命名空间</a-menu-item>
          <a-menu-item key="K8sRoleList">账号角色</a-menu-item>
          <a-menu-item key="K8sUserList">账号管理</a-menu-item>
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
  <!-- <div class="system">
    <div class="sidebar">
      <a-menu
        :style="{ width: '220px', height: '100%'}"
        :default-open-keys="['K8sNamespaceList']"
        :default-selected-keys="['K8sNamespaceList']"
        show-collapse-button
        breakpoint="xl"
        auto-open
        auto-open-selected
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="K8sNodeList">
          <template #icon><icon-settings /></template>
          <template #title><span class="menu-title">集群管理</span></template>
          <a-menu-item key="K8sNodeList">节点管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="K8sNamespaceList">
          <template #icon><icon-lock /></template>
          <template #title><span class="menu-title">访问控制</span></template>
          <a-menu-item key="K8sNamespaceList">命名空间</a-menu-item>
          <a-menu-item key="K8sRoleList">账号角色</a-menu-item>
          <a-menu-item key="K8sUserList">账号管理</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <div class="main">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div> -->
</template>
