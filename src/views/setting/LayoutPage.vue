<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.setting = routeName
  router.push({ name: routeName })
}

onMounted(() => {
  app.value.menu.setting = router.currentRoute.value.name
})
</script>

<template>
  <a-layout class="system">
    <a-layout-sider collapsible class="sidebar" breakpoint="xl">
      <a-menu
        :default-open-keys="['ResourceList']"
        :default-selected-keys="['NamespacePolicyList']"
        :selected-keys="[app.menu.setting]"
        breakpoint="xl"
        auto-open
        auto-open-selected
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="NamespacePermission">
          <template #icon><icon-lock /></template>
          <template #title><span class="menu-title">权限管理</span></template>
          <a-menu-item key="RoleList">角色管理</a-menu-item>
          <a-menu-item key="NamespacePolicyList">访问策略</a-menu-item>
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
