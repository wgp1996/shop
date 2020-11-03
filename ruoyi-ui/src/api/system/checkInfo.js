import request from '@/utils/request'

// 查询盘点单列表
export function listCheckInfo(query) {
  return request({
    url: '/system/checkInfo/list',
    method: 'get',
    params: query
  })
}

// 查询盘点单详细
export function getCheckInfo(id) {
  return request({
    url: '/system/checkInfo/' + id,
    method: 'get'
  })
}

// 新增盘点单
export function addCheckInfo(data) {
  return request({
    url: '/system/checkInfo',
    method: 'post',
    data: data
  })
}

// 修改盘点单
export function updateCheckInfo(data) {
  return request({
    url: '/system/checkInfo',
    method: 'put',
    data: data
  })
}

// 删除盘点单
export function delCheckInfo(id) {
  return request({
    url: '/system/checkInfo/' + id,
    method: 'delete'
  })
}

// 生效盘点单
export function updateCheckInfoStatus(id) {
  return request({
    url: '/system/checkInfo/effect/' + id,
    method: 'delete'
  })
}

// 导出盘点单
export function exportCheckInfo(query) {
  return request({
    url: '/system/checkInfo/export',
    method: 'get',
    params: query
  })
}