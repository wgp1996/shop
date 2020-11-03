import request from '@/utils/request'

// 查询随机检测单列表
export function listRandomInsp(query) {
  return request({
    url: '/system/randomInsp/list',
    method: 'get',
    params: query
  })
}

// 查询随机检测单列表
export function allListRandomInsp(query) {
  return request({
    url: '/system/randomInsp/allList',
    method: 'get',
    params: query
  })
}

// 查询随机检测单详细
export function getRandomInsp(id) {
  return request({
    url: '/system/randomInsp/' + id,
    method: 'get'
  })
}

// 新增随机检测单
export function addRandomInsp(data) {
  return request({
    url: '/system/randomInsp',
    method: 'post',
    data: data
  })
}

// 修改随机检测单
export function updateRandomInsp(data) {
  return request({
    url: '/system/randomInsp',
    method: 'put',
    data: data
  })
}

// 删除随机检测单
export function delRandomInsp(id) {
  return request({
    url: '/system/randomInsp/' + id,
    method: 'delete'
  })
}

// 导出随机检测单
export function exportRandomInsp(query) {
  return request({
    url: '/system/randomInsp/export',
    method: 'get',
    params: query
  })
}
// 检测地点下拉列表
export function getAllCheckAddress(query) {
  return request({
    url: '/system/checkAddress/getAllCheckAddress',
    method: 'get',
    params: query
  })
}