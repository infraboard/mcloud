<script setup>
import { app } from '@/stores/localstorage'
import { LIST_K8S_CLUSTER, DELETE_K8S_CLUSTER } from '@/api/mpaas/k8s'
import { Message } from '@arco-design/web-vue'
import { onMounted, reactive, ref } from 'vue'
import { Notification } from '@arco-design/web-vue'

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
  QueryData()
})

// 处理操作
const handleSelect = async (v, id) => {
  switch (v) {
    case 'delete':
      await DELETE_K8S_CLUSTER(id)
      Notification.success(`删除${id}成功`)
      QueryData()
      break
    default:
      break
  }
}
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button type="primary" @click="$router.push({ name: 'K8sClusterCreate' })" :size="app.size">
        添加集群
      </a-button>
    </div>
    <a-table
      :size="app.size"
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
              @click="$router.push({ name: 'K8sClusterCreate', query: { id: record.id } })"
            >
              编辑
            </a-button>
            <a-divider direction="vertical" />
            <a-dropdown @select="handleSelect($event, record.id)">
              <a-button type="text"><icon-more-vertical /></a-button>
              <template #content>
                <a-doption value="delete">
                  <template #icon>
                    <icon-delete />
                  </template>
                  删除
                </a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
