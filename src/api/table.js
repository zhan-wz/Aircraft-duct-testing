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

export function getLabel(formData) {
  return request({
    url: `/api/detect`,
    method: 'get',
    headers: {
      'Content-Type': 'multipart/form-data'
   },
   data: formData
  })
}