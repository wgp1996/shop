import request from '@/utils/request'

// 查询供应商建档列表
export function listPerson(query) {
  return request({
    url: '/system/person/list',
    method: 'get',
    params: query
  })
}
// 查询供应商下拉信息列表
export function getPersonAll(query) {
  return request({
    url: '/system/person/getPersonAll',
    method: 'get',
    params: query
  })
}
// 查询供应商建档详细
export function getPerson(id) {
  return request({
    url: '/system/person/' + id,
    method: 'get'
  })
}

// 新增供应商建档
export function addPerson(data) {
  return request({
    url: '/system/person',
    method: 'post',
    data: data
  })
}

// 修改供应商建档
export function updatePerson(data) {
  return request({
    url: '/system/person',
    method: 'put',
    data: data
  })
}

// 删除供应商建档
export function delPerson(id) {
  return request({
    url: '/system/person/' + id,
    method: 'delete'
  })
}

// 导出供应商建档
export function exportPerson(query) {
  return request({
    url: '/system/person/export',
    method: 'get',
    params: query
  })
}