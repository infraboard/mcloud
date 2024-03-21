export default {
  path: '/service_console',
  name: 'ServiceConsole',
  component: () => import('@/views/console/LayoutPage.vue'),
  redirect: { name: 'ServiceDashboard' },
  children: [
    {
      path: 'dashboard',
      name: 'ServiceDashboard',
      component: () => import('@/views/console/dashboard/BoardPage.vue'),
      meta: { label: '终端看板' }
    },
    {
      path: 'terminal',
      name: 'ServiceTerminal',
      component: () => import('@/views/console/terminal/TerminalPage.vue'),
      meta: { label: '服务终端控制台' }
    },
    {
      path: 'cluster/:id',
      name: 'ClusterDetail',
      component: () => import('@/views/console/cluster/DetailPage.vue'),
      meta: { label: '应用集群' }
    },
    {
      path: 'deploy/:id',
      name: 'DeployDetail',
      component: () => import('@/views/console/deploy/DetailPage.vue'),
      meta: { label: '应用部署' }
    }
  ]
}
