<template>
  <!-- 空间选择区 -->
  <div class="namespace-choice">
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
  </div>
</template>

<script setup>
import { app } from '@/stores/localstorage'
import { useRouter } from 'vue-router'
import { LIST_NAMESPACE } from '@/api/mcenter/permission'
import { CHANGE_NAMESPACE } from '@/api/mcenter/token'
import { reactive, ref, onBeforeMount } from 'vue'

const router = useRouter()

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
}

onBeforeMount(() => {
  ListNamespace()
})
</script>

<style scoped>
.namespace-choice {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  background-color: var(--color-neutral-2);
}

.namespace-choice :deep(.arco-select-view-single) {
  align-items: center;
}
</style>
