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
  <div class="system">
    <!-- 菜单导航区 -->
    <div class="sidebar">
      <a-menu
        :style="{ width: '200px', height: '100%', marginRight: '16px' }"
        :default-open-keys="['AccountManage']"
        :default-selected-keys="['UpdateMyPassword']"
        :selected-keys="[app.menu.person]"
        show-collapse-button
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
