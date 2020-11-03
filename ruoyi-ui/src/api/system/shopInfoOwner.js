import request from '@/utils/request'

// 查询门店管理列表
export function listShopInfo(query) {
  return request({
    url: '/system/shopInfoOwner/list',
    method: 'get',
    params: query
  })
}

// 查询门店下拉管理列表
export function getShopList(query) {
  return request({
    url: '/system/shopInfoOwner/getShopList',
    method: 'get',
    params: query
  })
}

// 查询门店管理详细
export function getShopInfo(id) {
  return request({
    url: '/system/shopInfoOwner/' + id,
    method: 'get'
  })
}

// 新增门店管理
export function addShopInfo(data) {
  return request({
    url: '/system/shopInfoOwner',
    method: 'post',
    data: data
  })
}

// 修改门店管理
export function updateShopInfo(data) {
  return request({
    url: '/system/shopInfoOwner',
    method: 'put',
    data: data
  })
}

// 删除门店管理
export function delShopInfo(id) {
  return request({
    url: '/system/shopInfoOwner/' + id,
    method: 'delete'
  })
}

// 刷新门店电子价签
export function refresh(storeID) {
  return request({
    url: '/system/shopInfoOwner/refresh/' + storeID,
    method: 'delete'
  })
}

// 导出门店管理
export function exportShopInfo(query) {
  return request({
    url: '/system/shopInfoOwner/export',
    method: 'get',
    params: query
  })
}