<script setup>
import { reactive } from 'vue'

const logOption = reactive({
  cluster_id: 'docker-desktop',
  namespace: 'default',
  pod_name: 'mcenter-55c58f449f-9zj2d',
  container_name: ''
})
</script>

<template>
  <div>
    <PodLog
      :option="logOption"
      :width="'calc(100vw - 260px)'"
      :height="'calc(100vh - 40px)'"
    ></PodLog>
  </div>
</template>

<style scoped></style>
