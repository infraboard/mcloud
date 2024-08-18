<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.person = routeName
  router.push({ name: routeName })
}

onMounted(() => {
  app.value.menu.person = router.currentRoute.value.name
})
</script>

<template>
  <a-layout class="system">
    <a-layout-sider collapsible class="sidebar" breakpoint="xl">
      <a-menu
        :default-open-keys="['AccountManage']"
        :default-selected-keys="['UpdateMyPassword']"
        :selected-keys="[app.menu.person]"
        auto-open
        breakpoint="xl"
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="AccountManage">
          <template #icon><icon-lock /></template>
          <template #title><span class="menu-title">账号安全</span></template>
          <a-menu-item key="UpdateMyPassword">重置密码</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="MessageManage">
          <template #icon><icon-email /></template>
          <template #title><span class="menu-title">消息中心</span></template>
          <a-menu-item key="ListMyMessage">我的消息</a-menu-item>
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
