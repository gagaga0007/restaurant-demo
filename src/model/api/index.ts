import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'

const api = axios.create({
  baseURL: '/',
})

api.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    // TODO: header
    // request.headers.set()

    return request
  },
  (error) => {
    console.error('@@@ ERROR @@@: ', error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error) => {
    console.error(error)
    message.error('发生错误，请查看控制台')
  },
)

export default api
