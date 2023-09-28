<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.develop = routeName
  router.push({ name: routeName })
}
</script>

<template>
  <TopMenu />
  <div class="sidebar">
    <!-- 菜单导航区 -->

    <div class="sidebar-menu">
      <a-menu
        :style="{ width: '200px', height: '100%' }"
        :default-open-keys="['DevelopPage']"
        :default-selected-keys="['ServiceList']"
        :selected-keys="[app.menu.develop]"
        show-collapse-button
        auto-open
        breakpoint="xl"
        @menu-item-click="menuItemClickHandler"
      >
        <a-sub-menu key="DevelopPage">
          <template #icon><icon-apps /></template>
          <template #title>服务管理</template>
          <a-menu-item key="ServiceList">服务列表</a-menu-item>
          <a-menu-item key="ApprovalList">上线申请</a-menu-item>
          <a-menu-item key="ServiceConsole">控制台</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="DevToolManage">
          <template #icon><icon-common /></template>
          <template #title>研发工具</template>
          <a-menu-item key="DomainPipelineList">Pipeline模版</a-menu-item>
          <a-menu-item key="DomainJobList">Job管理</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="ConsoleAudit">
          <template #icon><icon-video-camera /></template>
          <template #title>登录审计</template>
          <a-menu-item key="DomainPipelineList">Pod 登录</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
    <!-- 内容操作区 -->
    <div class="main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </div>
  </div>
</template>
