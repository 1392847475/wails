import http from '@/api'

// 获取分站信息
export const getSubstationInfo = () => {
  return http.get('/api/substation/get')
}
