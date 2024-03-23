// 封装一个统一的全局的http的客户端

import axios from 'axios'
import { Modal } from '@arco-design/web-vue'
import { app } from '@/stores/localstorage'
import { Message } from '@arco-design/web-vue'

var instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
})

// 为http客户端添加拦截器, 通过拦截器拦截返回 做异常的统一处理
// instance.interceptors.request

instance.interceptors.response.use(
  // 请求成功的返回
  (resp) => {
    return resp.data
  },
  // 请求失败
  (error) => {
    // 默认使用message
    var message = error.message

    // api 有返回异常，使用API接口返回的异常
    if (error.response && error.response.data) {
      message = error.response.data.message

      switch (error.response.data.error_code) {
        case 401:
          app.value.isLogin = false
          window.location.reload()
          return
        // Token过期
        case 50015:
          Modal.error({
            title: '确认退出',
            content: '当前会话已过期，您可以取消以停留在此页面，或者重新登录',
            okText: '重新登录',
            async onOk() {
              app.value.isLogin = false
              window.location.reload()
            }
          })
          return
        // 异地登录
        case 50010:
          Modal.error({
            title: error.response.data.reason,
            content: `${message}`,
            okText: '重新登录',
            async onOk() {
              app.value.isLogin = false
              window.location.reload()
            }
          })
          return
      }
    }

    // 提示异常
    Message.error({
      content: message,
      duration: 2000
    })
    return Promise.reject(new Error(message))
  }
)

export default instance
