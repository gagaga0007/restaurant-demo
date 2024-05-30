import { BasePage } from '@/components/base/basePage.tsx'
import { useCallback, useState } from 'react'
import { useMount } from 'ahooks'
import { OrderProps } from '@/model/interface/order.ts'
import { App, Button, Space, Typography } from 'antd'
import { OrderTable } from '@/components/order/orderTable.tsx'
import { changeOrderStatus, deleteOrder, getOrderList } from '@/model/api/order.ts'
import { BaseStatusEnum } from '@/model/interface/base.ts'

// const pageSize = 10

const OrderListPage = () => {
  const { message } = App.useApp()
  const [data, setData] = useState<OrderProps[]>([])
  const [page, setPage] = useState(1)
  // const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectIds, setSelectIds] = useState<number[]>([])

  const fetchData = useCallback(
    async (pageNumber: number) => {
      try {
        setLoading(true)
        const res = await getOrderList({ page: pageNumber })
        setData(res.rows)
        // setTotal(res.total)
        setPage(pageNumber)
      } catch (e) {
        message.error(e.msg ?? e.message)
      } finally {
        setLoading(false)
      }
    },
    [message],
  )

  const onDeselectAll = () => {
    setSelectIds([])
  }

  const onEntrance = async () => {
    try {
      setLoading(true)

      const ids = selectIds.join(',')
      // TODO: 改接口
      const res = await changeOrderStatus(ids, BaseStatusEnum.YES)
      if (res.code === 200) {
        message.success('入場済しました')
      }

      await fetchData(1)
      onDeselectAll()
    } catch (e) {
      message.error(e.msg ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async (id: number) => {
    try {
      setLoading(true)

      const res = await deleteOrder(id)
      if (res.code === 200) {
        // TODO: translate
        message.success('删除成功')
      }

      await fetchData(page)
      onDeselectAll()
    } catch (e) {
      message.error(e.msg ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  // const pagination = useMemo(() => {
  //   return {
  //     current: page,
  //     total: total,
  //     pageSize: pageSize,
  //     onChange: (page) => fetchData(page),
  //   } as TablePaginationConfig
  // }, [fetchData, page, total])

  useMount(() => fetchData(page))

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
            入場
          </Button>
        </Space>
      }
    >
      <OrderTable
        data={data}
        selectIds={selectIds}
        setSelectIds={setSelectIds}
        loading={loading}
        // pagination={pagination}
        onDelete={onDelete}
      />
    </BasePage>
  )
}

export default OrderListPage
