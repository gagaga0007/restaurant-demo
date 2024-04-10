import { useState } from 'react'
import { useAuth } from '@/store/authContext.tsx'
import { Button, DatePicker, Form, Input, InputNumber, message } from 'antd'
import { UserTypeEnum } from '@/model/interface/base.ts'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'
import { OrderEditProps } from '@/model/interface/order.ts'
import dayjs from 'dayjs'
import { createOrder } from '@/model/api/order.ts'

export const CustomerLogin = () => {
  const navigate = useNavigate()
  const { setUserName, setUserType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onSubmit = async (data: OrderEditProps) => {
    try {
      setLoading(true)

      const formData: OrderEditProps = {
        ...data,
        mealTime: dayjs(data.mealTime).toISOString(),
      }
      await createOrder(formData)

      setUserName(data.userName)
      setUserType(UserTypeEnum.CUSTOMER)
      navigate(`/${routes.LAYOUT_SELECT}`)
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const disabledTime = () => {
    const range = (start: number, end: number) => {
      const result = []
      for (let i = start; i < end; i++) {
        result.push(i)
      }
      return result
    }

    return { disabledHours: () => range(0, 60).splice(0, 17) }
  }

  return (
    <Form form={form} onFinish={onSubmit} disabled={loading} labelAlign="left" labelCol={{ span: 7 }}>
      <Form.Item
        rules={[{ required: true, message: 'ご宿泊様お名前を入力してください' }]}
        name="userName"
        label="ご宿泊様お名前"
      >
        <Input placeholder="ご宿泊様お名前を入力してください" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'お食事予約人数を入力してください' }]}
        name="numberOfDiners"
        label="お食事予約人数"
      >
        <InputNumber
          placeholder="お食事予約人数を入力してください"
          min={0}
          max={99}
          step={1}
          precision={0}
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'お食事ご来場日時を入力してください' }]}
        name="mealTime"
        label="お食事ご来場日時"
      >
        <DatePicker
          showTime={{ format: 'HH:mm', minuteStep: 10, hideDisabledOptions: true }}
          format="YYYY-MM-DD HH:mm"
          disabledTime={disabledTime}
          showNow={false}
          placeholder="お食事ご来場日時を入力してください"
          style={{ width: '100%' }}
        />
      </Form.Item>
      <Button type="primary" block loading={loading} htmlType="submit">
        確認
      </Button>
    </Form>
  )
}
