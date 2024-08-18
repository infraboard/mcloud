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
  <a-layout class="system">
    <a-layout-sider collapsible class="sidebar" breakpoint="xl">
      <a-menu
        :default-open-keys="['DevelopPage']"
        :default-selected-keys="['ServiceList']"
        :selected-keys="[app.menu.develop]"
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
        </a-sub-menu>
        <a-sub-menu key="DevToolManage">
          <template #icon><icon-common /></template>
          <template #title><span class="menu-title">研发工具</span></template>
          <a-menu-item key="DomainPipelineList">流水线模版</a-menu-item>
          <a-menu-item key="PipelineTaskList">流水线记录</a-menu-item>
          <a-menu-item key="TaskAuditList">任务审批</a-menu-item>
          <a-menu-item key="DomainJobList">任务模版</a-menu-item>
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
