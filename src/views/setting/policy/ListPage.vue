<script setup>
import { app } from '@/stores/localstorage'
import { LIST_POLICY } from '@/api/mcenter/policy'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 分页参数
const pagination = reactive(app.value.pagination)
const queryParams = reactive({
  page_number: 1,
  page_size: pagination.pageSize,
  with_role: true
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
    var resp = await LIST_POLICY(queryParams)
    data.items = resp.items
    pagination.total = resp.total
  } catch (error) {
    Message.error(`查询策略失败: ${error}`)
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
      <a-button
        type="primary"
        :size="app.size"
        @click="router.push({ name: 'NamespacePolicyCreate' })"
      >
        添加策略
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
        <a-table-column title="空间" data-index="namespace"></a-table-column>
        <a-table-column title="用户" data-index="username"></a-table-column>
        <a-table-column title="角色">
          <template #cell="{ record }">
            <a-link @click="router.push({ name: 'RoleDetail', query: { id: record.role.id } })">{{
              record.role.name
            }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="create_at"></a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
