export default {
  path: '/setting',
  name: 'SettingPage',
  component: () => import('@/views/setting/LayoutPage.vue'),
  redirect: { name: 'NamespacePermission' },
  children: [
    {
      path: 'permission',
      name: 'NamespacePermission',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '权限管理' },
      redirect: { name: 'NamespacePolicyList' },
      children: [
        {
          path: 'policy/list',
          name: 'NamespacePolicyList',
          component: () => import('@/views/setting/policy/ListPage.vue'),
          meta: { label: '策略列表' }
        },
        {
          path: 'policy/create',
          name: 'NamespacePolicyCreate',
          component: () => import('@/views/setting/policy/CreatePolicy.vue'),
          meta: { label: '创建策略' }
        },
        {
          path: 'role/list',
          name: 'RoleList',
          component: () => import('@/views/setting/role/ListPage.vue'),
          meta: { label: '角色列表' }
        },
        {
          path: 'role/detail',
          name: 'RoleDetail',
          component: () => import('@/views/setting/role/DetailPage.vue'),
          meta: { label: '角色详情' }
        },
        {
          path: 'role/create',
          name: 'CreateRole',
          component: () => import('@/views/setting/role/CreatePage.vue'),
          meta: { label: '创建角色' }
        }
      ]
    }
  ]
}
