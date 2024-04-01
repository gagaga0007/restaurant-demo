import { useAuth } from '@/store/authContext.tsx'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { UserLoginProps } from '@/model/interface/userLogin.ts'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'

export const AdminLogin = () => {
  const navigate = useNavigate()
  const { setUserName } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onSubmit = (data: UserLoginProps) => {
    setLoading(true)
    setTimeout(() => {
      setUserName(data.userName)
      setLoading(false)
      navigate(`/${routes.EDITOR_EDIT}`)
    }, 500)
  }

  return (
    <Form form={form} onFinish={onSubmit} disabled={loading} labelAlign="left" labelCol={{ span: 4 }}>
      <Form.Item rules={[{ required: true, message: '请输入用户名' }]} name="userName" label="用户名">
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请输入密码' }]} name="password" label="密码">
        <Input.Password placeholder="请输入密码" />
      </Form.Item>
      <Button type="primary" block loading={loading} htmlType="submit">
        确认
      </Button>
    </Form>
  )
}