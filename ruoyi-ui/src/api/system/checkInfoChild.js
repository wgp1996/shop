import request from '@/utils/request'

// 查询盘点单子表列表
export function listCheckInfoChild(query) {
  return request({
    url: '/system/checkInfoChild/list',
    method: 'get',
    params: query
  })
}

// 查询盘点单子表详细
export function getCheckInfoChild(id) {
  return request({
    url: '/system/checkInfoChild/' + id,
    method: 'get'
  })
}

// 新增盘点单子表
export function addCheckInfoChild(data) {
  return request({
    url: '/system/checkInfoChild',
    method: 'post',
    data: data
  })
}

// 修改盘点单子表
export function updateCheckInfoChild(data) {
  return request({
    url: '/system/checkInfoChild',
    method: 'put',
    data: data
  })
}

// 删除盘点单子表
export function delCheckInfoChild(id) {
  return request({
    url: '/system/checkInfoChild/' + id,
    method: 'delete'
  })
}

// 导出盘点单子表
export function exportCheckInfoChild(query) {
  return request({
    url: '/system/checkInfoChild/export',
    method: 'get',
    params: query
  })
}