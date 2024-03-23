import instance from '../client'

// 查询应用集群列表
export var LIST_CLUSTER = (params) => {
  return instance.get('/mpaas/api/v1/clusters', { params })
}

// 查询应用集群详情
export var DESCRIBE_CLUSTER = (id, params) => {
  return instance.get(`/mpaas/api/v1/clusters/${id}`, { params })
}

// 创建应用集群
export var CREATE_CLUSTER = (data) => {
  return instance.post(`/mpaas/api/v1/clusters/`, data)
}

// 更新应用集群
export var UPDATE_CLUSTER = (id, data) => {
  return instance.put(`/mpaas/api/v1/clusters/${id}`, data)
}

// 更新应用集群
export var DELETE_CLUSTER = (id) => {
  return instance.delete(`/mpaas/api/v1/clusters/${id}`)
}
