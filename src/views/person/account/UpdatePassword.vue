<script setup>
import { reactive, ref } from 'vue'
import { UPDATE_MY_PASSWORD } from '@/api/mcenter/account'
import { Message } from '@arco-design/web-vue'

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
      await UPDATE_MY_PASSWORD(data.values)
      Message.success(`更新成功`)
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

<template>
  <div class="page">
    <!-- 页头 -->
    <BreadcrumbMenu />

    <a-card>
      <a-form :model="form" @submit="handleSubmit" auto-label-width>
        <a-form-item
          field="old_pass"
          label="当前密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { minLength: 6, message: '密码至少6位' }
          ]"
          help="密码长度6到32位, 包含数字和字母"
        >
          <a-input-password v-model="form.old_pass" />
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
          <a-input-password v-model="form.new_pass" />
        </a-form-item>
        <a-form-item
          field="new_pass_repeat"
          label="确认密码"
          required
          :rules="[{ validator: validatePassRule }]"
          help="请再次输入相同的密码进行确认"
        >
          <a-input-password v-model="form.new_pass_repeat" />
        </a-form-item>

        <div class="form-submit">
          <a-space>
            <a-button @click="$router.go(-1)">取消</a-button>
            <a-button type="primary" html-type="submit" :loading="submitLoading">保存</a-button>
          </a-space>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped></style>
