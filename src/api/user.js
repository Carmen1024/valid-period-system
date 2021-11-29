import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login_with_admin',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/valid-period-system/user/info',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/valid-period-system/user/logout',
    method: 'post'
  })
}
