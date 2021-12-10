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
// 获取打印模板
export function printFetchTemp(data){
  return request({
      url: '/printTemp/fetchTemp',
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

// 打印测试
export function printTempTest(data){
  return request({
      url: '/printTemp/print',
      method: 'post',
      data
    })
}

// 打印机

export function printerQuery(data){
  return request({
    url: '/printer/query',
    method: 'post',
    data
  })
}

export function printerInsert(data){
  return request({
    url: '/printer/insert',
    method: 'post',
    data
  })
}

export function printerUpdate(data){
  return request({
    url: '/printer/update',
    method: 'post',
    data
  })
}
// 状态变更 失效 有效
export function printerValid(data){
  return request({
    url: '/printer/valid',
    method: 'post',
    data
  })
}
  //printerDelete
  export function printerDelete(data){
    return request({
      url: '/printer/del',
      method: 'post',
      data
    })
  }