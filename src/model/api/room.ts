import { api } from '@/model/api/index.ts'
import { RoomProps } from '@/model/interface/room.ts'
import { BaseApiProps } from '@/model/interface/base.ts'

export const getRooms = async (params: { parentId?: number } = {}) => {
  const res = await api.get<BaseApiProps<RoomProps[]>>('/system/dept/list', { params })
  return res.data
}
