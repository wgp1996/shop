import request from '@/utils/request'

// 查询销售收款列表
export function listSalesCollection(query) {
  return request({
    url: '/system/salesCollection/list',
    method: 'get',
    params: query
  })
}
// 销售收款选择合同信息
export function getLeaseContractList(query) {
  return request({
    url: '/system/leasechild/getLeaseContractListSales' ,
    method: 'get',
    params: query
  })
}
// 查询销售收款详细
export function getSalesCollection(collectionCode) {
  return request({
    url: '/system/salesCollection/' + collectionCode,
    method: 'get'
  })
}

// 新增销售收款
export function addSalesCollection(data) {
  return request({
    url: '/system/salesCollection',
    method: 'post',
    data: data
  })
}

// 修改销售收款
export function updateSalesCollection(data) {
  return request({
    url: '/system/salesCollection',
    method: 'put',
    data: data
  })
}

// 删除销售收款
export function delSalesCollection(collectionCode) {
  return request({
    url: '/system/salesCollection/' + collectionCode,
    method: 'delete'
  })
}

// 导出销售收款
export function exportSalesCollection(query) {
  return request({
    url: '/system/salesCollection/export',
    method: 'get',
    params: query
  })
}