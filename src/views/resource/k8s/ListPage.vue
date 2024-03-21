<script setup>
import { app } from '@/stores/localstorage'
import { LIST_K8S_CLUSTER } from '@/api/mpaas/k8s'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: pagination.current,
  page_size: pagination.pageSize,
  with_role: true
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
    var resp = await LIST_K8S_CLUSTER(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询k8s集群失败: ${error}`)
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
      <a-button type="primary" @click="$router.push({ name: 'K8sClusterCreate' })" :size="app.size">
        添加集群
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
          <a-table-column title="名称" data-index="name"></a-table-column>
          <a-table-column title="地址" data-index="server_info.server"></a-table-column>
          <a-table-column title="版本" data-index="server_info.version"></a-table-column>
          <a-table-column title="认证用户" data-index="server_info.auth_user"></a-table-column>
          <a-table-column title="创建时间" data-index="create_at"></a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped></style>
