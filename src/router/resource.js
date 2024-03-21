export default {
  path: '/resource',
  name: 'ResourcePage',
  component: () => import('@/views/resource/LayoutPage.vue'),
  redirect: { name: 'ResourceSearch' },
  children: [
    {
      path: 'search',
      name: 'ResourceSearch',
      component: () => import('@/views/resource/SearchPage.vue'),
      meta: { label: '资源检索' }
    },
    {
      path: 'iaas',
      name: 'IaaSResourceList',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '基础资源' },
      redirect: { name: 'HostList' },
      children: [
        {
          path: 'host/list',
          name: 'HostList',
          component: () => import('@/views/resource/host/ListPage.vue')
        }
      ]
    },
    {
      path: 'paas',
      name: 'PaaSResourceList',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '平台资源' },
      redirect: { name: 'K8sManagement' },
      children: [
        {
          path: 'k8s',
          name: 'K8sManagement',
          meta: { label: 'k8s集群' },
          children: [
            {
              path: 'list',
              name: 'K8sClusterList',
              component: () => import('@/views/resource/k8s/ListPage.vue'),
              meta: { label: '集群列表' }
            },
            {
              path: 'create',
              name: 'K8sClusterCreate',
              component: () => import('@/views/resource/k8s/CreatePage.vue'),
              meta: { label: '创建集群' }
            }
          ]
        },
        {
          path: 'gateway/list',
          name: 'GatewayList',
          component: () => import('@/views/resource/gateway/ListPage.vue')
        }
      ]
    },
    {
      path: 'sync',
      name: 'ResourceSync',
      component: () => import('@/components/RedirectPage.vue'),
      redirect: { name: 'ResourceTaskList' },
      children: [
        {
          path: 'task/list',
          name: 'ResourceTaskList',
          component: () => import('@/views/resource/task/ListPage.vue')
        },
        {
          path: 'secret/list',
          name: 'ResourceSecretList',
          component: () => import('@/views/resource/secret/ListPage.vue')
        }
      ]
    }
  ]
}
