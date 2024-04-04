import { Table, TableColumnsType } from 'antd'
import { OrderProps } from '@/model/interface/order.ts'
import { useMemo } from 'react'
import { BaseTableProps } from '@/model/interface/base.ts'
import { getDate } from '@/core/util.ts'

interface OrderTableProps extends BaseTableProps<OrderProps> {
  selectIds: string[]
  setSelectIds: (value: string[]) => void
}

const columns: TableColumnsType<OrderProps> = [
  { title: '姓名', dataIndex: 'userName' },
  { title: '房间号', dataIndex: 'deptName' },
  { title: '人数', dataIndex: 'numberOfDiners' },
  { title: '就餐时间', dataIndex: 'mealTime', render: (value) => getDate(value, { withTime: true }) },
  { title: '填写时间', dataIndex: 'createTime', render: (value) => getDate(value, { withTime: true }) },
  // {
  //   title: '类型',
  //   dataIndex: 'type',
  //   render: (value) => {
  //     const item = userOrderTypeOptions.find((v) => v.value === value)
  //     return <Tag color={item.color}>{item.key}</Tag>
  //   },
  // },
]

export const OrderTable = ({ data, selectIds, setSelectIds, loading }: OrderTableProps) => {
  const rowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectIds,
      onChange: setSelectIds,
    }
  }, [selectIds, setSelectIds])

  return (
    <Table
      rowKey={(record) => record.createTime}
      columns={columns}
      dataSource={data}
      rowSelection={rowSelection}
      loading={loading}
    />
  )
}
