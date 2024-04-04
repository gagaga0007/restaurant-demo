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
  // const [rooms, setRooms] = useState<RoomProps[]>([])
  // const [, setOptions] = useState<{ label: string; value: string }[]>([])
  const [form] = Form.useForm()

  // const fetchData = async () => {
  //   try {
  //     setLoading(true)
  //
  //     const room1 = async () => await getRooms({ parentId: 101 })
  //     const room2 = async () => await getRooms({ parentId: 102 })
  //     const room3 = async () => await getRooms({ parentId: 103 })
  //     const room4 = async () => await getRooms({ parentId: 104 })
  //     const room5 = async () => await getRooms({ parentId: 105 })
  //     const room6 = async () => await getRooms({ parentId: 106 })
  //     const res = await Promise.all([room1(), room2(), room3(), room4(), room5(), room6()])
  //
  //     let list: RoomProps[] = []
  //     res.forEach((v) => {
  //       list = list.concat(v.data)
  //     })
  //     setRooms(list)
  //     setOptions(list.map((v) => ({ label: v.deptName, value: v.deptName })))
  //   } catch (e) {
  //     console.log(e)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

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
      navigate(`/${routes.EDITOR_SELECT}`)
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  // const filterOption = (input: string, option?: { key: string; value: string; children: string }) => {
  //   return (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
  // }

  // const getOptions = (text: string) => {
  //   const filter = rooms.filter((v) => v.deptName.toLowerCase().includes(text.toLowerCase()))
  //   setOptions(filter.map((v) => ({ label: v.deptName, value: v.deptName })))
  // }

  // useMount(fetchData)

  return (
    <Form form={form} onFinish={onSubmit} disabled={loading} labelAlign="left" labelCol={{ span: 5 }}>
      <Form.Item rules={[{ required: true, message: '请输入入住姓名' }]} name="userName" label="入住姓名">
        <Input placeholder="请输入入住时登记的姓名" />
      </Form.Item>
      {/*<Form.Item rules={[{ required: true, message: '请输入房间号' }]} name="roomName" label="房间号">*/}
      {/*  <Select showSearch placeholder="请选择房间号" filterOption={filterOption}>*/}
      {/*    {rooms.map((v) => (*/}
      {/*      <Select.Option key={v.deptId} value={v.deptName}>*/}
      {/*        {v.deptName}*/}
      {/*      </Select.Option>*/}
      {/*    ))}*/}
      {/*  </Select>*/}
      {/*  /!*<AutoComplete options={options} onSearch={getOptions} placeholder="请选择房间号" />*!/*/}
      {/*</Form.Item>*/}
      <Form.Item rules={[{ required: true, message: '请输入就餐人数' }]} name="numberOfDiners" label="就餐人数">
        <InputNumber placeholder="请输入就餐人数" min={0} max={99} step={1} precision={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请选择就餐时间' }]} name="mealTime" label="就餐时间">
        <DatePicker showTime placeholder="请选择就餐时间" style={{ width: '100%' }} />
      </Form.Item>
      <Button type="primary" block loading={loading} htmlType="submit">
        确认
      </Button>
    </Form>
  )
}
