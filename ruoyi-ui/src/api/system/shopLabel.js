import request from '@/utils/request'

// 查询电子价签管理列表
export function listShopLabel(query) {
  return request({
    url: '/system/shopLabel/list',
    method: 'get',
    params: query
  })
}

// 查询电子价签管理详细
export function getShopLabel(id) {
  return request({
    url: '/system/shopLabel/' + id,
    method: 'get'
  })
}

// 新增电子价签管理
export function addShopLabel(data) {
  return request({
    url: '/system/shopLabel',
    method: 'post',
    data: data
  })
}

// 修改电子价签管理
export function updateShopLabel(data) {
  return request({
    url: '/system/shopLabel',
    method: 'put',
    data: data
  })
}

// 删除电子价签管理
export function delShopLabel(id) {
  return request({
    url: '/system/shopLabel/' + id,
    method: 'delete'
  })
}

// 绑定电子价签管理
export function bindShopLabel(id,storeId) {
  return request({
    url: '/system/shopLabel/bind/' + id+'/'+storeId,
    method: 'delete'
  })
}

bindShopLabel

// 导出电子价签管理
export function exportShopLabel(query) {
  return request({
    url: '/system/shopLabel/export',
    method: 'get',
    params: query
  })
}