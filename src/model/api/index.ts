import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const axiosConfig: AxiosRequestConfig = {
  timeout: 30000,
  timeoutErrorMessage: '连接超时',
  validateStatus: (status) => status < 400,
}

const createClient = (config?: AxiosRequestConfig) => {
  const instance = axios.create({ ...axiosConfig, ...config })
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      return config
    },
    (error: Error) => {
      console.log('@@@ Request Error @@@：', error)
      return Promise.reject(error)
    },
  )
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error: Error) => {
      console.log('@@@ Response Error @@@：', error)
      if (axios.isAxiosError(error)) {
        const response = error.response
        return Promise.reject(new Error(response?.data?.message ?? '服务器异常，请联系运维人员'))
      } else {
        return Promise.reject(error)
      }
    },
  )
  return instance
}

const api = createClient()

export default api
