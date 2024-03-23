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
  CHAIR_TYPE_VALUE,
  chairStatusOptions,
  defaultFillAlpha,
  ID_KEY,
  NAME_KEY,
  PARENT_ID_KEY,
  STATUS_KEY,
  TABLE_TYPE_VALUE,
  TABLE_TEXT_TYPE_VALUE,
  TYPE_KEY,
} from '../core/options.tsx'
import { getRandomId } from '../core/util.ts'

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
  const [titleName, setTitleName] = useState('')

  const onChangeObjectProperties = async (data: ChangePropertiesProps) => {
    try {
      selectedObjects.forEach((v) => {
        // 如果是文字，跳过
        if (v.type === 'text') return

        /** 填充颜色 */
        if (data.fillColor) {
          const { r, g, b, a } = data.fillColor.toRgb()
          v.set('fill', `rgba(${r}, ${g}, ${b}, ${a})`)
        }
        /** 边框颜色 */
        if (data.strokeColor) {
          const { r, g, b, a } = data.strokeColor.toRgb()
          v.set('stroke', `rgba(${r}, ${g}, ${b}, ${a})`)
        }
        /** 边框宽度 */
        v.set('strokeWidth', Number(data.strokeWidth))
        // 刷新画布
        v.canvas?.renderAll()
      })

      /** 桌位名 */
      if (isSingleTable || isMultipleHasSingleTable) {
        const tableItem = isSingleTable
          ? selectedObjects[0] // 单选 table
          : selectedObjects.find((v) => v.data?.[TYPE_KEY] === TABLE_TYPE_VALUE) // 多选中含有单个 table

        // 设置自定义 data 中的 name
        tableItem.set('data', { ...tableItem.data, [NAME_KEY]: data.tableName })
        // 更新页面显示的桌位名
        setTitleName(data.tableName)

        // 更新桌位名的文字
        const canvas = tableItem.canvas
        const textObjects = canvas.getObjects('text')
        // 找出绑定到当前桌子的文字对象
        const textItem = textObjects.find((v) => v.data?.[PARENT_ID_KEY] === tableItem.data?.id)
        if (textItem) {
          // 如果有，修改文字内容
          // @ts-ignore
          textItem.set('text', data.tableName || '')
          canvas.requestRenderAll()
        }
      }

      /** 椅子名 */
      if (isSingleChair) {
        const chairItem = selectedObjects[0]

        // 设置自定义 data 中的 name
        chairItem.set('data', { ...chairItem.data, [NAME_KEY]: data.chairName })
        // 更新页面显示的座位号
        setTitleName(data.chairName)
      }

      await message.success('修改成功')
    } catch (e) {
      console.error(e)
    }
  }

  // 单选椅子或多选中含有椅子时，修改椅子状态
  const onChairStatusChange = (value: string) => {
    // 选择的值对应的颜色
    const color = chairStatusOptions.find((v) => v.value === value)?.color
    let rgbList: RegExpMatchArray
    if (color) {
      rgbList = color.match(/\d+/g)
    }

    const chairs = isSingleChair
      ? [selectedObjects[0]] // 单选椅子
      : selectedObjects.filter((v) => v.type === 'circle' && v.data?.[TYPE_KEY] === CHAIR_TYPE_VALUE) // 多选中含有一个或多个椅子

    chairs.forEach((v) => {
      // 设置自定义 data 中的值
      v.set('data', { ...v.data, [STATUS_KEY]: value })
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

    const activeObjects: fabric.Object[] = []

    const clonedTableIdList: { oldId: string; newId: string }[] = []

    if (group) {
      /** 多选：有 group，是选择了多个元素 */
      group._objects.forEach((v) => {
        v.clone((cloned: fabric.Object) => {
          // 新 id
          const newId = getRandomId()

          if (cloned.type === 'image') {
            // group 中，图片 left、top 不需要计算，基于原始元素正常处理
            cloned.left = v.left + offset
            cloned.top = v.top + offset
            cloned.data = { ...v.data, [ID_KEY]: v.data[ID_KEY] ? newId : undefined }
          } else {
            // group 中，图形元素 left、top 的计算问题：
            // https://stackoverflow.com/questions/71356612/why-top-and-left-properties-become-negative-after-selection-fabricjs
            // https://stackoverflow.com/questions/29829475/how-to-get-the-canvas-relative-position-of-an-object-that-is-in-a-group
            const left = v.left + group.left + group.width / 2 + offset
            const top = v.top + group.top + group.height / 2 + offset
            cloned.left = left
            cloned.top = top
            cloned.data = { ...v.data, [ID_KEY]: v.data[ID_KEY] ? newId : undefined }

            // 如果是桌子，把以前的 id 和新 id 暂存一下
            if (item.data?.[TYPE_KEY] === TABLE_TYPE_VALUE) {
              clonedTableIdList.push({ oldId: v.data?.[ID_KEY], newId })
            }

            // 添加到画布
            canvas.add(cloned)
            activeObjects.push(cloned)
          }
        })
      })

      // 循环新克隆出来的元素列表，如果是桌子的文字，根据暂存的桌子 id 列表重新赋值一下新的 id
      activeObjects.forEach((v) => {
        if (v.data?.[TYPE_KEY] === TABLE_TEXT_TYPE_VALUE) {
          v.data[PARENT_ID_KEY] = clonedTableIdList.find((d) => d.oldId === v.data[PARENT_ID_KEY])?.newId
        }
      })
    } else {
      /** 单选 */
      // 新 id
      const newId = getRandomId()

      // 选择的是单个元素
      item.clone((cloned: fabric.Object) => {
        cloned.left += offset
        cloned.top += offset
        cloned.data = { ...item.data, [ID_KEY]: item.data[ID_KEY] ? newId : undefined }
        // 添加到画布
        canvas.add(cloned)
        activeObjects.push(cloned)
      })

      // 如果是桌子，将其桌位号的文字框一并克隆
      if (item.data?.[TYPE_KEY] === TABLE_TYPE_VALUE) {
        const textObject = canvas
          .getObjects('text')
          .find((v) => v.data && v.data[PARENT_ID_KEY] === item.data?.[ID_KEY])

        textObject.clone((cloned: fabric.Object) => {
          cloned.left += offset
          cloned.top += offset
          cloned.data = { [TYPE_KEY]: TABLE_TEXT_TYPE_VALUE, [PARENT_ID_KEY]: newId }
          // 添加到画布
          canvas.add(cloned)
          activeObjects.push(cloned)
        })
      }
    }

    // 取消当前选中
    canvas.discardActiveObject()
    // 设置选中为新克隆的元素，从新组中取
    const activeSelection = new fabric.ActiveSelection(activeObjects, { canvas })
    canvas.setActiveObject(activeSelection)
    // 刷新画布
    canvas.requestRenderAll()
    setSelectedObjects(activeObjects)
  }

  const deleteObjects = () => {
    // 画布中桌子的文字
    const canvas = selectedObjects[0].canvas
    if (!canvas) return
    const textObjects = canvas.getObjects('text').filter((v) => v.data && v.data[TYPE_KEY] === TABLE_TEXT_TYPE_VALUE)

    selectedObjects.forEach((v) => {
      const canvas = v.canvas

      // 如果是桌子，一并删除他们的文字
      if (v.data?.[TYPE_KEY] === TABLE_TYPE_VALUE) {
        // 文字对象
        const text = textObjects.find((item) => item.data?.[PARENT_ID_KEY] === v.data?.id)
        // 如果文字对象已经被选择了就不删除（当前文字是否在 selectedObjects 中，通过 parent_id 判断）
        // 没有则删除
        if (
          !selectedObjects.find(
            (item) =>
              item.data?.[TYPE_KEY] === TABLE_TEXT_TYPE_VALUE &&
              item.data?.[PARENT_ID_KEY] === text.data?.[PARENT_ID_KEY],
          )
        ) {
          canvas.remove(text)
        }
      }
      canvas.remove(v)
      canvas.requestRenderAll()
    })
    // 清空选择框
    onDeleteObjects()
    setSelectedObjects([])
  }

  // 是单选桌子
  const isSingleTable = useMemo(() => {
    return selectedObjects.length === 1 && selectedObjects[0].data?.[TYPE_KEY] === TABLE_TYPE_VALUE
  }, [selectedObjects])

  // 是单选椅子
  const isSingleChair = useMemo(() => {
    return selectedObjects.length === 1 && selectedObjects[0].data?.[TYPE_KEY] === CHAIR_TYPE_VALUE
  }, [selectedObjects])

  // 是多选，含有【一个或多个】椅子
  const isMultipleHasChair = useMemo(() => {
    const hasChairObject = selectedObjects.filter((v) => v.data?.[TYPE_KEY] === CHAIR_TYPE_VALUE).length > 0
    return selectedObjects.length > 1 && hasChairObject
  }, [selectedObjects])

  // 是多选，含有【单个】桌子
  const isMultipleHasSingleTable = useMemo(() => {
    const hasTableObject = selectedObjects.filter((v) => v.data?.[TYPE_KEY] === TABLE_TYPE_VALUE).length === 1
    return selectedObjects.length > 1 && hasTableObject
  }, [selectedObjects])

  // 切换选择的元素清空显示的桌位名/座位号
  useEffect(() => {
    setTitleName('')
  }, [selectedObjects])

  useEffect(() => {
    if (selectedObjects.length === 1) {
      // 单选时
      // 给默认值 TODO: 颜色
      settingForm.setFieldValue('strokeWidth', selectedObjects[0].strokeWidth)
    }
    // 桌位名，设置到表单上
    if (isSingleTable || isMultipleHasSingleTable) {
      const tableItem = isSingleTable
        ? selectedObjects[0] // 单选桌子
        : selectedObjects.find((v) => v.data[TYPE_KEY] === TABLE_TYPE_VALUE) // 多选中含有单个桌子
      const tableName = tableItem.data?.[NAME_KEY]
      settingForm.setFieldValue('tableName', tableName)
      // 设置标题显示名称
      setTitleName(tableName)
    }
    // 椅子名，设置到表单上
    if (isSingleChair) {
      const chairName = selectedObjects[0].data?.[NAME_KEY]
      settingForm.setFieldValue('chairName', chairName)
      // 设置标题显示名称
      setTitleName(chairName)
    }
  }, [isMultipleHasSingleTable, isSingleChair, isSingleTable, selectedObjects, settingForm])

  return (
    <>
      <Typography.Title level={4} style={{ margin: 0 }}>
        <SettingOutlined /> 设置{titleName ? ` ${titleName}` : null}
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
        {(isSingleTable || isMultipleHasSingleTable) && (
          <Form.Item name="tableName" label="桌位名">
            <Input placeholder="设置桌位名" allowClear />
          </Form.Item>
        )}
        {isSingleChair && (
          <Form.Item name="chairName" label="座位号">
            <Input placeholder="设置座位号" allowClear />
          </Form.Item>
        )}
        <Button type="primary" block htmlType="submit">
          确认
        </Button>
      </Form>
      <Divider />
      {(isSingleChair || isMultipleHasChair) && (
        <Dropdown menu={{ items: chairSelectItems, onClick: (e) => onChairStatusChange(e.key) }}>
          <Button icon={<ContainerOutlined />} type="primary" ghost block style={{ marginTop: 12 }}>
            <Space>
              <span>{isMultipleHasChair ? '批量设置' : ''}椅子状态</span>
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
