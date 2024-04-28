import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 加载UI组件
import ArcoVue from '@arco-design/web-vue'
// 引入UI组件的样式库
import '@arco-design/web-vue/dist/arco.css'
// 配置Vue实例使用 ArcoVue UI组件库
app.use(ArcoVue)

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
app.use(ArcoVueIcon)

// 注册全集组件
import TopMenu from './components/TopMenu.vue'
import BreadcrumbMenu from './components/BreadcrumbMenu.vue'
import ShowTime from './components/ShowTime.vue'
import SvgIcon from './components/SvgIcon.vue'
import PodLog from './components/PodLog.vue'
import PodConsole from './components/PodConsole.vue'
app.component('TopMenu', TopMenu)
app.component('BreadcrumbMenu', BreadcrumbMenu)
app.component('ShowTime', ShowTime)
app.component('SvgIcon', SvgIcon)
app.component('PodLog', PodLog)
app.component('PodConsole', PodConsole)

// 重写arco 样式
import './assets/arco.css'

app.mount('#app')
