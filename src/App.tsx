// import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { Button, Col, ColorPicker, Divider, Form, InputNumber, Row, Space, Typography, Upload } from "antd";
import { fabric } from "fabric";
import { CloseCircleOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import { Color } from "antd/lib/color-picker";

import './App.css';

interface CanvasPropertiesProps {
  width: number,
  height: number
}

interface ChangePropertiesProps {
  fillColor: Color
  strokeColor: Color
  strokeWidth: string | number
}

enum SelectedEnum {
  CREATE = 'create',
  UPDATE = 'update',
  CLEAR = 'clear',
}

const settingInitial: Partial<ChangePropertiesProps> = {
  strokeWidth: 2
}

// const controlIconSize = 16

const fillAlpha = 0.5
const defaultRectR = 30, defaultRectG = 144, defaultRectB = 255
const defaultCircle1R = 255, defaultCircle1G = 75, defaultCircle1B = 75
const defaultCircle2R = 222, defaultCircle2G = 184, defaultCircle2B = 135

function App() {
  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const canvasProperties = useRef<CanvasPropertiesProps>({ width: 0, height: 0 })

  const [backgroundImage, setBackgroundImage] = useState("")
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([])

  const [settingForm] = Form.useForm()

  const changeBgImg = (fileInfo?: UploadChangeParam<UploadFile>) => {
    if (!fileInfo) {
      setBackgroundImage("")
    } else {
      const file = fileInfo.file.originFileObj
      // 转成 Base64
      const reader = new FileReader()
      reader.readAsDataURL(file as Blob)
      reader.onload = () => {
        // 盒子宽度
        const innerWidth = innerElement.current!.getBoundingClientRect().width

        // 通过 Image 对象获取图片宽高，并设置 canvas 宽高
        const image = new Image()
        image.src = reader.result as string
        image.onload = () => {
          const height = image.height * innerWidth / image.width
          innerElement.current!.style.height = height + 'px'

          canvasObj.current!.setHeight(height)
          canvasElement.current!.height = height - 2
          canvasElement.current!.width = innerWidth - 2

          setBackgroundImage(reader.result as string)
        }
      }
    }
  }

  const addDesk = () => {
    const primaryColor = `rgb(${defaultRectR}, ${defaultRectG}, ${defaultRectB})`
    const fillColor = `rgba(${defaultRectR}, ${defaultRectG}, ${defaultRectB}, ${fillAlpha})`

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: fillColor,
      width: 120,
      height: 70,
      stroke: primaryColor,
      strokeWidth: 2,
    });

    canvasObj.current!.add(rect)
  }

  const addChair = () => {
    const primaryColor = `rgba(${defaultCircle1R}, ${defaultCircle1G}, ${defaultCircle1B})`
    const fillColor = `rgba(${defaultCircle1R}, ${defaultCircle1G}, ${defaultCircle1B}, ${fillAlpha})`

    const arc = new fabric.Circle({
      radius: 20,
      startAngle: -180,
      endAngle: 0,
      left: 100,
      top: 100,
      fill: fillColor,
      width: 40,
      height: 40,
      stroke: primaryColor,
      strokeWidth: 2,
    });

    canvasObj.current!.add(arc)
  }

  const addCircle = () => {
    const primaryColor = `rgba(${defaultCircle2R}, ${defaultCircle2G}, ${defaultCircle2B})`

    const circle = new fabric.Circle({
      radius: 20,
      left: 100,
      top: 100,
      fill: primaryColor,
      width: 40,
      height: 40,
      selectable: true,
      stroke: primaryColor,
      strokeWidth: 2,
    });

    canvasObj.current!.add(circle)
  }

  const onSelectedObjectChange = (objects: fabric.Object[], _isDeselected: boolean, selectType: SelectedEnum) => {
    if (objects.length === 0) return

    // 设置选择的元素
    switch (selectType) {
      case SelectedEnum.CREATE:
        setSelectedObjects([...objects])
        break;
      case SelectedEnum.UPDATE:
        setSelectedObjects([...objects])
        break;
      case SelectedEnum.CLEAR:
        setSelectedObjects([])
        break;
      default:
        break;
    }

    // if (isDeselected) {
    //   // TODO: 删除某个相同的元素
    //   // ...
    //   setSelectedObjects([])
    // } else {
    //   setSelectedObjects(list => [...list, ...objects])
    // }
  }

  const onChangeObjectProperties = (data: ChangePropertiesProps) => {
    selectedObjects.forEach(v => {
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

  const deleteObjects = () => {
    selectedObjects.forEach(v => {
      const canvas = v.canvas
      canvas!.remove(v)
      canvas!.requestRenderAll()
    })
    setSelectedObjects([])
  }

  const updateCanvasContext = (canvas: fabric.Canvas | null) => {
    canvasObj.current = canvas
  }

  useEffect(() => {
    if (selectedObjects.length === 0) {
      settingForm.resetFields()
    }
  }, [selectedObjects, settingForm]);

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
    const fabricCanvas = new fabric.Canvas(canvasElement.current);

    // 监听选择元素 初始/更新/取消
    fabricCanvas.on('selection:created', (e) => {
      onSelectedObjectChange(e.selected ?? [], false, SelectedEnum.CREATE)
    })

    fabricCanvas.on('selection:updated', (e) => {
      onSelectedObjectChange(e.selected ?? [], false, SelectedEnum.UPDATE)
      //   // 先删再加
      //   onSelectedObjectChange(e.deselected ?? [], true)
      //   onSelectedObjectChange(e.selected ?? [], false)
    })

    fabricCanvas.on('selection:cleared', (e) => {
      onSelectedObjectChange(e.deselected ?? [], true, SelectedEnum.CLEAR)
    })

    updateCanvasContext(fabricCanvas);

    return () => {
      updateCanvasContext(null);
      fabricCanvas.dispose();
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', padding: '12px 24px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <Space style={{ marginBottom: 12 }}>
        <Upload onChange={changeBgImg} fileList={[]} customRequest={() => {}}>
          <Button icon={<UploadOutlined />} type="primary" ghost>背景图</Button>
        </Upload>
        <Button icon={<CloseCircleOutlined />} type="primary" ghost onClick={() => changeBgImg()}>取消背景</Button>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addDesk}>加桌子</Button>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addChair}>加椅子</Button>
        <Button icon={<PlusOutlined />} type="primary" ghost onClick={addCircle}>加柱子</Button>
      </Space>

      <div style={{ flex: 1, display: 'flex' }}>
        <div ref={innerElement} style={{ flex: 1, border: '1px solid #cccccc', backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}>
          <canvas ref={canvasElement}></canvas>
        </div>

        <div style={{ width: '20vw', padding: '0 24px 12px', boxSizing: 'border-box' }}>
          {selectedObjects.length > 0 ?
            <>
              <Typography.Title level={3} style={{ margin: 0 }}>操作</Typography.Title>
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
                  <InputNumber min={0} max={10} step={1} formatter={(value) => Math.floor(value ?? 0) + ''} style={{ width: '100%' }} />
                </Form.Item>
                <Button type="primary" block htmlType="submit">确认</Button>
              </Form>
              <Button icon={<DeleteOutlined />} danger block onClick={deleteObjects} style={{ marginTop: 12 }}>删除元素</Button>
            </>
          : null}
        </div>
      </div>
    </div>
  )
}

export default App
