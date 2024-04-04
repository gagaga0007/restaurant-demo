import { OrderEditProps, SearchOrderProps } from '@/model/interface/order.ts'
import { api } from '@/model/api/index.ts'

export const createOrder = async (data: OrderEditProps) => {
  const res = await api.post('/dev-api/hotel/ordering', data)
  return res.data
}

export const getOrderList = async (params: SearchOrderProps = {}) => {
  const res = await api.get('/dev-api/hotel/ordering/list', { params })
  return res.data
}
