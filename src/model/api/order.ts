import { OrderEditProps, SearchOrderProps } from '@/model/interface/order.ts'
import { api } from '@/model/api/index.ts'

export const createOrder = async (data: OrderEditProps) => {
  const res = await api.post('/hotel/ordering', data)
  return res.data
}

export const getOrderList = async (params: SearchOrderProps = {}) => {
  const res = await api.get('/hotel/ordering/list', { params })
  return res.data
}
