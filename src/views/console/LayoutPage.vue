<script setup>
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { computed, h, onBeforeMount, ref } from 'vue'
import { LIST_CLUSTER } from '@/api/mpaas/cluster'
import BreatheLamp from '@/components/BreatheLamp.vue'
import { useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'

const router = useRouter()
const selectedPod = ref([router.currentRoute.value.query.pod_name])

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
  app.value.system = 'ServiceConsole'
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
  selectedPod.value = selectedKeys
  switch (data.node.type) {
    case 'cluster':
      router.push({
        name: 'ClusterDetail',
        params: {
          id: data.node.key
        }
      })
      return
    case 'deploy':
      router.push({
        name: 'DeployDetail',
        params: {
          id: data.node.key
        }
      })
      return
    case 'pod':
      if (e) {
        console.log(e.pod_name)
        router.push({
          name: 'ServiceTerminal',
          query: {
            cluster_id: e.cluster_id,
            namespace: e.namespace,
            pod_name: e.pod_name
          }
        })
      }
      return
  }
}
</script>

<template>
  <a-layout class="layout">
    <TopMenu />
    <a-layout>
      <a-layout-sider breakpoint="xl" :width="381" class="sider">
        <!-- 环境 -->
        <a-radio-group class="env" v-model="currentEnv" @change="changeEnv" type="button">
          <a-radio :value="env.value" v-for="env in envs" :key="env.label">{{ env.label }}</a-radio>
        </a-radio-group>
        <!-- 搜索框 -->
        <a-input-search style="margin-bottom: 8px; max-width: 360px" v-model="searchKey" />
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
      <a-layout-content class="main">
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

.env {
  margin-bottom: 8px;
}
</style>
