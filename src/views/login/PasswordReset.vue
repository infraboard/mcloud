<template>
  <div class="page">
    <div class="change-pass-box">
      <h3 class="title">重置用户密码</h3>
      <a-alert type="warning">{{ stage.reset_reason }}</a-alert>
      <a-form
        class="change-pass-form"
        :model="form"
        layout="vertical"
        @submit="handleSubmit"
        auto-label-width
      >
        <a-form-item field="old_pass" label="用户名">
          <span style="font-size: 12px"> {{ stage.username }}</span>
        </a-form-item>
        <a-form-item
          field="new_pass"
          label="新密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { minLength: 6, message: '密码至少6位' }
          ]"
          help="新密码与当前密码不能相同"
        >
          <a-input-password size="large" v-model="form.new_pass" />
        </a-form-item>
        <a-form-item
          field="new_pass_repeat"
          label="确认密码"
          required
          :rules="[{ validator: validatePassRule }]"
          help="请再次输入相同的密码进行确认"
        >
          <a-input-password size="large" v-model="form.new_pass_repeat" />
        </a-form-item>
        <div class="form-submit">
          <a-button
            style="width: 100%"
            size="large"
            type="primary"
            html-type="submit"
            :loading="submitLoading"
            >确认重置</a-button
          >
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { stage } from './state.js'
import { reactive, ref } from 'vue'
import { UPDATE_MY_PASSWORD } from '@/api/mcenter/account'
import { useRouter } from 'vue-router'

const router = useRouter()

// form数据
const form = reactive({
  old_pass: '',
  new_pass: '',
  new_pass_repeat: '',
  is_reset: false
})

// 表单提交
const submitLoading = ref(false)
const handleSubmit = async (data) => {
  if (!data.errors) {
    try {
      submitLoading.value = true
      form.old_pass = stage.old_password
      await UPDATE_MY_PASSWORD(form)
      router.push({ name: 'UserWorkspace' })
    } finally {
      submitLoading.value = false
    }
  }
}
const validatePassRule = (value, cb) => {
  if (form.new_pass !== value) {
    cb('二次输入的密码不一致')
  }
}
</script>

<style scoped>
.page {
  margin: 0px auto;
  width: 100vw;
  height: 100vh;
}

.change-pass-form {
  margin-top: 16px;
}

.title {
  margin: 0px 0px 1.5em;
  font-size: 1.6em;
  font-weight: 600;
  width: 100%;
  word-break: break-word;
  text-align: center;
  color: var(--cb-color-text-primary, #333);
}

.change-pass-box {
  padding: 36px;
  display: flex;
  word-break: break-word;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  margin: 0px auto;
  margin-top: 100px;
  border-radius: 8px;
  background: rgb(255, 255, 255);
  width: 560px;
  border: 1px solid var(--cb-color-border-tertiary, #ebebeb);
  box-shadow: 0 0 2px 0 var(--cb-color-shadow, rgba(0, 0, 0, 0.16));
}

.form-submit {
  margin-top: 30px;
  margin-bottom: 16px;
}
</style>
