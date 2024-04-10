import { useAuth } from '@/store/authContext.tsx'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { UserLoginProps } from '@/model/interface/login.ts'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'
import { UserTypeEnum } from '@/model/interface/base.ts'

const initData = {
  userName: 'admin',
  password: 'qazplm123',
}

export const AdminLogin = () => {
  const navigate = useNavigate()
  const { setUserName, setUserType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onSubmit = (data: UserLoginProps) => {
    setLoading(true)
    setTimeout(() => {
      setUserName(data.userName)
      setUserType(UserTypeEnum.ADMIN)
      setLoading(false)
      navigate(`/${routes.LAYOUT_EDIT}`)
    }, 500)
  }

  return (
    <Form
      form={form}
      onFinish={onSubmit}
      disabled={loading}
      labelAlign="left"
      labelCol={{ span: 5 }}
      initialValues={initData}
    >
      <Form.Item rules={[{ required: true, message: '利用者名を入力してください' }]} name="userName" label="利用者名">
        <Input placeholder="利用者名を入力してください" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'パスワードを入力してください' }]}
        name="password"
        label="パスワード"
      >
        <Input.Password placeholder="パスワードを入力してください" />
      </Form.Item>
      <Button type="primary" block loading={loading} htmlType="submit">
        確認
      </Button>
    </Form>
  )
}
