import instance from '../client'

// 查询k8s集群
export var LIST_K8S_CLUSTER = (params) => {
  return instance.get('/mpaas/api/v1/k8s_clusters', { params })
}

// 查询k8s详情
export var GET_K8S_CLUSTER = (id, params) => {
  return instance.get(`/mpaas/api/v1/k8s_clusters/${id}`, { params })
}

// 添加k8s集群
export var CREATE_K8S_CLUSTER = (data) => {
  return instance.post('/mpaas/api/v1/k8s_clusters', data)
}

// 更新k8s集群
export var UPDATE_K8S_CLUSTER = (id, data) => {
  return instance.put(`/mpaas/api/v1/k8s_clusters/${id}`, data)
}

// 删除k8s集群
export var DELETE_K8S_CLUSTER = (id) => {
  return instance.delete(`/mpaas/api/v1/k8s_clusters/${id}`)
}
