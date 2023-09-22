<script setup>
import { LIST_LABEL } from '@/api/mcenter/label'
import { Message } from '@arco-design/web-vue'
import { computed, onBeforeMount, ref } from 'vue'
import { LIST_CLUSTER } from '@/api/mpaas/cluster'

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
      with_deploy: true
    }
    clusters.value = await LIST_CLUSTER(listClusterReq)
  } catch (error) {
    Message.error(`查询集群失败: ${error}`)
  } finally {
    queryLoading.value = false
  }
}

onBeforeMount(async () => {
  await QueryEnv()
  await QueryCluster()
})

const originTreeData = [
  {
    title: 'Service AA',
    key: '0-0',
    children: [
      {
        title: 'V1',
        key: '0-0-0',
        children: [
          {
            title: 'Pod A',
            key: '0-0-0-0'
          },
          {
            title: 'Pod B',
            key: '0-0-0-1'
          }
        ]
      },
      {
        title: 'V2',
        key: '0-0-1',
        children: [
          {
            title: 'PodA',
            key: '0-0-1-0'
          }
        ]
      }
    ]
  },
  {
    title: 'Service B',
    key: '1-0',
    children: [
      {
        title: 'V1',
        key: '1-0-0',
        children: [
          {
            title: 'Pod AAAAaaaaaaaaaaaaaaaa',
            key: '1-0-0-0'
          },
          {
            title: 'Pod B',
            key: '1-0-0-1'
          }
        ]
      },
      {
        title: 'V2',
        key: '1-0-1',
        children: [
          {
            title: 'PodA',
            key: '1-0-1-0'
          }
        ]
      }
    ]
  }
]

const searchKey = ref('')
const treeData = computed(() => {
  if (!searchKey.value) return originTreeData
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

  return loop(originTreeData)
}

function getMatchIndex(title) {
  if (!searchKey.value) return -1
  return title.toLowerCase().indexOf(searchKey.value.toLowerCase())
}
</script>

<template>
  <a-layout class="layout">
    <a-layout-header class="content-header">
      <div class="search">
        <a-radio-group :model-value="currentEnv" size="small" @change="changeEnv" type="button">
          <a-radio :value="env.value" v-for="env in envs" :key="env.label">{{ env.label }}</a-radio>
        </a-radio-group>
      </div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider breakpoint="xl" width="260" class="sider">
        <a-input-search style="margin-bottom: 8px; max-width: 240px" v-model="searchKey" />
        <a-tree size="mini" :blockNode="true" :show-line="true" :data="treeData">
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
  height: 40px;
  border-bottom: 1px solid rgb(229, 230, 235);
}

.content {
  height: 100%;
}

.search {
  height: 30px;
}

.search :deep(.arco-radio-group-button) {
  background-color: var(--color-fill-3);
}
</style>
