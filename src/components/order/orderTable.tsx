import { Table, TableColumnsType, Tag } from 'antd'
import { OrderProps } from '@/model/interface/order.ts'
import { useMemo } from 'react'
import { BaseStatusEnum, BaseTableProps } from '@/model/interface/base.ts'
import { getDate } from '@/core/util.ts'
import type { TableRowSelection } from 'antd/es/table/interface'

interface OrderTableProps extends BaseTableProps<OrderProps> {
  selectIds: string[]
  setSelectIds: (value: string[]) => void
}

const columns: TableColumnsType<OrderProps> = [
  { title: '名前', dataIndex: 'userName' },
  { title: '部屋番号', dataIndex: 'deptName' },
  { title: '人数', dataIndex: 'numberOfDiners' },
  { title: '食事時間', dataIndex: 'mealTime', render: (value) => getDate(value, { withTime: true }) },
  { title: '記入時間', dataIndex: 'createTime', render: (value) => getDate(value, { withTime: true }) },
  {
    // TODO: Translate
    title: '状态',
    dataIndex: 'deleteFlg',
    render: (value) => {
      const flag = value === BaseStatusEnum.YES
      // TODO: Translate
      return <Tag color={flag ? 'green' : 'red'}>{flag ? '已入场' : '未入场'}</Tag>
    },
  },
]

export const OrderTable = ({ data, selectIds, setSelectIds, loading }: OrderTableProps) => {
  const rowSelection: TableRowSelection<OrderProps> = useMemo(() => {
    return {
      selectedRowKeys: selectIds,
      onChange: setSelectIds,
      getCheckboxProps: (record) => ({
        disabled: record.deleteFlg === BaseStatusEnum.YES,
      }),
    }
  }, [selectIds, setSelectIds])

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      dataSource={data}
      rowSelection={rowSelection}
      loading={loading}
    />
  )
}
