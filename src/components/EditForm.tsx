import { Button, Col, ColorPicker, Divider, Form, Input, InputNumber, Row, Typography } from 'antd'
import { ChangePropertiesProps } from '../core/interface.ts'
import { fabric } from 'fabric'
import { useEffect, useMemo, useState } from 'react'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  DEFAULT_CHAIR_NAME,
  DEFAULT_NAME_NAME,
  DEFAULT_STATUS_NAME,
  DEFAULT_TABLE_NAME,
  defaultChairColor,
} from '../core/options.tsx'
import { getNameProperties } from '../core/util.ts'

interface Props {
  selectedObjects: fabric.Object[]
  setSelectedObjects: (objects: fabric.Object[]) => void
  onDeleteObjects: () => void
}

const settingInitial: Partial<ChangePropertiesProps> = {
  strokeWidth: 2,
}

export const EditForm = ({ selectedObjects, setSelectedObjects, onDeleteObjects }: Props) => {
  const [settingForm] = Form.useForm()
  const [statusLabel, setStatusLabel] = useState('改变状态')

  const onChangeObjectProperties = (data: ChangePropertiesProps) => {
    selectedObjects.forEach((v) => {
      if (data.fillColor) {
        const { r, g, b, a } = data.fillColor.toRgb()
        v.set('fill', `rgba(${r}, ${g}, ${b}, ${a})`)
      }

      if (data.strokeColor) {
        const { r, g, b, a } = data.strokeColor.toRgb()
        v.set('stroke', `rgba(${r}, ${g}, ${b}, ${a})`)
      }

      v.set('strokeWidth', Number(data.strokeWidth))

      if (data.name) {
        let itemName = v.name // 元素 name 值
        const oldItemNameProperty = getNameProperties(v.name, DEFAULT_NAME_NAME) // 元素旧的 name 值
        if (oldItemNameProperty) {
          // 如果有旧的属性值，将旧的属性名和属性值设为空
          itemName = itemName.replace(`:${DEFAULT_NAME_NAME}${oldItemNameProperty}`, '')
        }
        // 将新的属性名和值拼到 name 上
        v.set('name', `${itemName}:${DEFAULT_NAME_NAME}${data.name}`)
      }

      if (data.status) {
        //   TODO: 椅子状态
      }

      v.canvas?.renderAll()
    })
  }

  // TODO: 改变椅子状态
  const changeChairStatus = () => {
    const { r: defaultR, g: defaultG, b: defaultB } = defaultChairColor

    const item = selectedObjects[0]
    const canvas = item.canvas

    // if (item.name.includes(DEFAULT_DISABLE_NAME)) {
    //   item.set('fill', `rgba(${defaultR}, ${defaultG}, ${defaultB}, ${defaultFillAlpha})`)
    //   item.set('name', item.name.replace(`:${DEFAULT_DISABLE_NAME}`, ''))
    // } else {
    //   item.set('fill', `rgb(${disabledR}, ${disabledG}, ${disabledB})`)
    //   item.set('name', `${item.name}:${DEFAULT_DISABLE_NAME}`)
    // }

    // item.canvas.requestRenderAll()
  }

  const cloneObjects = () => {
    if (selectedObjects.length === 0) return

    const item = selectedObjects[0]
    const canvas = item.canvas
    const group = item.group

    const offset = 20

    if (group) {
      const clonedObjects: fabric.Object[] = []

      // 选择了多个元素
      group._objects.forEach((v) => {
        v.clone((cloned: fabric.Object) => {
          if (cloned.type === 'image') {
            // group 中，图片 left、top 不需要计算，基于原始元素正常处理
            cloned.left = v.left + offset
            cloned.top = v.top + offset
            cloned.name = v.name
          } else {
            // group 中，图形元素 left、top 的计算问题：
            // https://stackoverflow.com/questions/71356612/why-top-and-left-properties-become-negative-after-selection-fabricjs
            // https://stackoverflow.com/questions/29829475/how-to-get-the-canvas-relative-position-of-an-object-that-is-in-a-group
            cloned.left = v.left + group.left + group.width / 2 + offset
            cloned.top = v.top + group.top + group.height / 2 + offset
            cloned.name = v.name
          }
          canvas.add(cloned)
          // 加入到新组中
          clonedObjects.push(cloned)
        })
      })
      // 取消当前选中
      canvas.discardActiveObject()
      // 设置选中为新克隆的元素，从新组中取
      const activeObjects = new fabric.ActiveSelection(clonedObjects, { canvas })
      canvas.setActiveObject(activeObjects)
      canvas.requestRenderAll()
    } else {
      // 单个元素
      item.clone((cloned: fabric.Object) => {
        cloned.left += offset
        cloned.top += offset
        canvas.add(cloned)
        // 取消当前选中
        canvas.discardActiveObject()
        // 设置选中为新克隆的元素
        canvas.setActiveObject(cloned)
        setSelectedObjects([cloned])
      })
    }
  }

  const deleteObjects = () => {
    selectedObjects.forEach((v) => {
      const canvas = v.canvas
      canvas.remove(v)
      canvas.requestRenderAll()
    })
    // 清空选择框
    onDeleteObjects()
    setSelectedObjects([])
  }

  const isTable = useMemo(() => {
    return (
      selectedObjects.length === 1 &&
      selectedObjects[0].type === 'rect' &&
      selectedObjects[0].name?.includes(DEFAULT_TABLE_NAME)
    )
  }, [selectedObjects])

  const isChair = useMemo(() => {
    return (
      selectedObjects.length === 1 &&
      selectedObjects[0].type === 'circle' &&
      selectedObjects[0].name?.includes(DEFAULT_CHAIR_NAME)
    )
  }, [selectedObjects])

  useEffect(() => {
    if (selectedObjects.length === 0) {
      // 重置表单
      settingForm.resetFields()
    } else if (isTable) {
      // 设置桌位名
      settingForm.setFieldValue('name', getNameProperties(selectedObjects[0].name, DEFAULT_NAME_NAME))
    } else if (isChair) {
      // 设置椅子状态
      settingForm.setFieldValue('status', getNameProperties(selectedObjects[0].name, DEFAULT_STATUS_NAME))
    }
  }, [isChair, isTable, selectedObjects, settingForm])

  return (
    <>
      <Typography.Title level={4} style={{ margin: 0 }}>
        操作
      </Typography.Title>
      <Divider />
      <Form form={settingForm} layout="vertical" onFinish={onChangeObjectProperties} initialValues={settingInitial}>
        <Row>
          <Col span={12}>
            <Form.Item name="strokeColor" label="边框颜色">
              <ColorPicker format="rgb" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="fillColor" label="填充颜色">
              <ColorPicker format="rgb" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="strokeWidth" label="边框宽度">
          <InputNumber
            min={0}
            max={10}
            step={1}
            formatter={(value) => Math.floor(value ?? 0) + ''}
            style={{ width: '100%' }}
          />
        </Form.Item>
        {isTable && (
          <Form.Item name="name" label="桌位名">
            <Input maxLength={5} placeholder="桌位名" allowClear />
          </Form.Item>
        )}
        {/* TODO: 改变椅子状态，改为下拉选择 */}
        {/*{isChair && (*/}
        {/*  <Button icon={<RedoOutlined />} type="dashed" block onClick={changeChairStatus} style={{ marginTop: 12 }}>*/}
        {/*    改变状态*/}
        {/*  </Button>*/}
        {/*)}*/}
        <Button type="primary" block htmlType="submit">
          确认
        </Button>
      </Form>
      <Button icon={<CopyOutlined />} type="primary" ghost block onClick={cloneObjects} style={{ marginTop: 12 }}>
        克隆元素
      </Button>
      <Button icon={<DeleteOutlined />} danger block onClick={deleteObjects} style={{ marginTop: 12 }}>
        删除元素
      </Button>
    </>
  )
}
