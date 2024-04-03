import { Table, TableColumnsType, Tag } from 'antd'
import { OrderProps } from '@/model/interface/order.ts'
import { userOrderTypeOptions } from '@/model/options/order.ts'
import { useMemo } from 'react'

interface OrderTableProps {
  data: OrderProps[]
  selectIds: string[]
  setSelectIds: (value: string[]) => void
}

const columns: TableColumnsType<OrderProps> = [
  { title: '姓名', dataIndex: 'userName' },
  { title: '房间号', dataIndex: 'roomName' },
  { title: '时间', dataIndex: 'dateTime' },
  { title: '人数', dataIndex: 'peopleNumber' },
  {
    title: '类型',
    dataIndex: 'type',
    render: (value) => {
      const item = userOrderTypeOptions.find((v) => v.value === value)
      return <Tag color={item.color}>{item.key}</Tag>
    },
  },
]

export const OrderTable = ({ data, selectIds, setSelectIds }: OrderTableProps) => {
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectIds,
      onChange: setSelectIds,
    }
  }, [selectIds, setSelectIds])

  return <Table rowKey={(record) => record.id} columns={columns} dataSource={data} rowSelection={rowSelection} />
}
