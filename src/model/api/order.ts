import { OrderEditProps, OrderProps, SearchOrderProps } from '@/model/interface/order.ts'
import { api } from '@/model/api/index.ts'
import { BaseApiResultProps, BasePageProps } from '@/model/interface/base.ts'

export const createOrder = async (data: OrderEditProps) => {
  const res = await api.post<BaseApiResultProps>('/hotel/ordering', data)
  return res.data
}

export const editOrder = async (data: Partial<OrderProps>) => {
  const res = await api.put<BaseApiResultProps>('/hotel/ordering', data)
  return res.data
}

export const changeOrderStatus = async (ids: string) => {
  const res = await api.delete<BaseApiResultProps>(`/hotel/ordering/${ids}`)
  return res.data
}

export const getOrderList = async (params: SearchOrderProps = {}) => {
  const res = await api.get<BasePageProps<OrderProps>>('/hotel/ordering/list', { params })
  return res.data
}
