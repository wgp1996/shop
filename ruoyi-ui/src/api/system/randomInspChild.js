import request from '@/utils/request'

// 查询检测单明细列表
export function listRandomInspChild(query) {
  return request({
    url: '/system/randomInspChild/list',
    method: 'get',
    params: query
  })
}

// 查询检测单明细详细
export function getRandomInspChild(id) {
  return request({
    url: '/system/randomInspChild/' + id,
    method: 'get'
  })
}

// 新增检测单明细
export function addRandomInspChild(data) {
  return request({
    url: '/system/randomInspChild',
    method: 'post',
    data: data
  })
}

// 修改检测单明细
export function updateRandomInspChild(data) {
  return request({
    url: '/system/randomInspChild',
    method: 'put',
    data: data
  })
}

// 删除检测单明细
export function delRandomInspChild(id) {
  return request({
    url: '/system/randomInspChild/' + id,
    method: 'delete'
  })
}

// 导出检测单明细
export function exportRandomInspChild(query) {
  return request({
    url: '/system/randomInspChild/export',
    method: 'get',
    params: query
  })
}