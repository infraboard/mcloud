<script setup>
import { onBeforeMount, ref } from 'vue'

// 声明属性
const props = defineProps({
  feishuSetting: Object
})

// 表单
const form = ref({
  enabled: false,
  app_id: '',
  app_secret: '',
  redirect_uri: ''
})
const initForm = () => {
  form.value = JSON.parse(JSON.stringify(props.feishuSetting))
  checkIsEdit()
}
onBeforeMount(() => {
  initForm()
})

// 表单是否处于编辑中
const isEdit = ref(false)
const checkIsEdit = () => {
  const ov = JSON.stringify(props.feishuSetting)
  const nv = JSON.stringify(form.value)
  isEdit.value = ov !== nv
}

// 提交表单
const submitLoading = ref(false)
const handleSubmit = () => {
  const payload = JSON.parse(JSON.stringify(form.value))
  // 密码未修改时 不提交
  if (props.feishuSetting.app_secret === payload.app_secret) {
    payload.app_secret = ''
  }
  console.log(payload)
}
</script>

<template>
  <div class="content">
    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item field="enabled" label="启用" class="enable-line">
          <template #help>
            <span
              >开启时, 请到前往<a class="link" href="https://open.feishu.cn/app" target="_blank"
                >飞书后台</a
              >获得应用相关信息</span
            >
          </template>
          <a-switch type="round" v-model="form.enabled" @change="checkIsEdit">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
        <a-divider orientation="center" type="dotted">飞书应用配置</a-divider>
        <a-form-item field="app_id" label="App ID" :required="form.enabled">
          <a-input v-model="form.app_id" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item field="app_secret" label="App Secret" :required="form.enabled">
          <a-input v-model="form.app_secret" @change="checkIsEdit"> </a-input>
        </a-form-item>
        <a-form-item field="redirect_uri" label="重定向地址" :required="form.enabled">
          <a-input v-model="form.redirect_uri" @change="checkIsEdit"> </a-input>
        </a-form-item>
      </a-form>
      <div class="form-submit">
        <a-space>
          <a-button @click="initForm" :disabled="!isEdit">重置</a-button>
          <a-button type="primary" html-type="submit" :disabled="!isEdit" :loading="submitLoading"
            >保存</a-button
          >
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.enable-line {
  margin-bottom: 0px;
}

.enable-line :deep(.arco-form-item-message) {
  margin-bottom: 0px;
}
</style>
