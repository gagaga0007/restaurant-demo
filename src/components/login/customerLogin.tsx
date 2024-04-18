import { useState } from 'react'
import { useAuth } from '@/store/authContext.tsx'
import { Button, DatePicker, Form, Input, InputNumber, message, Select } from 'antd'
import { UserTypeEnum } from '@/model/interface/base.ts'
import { useNavigate } from 'react-router-dom'
import { routes } from '@/core/routes.ts'
import { OrderEditProps } from '@/model/interface/order.ts'
import dayjs from 'dayjs'
import { createOrder } from '@/model/api/order.ts'
import { RoomProps } from '@/model/interface/room.ts'
import { getRooms } from '@/model/api/room.ts'
import { useMount } from 'ahooks'
import { DisabledTimes } from 'rc-picker/lib/interface'

export const CustomerLogin = () => {
  const navigate = useNavigate()
  const { setUserName, setRoomNumber, setUserType } = useAuth()
  const [loading, setLoading] = useState(false)
  const [rooms, setRooms] = useState<RoomProps[]>([])
  // const [options, setOptions] = useState<{ label: string; value: string }[]>([])
  const [form] = Form.useForm()

  const fetchData = async () => {
    try {
      setLoading(true)

      const room1 = async () => await getRooms({ parentId: 101 })
      const room2 = async () => await getRooms({ parentId: 102 })
      const room3 = async () => await getRooms({ parentId: 103 })
      const room4 = async () => await getRooms({ parentId: 104 })
      const room5 = async () => await getRooms({ parentId: 105 })
      const room6 = async () => await getRooms({ parentId: 106 })
      const res = await Promise.all([room1(), room2(), room3(), room4(), room5(), room6()])

      let list: RoomProps[] = []
      res.forEach((v) => {
        list = list.concat(v.data)
      })
      setRooms(list)
      // setOptions(list.map((v) => ({ label: v.deptName, value: v.deptName })))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: OrderEditProps) => {
    try {
      setLoading(true)

      const formData: OrderEditProps = {
        ...data,
        mealTime: dayjs(data.mealTime).toISOString(),
      }
      await createOrder(formData)

      setUserName(data.userName)
      setRoomNumber(data.deptName)
      setUserType(UserTypeEnum.CUSTOMER)
      navigate(`/${routes.LAYOUT_SELECT}`, { state: { numberOfDiners: data.numberOfDiners } })
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

    return { disabledHours: () => range(0, 60).splice(0, 17) } as DisabledTimes
  }

  const filterOption = (input: string, option?: { key: string; value: string; children: string }) => {
    return (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
  }

  // const getOptions = (text: string) => {
  //   const filter = rooms.filter((v) => v.deptName.toLowerCase().includes(text.toLowerCase()))
  //   setOptions(filter.map((v) => ({ label: v.deptName, value: v.deptName })))
  // }

  useMount(fetchData)

  return (
    <Form form={form} onFinish={onSubmit} disabled={loading} labelAlign="left" layout="vertical">
      <Form.Item
        rules={[{ required: true, message: 'ご宿泊様お名前を入力してください' }]}
        name="userName"
        label="ご宿泊様お名前"
      >
        <Input placeholder="ご宿泊様お名前を入力してください" />
      </Form.Item>
      {/* TODO: Translate */}
      <Form.Item rules={[{ required: true, message: '请输入房间号' }]} name="deptName" label="房间号">
        <Select showSearch placeholder="请选择房间号" filterOption={filterOption}>
          {rooms.map((v) => (
            <Select.Option key={v.deptId} value={v.deptName}>
              {v.deptName}
            </Select.Option>
          ))}
        </Select>
        {/*<AutoComplete options={options} onSearch={getOptions} placeholder="请选择房间号" />*/}
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
          changeOnScroll
          needConfirm={false}
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
