<script setup>
import { app } from '@/stores/localstorage'
import { LIST_NAMESPACE } from '@/api/mcenter/namespace'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    var resp = await LIST_NAMESPACE()
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询空间失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}
onMounted(async () => {
  QueryData()
})
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button type="primary" :size="app.size" @click="router.push({ name: 'CreateNamespace' })">
        创建空间
      </a-button>
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
        <a-table-column title="描述" data-index="description"></a-table-column>
        <a-table-column title="创建时间">
          <template #cell="{ record }">
            <ShowTime :timestamp="record.create_at"></ShowTime>
          </template>
        </a-table-column>
        <a-table-column align="center" title="操作" :width="200">
          <template #cell="{ record }">
            <a-button
              type="text"
              :size="app.size"
              @click="router.push({ name: 'CreateNamespace', query: { id: record.id } })"
            >
              编辑
            </a-button>
            <a-divider direction="vertical" />
            <a-dropdown>
              <a-button type="text"><icon-more-vertical /></a-button>
              <template #content>
                <a-doption>删除</a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
