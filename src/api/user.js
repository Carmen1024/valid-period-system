import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/valid-period-system/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/valid-period-system/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/valid-period-system/user/logout',
    method: 'post'
  })
}
