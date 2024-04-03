import { Button, Form, Input } from 'antd'
import { UserLoginProps } from '@/model/interface/login.ts'
import { useState } from 'react'
import { useAuth } from '@/store/authContext.tsx'
import { UserTypeEnum } from '@/model/interface/base.ts'
import { useMount } from 'ahooks'
import { getRooms } from '@/model/api/room.ts'
import { RoomProps } from '@/model/interface/room.ts'

export const CustomerLoginEditor = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const { setUserName, setRoomNumber, setUserType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<RoomProps[]>([])
  const [form] = Form.useForm()

  const fetchData = async () => {
    try {
      const room1 = async () => await getRooms({ parentId: 101 })
      const room2 = async () => await getRooms({ parentId: 102 })
      const room3 = async () => await getRooms({ parentId: 103 })
      const room4 = async () => await getRooms({ parentId: 104 })
      const room5 = async () => await getRooms({ parentId: 105 })
      const room6 = async () => await getRooms({ parentId: 106 })
      const res = await Promise.all([room1(), room2(), room3(), room4(), room5(), room6()])
      let list = []
      res.forEach((v) => {
        list = list.concat(v.data)
      })
      setRooms(list)
    } catch (e) {
      console.log(e)
    }
  }

  const onSubmit = (data: UserLoginProps) => {
    setLoading(true)
    setTimeout(() => {
      setUserName(data.userName)
      setRoomNumber(data.roomName)
      setUserType(UserTypeEnum.CUSTOMER)
      setIsLogin(true)
      setLoading(false)
    }, 500)
  }

  useMount(fetchData)

  return (
    <Form form={form} onFinish={onSubmit} disabled={loading} labelAlign="left" labelCol={{ span: 4 }}>
      <Form.Item rules={[{ required: true, message: '请输入姓名' }]} name="userName" label="姓名">
        <Input placeholder="请输入姓名" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请输入房间号' }]} name="roomName" label="房间号">
        <Input placeholder="请输入房间号" />
      </Form.Item>
      <Button type="primary" block loading={loading} htmlType="submit">
        确认
      </Button>
    </Form>
  )
}
