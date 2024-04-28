import instance from '../client'

// 查询空间列表
export var LIST_NAMESPACE = (params) => {
  return instance.get('/mcenter/api/v1/permission/namespaces', { params })
}
