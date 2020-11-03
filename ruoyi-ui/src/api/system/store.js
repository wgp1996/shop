import request from '@/utils/request'

// 查询冷库建档列表
export function listStore(query) {
  return request({
    url: '/system/store/list',
    method: 'get',
    params: query
  })
}
// 查询仓库下拉信息列表
export function getStoreAll(query) {
  return request({
    url: '/system/store/getStoreAll',
    method: 'get',
    params: query
  })
}
// 查询冷库建档详细
export function getStore(id) {
  return request({
    url: '/system/store/' + id,
    method: 'get'
  })
}

// 新增冷库建档
export function addStore(data) {
  return request({
    url: '/system/store',
    method: 'post',
    data: data
  })
}

// 修改冷库建档
export function updateStore(data) {
  return request({
    url: '/system/store',
    method: 'put',
    data: data
  })
}

// 删除冷库建档
export function delStore(id) {
  return request({
    url: '/system/store/' + id,
    method: 'delete'
  })
}

// 导出冷库建档
export function exportStore(query) {
  return request({
    url: '/system/store/export',
    method: 'get',
    params: query
  })
}