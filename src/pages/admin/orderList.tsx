import { BasePage } from '@/components/base/basePage.tsx'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { OrderProps } from '@/model/interface/order.ts'
import { Button, message, Space, Typography } from 'antd'
import { OrderTable } from '@/components/order/orderTable.tsx'
import { getOrderList } from '@/model/api/order.ts'

const OrderListPage = () => {
  const [data, setData] = useState<OrderProps[]>([])
  const [loading, setLoading] = useState(false)
  const [selectIds, setSelectIds] = useState<string[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await getOrderList()
      setData(res.rows)
    } catch (e) {
      message.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onDeselectAll = () => {
    setSelectIds([])
  }

  const onSubmit = () => {
    console.log(selectIds)
  }

  useMount(fetchData)

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
      <OrderTable data={data} selectIds={selectIds} setSelectIds={setSelectIds} loading={loading} />
    </BasePage>
  )
}

export default OrderListPage
