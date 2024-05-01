<script setup>
import { app } from '@/stores/localstorage'
import { LIST_JOB_TASK, Audit_JOB_TASK } from '@/api/mflow/task'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize,
  audit_enable: true,
  audit_stages: '',
  auditor: app.value.token.user_id
})

const pageChange = (v) => {
  queryParams.page_number = v
  QueryData()
}
const pageSizeChange = (v) => {
  queryParams.page_size = v
  queryParams.page_number = 1
  QueryData()
}

const queryLoading = ref(false)
const data = reactive({ items: [], total: 0 })
const QueryData = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_JOB_TASK(queryParams)
    data.items = resp.items
    data.total = resp.total
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData()
})

// 审核
const auditLoadding = ref('')
const auditRequest = ref({
  comment: '',
  stage: ''
})
const handleAuditJobTask = async (isPass, record) => {
  auditLoadding.value = record.id
  if (isPass) {
    auditRequest.value.stage = 'PASS'
  } else {
    auditRequest.value.stage = 'DENY'
  }

  try {
    await Audit_JOB_TASK(record.id)
  } finally {
    auditLoadding.value = ''
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
        <a-table-column title="任务名称" data-index="task_name">
          <template #cell="{ record }">
            <a-button
              type="text"
              :size="app.size"
              @click="
                router.push({ name: 'PipelineTaskDetail', params: { id: record.pipeline_task } })
              "
            >
              {{ record.task_name }}
            </a-button>
          </template>
        </a-table-column>
        <a-table-column title="开始时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.status.start_at"></ShowTime>
          </template>
        </a-table-column>
        <a-table-column title="模式" data-index="run_mode"></a-table-column>
        <a-table-column title="状态">
          <template #cell="{ record }">
            <span>{{ record.audit.status.stage }}</span>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="200">
          <template #cell="{ record }">
            <a-button
              type="text"
              :size="app.size"
              status="success"
              :loading="auditLoadding === record.id"
              @click="handleAuditJobTask(true, record)"
            >
              <template #icon>
                <icon-check-circle-fill />
              </template>
              同意
            </a-button>
            <a-button
              type="text"
              :size="app.size"
              status="danger"
              @click="auditLoadding = record.id"
            >
              <template #icon>
                <icon-close-circle-fill />
              </template>
              拒绝
            </a-button>

            <a-modal
              class="deny-frame"
              hideTitle
              :visible="auditLoadding === record.id"
              @ok="handleAuditJobTask(false, record)"
              @cancel="auditLoadding = ''"
              :bodyStyle="{ padding: '6px 6px 0px 6px' }"
            >
              <div>
                <a-textarea style="height: 160px" placeholder="请输入审核不通过的原因" />
              </div>
            </a-modal>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
