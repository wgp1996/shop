import request from '@/utils/request'

// 查询物业收款列表
export function listPropertyCollection(query) {
  return request({
    url: '/system/propertyCollection/list',
    method: 'get',
    params: query
  })
}
// 物业收款选择合同信息
export function getLeaseContractList(query) {
  return request({
    url: '/system/leasechild/getLeaseContractListAll' ,
    method: 'get',
    params: query
  })
}
// 查询物业收款详细
export function getPropertyCollection(collectionCode) {
  return request({
    url: '/system/propertyCollection/' + collectionCode,
    method: 'get'
  })
}

// 新增物业收款
export function addPropertyCollection(data) {
  return request({
    url: '/system/propertyCollection',
    method: 'post',
    data: data
  })
}

// 修改物业收款
export function updatePropertyCollection(data) {
  return request({
    url: '/system/propertyCollection',
    method: 'put',
    data: data
  })
}

// 删除物业收款
export function delPropertyCollection(collectionCode) {
  return request({
    url: '/system/propertyCollection/' + collectionCode,
    method: 'delete'
  })
}

// 导出物业收款
export function exportPropertyCollection(query) {
  return request({
    url: '/system/propertyCollection/export',
    method: 'get',
    params: query
  })
}