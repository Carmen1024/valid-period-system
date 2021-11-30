import request from '@/utils/request';

export function classifyQuery(data){
    return request({
        url: '/classify/query',
        method: 'post',
        data
      })
}

