import { OrderEditProps, OrderProps, SearchOrderProps } from '@/model/interface/order.ts'
import { api } from '@/model/api/index.ts'
import { BaseApiResultProps, BasePageProps, BaseStatusEnum } from '@/model/interface/base.ts'

export const createOrder = async (data: OrderEditProps) => {
  const res = await api.post<BaseApiResultProps>('/hotel/ordering', data)
  return res.data
}

export const editOrder = async (data: Partial<OrderProps>) => {
  const res = await api.put<BaseApiResultProps>('/hotel/ordering', data)
  return res.data
}

export const deleteOrder = async (ids: number) => {
  const res = await api.delete<BaseApiResultProps>(`/hotel/ordering/${ids}`)
  return res.data
}

export const getOrderList = async (params: SearchOrderProps = {}) => {
  const res = await api.get<BasePageProps<OrderProps>>('/hotel/ordering/list', { params })
  return res.data
}

export const changeOrderStatus = async (ids: string, status: BaseStatusEnum) => {
  const res = await api.put<BaseApiResultProps>(``)
  return res.data
}

export const getOrderSeatsByDate = async (date: string) => {
  const res = await api.get(`/hotel/ordering/seatList/${date}`)
  return res.data
}
