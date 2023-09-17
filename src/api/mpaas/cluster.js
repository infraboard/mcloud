import instance from '../client'

// 查询部署列表
export var LIST_CLUSTER = (params) => {
  return instance.get('/mpaas/api/v1/clusters', { params })
}
