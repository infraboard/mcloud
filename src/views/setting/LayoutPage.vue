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
  <TopMenu />
  <div class="sidebar">
    <!-- 菜单导航区 -->
    <div class="sidebar-menu sidebar-height-with-ns">
      <a-menu
        :style="{ width: '200px', height: '100%' }"
        :default-open-keys="['ResourceList']"
        :default-selected-keys="['NamespacePolicyList']"
        :selected-keys="[app.menu.setting]"
        show-collapse-button
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
