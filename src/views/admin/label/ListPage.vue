<script setup>
import { app } from '@/stores/localstorage'
import { LIST_LABEL } from '@/api/mcenter/label'
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
    var resp = await LIST_LABEL()
    data.items = resp.items
    pagination.total = resp.total
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
        <a-table-column title="创建时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.create_at"></ShowTime>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
