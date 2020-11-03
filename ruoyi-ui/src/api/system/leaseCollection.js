import request from '@/utils/request'

// 查询租赁收款列表
export function listLeaseCollection(query) {
  return request({
    url: '/system/leaseCollection/list',
    method: 'get',
    params: query
  })
}

// 租赁收款选择租赁合同信息
export function getLeaseContractlist(query) {
  return request({
    url: '/system/leasechild/getLeaseContractlist' ,
    method: 'get',
    params: query
  })
}
// 查询租赁收款详细
export function getLeaseCollection(collectionCode) {
  return request({
    url: '/system/leaseCollection/' + collectionCode,
    method: 'get'
  })
}

// 新增租赁收款
export function addLeaseCollection(data) {
  return request({
    url: '/system/leaseCollection',
    method: 'post',
    data: data
  })
}

// 修改租赁收款
export function updateLeaseCollection(data) {
  return request({
    url: '/system/leaseCollection',
    method: 'put',
    data: data
  })
}

// 删除租赁收款
export function delLeaseCollection(collectionCode) {
  return request({
    url: '/system/leaseCollection/' + collectionCode,
    method: 'delete'
  })
}

// 导出租赁收款
export function exportLeaseCollection(query) {
  return request({
    url: '/system/leaseCollection/export',
    method: 'get',
    params: query
  })
}