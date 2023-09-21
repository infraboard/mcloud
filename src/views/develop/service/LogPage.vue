<script setup>
import { reactive } from 'vue'
import ServiceLog from './components/ServiceLog.vue'

const logOption = reactive({
  cluster_id: 'docker-desktop',
  namespace: 'default',
  pod_name: 'mcenter-55c58f449f-9zj2d',
  container_name: ''
})
</script>

<template>
  <div>
    <ServiceLog :option="logOption"></ServiceLog>
  </div>
</template>
