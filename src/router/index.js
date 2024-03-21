import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/login/LoginPage.vue'
import { beforeEachHanler } from './permission'
import console from './console'
import admin from './admin'
import setting from './setting'
import resource from './resource'
import develop from './develop'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    },
    // Home页面
    {
      path: '/',
      name: 'UserWorkspace',
      redirect: { name: 'ServiceConsole' }
    },
    // 服务工作台
    console,
    // 后台管理
    admin,
    // 空间设置
    setting,
    // 资源管理
    resource,
    // 研发交付
    develop,
    // 其他通用页面
    {
      path: '/errors/403',
      name: 'PermissionDeny',
      component: () => import('@/views/common/PermissionDeny.vue')
    },
    // 匹配前面所有没有被名字的路由, 都指向404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/common/NotFound.vue')
    }
  ]
})

// 对Router进行导航守卫的设置
// 全局前置守卫
router.beforeEach(beforeEachHanler)

export default router
