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