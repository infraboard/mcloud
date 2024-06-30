import { createRouter, createWebHistory } from 'vue-router'
import { beforeEachHanler } from './permission'
import console from './system/console'
import admin from './system/admin'
import setting from './system/setting'
import resource from './system/resource'
import develop from './system/develop'
import person from './system/person'
import ks8 from './system/k8s'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('@/views/login/LoginPage.vue')
    },
    // 登录
    {
      path: '/login-reset-password',
      name: 'LoginPasswordReset',
      component: () => import('@/views/login/PasswordReset.vue')
    },
    {
      path: '/system',
      name: 'SystemMenuLayout',
      component: () => import('@/layout/SystemMenu.vue'),
      children: [
        // 账号中心
        person,
        // 服务工作台
        console,
        // 后台管理
        admin,
        // 空间设置
        setting,
        // 资源管理
        resource,
        // k8s平台
        ks8,
        // 研发交付
        develop
      ]
    },
    // Home页面
    {
      path: '/',
      name: 'UserWorkspace',
      redirect: { name: 'ServiceConsole' }
    },

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
