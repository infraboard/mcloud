<script setup>
import { app } from '@/stores/localstorage'
import { LIST_K8S_CLUSTER, DELETE_K8S_CLUSTER } from '@/api/mpaas/k8s'
import { onMounted, reactive, ref } from 'vue'
import { Notification } from '@arco-design/web-vue'
import { useRouter } from 'vue-router';
import { Modal } from '@arco-design/web-vue';

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
    var resp = await LIST_K8S_CLUSTER(queryParams)
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
const handleSelect = async (e, v, cluster) => {
  e.stopPropagation()
  switch (v) {
    case 'delete':
      Modal.warning({
        title: '集群删除提醒',
        content: `你当前正在删除【${cluster.name}】集群, 是否确认？`,
        ok: async () => {
          await DELETE_K8S_CLUSTER(cluster.id)
          Notification.success(`删除${cluster.id}成功`)
          QueryData()
        }
      });
      break
    case 'update':
      router.push({ name: 'K8sClusterCreate', query: { id: cluster.id } })
      break;
    default:
      break
  }
}

const jumpToDashboard = (cluster) => {
  router.push({ name: 'K8sDashoard', params: { id: cluster.id } })
  app.value.menu.k8s_dashboard = cluster.id
}

</script>

<template>
  <div class="page">
    <div class="table-op">
      <div>
        <a-button type="primary" @click="$router.push({ name: 'K8sClusterCreate' })" :size="app.size">
          添加集群
        </a-button>
      </div>
      <div style="margin-left: auto; margin-right: 12px">
        <a-pagination :size="app.size" :total="pagination.total" @change="pageChange"
          @page-size-change="pageSizeChange" />
      </div>
    </div>
    <div class="cluster-list">
      <a-card v-for="cluster in data.items" :key="cluster.id" class="cluster-card" hoverable
        @click="jumpToDashboard(cluster)">
        <template #title>
          <div class="cluster-title">
            {{ cluster.name }}
          </div>
        </template>
        <template #extra>
          <a-button type="text" :size="app.size" @click="handleSelect($event, 'update', cluster)">
            <template #icon>
              <icon-edit />
            </template>
          </a-button>
          <a-button type="text" :size="app.size" @click="handleSelect($event, 'delete', cluster)">
            <template #icon>
              <icon-delete style="color: rgb(var(--red-6));" />
            </template>
          </a-button>
        </template>
        <div class="cluster-content">
          <span>{{ cluster.server_info.server }}</span>
          (<span>{{ cluster.server_info.version }}</span>)
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.page {
  height: calc(100vh - 60px);
  background-color: var(--color-fill-1);
  padding-top: 12px;
}

.cluster-title {
  display: flex;
  align-items: center;
}

.cluster-list {
  display: flex;
  flex-wrap: wrap;
}

.cluster-card {
  margin-right: 12px;
  width: 360px;
  cursor: pointer;
}

.cluster-card:hover {
  background-color: var(--color-primary-light-1);
}

.list-params {
  display: flex;
}

.cluster-content {
  font-size: 12px;
  margin-top: 12px;
}
</style>
