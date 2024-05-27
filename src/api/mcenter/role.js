import instance from '../client'

// 查询角色列表
export var LIST_ROLE = (params) => {
  return instance.get('/mcenter/api/v1/role', { params })
}

// 创建角色
export var CREATE_ROLE = (data) => {
  return instance.post('/mcenter/api/v1/role', data)
}

// 查询角色详情
export var GET_ROLE = (id) => {
  return instance.get(`/mcenter/api/v1/role/${id}`)
}

// 查询系统服务
export var LIST_SYSTEM_SERVICE = (params) => {
  return instance.get('/mcenter/api/v1/system/service', { params })
}

// 查询系统资源
export var LIST_SYSTEM_RESOURCE = (params) => {
  return instance.get('/mcenter/api/v1/system/resource', { params })
}
