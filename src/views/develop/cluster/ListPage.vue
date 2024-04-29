<script setup>
import { app } from '@/stores/localstorage'
import { LIST_CLUSTER, DELETE_CLUSTER } from '@/api/mpaas/cluster'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notification } from '@arco-design/web-vue'

const router = useRouter()

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
    var resp = await LIST_CLUSTER(queryParams)
    data.items = resp.items
    pagination.total = resp.total
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
      await DELETE_CLUSTER(id)
      Notification.success(`删除${id}成功`)
      QueryData()
      break
    default:
      break
  }
}

// 映射表
const kindMap = {
  WORKLOAD: '工作负载',
  MIDDLEWARE: '中间件'
}
</script>

<template>
  <div class="page">
    <BreadcrumbMenu />
    <div class="table-op">
      <a-button
        type="primary"
        @click="$router.push({ name: 'ServiceClusterCreate' })"
        :size="app.size"
      >
        创建集群
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
        <a-table-column title="名称">
          <template #cell="{ record }">
            <a-link @click="router.push({ name: 'ClusterDetail', params: { id: record.id } })">{{
              record.name
            }}</a-link>
          </template>
        </a-table-column>
        <a-table-column title="环境">
          <template #cell="{ record }">
            {{ record.labels.Env }}
          </template>
        </a-table-column>
        <a-table-column title="类型">
          <template #cell="{ record }">
            {{ kindMap[record.kind] }}
          </template>
        </a-table-column>
        <a-table-column title="描述" data-index="describe"></a-table-column>
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
              @click="router.push({ name: 'ServiceClusterCreate', query: { id: record.id } })"
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
