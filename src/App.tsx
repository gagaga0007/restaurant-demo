// import _ from "lodash";
import { useEffect, useRef, useState } from 'react'
import { Button, Col, ColorPicker, Divider, Form, InputNumber, Popconfirm, Row, Space, Typography, Upload } from 'antd'
import { fabric } from 'fabric'
import { CloseCircleOutlined, CopyOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadFile } from 'antd/lib/upload'
import { Color } from 'antd/lib/color-picker'
import { convertFileToBase64 } from './core/util.ts'

import './App.css'

interface CanvasPropertiesProps {
  width: number
  height: number
}

interface ChangePropertiesProps {
  fillColor: Color
  strokeColor: Color
  strokeWidth: string | number
}

const settingInitial: Partial<ChangePropertiesProps> = {
  strokeWidth: 2,
}

// const controlIconSize = 16

const fillAlpha = 0.5
const defaultRectR = 30,
  defaultRectG = 144,
  defaultRectB = 255
const defaultCircle1R = 255,
  defaultCircle1G = 75,
  defaultCircle1B = 75
const defaultCircle2R = 222,
  defaultCircle2G = 184,
  defaultCircle2B = 135
const defaultWallR = 0,
  defaultWallG = 0,
  defaultWallB = 0

function App() {
  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const canvasProperties = useRef<CanvasPropertiesProps>({ width: 0, height: 0 })

  const [backgroundImage, setBackgroundImage] = useState('')
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([])

  const [settingForm] = Form.useForm()

  const changeBgImg = async (fileInfo?: UploadChangeParam<UploadFile>) => {
    if (!fileInfo) {
      setBackgroundImage('')
    } else {
      const file = fileInfo.file.originFileObj
      // 转成 Base64
      const base64 = await convertFileToBase64(file as File)

      // 盒子宽度
      const innerWidth = innerElement.current!.getBoundingClientRect().width

      // 通过 Image 对象获取图片宽高，并设置 canvas 宽高
      const image = new Image()
      image.src = base64
      image.onload = () => {
        const height = (image.height * innerWidth) / image.width
        innerElement.current!.style.height = height + 'px'

        canvasObj.current!.setHeight(height)
        canvasElement.current!.height = height - 2
        canvasElement.current!.width = innerWidth - 2

        setBackgroundImage(base64)
      }
    }
  }

  const addDesk = () => {
    const primaryColor = `rgb(${defaultRectR}, ${defaultRectG}, ${defaultRectB})`
    const fillColor = `rgba(${defaultRectR}, ${defaultRectG}, ${defaultRectB}, ${fillAlpha})`

    const rect = new fabric.Rect({
      left: 50,
      top: 100,
      fill: fillColor,
      width: 120,
      height: 70,
      stroke: primaryColor,
      strokeWidth: 2,
    })

    canvasObj.current!.add(rect)
  }

  const addChair = () => {
    const primaryColor = `rgba(${defaultCircle1R}, ${defaultCircle1G}, ${defaultCircle1B})`
    const fillColor = `rgba(${defaultCircle1R}, ${defaultCircle1G}, ${defaultCircle1B}, ${fillAlpha})`

    const arc = new fabric.Circle({
      radius: 20,
      startAngle: -180,
      endAngle: 0,
      left: 50,
      top: 30,
      fill: fillColor,
      width: 40,
      height: 40,
      stroke: primaryColor,
      strokeWidth: 2,
    })

    canvasObj.current!.add(arc)
  }

  const addCircle = () => {
    const primaryColor = `rgba(${defaultCircle2R}, ${defaultCircle2G}, ${defaultCircle2B})`

    const circle = new fabric.Circle({
      radius: 20,
      left: 180,
      top: 100,
      fill: primaryColor,
      width: 40,
      height: 40,
      selectable: true,
      stroke: primaryColor,
      strokeWidth: 2,
    })

    canvasObj.current!.add(circle)
  }

  const addWall = () => {
    const fillColor = `rgb(${defaultWallR}, ${defaultWallG}, ${defaultWallB})`

    const rect = new fabric.Rect({
      left: 240,
      top: 50,
      fill: fillColor,
      width: 5,
      height: 200,
    })

    canvasObj.current!.add(rect)
  }

  const addImage = async (fileInfo?: UploadChangeParam<UploadFile>) => {
    if (!fileInfo) return

    const file = fileInfo.file.originFileObj
    // 转成 Base64
    const base64 = await convertFileToBase64(file as File)

    const addImage = new Image()
    addImage.src = base64
    addImage.onload = () => {
      const image = new fabric.Image(addImage, {
        left: 200,
        top: 200,
      })
      // 缩放到宽度为 300
      image.scaleToWidth(300)

      canvasObj.current!.add(image)
    }
  }

  const clearAll = () => {
    canvasObj.current!.clear()
    setBackgroundImage('')
    setSelectedObjects([])
  }

  const onSelectedObjectChange = (objects: fabric.Object[]) => {
    if (objects.length === 0) return

    const canvas = objects?.[0]?.canvas
    setSelectedObjects(canvas?.getActiveObjects() ?? [])
  }

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
      const newGroup = new fabric.Group([])

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
          newGroup.add(cloned)
        })
      })
      canvas.add(newGroup)
      // 取消当前选中
      canvas.discardActiveObject()
      // 设置选中为新克隆的元素，从新组中取
      const activeObjects = new fabric.ActiveSelection([...newGroup._objects], { canvas })
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
    canvasObj.current.discardActiveObject()
    setSelectedObjects([])
  }

  const updateCanvasContext = (canvas: fabric.Canvas | null) => {
    canvasObj.current = canvas
  }

  useEffect(() => {
    if (selectedObjects.length === 0) {
      settingForm.resetFields()
    }
  }, [selectedObjects, settingForm])

  useEffect(() => {
    // 设置宽高
    const { width, height } = innerElement.current!.getBoundingClientRect()
    const canvasWidth = width - 2
    const canvasHeight = height - 2
    canvasElement.current!.width = canvasWidth
    canvasElement.current!.height = canvasHeight
    canvasElement.current!.style.width = canvasWidth + 'px'
    canvasElement.current!.style.height = canvasHeight + 'px'
    canvasProperties.current.width = canvasWidth
    canvasProperties.current.height = canvasHeight

    // 初始化
    const fabricCanvas = new fabric.Canvas(canvasElement.current)

    // 监听选择元素 初始/更新/取消
    fabricCanvas.on('selection:created', (e) => {
      onSelectedObjectChange(e.selected ?? [])
    })

    fabricCanvas.on('selection:updated', (e) => {
      onSelectedObjectChange(e.selected ?? [])
      onSelectedObjectChange(e.deselected ?? [])
    })

    fabricCanvas.on('selection:cleared', (e) => {
      onSelectedObjectChange(e.deselected ?? [])
    })

    updateCanvasContext(fabricCanvas)

    return () => {
      updateCanvasContext(null)
      fabricCanvas.dispose()
    }
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px 24px 24px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Space style={{ marginBottom: 12 }}>
        <Upload onChange={changeBgImg} fileList={[]} customRequest={() => {}}>
          <Button icon={<UploadOutlined />} type="primary" ghost>
            背景图
          </Button>
        </Upload>
        {!!backgroundImage && (
          <Button icon={<CloseCircleOutlined />} type="primary" ghost danger onClick={() => changeBgImg()}>
            取消背景
          </Button>
        )}
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addDesk}>
          加桌子
        </Button>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addChair}>
          加椅子
        </Button>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addCircle}>
          加柱子
        </Button>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addWall}>
          加墙体
        </Button>
        <Upload onChange={addImage} fileList={[]} customRequest={() => {}}>
          <Button icon={<PlusOutlined />} type="primary" ghost>
            加图片
          </Button>
        </Upload>
        <Popconfirm
          title="清空全部"
          description="确认清空全部内容吗？此操作不可恢复。"
          placement="bottom"
          okText="确定"
          cancelText="取消"
          icon={<DeleteOutlined style={{ color: 'red' }} />}
          onConfirm={clearAll}
        >
          <Button icon={<DeleteOutlined />} type="primary" ghost danger>
            清空全部
          </Button>
        </Popconfirm>
      </Space>

      <div style={{ flex: 1, display: 'flex' }}>
        <div
          ref={innerElement}
          style={{
            flex: 1,
            border: '1px solid #cccccc',
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <canvas ref={canvasElement}></canvas>
        </div>

        <div
          style={{
            width: '20vw',
            padding: '12px 24px',
            marginLeft: 12,
            boxSizing: 'border-box',
            backgroundColor: '#eeeeee',
            borderRadius: 12,
          }}
        >
          {selectedObjects.length > 0 ? (
            <>
              <Typography.Title level={4} style={{ margin: 0 }}>
                操作
              </Typography.Title>
              <Divider />
              <Form
                form={settingForm}
                layout="vertical"
                onFinish={onChangeObjectProperties}
                initialValues={settingInitial}
              >
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
              <Button
                icon={<CopyOutlined />}
                type="primary"
                ghost
                block
                onClick={cloneObjects}
                style={{ margin: '12px 0' }}
              >
                克隆元素
              </Button>
              <Button icon={<DeleteOutlined />} danger block onClick={deleteObjects}>
                删除元素
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
