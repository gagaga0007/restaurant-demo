import { BasePage } from '@/components/base/basePage.tsx'
import { useState } from 'react'
import { useMount } from 'ahooks'
import { OrderProps } from '@/model/interface/order.ts'
import { App, Button, Space, Typography } from 'antd'
import { OrderTable } from '@/components/order/orderTable.tsx'
import { changeOrderStatus, getOrderList } from '@/model/api/order.ts'

const OrderListPage = () => {
  const { message } = App.useApp()
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

  const onEntrance = async () => {
    try {
      setLoading(true)

      const ids = selectIds.join(',')
      await changeOrderStatus(ids)

      await fetchData()
      onDeselectAll()
      // TODO: Translate
      message.success('修改成功')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useMount(fetchData)

  return (
    <BasePage
      title="予約リスト"
      extra={
        <Space>
          <Typography.Text> {selectIds.length} 項目を選び</Typography.Text>
          <Button type="primary" ghost onClick={onDeselectAll} disabled={selectIds.length === 0}>
            選択をキャンセルする
          </Button>
          <Button type="primary" onClick={onEntrance} disabled={selectIds.length === 0}>
            {/* TODO: Translate */}
            入场
          </Button>
        </Space>
      }
    >
      <OrderTable data={data} selectIds={selectIds} setSelectIds={setSelectIds} loading={loading} />
    </BasePage>
  )
}

export default OrderListPage
