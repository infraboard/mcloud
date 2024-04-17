<template>
  <a-card class="job-card" hoverable>
    <template #title>
      <a-space>
        <span>{{ buildConf.name }}</span>
        <span>创建于: <ShowTime :timestamp="buildConf.create_at"></ShowTime></span>
        <span
          ><span>匹配规则: </span>{{ buildConf.condition.events.join(',') }}/{{
            buildConf.condition.sub_events.join(',')
          }}</span
        >
      </a-space>
    </template>
    <template #extra>
      <a-button size="mini" type="text" @click="goToEdit">
        <template #icon>
          <icon-edit />
        </template>
        修改
      </a-button>
    </template>
    {{ buildConf }}
  </a-card>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 声明属性
const props = defineProps(['buildConf'])

const router = useRouter()

const goToEdit = () => {
  router.push({ name: 'BuildConfCreate', query: { id: props.buildConf.id } })
}
</script>

<style scoped></style>
