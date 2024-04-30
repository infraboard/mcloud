<script setup>
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { onMounted } from 'vue'

const router = useRouter()
const menuItemClickHandler = (routeName) => {
  app.value.menu.develop = routeName
  router.push({ name: routeName })
}

onMounted(() => {
  app.value.system = 'DevelopPage'
  app.value.menu.develop = router.currentRoute.value.name
})
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
          <template #title> <span class="menu-title">服务管理</span></template>
          <a-menu-item key="ServiceList">服务列表</a-menu-item>
          <a-menu-item key="ServiceClusterList">部署集群</a-menu-item>
          <a-menu-item key="ApprovalList">上线申请</a-menu-item>
          <a-menu-item key="TaskAuditList">任务审批</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="DevToolManage">
          <template #icon><icon-common /></template>
          <template #title><span class="menu-title">研发工具</span></template>
          <a-menu-item key="DomainPipelineList">流水线模版</a-menu-item>
          <a-menu-item key="PipelineTaskList">流水线记录</a-menu-item>
          <a-menu-item key="DomainJobList">任务模版</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="ConsoleAudit">
          <template #icon><icon-video-camera /></template>
          <template #title><span class="menu-title">登录审计</span></template>
          <a-menu-item key="PodAudit">容器登录</a-menu-item>
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
