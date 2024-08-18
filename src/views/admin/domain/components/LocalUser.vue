<script setup>
import { app } from '@/stores/localstorage'
import { onBeforeMount, ref } from 'vue'

// 声明属性
const props = defineProps({
  passwordConfig: Object
})

// 表单
const form = ref({
  enabled: false,
  length: 8,
  include_number: true,
  include_lower_letter: true,
  include_upper_letter: false,
  include_symbols: false,
  include_similar: false,
  exclude_ambiguous: false,
  character_set: '',
  repeate_limite: 1,
  password_expired_days: 90,
  before_expired_remind_days: 10
})
const initForm = () => {
  form.value = JSON.parse(JSON.stringify(props.passwordConfig))
  checkIsEdit()
}
onBeforeMount(() => {
  initForm()
})

// 表单是否处于编辑中
const isEdit = ref(false)
const checkIsEdit = () => {
  const ov = JSON.stringify(props.passwordConfig)
  const nv = JSON.stringify(form.value)
  isEdit.value = ov !== nv
}

// 提交表单
const submitLoading = ref(false)
const handleSubmit = () => {
  const payload = JSON.parse(JSON.stringify(form.value))
  console.log(payload)
}
</script>

<template>
  <div class="content">
    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item
          field="enabled"
          label="启用"
          class="enable-line"
          help="开启后, 允许用户通过本地用户名密码登录"
        >
          <a-switch type="round" v-model="form.enabled" @change="checkIsEdit">
            <template #checked> ON </template>
            <template #unchecked> OFF </template>
          </a-switch>
        </a-form-item>
      </a-form>
      <a-divider orientation="center" type="dotted">密码规则</a-divider>
      <a-form-item field="include_number" label="至少包含">
        <a-space :size="app.size">
          <a-checkbox v-model="form.include_number" @change="checkIsEdit">数字</a-checkbox>
          <a-checkbox v-model="form.include_lower_letter" @change="checkIsEdit"
            >小写字母</a-checkbox
          >
          <a-checkbox v-model="form.include_upper_letter" @change="checkIsEdit"
            >大写字母</a-checkbox
          >
          <a-checkbox v-model="form.include_symbols" @change="checkIsEdit"
            >特殊字符(比如 !"£*)</a-checkbox
          >
        </a-space>
      </a-form-item>

      <a-form-item
        field="length"
        label="最短密码长度"
        help="限制密码长度。默认 8 个字符，最大长度可设置 32 个字符"
        required
      >
        <a-input-number
          style="width: 140px"
          v-model="form.length"
          @change="checkIsEdit"
          mode="button"
          :min="6"
          :default-value="8"
          :max="32"
        >
        </a-input-number>
        <span class="form-item-append-text">个字符</span>
      </a-form-item>
      <a-form-item
        field="length"
        label="定期失效天数"
        help="限制密码定期失效须重置密码。默认为 90，最长可设置 365 天"
        required
      >
        <a-input-number
          style="width: 140px"
          v-model="form.password_expired_days"
          @change="checkIsEdit"
          mode="button"
          :min="0"
          :default-value="90"
          :max="365"
        >
        </a-input-number>
        <span class="form-item-append-text">天</span>
      </a-form-item>
      <a-form-item
        field="length"
        label="重复次数限制"
        help="	限制新密码与历史密码的重复。默认与前1次密码不重复，最多可限制与前 24 次密码不重复，0次表示不检查历史密码重复"
        required
      >
        <a-input-number
          style="width: 140px"
          v-model="form.repeate_limite"
          @change="checkIsEdit"
          mode="button"
          :min="0"
          :default-value="1"
          :max="24"
        >
        </a-input-number>
        <span class="form-item-append-text">次</span>
      </a-form-item>
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
.content {
  margin-top: 12px;
}

.enable-line {
  margin-bottom: 0px;
}

.enable-line :deep(.arco-form-item-message) {
  margin-bottom: 0px;
}
</style>
