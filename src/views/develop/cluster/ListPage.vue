<script setup>
import { app } from '@/stores/localstorage'
import { LIST_CLUSTER } from '@/api/mpaas/cluster'
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
  try {
    queryLoading.value = true
    var resp = await LIST_CLUSTER(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询部署失败: ${error}`)
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
      <a-button type="primary" :size="app.size"> 创建集群 </a-button>
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
              <a-link @click="router.push({ name: 'ClusterDetail', params: { id: record.id } })">{{
                record.name
              }}</a-link>
            </template>
          </a-table-column>
          <a-table-column title="类型" data-index="type"></a-table-column>
          <a-table-column title="仓库" data-index="code_repository.ssh_url"></a-table-column>
          <a-table-column title="创建时间" data-index="create_at"></a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped></style>
