<script setup>
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { computed, h, onBeforeMount, ref, reactive } from 'vue'
import { LIST_CLUSTER } from '@/api/mpaas/cluster'
import BreatheLamp from '@/components/BreatheLamp.vue'
import { LIST_NAMESPACE } from '@/api/mcenter/namespace'
import { CHANGE_NAMESPACE } from '@/api/mcenter/token'
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'

const consoleType = ref('log')

const router = useRouter()
const selectedPod = ref([router.currentRoute.value.query.pod_name])

// 查询空间列表
const currentNamespace = ref(app.value.token.namespace)
const namespaces = reactive({ items: [], total: 0 })
const ListNamespace = async () => {
  var resp = await LIST_NAMESPACE()
  namespaces.items = resp.items
  namespaces.total = resp.total
}

// 切换空间
const ChangeNamespace = async (namespace) => {
  var resp = await CHANGE_NAMESPACE({ namespace })
  app.value.token = resp
  router.go(0)
  selectedPod.value = []
  router.push({name: 'ServiceConsole'})
}

// 查询环境标签
const queryLoading = ref(false)
const envs = ref([])
const QueryEnv = async () => {
  try {
    queryLoading.value = true
    var resp = await LIST_LABEL({ keys: 'Env' })
    if (resp.items.length > 0) {
      envs.value = resp.items[0].enum_options
    }
  } catch (error) {
    Message.error(`查询标签失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

const currentEnv = ref('开发')
const clusters = ref({
  items: [],
  total: 1
})
const changeEnv = (v) => {
  currentEnv.value = v
  QueryCluster()
}

// 查询服务部署集群
const QueryCluster = async () => {
  try {
    queryLoading.value = true
    const listClusterReq = {
      filters: `Env=${currentEnv.value}`,
      with_deploy: true,
      with_service: true,
      to_tree: true
    }

    const resp = await LIST_CLUSTER(listClusterReq)
    initData(resp.items)
    clusters.value = resp
  } catch (error) {
    Message.error(`查询集群失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

function initData(nodes) {
  const loop = (data) => {
    data.forEach((item) => {
      if (item.extra.status) {
        item.switcherIcon = () => {
          return h(BreatheLamp)
        }
      }
      if (item.children) {
        loop(item.children)
      }
    })
  }

  return loop(nodes)
}

onBeforeMount(async () => {
  await ListNamespace()
  await QueryEnv()
  await QueryCluster()
})

const searchKey = ref('')
const treeData = computed(() => {
  if (!searchKey.value) return clusters.value.items
  return searchData(searchKey.value)
})

function searchData(keyword) {
  const loop = (data) => {
    const result = []
    data.forEach((item) => {
      if (item.title.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result
  }

  return loop(clusters.value.items)
}

function getMatchIndex(title) {
  if (!searchKey.value) return -1
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase())
}

const clickNode = (selectedKeys, data) => {
  const e = data.node.extra
  selectedPod.value[0] = e.pod_name
  if (e) {
    router.replace({
      query: {
        cluster_id: e.cluster_id,
        namespace: e.namespace,
        pod_name: e.pod_name
      }
    })
  }
}
</script>

<template>
  <a-layout class="layout">
    <a-layout-header class="content-header">
      <a-space>
        <a-select
          placeholder="请选择工作空间"
          :bordered="false"
          v-model="currentNamespace"
          @change="ChangeNamespace"
        >
          <a-option
            v-for="item in namespaces.items"
            :key="item.id"
            :label="item.description"
            :value="item.name"
          ></a-option>
        </a-select>

        <a-select
          :bordered="false"
          :model-value="currentEnv"
          size="small"
          @change="changeEnv"
          placeholder="请选择环境"
        >
          <a-option :value="env.value" v-for="env in envs" :key="env.label" :label="env.label" />
        </a-select>
      </a-space>
      <a-space>
        <a-button type="outline" size="small">
          <template #icon>
            <icon-tool />
          </template>
          工具箱
        </a-button>
      </a-space>
      <a-space>
        <a-radio-group
          style="margin-left: 12px"
          size="small"
          type="button"
          v-model="consoleType"
          default-value="log"
        >
          <a-radio value="log"><icon-file /> 日志</a-radio>
          <a-radio value="console"><icon-desktop /> 控制台</a-radio>
        </a-radio-group>
      </a-space>
    </a-layout-header>
    <a-layout>
      <a-layout-sider breakpoint="xl" :width="260" class="sider">
        <a-input-search style="margin-bottom: 8px; max-width: 240px" v-model="searchKey" />
        <!-- Loading 骨架 -->
        <a-skeleton v-if="queryLoading" animation :loading="queryLoading">
          <a-space direction="vertical" :style="{ width: '100%' }" size="mini">
            <a-skeleton-line :rows="10" />
          </a-space>
        </a-skeleton>
        <div v-else>
          <!-- 服务树 -->
          <a-tree
            v-if="clusters.items.length > 0"
            style="width: 100%"
            size="mini"
            :blockNode="true"
            :show-line="true"
            :data="treeData"
            :selected-keys="selectedPod"
            @select="clickNode"
          >
            <template #title="nodeData">
              <template v-if="((index = getMatchIndex(nodeData?.title)), index < 0)">{{
                nodeData?.title
              }}</template>
              <span v-else>
                {{ nodeData?.title?.substr(0, index) }}
                <span style="color: var(--color-primary-light-4)">
                  {{ nodeData?.title?.substr(index, searchKey.length) }} </span
                >{{ nodeData?.title?.substr(index + searchKey.length) }}
              </span>
            </template>
          </a-tree>
          <a-empty v-else />
        </div>
      </a-layout-sider>
      <a-layout-content>
        <!-- 内容操作区 -->
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.layout {
  height: 100vh;
}

.sider {
  padding: 12px;
  border-right: 1px solid rgb(229, 230, 235);
}

.content-header {
  padding: 0px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  border-bottom: 1px solid rgb(229, 230, 235);
}

.content {
  height: 100%;
}

.search {
  display: flex;
  height: 30px;
}

.search :deep(.arco-radio-group-button) {
  background-color: var(--color-fill-3);
}
</style>
