<script setup>
import { app } from '@/stores/localstorage'
import { LIST_APPROVAL } from '@/api/mflow/approval'
import { onMounted, reactive, ref } from 'vue'

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize
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
    var resp = await LIST_APPROVAL(queryParams)
    data.items = resp.items
    data.total = resp.total
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
      <a-button type="primary" :size="app.size"> 创建申请 </a-button>
    </div>
    <a-table
      :data="data.items"
      :loading="queryLoading"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #columns>
        <a-table-column title="名称" data-index="name"></a-table-column>
        <a-table-column title="类型" data-index="type"></a-table-column>
        <a-table-column title="仓库" data-index="code_repository.ssh_url"></a-table-column>
        <a-table-column title="创建时间" data-index="create_at"></a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
