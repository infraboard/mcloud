export default {
  path: 'admin',
  name: 'AdminPage',
  component: () => import('@/views/admin/LayoutPage.vue'),
  redirect: { name: 'PermissionManage' },
  children: [
    {
      path: 'permission',
      name: 'PermissionManage',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '权限管理' },
      redirect: { name: 'SubUserList' },
      children: [
        {
          path: 'domain/get',
          name: 'DomainDetail',
          component: () => import('@/views/admin/domain/DetailPage.vue')
        },
        {
          path: 'sub_user/list',
          name: 'SubUserList',
          component: () => import('@/views/admin/user/ListPage.vue'),
          meta: { label: '用户列表' }
        },
        {
          path: 'user/create',
          name: 'CreateSubUser',
          component: () => import('@/views/admin/user/CreateUser.vue'),
          meta: { label: '创建用户' }
        },
        {
          path: 'namespace/list',
          name: 'NamespaceList',
          component: () => import('@/views/admin/namespace/ListPage.vue'),
          meta: { label: '空间列表' }
        },
        {
          path: 'namespace/create',
          name: 'CreateNamespace',
          component: () => import('@/views/admin/namespace/CreateNamespace.vue'),
          meta: { label: '创建空间' }
        },
        {
          path: 'label/list',
          name: 'LabelList',
          component: () => import('@/views/admin/label/ListPage.vue'),
          meta: { label: '标签列表' }
        }
      ]
    },
    {
      path: 'audit',
      name: 'AuditManage',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '审计管理' },
      redirect: { name: 'LoginLog' },
      children: [
        {
          path: 'log/login',
          name: 'AuditLoginLog',
          component: () => import('@/views/admin/audit/LoginLog.vue'),
          meta: { label: '登录日志' }
        },
        {
          path: 'log/operate',
          name: 'AuditOperateLog',
          component: () => import('@/views/admin/audit/OperateLog.vue'),
          meta: { label: '操作日志' }
        }
      ]
    }
  ]
}
