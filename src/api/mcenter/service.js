import instance from '../client'

// 查询服务列表
export var LIST_SERVICE = (params) => {
  return instance.get('/mcenter/api/v1/service', { params })
}

// 查询GITLAB项目
export var LIST_GITLAB_PROJECT = (params) => {
  return instance.get('/mcenter/api/v1/providers/gitlab/projects', { params })
}

// 查询服务列表
export var DESCRIBE_SERVICE = (id, params) => {
  return instance.get(`/mcenter/api/v1/service/${id}`, { params })
}

// 创建服务
export var CREATE_SERVICE = (data) => {
  return instance.post('/mcenter/api/v1/service', data)
}

// 删除服务
export var DELETE_SERVICE = (id) => {
  return instance.delete(`/mcenter/api/v1/service/${id}`)
}
