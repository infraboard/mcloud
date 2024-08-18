export default {
  path: 'k8s',
  name: 'K8sPlatform',
  component: () => import('@/components/RedirectPage.vue'),
  redirect: { name: 'K8sClusterList' },
  children: [
    {
      path: 'cluster',
      name: 'K8sClusterManagement',
      meta: { label: 'k8s集群' },
      children: [
        {
          path: 'list',
          name: 'K8sClusterList',
          component: () => import('@/views/k8s/cluster/ListPage.vue'),
          meta: { label: '集群列表' }
        },
        {
          path: 'create',
          name: 'K8sClusterCreate',
          component: () => import('@/views/k8s/cluster/CreatePage.vue'),
          meta: { label: '创建集群' }
        }
      ]
    },
    {
      path: 'dashboard/:id',
      name: 'K8sDashoard',
      component: () => import('@/views/k8s/LayoutPage.vue'),
      meta: { label: '容器平台' },
      redirect: { name: 'K8sNamespaceList' },
      children: [
        {
          path: 'namespace/list',
          name: 'K8sNamespaceList',
          component: () => import('@/views/k8s/namespace/ListPage.vue'),
          meta: { label: '命名空间' }
        },
        {
          path: 'namespace/create',
          name: 'K8sNamespaceCreate',
          component: () => import('@/views/k8s/namespace/CreatePage.vue'),
          meta: { label: '创建命名空间' }
        }
      ]
    }
  ]
}
