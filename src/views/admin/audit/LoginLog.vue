<script setup>
import { app } from '@/stores/localstorage'
import { LIST_TOKEN } from '@/api/mcenter/token'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize
})

const pageChange = (v) => {
  queryParams.page_number.current = v
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
  // 补充分页参数
  queryParams.page_number = pagination.current
  queryParams.page_size = pagination.pageSize

  try {
    queryLoading.value = true
    var resp = await LIST_TOKEN(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询登录日志失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(() => {
  QueryData(queryParams)
})
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op"></div>
    <a-table
      :data="data.items"
      :loading="queryLoading"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #columns>
        <a-table-column title="令牌" data-index="access_token"></a-table-column>
        <a-table-column title="用户Id" data-index="user_id"></a-table-column>
        <a-table-column title="用户类型" data-index="user_type"></a-table-column>
        <a-table-column title="授权类型" data-index="grant_type"></a-table-column>
        <a-table-column title="用途" data-index="platform"></a-table-column>
        <a-table-column title="颁发时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.issue_at"></ShowTime>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
