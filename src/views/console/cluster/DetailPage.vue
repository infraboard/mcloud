<script setup>
import { onBeforeMount, ref, watch } from 'vue'
import { DESCRIBE_CLUSTER } from '@/api/mpaas/cluster'
import { DELETE_DEPLOY } from '@/api/mpaas/deploy'
import { Notification } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import { parse } from 'yaml'
import { app } from '@/stores/localstorage'

const router = useRouter()

// 查询环境标签
const queryLoading = ref(false)
const cluster = ref({
  deployments: { items: [], totoal: 0 }
})

// 查询服务部署集群
const GetCluster = async () => {
  try {
    queryLoading.value = true
    const id = router.currentRoute.value.params.id
    const resp = await DESCRIBE_CLUSTER(id, { with_deploy: true })
    resp.deployments.items.forEach((element) => {
      try {
        element._service = parse(element.k8s_type_config.service)
      } catch (error) {
        console.log(error)
      }
    })
    cluster.value = resp
  } catch (error) {
    Notification.error(`查询集群失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onBeforeMount(async () => {
  await GetCluster()
})

watch(
  () => router.currentRoute.value.fullPath,
  async () => {
    if (router.currentRoute.value.name === 'ClusterDetail') {
      await GetCluster()
    }
  }
)

// 处理操作
const handleSelect = async (v, id) => {
  switch (v) {
    case 'delete':
      await DELETE_DEPLOY(id)
      Notification.success(`删除${id}成功`)
      GetCluster()
      break
    default:
      break
  }
}

const showAccessPort = (service) => {
  const ports = []
  service.spec.ports.forEach((element) => {
    ports.push(`${element.protocol} | ${element.port}`)
  })
  return ports
}
</script>

<template>
  <div class="page">
    <div class="service-cluster f12">
      {{ cluster.name }}
      <span>创建于 <ShowTime :timestamp="cluster.create_at"></ShowTime></span>
      <a-button
        type="text"
        @click="
          $router.push({
            name: 'CreateDeploy',
            query: { cluster_id: $route.params.id, kind: cluster.kind }
          })
        "
        size="mini"
      >
        创建部署
      </a-button>
      <!-- 部署列表 -->
      <a-table
        class="deployments"
        :bordered="true"
        :pagination="false"
        :data="cluster.deployments.items"
      >
        <template #columns>
          <a-table-column align="center" title="名称" data-index="name"></a-table-column>
          <a-table-column align="center" title="服务版本">
            <template #cell="{ record }">
              {{ record.service_name }}:{{ record.service_version }}
            </template>
          </a-table-column>
          <a-table-column align="center" title="部署分组">
            <template #cell="{ record }">
              {{ record.labels.DeployGroup }}
            </template>
          </a-table-column>
          <a-table-column align="center" title="状态">
            <template #cell="{ record }">
              {{ record.status.stage }}
              (<ShowTime :timestamp="record.status.update_at" />)
            </template>
          </a-table-column>
          <a-table-column align="center" title="访问IP">
            <template #cell="{ record }">
              {{ record._service.spec.clusterIP }}
            </template>
          </a-table-column>
          <a-table-column align="center" title="访问端口">
            <template #cell="{ record }">
              <a-tag
                v-for="(port, index) of showAccessPort(record._service)"
                :key="index"
                color="green"
                bordered
                >{{ port }}</a-tag
              >
            </template>
          </a-table-column>
          <a-table-column align="center" title="操作" :width="200">
            <template #cell="{ record }">
              <a-button
                type="text"
                :size="app.size"
                @click="$router.push({ name: 'CreateDeploy', query: { id: record.id } })"
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
  </div>
</template>

<style scoped>
.page :deep(.arco-radio-group-button) {
  background-color: var(--color-fill-3);
}

.header-item {
  display: flex;
}

.service-cluster {
  margin-top: 12px;
}

.cluster-item {
  margin-bottom: 12px;
}

.deployments :deep(.arco-table-th) {
  background-color: var(--color-neutral-2);
}
</style>
