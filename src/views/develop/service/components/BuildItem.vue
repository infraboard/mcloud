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
      <a-table :loading="queryLoadding" :data="records.items">
        <template #columns>
          <a-table-column align="center" title="时间">
            <template #cell="{ record }">
              <ShowTime :timestamp="record.time / 1000"></ShowTime>
            </template>
          </a-table-column>
          <a-table-column align="center" title="事件" data-index="name" />
          <a-table-column align="center" title="分支" data-index="sub_name" />
          <a-table-column align="center" title="执行状态">
            <template #cell="{ record }">
              <div v-if="record.build_status && record.build_status[0].pipline_task"></div>
              <div v-else>-</div>
            </template>
          </a-table-column>
        </template>
      </a-table>
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
    records.value = resp
  } finally {
    queryLoadding.value = false
  }
}
</script>

<style scoped>
.job-card :deep(.arco-table-th) {
  background-color: #fff;
}
</style>
