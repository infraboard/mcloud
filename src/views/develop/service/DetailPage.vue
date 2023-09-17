<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ServiceCluster from './components/ServiceCluster.vue'
import ServiceBuild from './components/ServiceBuild.vue'

const router = useRouter()
const tab = ref(router.currentRoute.value.query.tab)
if (!tab.value) {
  tab.value = 'BaseInfo'
}
const ChangeTab = (v) => {
  tab.value = v
  router.replace({ query: { tab: v } })
}
</script>

<template>
  <div>
    <!-- 页头 -->
    <a-page-header title="详情" class="detail-header" @back="router.push({ name: 'ServiceList' })">
    </a-page-header>
    <!-- 详情标签页 -->
    <a-tabs :active-key="tab" @change="ChangeTab" lazy-load>
      <a-tab-pane key="BaseInfo" title="基础信息"> </a-tab-pane>
      <a-tab-pane key="ServiceCluster" title="服务部署">
        <ServiceCluster></ServiceCluster>
      </a-tab-pane>
      <a-tab-pane key="ServiceBuild" title="持续构建">
        <ServiceBuild></ServiceBuild>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
