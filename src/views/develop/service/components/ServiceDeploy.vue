<script setup>
const props = defineProps(['deploy'])
console.log(props)
</script>

<template>
  <div v-if="deploy">
    <a-card style="margin-bottom: 12px" :bordered="true">
      <template #title>
        {{ deploy.name }}
        <span v-if="deploy.k8s_type_config">
          部署平台: {{ deploy.k8s_type_config.cluster_id }}
        </span>
        <span v-if="deploy.status">
            状态: {{ deploy.status.stage }}(<ShowTime :timestamp="deploy.status.update_at" />)
        </span>
      </template>
      <template #extra>
        <a-link>YAML</a-link>
        <a-link>详情</a-link>
      </template>
      {{ deploy }}
    </a-card>
  </div>
</template>

<style scoped></style>
