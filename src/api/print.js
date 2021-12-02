import request from '@/utils/request';

export function printHistoryQuery(data){
    return request({
        url: '/printer_history/query',
        method: 'post',
        data
      })
}

export function printTempQuery(data){
  return request({
      url: '/printTemp/query',
      method: 'post',
      data
    })
}

export function printTempInsert(data){
return request({
    url: '/printTemp/insert',
    method: 'post',
    data
  })
}

export function printTempUpdate(data){
return request({
    url: '/printTemp/update',
    method: 'post',
    data
  })
}

// 状态变更 失效 有效
export function printTempValid(data){
return request({
    url: '/printTemp/valid',
    method: 'post',
    data
  })
}

// 删除
export function printTempDelete(data){
return request({
    url: '/printTemp/del',
    method: 'post',
    data
  })
}

