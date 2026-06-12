import axios, { AxiosRequestConfig } from 'axios'

const instance = axios.create({
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等头部信息
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 封装基础的请求方法
const http = {
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.get(url, { params, ...config })
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.put(url, data, config)
  },
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return instance.delete(url, { params, ...config })
  }
}

export default http
