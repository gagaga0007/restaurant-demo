import { Button, DatePicker, Form, InputNumber, Select } from 'antd'
import { UserOrderProps } from '@/model/interface/userLogin.ts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userOrderTypeOptions } from '@/model/options/userLogin.ts'
import { useAuth } from '@/store/authContext.tsx'

export const OrderEditor = ({ setIsLogin }: { setIsLogin: (value: boolean) => void }) => {
  const navigate = useNavigate()
  const { setUserName, setRoomNumber } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onSubmit = (data: UserOrderProps) => {
    setLoading(true)
    setTimeout(() => {
      console.log(data)
      setLoading(false)
      navigate('/editor')
    }, 500)
  }

  const onBack = () => {
    setUserName(undefined)
    setRoomNumber(undefined)
    setIsLogin(false)
  }

  return (
    <Form form={form} onFinish={onSubmit} disabled={loading} labelAlign="left" labelCol={{ span: 4 }}>
      <Form.Item rules={[{ required: true, message: '请输入人数' }]} name="peopleNumber" label="人数">
        <InputNumber placeholder="请输入人数" min={0} max={99} step={1} precision={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请选择时间' }]} name="dateTime" label="时间">
        <DatePicker showTime placeholder="请选择时间" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请选择类型' }]} name="type" label="类型">
        <Select placeholder="请选择类型">
          {userOrderTypeOptions.map((v) => (
            <Select.Option key={v.value} value={v.value} style={{ color: v.color }}>
              {v.key}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Button type="primary" block loading={loading} htmlType="submit">
        确认
      </Button>
      <Button type="primary" block ghost disabled={loading} onClick={onBack} style={{ marginTop: 16 }}>
        返回
      </Button>
    </Form>
  )
}