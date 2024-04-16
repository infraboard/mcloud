import instance from '../client'

// 查询构建配置
export var LIST_BUILD = (params) => {
  return instance.get('/mflow/api/v1/builds', { params })
}

// 创建构建配置
export var CREATE_BUILD = (data) => {
  return instance.get('/mflow/api/v1/builds', data)
}
