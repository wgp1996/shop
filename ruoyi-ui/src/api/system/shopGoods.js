import request from '@/utils/request'

// 查询门店商品管理列表
export function listShopGoods(query) {
  return request({
    url: '/system/shopGoods/list',
    method: 'get',
    params: query
  })
}

// 查询门店商品管理详细
export function getShopGoods(id) {
  return request({
    url: '/system/shopGoods/' + id,
    method: 'get'
  })
}

// 新增门店商品管理
export function addShopGoods(data) {
  return request({
    url: '/system/shopGoods',
    method: 'post',
    data: data
  })
}

// 修改门店商品管理
export function updateShopGoods(data) {
  return request({
    url: '/system/shopGoods',
    method: 'put',
    data: data
  })
}

// 删除门店商品管理
export function delShopGoods(id) {
  return request({
    url: '/system/shopGoods/' + id,
    method: 'delete'
  })
}

// 导出门店商品管理
export function exportShopGoods(query) {
  return request({
    url: '/system/shopGoods/export',
    method: 'get',
    params: query
  })
}