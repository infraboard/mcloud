import instance from '../client'

// 更新自己账号密码
export var UPDATE_MY_PASSWORD = (data) => {
  return instance.post(`/mcenter/api/v1/account/password`, data)
}
