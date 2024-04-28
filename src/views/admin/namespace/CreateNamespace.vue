<script setup>
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { GET_NAMESPACE, CREATE_NAMESPACE } from '@/api/mcenter/namespace'
import SearchUser from '@/components/SearchUser.vue'

const router = useRouter()
const form = ref({
  enabled: true,
  name: '',
  description: ''
})

// 提交处理
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      let resp = await CREATE_NAMESPACE(data.values)
      console.log(resp)
      router.push({ name: 'NamespaceList' })
    } finally {
      submitLoading.value = false
    }
  }
}

// 判断更新模式
let pageHeader = '创建空间'
const id = router.currentRoute.value.query.id
const isCreate = id === undefined
const GetNamespace = async () => {
  if (!isCreate) {
    pageHeader = '编辑空间'
    form.value = await GET_NAMESPACE(id)
  }
}
onBeforeMount(async () => {
  GetNamespace()
})
</script>

<template>
  <div class="page">
    <!-- 页头 -->
    <a-page-header :title="pageHeader" @back="router.go(-1)"> </a-page-header>

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="enabled" label="启用" class="enable-line">
          <a-switch type="round" v-model="form.enabled">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
        <a-form-item
          field="name"
          label="名称"
          :disabled="!isCreate"
          required
          help="创建后不允许修改"
        >
          <a-input v-model="form.name" placeholder="请输入空间名称" />
        </a-form-item>
        <a-form-item field="description" label="描述" required>
          <a-input v-model="form.description" placeholder="请输入空间名称" />
        </a-form-item>
        <a-form-item field="owner" label="负责人" help="请选择空间负责人" required>
          <SearchUser v-model="form.owner"></SearchUser>
        </a-form-item>
        <div class="form-submit">
          <a-space>
            <a-button @click="router.push({ name: 'NamespaceList' })">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>
