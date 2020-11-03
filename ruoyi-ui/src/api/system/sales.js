import request from '@/utils/request'

// 查询销售合同列表
export function listContract(query) {
  return request({
    url: '/system/sales/list',
    method: 'get',
    params: query
  })
}
// 查询销售合同子表信息
export function getContractChild(code) {
  return request({
    url: '/system/sales/leaseChildData/' + code,
    method: 'get'
  })
}

// 查询销售合同详细
export function getContract(id) {
  return request({
    url: '/system/sales/' + id,
    method: 'get'
  })
}

// 查询业主信息
export function getOwnerList() {
  return request({
    url: '/system/owner/ownerList',
    method: 'get'
  })
}

// 新增销售合同
export function addContract(data) {
  return request({
    url: '/system/sales',
    method: 'post',
    data: data
  })
}

// 修改销售合同
export function updateContract(data) {
  return request({
    url: '/system/sales',
    method: 'put',
    data: data
  })
}

// 修改租赁合同状态
export function updateContractStatus(id) {
  return request({
    url: '/system/sales/effect/' + id,
    method: 'delete'
  })
}

// 删除销售合同
export function delContract(id) {
  return request({
    url: '/system/sales/' + id,
    method: 'delete'
  })
}

// 删除销售合同子表
export function delContractChild(id) {
  return request({
    url: '/system/saleschild/' + id,
    method: 'delete'
  })
}

// 导出销售合同
export function exportContract(query) {
  return request({
    url: '/system/sales/export',
    method: 'get',
    params: query
  })
}