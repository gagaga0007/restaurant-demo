import { api } from '@/model/api/index.ts'
import { LayoutEditProps, LayoutProps } from '@/model/interface/layout.ts'
import { BaseApiProps, BaseApiResultProps } from '@/model/interface/base.ts'

export const createLayout = async (data: LayoutEditProps) => {
  const res = await api.post<BaseApiResultProps>('/hotel/layout', data)
  return res.data
}

export const editLayout = async (data: LayoutEditProps) => {
  const res = await api.put<BaseApiResultProps>('/hotel/layout', data)
  return res.data
}

export const getLayout = async (id: string | number) => {
  const res = await api.get<BaseApiProps<LayoutProps>>(`/hotel/layout/${id}`)
  return res.data
}
