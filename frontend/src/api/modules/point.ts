import http from '@/api'

// 获取历史数据
export const getPointHistory = (params: { data_point: string }) => {
  return http.get('/api/point/history/window24h', params)
}
