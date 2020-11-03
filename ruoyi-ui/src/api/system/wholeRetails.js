import request from '@/utils/request'

// 查询批发销货一票通列表
export function listWholeRetail(query) {
  return request({
    url: '/info/wholeRetail/list',
    method: 'get',
    params: query
  })
}

// 查询批发销货一票通列表
export function allListWholeRetail(query) {
  return request({
    url: '/system/kh/allList',
    method: 'get',
    params: query
  })
}

// 查询批发销货一票通详细
export function getWholeRetail(id) {
  return request({
    url: '/info/wholeRetail/' + id,
    method: 'get'
  })
}
// 删除批发销货一票通子表
export function delWholeRetailChild(id) {
  return request({
    url: '/info/wholeRetailChild/' + id,
    method: 'delete'
  })
}
// 生效单据
export function updateWholeRetailStatus(id) {
  return request({
    url: '/info/wholeRetail/effect/' + id,
    method: 'delete'
  })
}
// 查询批发销货一票通明细
export function getWholeRetailChild(dj_number) {
  return request({
    url: '/info/wholeRetailChild/getWholeRetailChild?djNumber=' + dj_number,
    method: 'get'
  })
}


// 新增批发销货一票通
export function addWholeRetail(data) {
  return request({
    url: '/info/wholeRetail',
    method: 'post',
    data: data
  })
}

// 修改批发销货一票通
export function updateWholeRetail(data) {
  return request({
    url: '/info/wholeRetail',
    method: 'put',
    data: data
  })
}

// 删除批发销货一票通
export function delWholeRetail(id) {
  return request({
    url: '/info/wholeRetail/' + id,
    method: 'delete'
  })
}

// 导出批发销货一票通
export function exportWholeRetail(query) {
  return request({
    url: '/info/wholeRetail/export',
    method: 'get',
    params: query
  })
}