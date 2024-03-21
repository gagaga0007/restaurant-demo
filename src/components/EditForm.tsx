import {
  Button,
  Col,
  ColorPicker,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Space,
  Typography,
} from 'antd'
import { ChairStatusEnum, ChangePropertiesProps } from '../core/interface.ts'
import { fabric } from 'fabric'
import { useEffect, useMemo, useState } from 'react'
import { ContainerOutlined, CopyOutlined, DeleteOutlined, DownOutlined, SettingOutlined } from '@ant-design/icons'
import {
  chairStatusOptions,
  DEFAULT_CHAIR_NAME,
  DEFAULT_NAME_NAME,
  DEFAULT_STATUS_NAME,
  DEFAULT_TABLE_NAME,
  defaultFillAlpha,
} from '../core/options.tsx'
import { getNameProperties } from '../core/util.ts'

interface Props {
  selectedObjects: fabric.Object[]
  setSelectedObjects: (objects: fabric.Object[]) => void
  onDeleteObjects: () => void
}

const settingInitial: Partial<ChangePropertiesProps> = {
  strokeWidth: 2,
  status: ChairStatusEnum.DEFAULT,
}

// 椅子状态下拉框数据（多个时在按钮下拉菜单用）
const chairSelectItems = chairStatusOptions.map((v) => ({
  key: v.value,
  label: <span style={{ color: v.color }}>{v.key}</span>,
}))

export const EditForm = ({ selectedObjects, setSelectedObjects, onDeleteObjects }: Props) => {
  const [settingForm] = Form.useForm()
  const [singleTableName, setSingleTableName] = useState('')

  const onChangeObjectProperties = async (data: ChangePropertiesProps) => {
    try {
      selectedObjects.forEach((v) => {
        // 填充颜色
        if (data.fillColor) {
          const { r, g, b, a } = data.fillColor.toRgb()
          v.set('fill', `rgba(${r}, ${g}, ${b}, ${a})`)
        }
        // 边框样色
        if (data.strokeColor) {
          const { r, g, b, a } = data.strokeColor.toRgb()
          v.set('stroke', `rgba(${r}, ${g}, ${b}, ${a})`)
        }
        // 边框宽度
        v.set('strokeWidth', Number(data.strokeWidth))
        // 命名（目前为桌位名）
        if (isSingleTable) {
          let itemName = v.name // 元素 name 属性
          const oldItemNameProperty = getNameProperties(v.name, DEFAULT_NAME_NAME) // 元素旧的 name 值
          if (oldItemNameProperty) {
            // 如果有旧的属性值，将旧的属性名和属性值设为空
            itemName = itemName.replace(`:${DEFAULT_NAME_NAME}${oldItemNameProperty}`, '')
          }
          // 将新的属性名和值拼到元素的 name 属性上
          v.set('name', `${itemName}:${DEFAULT_NAME_NAME}${data.name}`)
          // 更新页面显示的桌位名
          setSingleTableName(data.name)
        }

        v.canvas?.renderAll()
      })

      await message.success('修改成功')
    } catch (e) {
      console.error(e)
    }
  }

  // 单选椅子或多选中含有椅子时，修改椅子状态
  const onChairStatusChange = (value: string) => {
    let chairs: fabric.Object[]

    if (isSingleChair) {
      // 单选椅子
      chairs = [selectedObjects[0]]
    } else {
      // 多选中含有椅子
      chairs = selectedObjects.filter((v) => v.type === 'circle' && v.name?.includes(DEFAULT_CHAIR_NAME))
    }

    // 选择的值对应的颜色
    const color = chairStatusOptions.find((v) => v.value === value)?.color
    let rgbList: RegExpMatchArray
    if (color) {
      rgbList = color.match(/\d+/g)
    }

    chairs.forEach((v) => {
      let itemName = v.name // 元素 name 属性
      const oldItemNameProperty = getNameProperties(v.name, DEFAULT_STATUS_NAME) // 元素旧的 status 值
      if (oldItemNameProperty) {
        // 如果有旧的属性值，删除旧的属性名和属性值
        itemName = itemName.replace(`:${DEFAULT_STATUS_NAME}${oldItemNameProperty}`, '')
      }
      // 将新的属性名和值拼到元素的 name 属性上
      v.set('name', `${itemName}:${DEFAULT_STATUS_NAME}${value}`)
      // 设置画布上椅子的样式（颜色）
      if (rgbList.length > 1) {
        v.set('stroke', `rgb(${rgbList[0]}, ${rgbList[1]}, ${rgbList[2]})`)
        v.set('fill', `rgba(${rgbList[0]}, ${rgbList[1]}, ${rgbList[2]}, ${defaultFillAlpha})`)
      }
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
        cloned.name = item.name
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

  // 单选桌子
  const isSingleTable = useMemo(() => {
    return (
      selectedObjects.length === 1 &&
      selectedObjects[0].type === 'rect' &&
      selectedObjects[0].name?.includes(DEFAULT_TABLE_NAME)
    )
  }, [selectedObjects])

  // 单选椅子
  const isSingleChair = useMemo(() => {
    return (
      selectedObjects.length === 1 &&
      selectedObjects[0].type === 'circle' &&
      selectedObjects[0].name?.includes(DEFAULT_CHAIR_NAME)
    )
  }, [selectedObjects])

  // 多选中含有椅子
  const isMultipleChair = useMemo(() => {
    const hasChairObject = selectedObjects.filter((v) => v.name?.includes(DEFAULT_CHAIR_NAME)).length > 0
    return selectedObjects.length > 1 && hasChairObject
  }, [selectedObjects])

  // 切换选择的元素清空显示的桌位名
  useEffect(() => {
    setSingleTableName('')
  }, [selectedObjects])

  useEffect(() => {
    if (selectedObjects.length === 0) {
      // 重置表单
      settingForm.resetFields()
    } else if (selectedObjects.length === 1) {
      // 单选
      // 默认值
      settingForm.setFieldValue('strokeWidth', selectedObjects[0].strokeWidth)

      if (isSingleTable) {
        // 桌位名
        const tableName = getNameProperties(selectedObjects[0].name, DEFAULT_NAME_NAME)
        settingForm.setFieldValue('name', tableName)
        setSingleTableName(tableName)
      }
    }
  }, [isSingleChair, isSingleTable, selectedObjects, settingForm])

  return (
    <>
      <Typography.Title level={4} style={{ margin: 0 }}>
        <SettingOutlined /> 设置{singleTableName ? `桌位：${singleTableName}` : null}
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
        {isSingleTable && (
          <Form.Item name="name" label="桌位名">
            <Input placeholder="设置桌位名" allowClear />
          </Form.Item>
        )}
        <Button type="primary" block htmlType="submit">
          确认
        </Button>
      </Form>
      <Divider />
      {(isSingleChair || isMultipleChair) && (
        <Dropdown menu={{ items: chairSelectItems, onClick: (e) => onChairStatusChange(e.key) }}>
          <Button icon={<ContainerOutlined />} type="primary" ghost block style={{ marginTop: 12 }}>
            <Space>
              <span>{isMultipleChair ? '批量设置' : ''}椅子状态</span>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      )}
      <Button icon={<CopyOutlined />} type="primary" ghost block onClick={cloneObjects} style={{ marginTop: 12 }}>
        克隆元素
      </Button>
      <Button icon={<DeleteOutlined />} danger block onClick={deleteObjects} style={{ marginTop: 12 }}>
        删除元素
      </Button>
    </>
  )
}
