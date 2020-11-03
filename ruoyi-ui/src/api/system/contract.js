import request from '@/utils/request'

// 查询租赁合同列表
export function listContract(query) {
  return request({
    url: '/system/contract/list',
    method: 'get',
    params: query
  })
}
// 查询租赁合同子表信息
export function getContractChild(code) {
  return request({
    url: '/system/contract/leaseChildData/' + code,
    method: 'get'
  })
}

// 查询租赁合同详细
export function getContract(id) {
  return request({
    url: '/system/contract/' + id,
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

// 新增租赁合同
export function addContract(data) {
  return request({
    url: '/system/contract',
    method: 'post',
    data: data
  })
}

// 修改租赁合同
export function updateContract(data) {
  return request({
    url: '/system/contract',
    method: 'put',
    data: data
  })
}

// 删除租赁合同
export function delContract(id) {
  return request({
    url: '/system/contract/' + id,
    method: 'delete'
  })
}

// 修改租赁合同状态
export function updateContractStatus(id) {
  return request({
    url: '/system/contract/effect/' + id,
    method: 'delete'
  })
}

// 删除租赁合同子表
export function delContractChild(id) {
  return request({
    url: '/system/leasechild/' + id,
    method: 'delete'
  })
}

// 导出租赁合同
export function exportContract(query) {
  return request({
    url: '/system/contract/export',
    method: 'get',
    params: query
  })
}