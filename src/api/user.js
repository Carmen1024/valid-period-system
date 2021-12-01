import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login_with_admin',
    method: 'post',
    data
  })
}

export function getInfo(data) {

  return new Promise((resolve)=>{
    const reData={
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: '@/styles/images/avatar.jpg',
      name: '管理员'
    }
    resolve(reData)
  })
  // return request({
  //   url: '/valid-period-system/user/info',
  //   type: 'get',
  //   response: config => {
  //     const info = {
  //       roles: ['admin'],
  //       introduction: 'I am a super administrator',
  //       avatar: '@/styles/images/avatar.jpg',
  //       name: '管理员'
  //     }

  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // })
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
