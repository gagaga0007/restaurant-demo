import { BasePage } from '@/components/base/basePage.tsx'
import { useMemo, useState } from 'react'
import { useMount } from 'ahooks'
import { getRandomId } from '@/core/util.ts'
import { OrderProps, OrderTypeEnum } from '@/model/interface/order.ts'
import { Button, Space, Table, TableColumnsType, Tag } from 'antd'
import { userOrderTypeOptions } from '@/model/options/order.ts'

const columns: TableColumnsType<OrderProps> = [
  {
    title: '姓名',
    dataIndex: 'userName',
  },
  {
    title: '房间号',
    dataIndex: 'roomName',
  },
  {
    title: '时间',
    dataIndex: 'dateTime',
  },
  {
    title: '人数',
    dataIndex: 'peopleNumber',
  },
  {
    title: '类型',
    dataIndex: 'type',
    render: (value) => {
      const item = userOrderTypeOptions.find((v) => v.value === value)
      return <Tag color={item.color}>{item.key}</Tag>
    },
  },
]

const OrderListPage = () => {
  const [data, setData] = useState<OrderProps[]>([])
  const [selectIds, setSelectIds] = useState<string[]>([])

  const onDeselectAll = () => {
    setSelectIds([])
  }

  const onSubmit = () => {
    console.log(selectIds)
  }

  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectIds,
      onChange: setSelectIds,
    }
  }, [selectIds])

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
          {selectIds.length > 0 && (
            <Button type="primary" ghost onClick={onDeselectAll}>
              取消选择
            </Button>
          )}
          <Button type="primary" onClick={onSubmit} disabled={selectIds.length === 0}>
            提交
          </Button>
        </Space>
      }
    >
      {/* @ts-ignore*/}
      <Table rowKey={(record) => record.id} columns={columns} dataSource={data} rowSelection={rowSelection} />
    </BasePage>
  )
}

export default OrderListPage
