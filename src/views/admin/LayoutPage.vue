<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.admin = routeName
  router.push({ name: routeName })
}

onMounted(() => {
  app.value.menu.admin = router.currentRoute.value.name
})
</script>

<template>
  <a-layout class="system">
    <a-layout-sider collapsible class="sidebar" breakpoint="xl">
      <a-menu
        :default-open-keys="['PermissionManage']"
        :default-selected-keys="['SubUserList']"
        :selected-keys="[app.menu.admin]"
        auto-open
        breakpoint="xl"
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="PermissionManage">
          <template #icon><icon-lock /></template>
          <template #title><span class="menu-title">权限管理</span></template>
          <a-menu-item key="DomainDetail">登录设置</a-menu-item>
          <a-menu-item key="SubUserList">用户列表</a-menu-item>
          <a-menu-item key="NamespaceList">空间列表</a-menu-item>
          <a-menu-item key="LabelList">标签列表</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="AuditManage">
          <template #icon><icon-eye /></template>
          <template #title><span class="menu-title">审计管理</span></template>
          <a-menu-item key="AuditLoginLog">登录日志</a-menu-item>
          <a-menu-item key="AuditOperateLog">操作日志</a-menu-item>
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
