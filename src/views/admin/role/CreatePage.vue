<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="$router.go(-1)"> </a-page-header>

    <a-card>
      <a-steps :current="current">
        <a-step>选择权限</a-step>
        <a-step>基本信息</a-step>
        <a-step>权限确认</a-step>
      </a-steps>
      <div class="content">
        <div class="permission" v-if="current === 1">
          <div>
            <a-tree
              class="svc-tree"
              :default-selected-keys="['0-0']"
              :data="treeData"
              size="mini"
              :default-expanded-keys="['root']"
              :show-line="true"
              :blockNode="true"
              :selected-keys="selectedKeys"
              @select="selectTreeNode"
            >
              <template #title="node">
                {{ nodeTitle(node) }}
              </template>
            </a-tree>
          </div>
          <div class="svc-perm">
            <a-table :data="selectTService().items">
              <template #columns>
                <a-table-column title="资源名称" :width="160" data-index="name"></a-table-column>
                <a-table-column title="资源操作">
                  <template #cell="{ record }">
                    <a-checkbox-group v-model="record.selected" :options="record.actions" />
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
        </div>
        <div v-if="current === 2">基本信息</div>
        <div v-if="current === 3">权限确认</div>
      </div>
      <a-space align="center" class="summit">
        <a-button type="secondary" :disabled="current <= 1" @click="onPrev">
          <IconLeft /> 上一步
        </a-button>
        <a-button type="primary" :disabled="current >= 3" @click="onNext">
          下一步 <IconRight />
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { LIST_SYSTEM_SERVICE, LIST_SYSTEM_RESOURCE } from '@/api/mcenter/role'

// 判断更新模式
let pageHeader = '创建角色'

// 服务树
const treeData = ref([
  {
    title: '服务树',
    key: 'root',
    children: [
      {
        title: '用户中心',
        key: 'mcenter',
        loaded: false,
        resource: { items: [] }
      }
    ]
  }
])

// 切换
const current = ref(1)
const onPrev = () => {
  current.value = Math.max(1, current.value - 1)
}
const onNext = () => {
  // 判断是否选择有权限
  console.log(current.value)

  current.value = Math.min(3, current.value + 1)
}

// 服务切换
const selectedKeys = ref([])
const nodeResource = reactive({})
const selectTreeNode = async (e) => {
  // 创建临时变量存储选中的节点键
  const selectedNodeKey = e[0]

  if (selectedKeys.value.length > 0 && selectedKeys.value[0] === selectedNodeKey) {
    return
  }

  // 忽略Root处理
  if (selectedNodeKey === 'root') {
    return
  }

  selectedKeys.value = [selectedNodeKey]

  // 加载资源
  if (!nodeResource[selectedNodeKey]) {
    nodeResource[selectedNodeKey] = { loaded: true }
    const resp = await LIST_SYSTEM_RESOURCE({
      service_ids: selectedNodeKey
    })
    nodeResource[selectedNodeKey].items = resp.items
    nodeResource[selectedNodeKey].total = resp.total
  }
}

const selectTService = () => {
  const v = nodeResource[selectedKeys.value[0]]
  if (v) {
    return v
  }

  return { resource: { items: [] } }
}
const nodeTitle = (node) => {
  var title = node.title

  if (node.key === 'root') {
    return title
  }

  const resources = nodeResource[node.key]
  if (!resources || !resources.items) {
    return title
  }

  var selected_count = 0
  var total_count = 0

  resources.items.forEach((item) => {
    total_count += item.actions.length
    if (item.selected) {
      selected_count += item.selected.length
    }
  })

  if (selected_count === 0) {
    return title
  }

  return `${title} (${selected_count}/${total_count})`
}

onMounted(async () => {
  const resp = await LIST_SYSTEM_SERVICE()
  resp.items.forEach((item) => {
    treeData.value[0].children.push({
      title: item.description,
      key: item.id,
      loaded: false,
      resource: { items: [] }
    })
  })

  const first = treeData.value[0].children[0]
  selectTreeNode([first.key], { node: first })
})
</script>

<style scoped>
.summit {
  display: flex;
  justify-content: center;
}

.content {
  margin-top: 12px;
  height: 700px;
}

.permission {
  display: flex;
  height: 100%;
}

.svc-tree {
  width: 260px;
  height: 100%;
  border: 1px solid var(--color-border);
  border-radius: 2px 2px 0 0;
  background-color: var(--color-fill-1);
}

.svc-perm {
  padding: 0px 12px;
  width: 100%;
}
</style>
