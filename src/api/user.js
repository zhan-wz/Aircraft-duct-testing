import request from '@/utils/request'

export function login(formData) {
  return request({
    url: '/api/login',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
   },
   data: formData
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:9528/dev-api/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'get'
  })
}
