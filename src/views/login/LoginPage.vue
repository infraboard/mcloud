<template>
  <div class="login-form-wrap">
    <div class="login-form">
      <a-form :model="form" :style="{ width: '480px' }" @submit="handleSubmit" auto-label-width>
        <a-form-item>
          <div class="login-title">欢迎登录研发管理平台</div>
        </a-form-item>
        <!-- 补充规则校验条件, 校验规则和field的设置联合一起生效 -->
        <a-form-item
          field="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label=""
        >
          <!-- 为什么使用v-model 这是一个输入组件, 把用户输入的值 绑定到 form的username属性, -->
          <a-input size="large" v-model="form.username" placeholder="请输入用户名...">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[
            { required: true, message: '请输入密码' },
            { minLength: 6, message: '密码至少6位' }
          ]"
          :validate-trigger="['change', 'input']"
          hide-asterisk
          label=""
        >
          <a-input-password
            size="large"
            v-model="form.password"
            placeholder="请输入密码..."
            allow-clear
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button size="large" style="width: 100%" html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { app } from '@/stores/localstorage'
import { ISSUE_TOKEN } from '@/api/mcenter/token'
import { stage } from './state.js'

// 用户登录数据
const form = reactive({
  username: '',
  password: ''
})

const router = useRouter()
const route = useRoute()

// 提交处理
const handleSubmit = async (data) => {
  if (!data.errors) {
    let resp = await ISSUE_TOKEN(data.values)
    app.value.isLogin = true
    app.value.token = resp

    // 获取当前url的query参数, 可以通过获取当前路由 /login?name=TagList
    // useRoute vue-router 来提供获取当前页面的路由对象, Route对象
    // {name: 'TagList'}
    let redirect = { name: app.value.system, params: {}, query: {} }

    // 如果需要重置密码, 则需要调整
    if (resp.meta.reset_password) {
      redirect.name = 'LoginPasswordReset'
      stage.reset_reason = resp.meta.reset_password
      stage.username = form.username
      stage.old_password = form.password
    }

    if (route.query.name) {
      redirect.name = route.query.name
    }
    if (route.query.params) {
      redirect.params = JSON.parse(route.query.params)
    }
    if (route.query.query) {
      redirect.query = JSON.parse(route.query.query)
    }
    router.push(redirect)
  }
}
</script>

<style scoped>
.login-form-wrap {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
}

.login-form {
  display: flex;
  justify-content: center;
  background: #acb6e5;
  height: 260px;
  width: 100vw;
  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #86fde8, #acb6e5);
  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #86fde8, #acb6e5);
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.login-title {
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  color: #555a65;
  margin-top: 12px;
}
</style>
