import request from '@/utils/request'

// 查询批发销货一票通列表
export function listWholeSales(query) {
  return request({
    url: '/system/wholeSales/list',
    method: 'get',
    params: query
  })
}
export function selectWholeAllList(query) {
  return request({
    url: '/system/wholeSales/selectWholeAllList',
    method: 'get',
    params: query
  })
}
// 查询批发销货一票通详细
export function getWholeSales(id) {
  return request({
    url: '/system/wholeSales/' + id,
    method: 'get'
  })
}
// 删除批发销货一票通子表
export function delWholeSalesChild(id) {
  return request({
    url: '/system/wholeSalesChild/' + id,
    method: 'delete'
  })
}
// 生效单据
export function updateWholeSalesStatus(id) {
  return request({
    url: '/system/wholeSales/effect/' + id,
    method: 'delete'
  })
}

// 查询批发销货一票通明细
export function getWholeSalesChild(dj_number) {
  return request({
    url: '/system/wholeSalesChild/getWholeSalesChild?djNumber=' + dj_number,
    method: 'get'
  })
}


// 新增批发销货一票通
export function addWholeSales(data) {
  return request({
    url: '/system/wholeSales',
    method: 'post',
    data: data
  })
}

// 修改批发销货一票通
export function updateWholeSales(data) {
  return request({
    url: '/system/wholeSales',
    method: 'put',
    data: data
  })
}

// 删除批发销货一票通
export function delWholeSales(id) {
  return request({
    url: '/system/wholeSales/' + id,
    method: 'delete'
  })
}

// 导出批发销货一票通
export function exportWholeSales(query) {
  return request({
    url: '/system/wholeSales/export',
    method: 'get',
    params: query
  })
}