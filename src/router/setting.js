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
        }
      ]
    }
  ]
}
