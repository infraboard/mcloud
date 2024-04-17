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
      <a-button status="danger" size="mini" type="text">
        <template #icon>
          <icon-delete />
        </template>
        删除
      </a-button>
    </template>
    <div>
      <a-table :loading="queryLoadding" :columns="columns" :data="records.items" />
    </div>
  </a-card>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { LIST_TRIGGER_RECORD } from '@/api/mflow/trigger'
import { onMounted, ref } from 'vue'

// 声明属性
const props = defineProps(['buildConf'])

const router = useRouter()

const goToEdit = () => {
  router.push({ name: 'BuildConfCreate', query: { id: props.buildConf.id } })
}

onMounted(() => {
  queryBuildRecord()
})

const queryLoadding = ref(false)
const records = ref({ items: [] })
const queryBuildRecord = async () => {
  queryLoadding.value = true
  try {
    const resp = await LIST_TRIGGER_RECORD({
      build_conf_ids: props.buildConf.id
    })
    console.log(resp)
  } finally {
    queryLoadding.value = false
  }
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name'
  }
]
</script>

<style scoped></style>
