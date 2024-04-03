import { BasePage } from '@/components/base/basePage.tsx'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { getRandomId } from '@/core/util.ts'
import { OrderProps, OrderTypeEnum } from '@/model/interface/order.ts'
import { Button, Space, Typography } from 'antd'
import { OrderTable } from '@/components/order/orderTable.tsx'

const OrderListPage = () => {
  const [data, setData] = useState<OrderProps[]>([])
  const [selectIds, setSelectIds] = useState<string[]>([])

  const onDeselectAll = () => {
    setSelectIds([])
  }

  const onSubmit = () => {
    console.log(selectIds)
  }

  useMount(() => {
    const list = []
    for (let i = 0; i < 30; i++) {
      list.push({
        id: getRandomId(),
        userName: `user${i + 1}`,
        roomName: `room${i + 1}`,
        dateTime: `dateTime${i + 1}`,
        peopleNumber: `peopleNumber${i + 1}`,
        type: OrderTypeEnum.BREAKFAST,
      })
    }
    setData(list)
  })

  return (
    <BasePage
      title="预订列表"
      extra={
        <Space>
          <Typography.Text>已选 {selectIds.length} 项</Typography.Text>
          <Button type="primary" ghost onClick={onDeselectAll} disabled={selectIds.length === 0}>
            取消选择
          </Button>
          <Button type="primary" onClick={onSubmit} disabled={selectIds.length === 0}>
            提交
          </Button>
        </Space>
      }
    >
      <OrderTable data={data} selectIds={selectIds} setSelectIds={setSelectIds} />
    </BasePage>
  )
}

export default OrderListPage
