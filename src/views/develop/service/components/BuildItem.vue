<template>
  <a-card class="job-card" hoverable>
    <template #title>
      <a-space>
        <span>{{ buildConf.name }}</span>
        <span>创建于: <ShowTime :timestamp="buildConf.create_at"></ShowTime></span>
        <span
          ><span>触发规则: </span>{{ buildConf.condition.events.join(',') }}/{{
            buildConf.condition.sub_events.join(',')
          }}</span
        >
        <span>状态: {{ buildConf.enabled ? '启用中' : '未启用' }}</span>
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
      <a-table
        :pagination="pagination"
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
        :loading="queryLoadding"
        :data="records.items"
      >
        <template #columns>
          <a-table-column align="center" title="时间">
            <template #cell="{ record }">
              <ShowTime :timestamp="record.time / 1000"></ShowTime>
            </template>
          </a-table-column>
          <a-table-column align="center" title="事件" data-index="name" />
          <a-table-column align="center" title="分支" data-index="sub_name" />
          <a-table-column align="center" title="状态">
            <template #cell="{ record }">
              <span v-if="record.build_status[0].stage === 'FAILED'">
                <a-popover :content-style="{ fontSize: '12px' }">
                  <div v-if="ps(record).id">
                    <a-button
                      @click="
                        $router.push({ name: 'PipelineTaskDetail', params: { id: ps(record).id } })
                      "
                      size="mini"
                      type="text"
                      status="danger"
                      >失败 <icon-question-circle-fill
                    /></a-button>
                  </div>
                  <a-button v-else size="mini" type="text" status="danger"
                    >失败 <icon-question-circle-fill
                  /></a-button>
                  <template #content>
                    {{ record.build_status[0].error_message }}
                  </template>
                </a-popover>
              </span>
              <span v-else-if="record.build_status[0].stage === 'RUNNING'">
                <a-button
                  @click="
                    $router.push({ name: 'PipelineTaskDetail', params: { id: ps(record).id } })
                  "
                  size="mini"
                  type="text"
                  status="info"
                  >运行中</a-button
                ></span
              >
              <span
                v-else-if="record.build_status[0].stage === 'SUCCESS'"
                style="color: rgb(var(--success-6))"
              >
                <a-button
                  @click="
                    $router.push({ name: 'PipelineTaskDetail', params: { id: ps(record).id } })
                  "
                  size="mini"
                  type="text"
                  status="success"
                  >成功</a-button
                ></span
              >
              <span
                v-else-if="record.build_status[0].stage === 'ENQUEUE'"
                style="color: rgb(var(--arcoblue-3))"
                >排队中</span
              >
              <span v-else style="color: var(--color-neutral-4)">等待中</span>
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
import { onMounted, reactive, ref, watch } from 'vue'

// 声明属性
const props = defineProps(['buildConf', 'refresh_record'])

const router = useRouter()

const goToEdit = () => {
  router.push({ name: 'BuildConfCreate', query: { id: props.buildConf.id } })
}

// 分页参数
const pagination = reactive({
  size: 'medium',
  total: 0,
  current: 1,
  pageSize: 5,
  showTotal: true,
  showMore: true,
  showJumper: true,
  showPageSize: true,
  pageSizeOptions: [5, 10, 20, 50, 100]
})
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize,
  build_conf_ids: props.buildConf.id,
  with_pipeline_task: true
})

const pageChange = (v) => {
  pagination.current = v
  queryBuildRecord()
}
const pageSizeChange = (v) => {
  pagination.current = 1
  pagination.pageSize = v
  queryBuildRecord()
}

onMounted(() => {
  queryBuildRecord()
})

// 填充默认值
watch(
  () => props.refresh_record,
  (newV) => {
    if (newV) {
      queryBuildRecord()
    }
  }
)

const queryLoadding = ref(false)
const records = ref({ items: [] })
const queryBuildRecord = async () => {
  queryParams.page_number = pagination.current
  queryParams.page_size = pagination.pageSize
  queryLoadding.value = true
  try {
    const resp = await LIST_TRIGGER_RECORD(queryParams)
    records.value = resp
    pagination.total = resp.total
  } finally {
    queryLoadding.value = false
  }
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
        case 'ACTIVE':
          status.stage = '运行中'
          status.color = 'info'
          break
        case 'SUCCEEDED':
          status.stage = '成功'
          status.color = 'success'
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
