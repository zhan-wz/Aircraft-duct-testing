import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/detect',
    method: 'get',
    params
  })
}

export function getPic(id) {
  return request({
    url: `/api/OriImage/${id}`,
    method: 'get'
  })
}
