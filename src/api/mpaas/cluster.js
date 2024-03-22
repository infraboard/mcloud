import instance from '../client'

// 查询部署列表
export var LIST_CLUSTER = (params) => {
  return instance.get('/mpaas/api/v1/clusters', { params })
}

// 查询部署列表
export var DESCRIBE_CLUSTER = (id, params) => {
  return instance.get(`/mpaas/api/v1/clusters/${id}`, { params })
}

// 创建部署
export var CREATE_CLUSTER = (data) => {
  return instance.post(`/mpaas/api/v1/clusters/`, data)
}
