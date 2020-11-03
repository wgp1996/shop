import request from '@/utils/request'

// 查询冷库建档列表
export function listCk(query) {
  return request({
    url: '/system/ck/list',
    method: 'get',
    params: query
  })
}
// 查询仓库下拉信息列表
export function getCkAll(query) {
  return request({
    url: '/system/ck/getCkAll',
    method: 'get',
    params: query
  })
}
// 查询冷库建档详细
export function getCk(id) {
  return request({
    url: '/system/ck/' + id,
    method: 'get'
  })
}

// 新增冷库建档
export function addCk(data) {
  return request({
    url: '/system/ck',
    method: 'post',
    data: data
  })
}

// 修改冷库建档
export function updateCk(data) {
  return request({
    url: '/system/ck',
    method: 'put',
    data: data
  })
}

// 删除冷库建档
export function delCk(id) {
  return request({
    url: '/system/ck/' + id,
    method: 'delete'
  })
}

// 导出冷库建档
export function exportCk(query) {
  return request({
    url: '/system/ck/export',
    method: 'get',
    params: query
  })
}