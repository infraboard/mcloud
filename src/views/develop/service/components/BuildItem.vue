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
          <a-table-column align="center" title="触发状态">
            <template #cell="{ record }">
              <span v-if="record.build_status[0].error_message">
                <a-popover :content-style="{ fontSize: '12px' }">
                  <a-button size="mini" type="text" status="danger"
                    >失败 <icon-question-circle-fill
                  /></a-button>
                  <template #content>
                    {{ record.build_status[0].error_message }}
                  </template>
                </a-popover>
              </span>
              <span v-else style="color: rgb(var(--success-6))">成功</span>
            </template>
          </a-table-column>
          <a-table-column align="center" title="流水线状态">
            <template #cell="{ record }">
              <div v-if="ps(record).id">
                <a-button
                  @click="
                    $router.push({ name: 'PipelineTaskDetail', params: { id: ps(record).id } })
                  "
                  size="mini"
                  type="text"
                  :status="ps(record).color"
                  >{{ ps(record).stage }}</a-button
                >
              </div>
              <span v-else>-</span>
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
      build_conf_ids: props.buildConf.id,
      with_pipeline_task: true
    })
    records.value = resp
  } finally {
    queryLoadding.value = false
  }
}

const bs = (record) => {
  const status = {
    stage: '成功',
    color: 'success',
    message: ''
  }
  if (record.build_status.length > 0) {
    const bs = record.build_status[0]
    if (bs.error_message) {
      status.stage = '失败'
      status.message = bs.error_message
    }
  }

  return status
}

const ps = (record) => {
  const status = {
    stage: '无',
    color: '',
    id: ''
  }
  if (record.build_status.length > 0) {
    const bs = record.build_status[0]
    const pt = bs.pipline_task
    if (pt) {
      status.id = pt.id
      switch (pt.stage) {
        case 'FAILED':
          status.stage = '失败'
          status.color = 'danger'
          break
        default:
          break
      }
    }
  }

  return status
}
</script>

<style scoped>
.job-card :deep(.arco-table-th) {
  background-color: #fff;
}
</style>
