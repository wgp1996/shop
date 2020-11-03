import request from '@/utils/request'

// 查询业户商品建档列表
export function listOwnerGoods(query) {
  return request({
    url: '/system/ownerGoods/list',
    method: 'get',
    params: query
  })
}

// 查询业户商品建档下拉列表
export function goodsList(query) {
  return request({
    url: '/system/ownerGoods/goodsList',
    method: 'get',
    params: query
  })
}

// 查询业户商品建档列表
export function getPageOwnerGoodsList(query) {
  return request({
    url: '/system/ownerGoods/ownerGoodsList',
    method: 'get',
    params: query
  })
}

// 查询业户商品建档详细
export function getOwnerGoods(id) {
  return request({
    url: '/system/ownerGoods/' + id,
    method: 'get'
  })
}

// 新增业户商品建档
export function addOwnerGoods(data) {
  return request({
    url: '/system/ownerGoods',
    method: 'post',
    data: data
  })
}

// 修改业户商品建档
export function updateOwnerGoods(data) {
  return request({
    url: '/system/ownerGoods',
    method: 'put',
    data: data
  })
}

// 删除业户商品建档
export function delOwnerGoods(id) {
  return request({
    url: '/system/ownerGoods/' + id,
    method: 'delete'
  })
}

// 导出业户商品建档
export function exportOwnerGoods(query) {
  return request({
    url: '/system/ownerGoods/export',
    method: 'get',
    params: query
  })
}