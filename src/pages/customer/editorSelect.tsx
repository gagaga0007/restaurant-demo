import { BasePage } from '@/components/base/basePage.tsx'
import { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import {
  CHAIR_TYPE_VALUE,
  defaultChairColor,
  defaultFillAlpha,
  STORAGE_BG_IMAGE_KEY,
  STORAGE_KEY,
} from '@/model/options/editor.tsx'
import { Button, Col, message, Row, Tag } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useMount, useUnmount } from 'ahooks'

interface SelectProps {
  id: string
  name?: string
}

const EditorSelectPage = () => {
  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const [selectedObjects, setSelectedObjects] = useState<SelectProps[]>([])
  const selectIds = useRef<string[]>([])

  const [backgroundImage, setBackgroundImage] = useState('')

  // 改变背景图
  const setBgImg = (base64: string) => {
    // 盒子宽度
    const innerWidth = innerElement.current!.getBoundingClientRect().width
    // 通过 Image 对象获取图片宽高，并设置 canvas 宽高
    const image = new Image()
    image.src = base64
    image.onload = () => {
      const height = (image.height * innerWidth) / image.width
      innerElement.current!.style.height = height + 'px'
      canvasObj.current!.setHeight(height)

      const borderWidth = 2
      canvasElement.current!.height = height - borderWidth
      canvasElement.current!.width = innerWidth - borderWidth

      setBackgroundImage(base64)
    }
  }

  // 点击触发
  const onClickTarget = useCallback((e: fabric.IEvent<MouseEvent>) => {
    if (!e.target) return
    const data = e.target.data
    // 只能选择椅子
    if (data?.type !== CHAIR_TYPE_VALUE) return

    if (selectIds.current.includes(data.id)) {
      // 点击的是已选择的椅子，移除
      onRemoveSelect(data.id)
    } else {
      // 添加
      // 设置为红色
      e.target.set('fill', 'rgba(255, 77, 79, 0.8)')
      // 添加到已选择
      setSelectedObjects((list) => [...list, { id: data.id, name: data.name }])
      selectIds.current.push(data.id)
    }
  }, [])

  // 取消选择
  const onRemoveSelect = (id: string) => {
    // 画布中的椅子样式
    const objects = canvasObj.current.getObjects()
    const removeItem = objects.find((v) => v.data?.type === CHAIR_TYPE_VALUE && v.data?.id === id)
    removeItem.set(
      'fill',
      `rgba(${defaultChairColor.r}, ${defaultChairColor.g}, ${defaultChairColor.b}, ${defaultFillAlpha})`,
    )
    canvasObj.current.renderAll()
    // 移除选择
    setSelectedObjects((list) => list.filter((v) => v.id !== id))
    selectIds.current = selectIds.current.filter((v) => v !== id)
  }

  const onSaveData = async () => {
    console.log(selectedObjects)
  }

  const onImportData = useCallback(async () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      const bgImage = localStorage.getItem(STORAGE_BG_IMAGE_KEY)
      if (!data && !bgImage) {
        message.warning('現在ブラウザにはインポートできるデータがありません')
      } else {
        if (data) {
          const objectsJson = JSON.parse(data)
          // 使每个元素都不可选择（只读状态）
          objectsJson.objects.forEach((v: fabric.Object) => {
            v.selectable = false
          })
          // 渲染到画布
          canvasObj.current.loadFromJSON(objectsJson, canvasObj.current.renderAll.bind(canvasObj.current))
        }
        if (bgImage) {
          setBgImg(bgImage)
        }
      }
    } catch (e) {
      console.error(e)
      message.error('インポート時エラーが発生しました')
    }
  }, [])

  useMount(() => {
    // 设置宽高
    const { width, height } = innerElement.current!.getBoundingClientRect()
    const canvasWidth = width - 2
    const canvasHeight = height - 2
    canvasElement.current!.width = canvasWidth
    canvasElement.current!.height = canvasHeight
    canvasElement.current!.style.width = canvasWidth + 'px'
    canvasElement.current!.style.height = canvasHeight + 'px'

    // 初始化，使画布不可选择，且鼠标指针改为 pointer
    const fabricCanvas = new fabric.Canvas(canvasElement.current, { selection: false, hoverCursor: 'pointer' })
    // 监听点击事件
    fabricCanvas.on('mouse:down', onClickTarget)

    canvasObj.current = fabricCanvas

    // 导入数据
    onImportData()
  })

  useUnmount(() => {
    canvasObj.current?.dispose()
    canvasObj.current = null
    setSelectedObjects([])
    selectIds.current = []
  })

  return (
    <BasePage>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Row style={{ marginBottom: 16 }}>
          <Col flex="auto" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            当前已选：
            {selectedObjects.map((v) => (
              <Tag key={v.id} closable onClose={() => onRemoveSelect(v.id)}>
                {v.name || v.id}
              </Tag>
            ))}
          </Col>
          <Col flex="none">
            <Button icon={<SaveOutlined />} type="primary" onClick={onSaveData}>
              保存
            </Button>
          </Col>
        </Row>
        <div
          ref={innerElement}
          style={{
            flex: 1,
            boxSizing: 'border-box',
            border: '1px solid #cccccc',
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <canvas ref={canvasElement}></canvas>
        </div>
      </div>
    </BasePage>
  )
}

export default EditorSelectPage
