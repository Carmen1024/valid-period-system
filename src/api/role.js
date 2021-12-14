import request from '@/utils/request'

export function powerQuery(data){
    return request({
        url: '/power/query',
        method: 'post',
        data
      })
}

export function powerInsert(data){
  return request({
      url: '/power/insert',
      method: 'post',
      data
    })
}

export function powerUpdate(data){
  return request({
      url: '/power/update',
      method: 'post',
      data
    })
}

// 状态变更 失效 有效
export function powerValid(data){
  return request({
      url: '/power/valid',
      method: 'post',
      data
    })
}

// 删除
export function powerDelete(data){
  return request({
      url: '/power/del',
      method: 'post',
      data
    })
}

// 获取权限列表
export function powerQueryAll(){
  return request({
      url: '/power/query_all_valid',
      method: 'post'
    })
}


// 以下为角色接口
export function roleQuery(data){
  return request({
      url: '/role/query',
      method: 'post',
      data
    })
}

export function roleInsert(data){
return request({
    url: '/role/insert',
    method: 'post',
    data
  })
}

export function roleUpdate(data){
return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

// 状态变更 失效 有效
export function roleValid(data){
return request({
    url: '/role/valid',
    method: 'post',
    data
  })
}

// 删除
export function roleDelete(data){
return request({
    url: '/role/del',
    method: 'post',
    data
  })
}

// 获取权限列表
export function roleQueryAll(){
return request({
    url: '/role/query_all_valid',
    method: 'post'
  })
}