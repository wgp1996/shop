import request from '@/utils/request'

// 查询批发销货一票通子表列表
export function listWholeSalesChild(query) {
  return request({
    url: '/system/wholeSalesChild/list',
    method: 'get',
    params: query
  })
}

// 查询批发销货一票通子表详细
export function getWholeSalesChild(id) {
  return request({
    url: '/system/wholeSalesChild/' + id,
    method: 'get'
  })
}

// 新增批发销货一票通子表
export function addWholeSalesChild(data) {
  return request({
    url: '/system/wholeSalesChild',
    method: 'post',
    data: data
  })
}

// 修改批发销货一票通子表
export function updateWholeSalesChild(data) {
  return request({
    url: '/system/wholeSalesChild',
    method: 'put',
    data: data
  })
}

// 删除批发销货一票通子表
export function delWholeSalesChild(id) {
  return request({
    url: '/system/wholeSalesChild/' + id,
    method: 'delete'
  })
}

// 导出批发销货一票通子表
export function exportWholeSalesChild(query) {
  return request({
    url: '/system/wholeSalesChild/export',
    method: 'get',
    params: query
  })
}