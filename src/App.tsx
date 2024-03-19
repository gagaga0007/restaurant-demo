import './App.css'
import { useEffect, useRef } from "react";
import { Button, Space } from "antd";
import { fabric } from "fabric";
import { PlusOutlined } from "@ant-design/icons";
import { Transform } from "fabric/fabric-impl";

interface CanvasPropertiesProps {
  width: number,
  height: number
}

const deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E"
const deleteIconSize = 20

function App() {
  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)
  const deleteImageElement = useRef<HTMLImageElement>()

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const canvasProperties = useRef<CanvasPropertiesProps>({ width: 0, height: 0 })

  const addBgImg = () => {
    // const image = new fabric.Image({
    //
    // })
  }

  const addDesk = () => {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'rgba(0, 0, 255, 0.05)',
      width: 120,
      height: 70,
      stroke: 'rgba(0, 0, 255, 0.7)',
      strokeWidth: 2,
    });

    // rect.fill = 'rgb(0, 0, 255)'

    rect.onSelect = () => {
      rect.fill = 'rgb(0, 0, 255)'
      rect.stroke = undefined
      rect.strokeWidth = 0
      return false
    }

    canvasObj.current!.add(rect);
  }

  const addChair = () => {
    const arc = new fabric.Circle({
      radius: 20,
      startAngle: -180,
      endAngle: 0,
      left: 100,
      top: 100,
      fill: 'rgba(255, 0, 0, 0.05)',
      width: 40,
      height: 40,
      stroke: 'rgba(255, 0, 0, 0.7)',
      strokeWidth: 2,
    });

    canvasObj.current!.add(arc);
  }

  const addCircle = () => {
    const circle = new fabric.Circle({
      radius: 20,
      left: 100,
      top: 100,
      fill: 'rgb(222, 184, 135)',
      width: 40,
      height: 40,
    });

    canvasObj.current!.add(circle);
  }

  const deleteObject = (_eventData: MouseEvent, transform: Transform) => {
    const target = transform.target;
    const canvas = target.canvas;
    canvas!.remove(target);
    canvas!.requestRenderAll();
  }

  const renderDeleteIcon = (ctx: CanvasRenderingContext2D, left: number, top: number, _styleOverride: never, fabricObject: fabric.Object) => {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
    ctx.drawImage(deleteImageElement.current!, -deleteIconSize / 2, -deleteIconSize / 2, deleteIconSize, deleteIconSize);
    ctx.restore();
  }

  const updateCanvasContext = (canvas: fabric.Canvas | null) => {
    canvasObj.current = canvas
  }

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
    updateCanvasContext(fabricCanvas);

    // 增加控制栏
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 0,
      offsetY: 0,
      cursorStyle: 'pointer',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mouseUpHandler: deleteObject,
      render: renderDeleteIcon,
      cornerSize: 24
    });

    // 删除图标
    const deleteIconImg = new Image()
    deleteIconImg.src = deleteIcon
    deleteImageElement.current = deleteIconImg

    return () => {
      updateCanvasContext(null);
      fabricCanvas.dispose();
    }
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', padding: '12px 24px', boxSizing: 'border-box' }}>
      <Space style={{ marginBottom: 12 }}>
        <Button icon={<PlusOutlined />} onClick={addBgImg}>背景图</Button>
        <Button icon={<PlusOutlined />} onClick={addDesk}>加桌子</Button>
        <Button icon={<PlusOutlined />} onClick={addChair}>加椅子</Button>
        <Button icon={<PlusOutlined />} onClick={addCircle}>加柱子</Button>
      </Space>
      <div ref={innerElement} style={{ flex: 1, border: '1px solid #cccccc' }}>
        <canvas ref={canvasElement}></canvas>
      </div>
    </div>
  )
}

export default App
