<script setup>
import { app } from '@/stores/localstorage'
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: pagination.current,
  page_size: pagination.pageSize
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
  // 补充分页参数
  queryParams.page_number = pagination.current
  queryParams.page_size = pagination.pageSize

  try {
    queryLoading.value = true
    var resp = await LIST_LABEL()
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询标签失败: ${error}`)
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
    <div class="table-op">
      <a-button type="primary" :size="app.size"> 创建标签 </a-button>
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
          <a-table-column title="名称" data-index="key"></a-table-column>
          <a-table-column title="描述" data-index="value_desc"></a-table-column>
          <a-table-column title="创建时间" data-index="create_at"></a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped></style>
