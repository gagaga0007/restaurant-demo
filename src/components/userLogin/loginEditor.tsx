import { Button, Form, Input } from 'antd'
import { UserLoginProps } from '@/model/interface/userLogin.ts'
import { useState } from 'react'
import { useAuth } from '@/store/authContext.tsx'

export const LoginEditor = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const { setUserName, setRoomNumber } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onSubmit = (data: UserLoginProps) => {
    setLoading(true)
    setTimeout(() => {
      setUserName(data.userName)
      setRoomNumber(data.roomName)
      setIsLogin(true)
      setLoading(false)
    }, 500)
  }

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
