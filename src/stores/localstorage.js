//  安装:  npm i @vueuse/core， 使用响应式localStorage对象
//  使用 app.isLogin 来
import { useStorage } from '@vueuse/core'

// 帮助把LocalStroage封装成一个响应式的Ref对象
export var app = useStorage(
  'app',
  {
    isLogin: false,
    token: {},
    system: 'HomePage',
    menu: {
      admin: 'SubUserList',
      console: 'ServiceConsole',
      develop: 'ServiceList',
      resource: 'ResourceSearch',
      setting: 'NamespacePolicyList'
    },
    size: 'small',
    pagination: {
      total: 0,
      current: 1,
      pageSize: 20,
      showTotal: true,
      showMore: true,
      showJumper: true,
      showPageSize: true,
      pageSizeOptions: [10, 20, 50, 100]
    },
    xterm: {
      theme: 'Solarized_Darcula'
    },
    serviceTree: {
      selected: ''
    }
  },
  localStorage,
  { mergeDefaults: true }
)
