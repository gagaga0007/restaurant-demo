import { Button, Popconfirm, Table, TableColumnsType, Tag } from 'antd'
import { OrderProps } from '@/model/interface/order.ts'
import React, { useMemo } from 'react'
import { BaseStatusEnum, BaseTableProps } from '@/model/interface/base.ts'
import { getDate } from '@/core/util.ts'
import type { TableRowSelection } from 'antd/es/table/interface'
import { DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

interface OrderTableProps extends BaseTableProps<OrderProps> {
  selectIds: number[]
  setSelectIds: (value: number[]) => void
  // pagination: TablePaginationConfig
  onDelete: (id: number) => void
}

export const OrderTable = ({ data, selectIds, setSelectIds, loading, onDelete }: OrderTableProps) => {
  const columns: TableColumnsType<OrderProps> = useMemo(
    () => [
      { title: '名前', dataIndex: 'userName', render: (value) => `${value} 様` },
      { title: '部屋番号', dataIndex: 'deptName' },
      { title: '人数', dataIndex: 'numberOfDiners' },
      { title: 'ご予約済席', dataIndex: 'seatList', width: 220 },
      { title: '食事日時', dataIndex: 'mealTime', render: (value) => getDate(value, { withTime: true }) },
      { title: '記入日時', dataIndex: 'createTime', render: (value) => getDate(dayjs.utc(value), { withTime: true }) },
      {
        title: '状態',
        dataIndex: 'isCheckIn',
        render: (value) => {
          const flag = value === BaseStatusEnum.YES
          return <Tag color={flag ? 'green' : 'red'}>{flag ? '入場済' : '未入場'}</Tag>
        },
      },
      {
        title: '操作',
        render: (value, record) => (
          <Popconfirm
            title="削除"
            description="削除後、復元できません。削除しますか?"
            placement="left"
            okText="確定"
            cancelText="キャンセル"
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
            onConfirm={() => onDelete(record.id)}
          >
            <Button ghost danger>
              削除
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [onDelete],
  )

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
      // pagination={pagination}
    />
  )
}
