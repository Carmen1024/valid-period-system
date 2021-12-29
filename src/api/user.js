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
    url: '/login/logout_with_admin',
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

export function userQuery(data){
    return request({
        url: '/user/query',
        method: 'post',
        data
      })
}

export function userInsert(data){
  return request({
      url: '/user/insert',
      method: 'post',
      data
    })
}

export function userUpdate(data){
  return request({
      url: '/user/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function userValid(data){
  return request({
      url: '/user/valid',
      method: 'post',
      data
    })
}

// 删除
export function userDelete(data){
  return request({
      url: '/user/del',
      method: 'post',
      data
    })
}
