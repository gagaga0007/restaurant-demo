import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const API_PREFIX = '/api'

const defaultConfig: AxiosRequestConfig = {
  baseURL: API_PREFIX,
  timeout: 30000,
  // TODO: Translate
  timeoutErrorMessage: '接口超时',
  validateStatus: (status) => status < 400,
}

export const createClient = (config?: AxiosRequestConfig, withAuth?: boolean) => {
  const axiosConfig = { ...defaultConfig, ...config }
  if (withAuth) {
    // TODO: token
    const token = 'xxx' // getTokens()
    axiosConfig.headers && (axiosConfig.headers['Authorization'] = `Bearer ${token}`)
  }

  const instance = axios.create(axiosConfig)
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
      return config
    },
    (error: Error) => {
      console.error('@@@ Request Error @@@：', error)
      return Promise.reject(error)
    },
  )
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    (error: Error) => {
      console.error('@@@ Response Error @@@：', error)
      if (axios.isAxiosError(error)) {
        const response = error.response
        // TODO: translate
        return Promise.reject(new Error(response?.data?.message ?? '服务器异常，请联系运维人员'))
      } else {
        return Promise.reject(error)
      }
    },
  )
  return instance
}

export const api = createClient()

export const authApi = createClient({}, true)
