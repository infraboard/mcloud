export default {
  path: 'person',
  name: 'PersonPage',
  component: () => import('@/views/person/LayoutPage.vue'),
  redirect: { name: 'AccountManage' },
  children: [
    {
      path: 'account',
      name: 'AccountManage',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '账号安全' },
      redirect: { name: 'UpdateMyPassword' },
      children: [
        {
          path: 'password/update',
          name: 'UpdateMyPassword',
          component: () => import('@/views/person/account/UpdatePassword.vue'),
          meta: { label: '更新密码' }
        }
      ]
    },
    {
      path: 'message',
      name: 'MessageManage',
      component: () => import('@/components/RedirectPage.vue'),
      meta: { label: '消息中心' },
      redirect: { name: 'ListMyMessage' },
      children: [
        {
          path: 'list',
          name: 'ListMyMessage',
          component: () => import('@/views/person/message/ListPage.vue'),
          meta: { label: '我的消息' }
        }
      ]
    }
  ]
}
