import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login_with_admin',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  // return request({
  //   url: '/valid-period-system/user/info',
  //   method: 'post',
  //   data
  // })
  return new Promise(()=>{
    const reData={
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
    resolve(reData)
  })
}

export function logout() {
  return request({
    url: '/valid-period-system/user/logout',
    method: 'post'
  })
}

export function signup(data) {
  return request({
    url: '/signup/signup_with_admin',
    method: 'post',
    data
  })
}
