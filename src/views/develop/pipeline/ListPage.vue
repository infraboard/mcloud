<script setup>
import { app } from '@/stores/localstorage'
import { LIST_PIPELINE } from '@/api/mflow/pipeline'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: pagination.current,
  page_size: pagination.pageSize,
  is_template: true
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
  try {
    queryLoading.value = true
    var resp = await LIST_PIPELINE(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询流水线模版失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData()
})
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button
        type="primary"
        :size="app.size"
        @click="router.push({ name: 'DomainPipelineCreate' })"
      >
        创建模版
      </a-button>
    </div>
    <a-card class="table-data">
      <a-table
        :data="data.items"
        :loading="queryLoading"
        :pagination="pagination"
        @page-change="pageChange"
        @page-size-change="pageSizeChange"
      >
        <template #columns>
          <a-table-column title="名称">
            <template #cell="{ record }">
              <a-link
                @click="router.push({ name: 'DomainPipelineDetail', params: { id: record.id } })"
                >{{ record.name }}</a-link
              >
            </template>
          </a-table-column>
          <a-table-column title="描述" data-index="description"></a-table-column>
          <a-table-column title="来源" data-index="visiable_mode"></a-table-column>
          <a-table-column title="创建时间">
            <template #cell="{ record }">
              <ShowTime :timestamp="record.create_at"></ShowTime>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped></style>
