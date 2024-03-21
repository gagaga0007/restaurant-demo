import { Button, Col, ColorPicker, Divider, Form, InputNumber, Row, Typography } from 'antd'
import { ChangePropertiesProps } from '../core/interface.ts'
import { fabric } from 'fabric'
import { useEffect } from 'react'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'

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
      v.canvas?.renderAll()
    })
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
          } else {
            // group 中，图形元素 left、top 的计算问题：
            // https://stackoverflow.com/questions/71356612/why-top-and-left-properties-become-negative-after-selection-fabricjs
            // https://stackoverflow.com/questions/29829475/how-to-get-the-canvas-relative-position-of-an-object-that-is-in-a-group
            cloned.left = v.left + group.left + group.width / 2 + offset
            cloned.top = v.top + group.top + group.height / 2 + offset
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

  useEffect(() => {
    if (selectedObjects.length === 0) {
      settingForm.resetFields()
    }
  }, [selectedObjects, settingForm])

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
        <Button type="primary" block htmlType="submit">
          确认
        </Button>
      </Form>
      <Button icon={<CopyOutlined />} type="primary" ghost block onClick={cloneObjects} style={{ margin: '12px 0' }}>
        克隆元素
      </Button>
      <Button icon={<DeleteOutlined />} danger block onClick={deleteObjects}>
        删除元素
      </Button>
    </>
  )
}
