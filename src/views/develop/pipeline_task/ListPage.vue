<script setup>
import { app } from '@/stores/localstorage'
import { _pagination } from '@/stores/pagination'
import { LIST_PIPELINE_TASK, DELETE_PIPELINE_TASK } from '@/api/mflow/task'
import { Notification } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分页参数
const pagination = reactive(_pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize,
  job_id: router.currentRoute.value.params.id
})

const pageChange = (v) => {
  pagination.current = v
  QueryData()
}
const pageSizeChange = (v) => {
  pagination.pageSize = v
  pagination.current = 1
  QueryData()
}

const queryLoading = ref(false)
const data = reactive({ items: [], total: 0 })
const QueryData = async () => {
  queryParams.page_number = pagination.current
  queryParams.page_size = pagination.pageSize
  try {
    queryLoading.value = true
    var resp = await LIST_PIPELINE_TASK(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Notification.error(`查询Task失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData()
})

// 删除执行记录
const selectRow = ref('')
const deleteTask = async (id) => {
  selectRow.value = id
  try {
    await DELETE_PIPELINE_TASK(id)
    QueryData()
  } finally {
    selectRow.value = ''
  }
}
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <a-table
      :data="data.items"
      :loading="queryLoading"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #columns>
        <a-table-column title="开始时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.start_at"></ShowTime>
          </template>
        </a-table-column>
        <a-table-column title="流水线" data-index="pipeline.name"></a-table-column>
        <a-table-column title="执行模式" data-index="run_mode"></a-table-column>
        <a-table-column title="调试模式" data-index="dry_run"></a-table-column>
        <a-table-column title="状态">
          <template #cell="{ record }">
            <span>{{ record.stage }}</span>
          </template>
        </a-table-column>
        <a-table-column title="耗时">
          <template #cell="{ record }">
            <ShowTime
              v-if="record.end_at"
              :timestamp="record.end_at - record.start_at"
              isDuration
            ></ShowTime>
            <span v-else>-</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="200">
          <template #cell="{ record }">
            <a-button
              type="text"
              :size="app.size"
              @click="router.push({ name: 'PipelineTaskDetail', params: { id: record.id } })"
            >
              <template #icon>
                <icon-file />
              </template>
              详情
            </a-button>
            <a-popconfirm
              :content="`您确定要删除吗?`"
              type="warning"
              :ok-loading="selectRow === record.id"
              @ok="deleteTask(record.id)"
            >
              <a-button type="text" status="danger" :size="app.size">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
