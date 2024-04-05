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
  <TopMenu />
  <div class="sidebar">
    <!-- 菜单导航区 -->
    <div class="sidebar-menu">
      <a-menu
        :style="{ width: '200px', height: '100%' }"
        :default-open-keys="['PermissionManage']"
        :default-selected-keys="['SubUserList']"
        :selected-keys="[app.menu.admin]"
        show-collapse-button
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
          <a-menu-item key="RoleList">角色列表</a-menu-item>
          <a-menu-item key="LabelList">标签列表</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="AuditManage">
          <template #icon><icon-eye /></template>
          <template #title><span class="menu-title">审计管理</span></template>
          <a-menu-item key="AuditLoginLog">登录日志</a-menu-item>
          <a-menu-item key="AuditOperateLog">操作日志</a-menu-item>
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
