import request from '@/utils/request';

export function printHistoryQuery(data){
    return request({
        url: '/printer_history/query',
        method: 'post',
        data
      })
}

