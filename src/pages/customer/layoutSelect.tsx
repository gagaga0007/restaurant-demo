/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { BasePage } from '@/components/base/basePage.tsx'
import { useCallback, useMemo, useRef, useState } from 'react'
import { fabric } from 'fabric'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CHAIR_TYPE_VALUE,
  chairStatusOptions,
  defaultFillAlpha,
  STATUS_KEY,
  TABLE_TYPE_VALUE,
} from '@/model/options/editor.tsx'
import { App, Button, Col, Row, Tag, Typography } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { useMount, useUnmount } from 'ahooks'
import { editLayout, getLayout } from '@/model/api/layout.ts'
import { Config } from '@/core/config.ts'
import { useLocation } from 'react-router-dom'
import { ChairStatusEnum } from '@/model/interface/editor.ts'

interface SelectProps {
  id: string
  name?: string
}

const LayoutSelectPage = () => {
  const location = useLocation()
  const { message } = App.useApp()

  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const [selectedObjects, setSelectedObjects] = useState<SelectProps[]>([])
  const selectIds = useRef<string[]>([])

  const [backgroundImage, setBackgroundImage] = useState('')
  const [numberOfDiners, setNumberOfDiners] = useState(0)
  const [loading, setLoading] = useState(false)

  const isMouseDownRef = useRef(false) // 鼠标是否按下
  const isMouseMoveRef = useRef(false) // 鼠标是否移动
  const touchPageXRef = useRef(0) // 移动端鼠标移动的 X 坐标
  const touchPageYRef = useRef(0) // 移动端鼠标移动的 Y 坐标

  // 改变背景图
  // const setBgImg = (base64: string) => {
  //   // 盒子宽度
  //   const innerWidth = innerElement.current!.getBoundingClientRect().width
  //   // 通过 Image 对象获取图片宽高，并设置 canvas 宽高
  //   const image = new Image()
  //   image.src = base64
  //   image.onload = () => {
  //     const height = (image.height * innerWidth) / image.width
  //     innerElement.current!.style.height = height + 'px'
  //     canvasObj.current!.setHeight(height)
  //
  //     const borderWidth = 2
  //     canvasElement.current!.height = height - borderWidth
  //     canvasElement.current!.width = innerWidth - borderWidth
  //
  //     setBackgroundImage(base64)
  //   }
  // }

  // 修改椅子状态
  const changeChairStatus = useCallback((status: ChairStatusEnum, target: fabric.Object) => {
    const data = target.data

    const color = chairStatusOptions.find((v) => v.value === status)?.color
    let rgbList: RegExpMatchArray
    if (color) {
      rgbList = color.match(/\d+/g)
    }

    // 设置自定义 data 中的值
    target.set('data', { ...data, [STATUS_KEY]: status })
    // 设置画布上椅子的样式（颜色）
    if (rgbList.length > 1) {
      target.set('stroke', `rgb(${rgbList[0]}, ${rgbList[1]}, ${rgbList[2]})`)
      target.set('fill', `rgba(${rgbList[0]}, ${rgbList[1]}, ${rgbList[2]}, ${defaultFillAlpha})`)
    }
    target.canvas?.renderAll()
  }, [])

  // 取消选择
  const onRemoveSelect = useCallback(
    (id: string) => {
      const objects = canvasObj.current?.getObjects()
      const target = objects.find((v) => v.data?.id === id)

      const data = target.data
      if (!data) return

      // 移除选择
      setSelectedObjects((list) => list.filter((v) => v.id !== data.id))
      selectIds.current = selectIds.current.filter((v) => v !== data.id)
      // 修改状态
      changeChairStatus(ChairStatusEnum.DEFAULT, target)
    },
    [changeChairStatus],
  )

  const onAddSelect = useCallback(
    (target: fabric.Object) => {
      const data = target.data
      if (!data || data[STATUS_KEY] === ChairStatusEnum.HAS_ORDER) return

      // 添加到已选择
      setSelectedObjects((list) => [...list, { id: data.id, name: data.name }])
      selectIds.current.push(data.id)
      // 修改状态
      changeChairStatus(ChairStatusEnum.HAS_ORDER, target)
    },
    [changeChairStatus],
  )

  // 点击触发
  const onClickTarget = useCallback(
    (event: fabric.IEvent<MouseEvent>) => {
      if (!event.target) return
      const data = event.target.data
      // 只能选择椅子
      if (data?.type !== CHAIR_TYPE_VALUE) return

      if (selectIds.current.includes(data.id)) {
        // 移除
        onRemoveSelect(data.id)
      } else {
        // 添加
        onAddSelect(event.target)
      }
    },
    [onAddSelect, onRemoveSelect],
  )

  const onSaveData = async () => {
    if (selectedObjects.length !== numberOfDiners) {
      message.error(
        `予約人数は ${numberOfDiners} 人，現在選択の人は ${selectedObjects.length} 人です，もう一度選択ください。`,
      )
      return
    }

    console.log(selectedObjects)

    // TODO: 目前是将当前的画布当做编辑保存
    try {
      setLoading(true)

      // 默认只包含必要的字段。接受一个参数，包含输出中额外包括的属性名。此处将 data 存入
      const objectsJson = canvasObj.current.toJSON(['data'])
      objectsJson.objects.forEach((e) => {
        // 将其中 type 为 click 的元素处理成正确的元素 TODO: 暂时不知触发条件，偶尔触发
        if (e.type === 'click') {
          if (e.data?.type === CHAIR_TYPE_VALUE) {
            e.type = 'circle'
          } else if (e.data?.type === TABLE_TYPE_VALUE) {
            e.type = 'rect'
          }
        }
      })
      if (objectsJson.objects.length === 0 && !backgroundImage) {
        message.warning('まだ何も追加されていません。何かを追加した後で保存してください')
      } else {
        const json = JSON.stringify(objectsJson)
        const formData = { jsonData: json, imageData: backgroundImage, id: Config.LAYOUT_ID }
        const res = await editLayout(formData)
        if (res.code === 200) {
          message.success('保存しました')
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const onImportData = useCallback(async () => {
    try {
      setLoading(true)

      const res = await getLayout(Config.LAYOUT_ID)
      if (!res.data) {
        message.warning('現在ブラウザにはインポートできるデータがありません')
        return
      }

      const data = res.data.jsonData
      const bgImage = res.data.imageData
      if (data) {
        const objectsJson = JSON.parse(data)
        // 使每个元素都不可选择（只读状态）
        objectsJson.objects.forEach((v: fabric.Object) => {
          v.selectable = false
        })
        // 渲染到画布
        canvasObj.current?.loadFromJSON(objectsJson, canvasObj.current.renderAll.bind(canvasObj.current))
      }
      if (bgImage) {
        // setBgImg(bgImage)
        setBackgroundImage(bgImage)
      }
    } catch (e) {
      console.error(e)
      message.error('インポート時エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  // 选择座位数与预定座位数是否相符
  const isSelectWarning = useMemo(() => {
    return selectedObjects.length !== numberOfDiners
  }, [numberOfDiners, selectedObjects.length])

  // 鼠标按下事件
  const onMouseDown = (event: fabric.IEvent<MouseEvent>) => {
    // 设置鼠标已按下
    isMouseDownRef.current = true

    // 移动端专用，用于判断坐标从而计算移动的距离
    const { e } = event
    if (e.type === 'touchstart') {
      if ((e as unknown as TouchEvent).targetTouches?.length > 1) return
      const touch = (e as unknown as TouchEvent).targetTouches[0]

      touchPageXRef.current = touch.pageX
      touchPageYRef.current = touch.pageY
    }
  }

  // 鼠标移动事件
  const onMouseMove = (event: fabric.IEvent<MouseEvent>) => {
    if (isMouseDownRef.current) {
      // 如果鼠标已按下，设置鼠标正在移动
      isMouseMoveRef.current = true

      const { e } = event
      let x, y
      if (e.type === 'mousemove') {
        // PC 端
        x = e.movementX
        y = e.movementY
      } else if (e.type === 'touchmove') {
        // 移动端
        if ((e as unknown as TouchEvent).targetTouches?.length > 1) return
        const touch = (e as unknown as TouchEvent).targetTouches[0]

        x = touch.pageX - touchPageXRef.current
        touchPageXRef.current = touch.pageX
        y = touch.pageY - touchPageYRef.current
        touchPageYRef.current = touch.pageY
      }

      // 根据 x, y 移动画布
      if (x && y) {
        const point = new fabric.Point(x, y)
        canvasObj.current.relativePan(point)
      }
    }
  }

  // 鼠标抬起事件
  const onMouseUp = (event: fabric.IEvent<MouseEvent>) => {
    // 如果不是移动画布，再判断点击操作（选择座位）
    if (!(isMouseDownRef.current && isMouseMoveRef.current)) {
      onClickTarget(event)
    }
    // 初始化鼠标事件（和触摸）
    isMouseDownRef.current = false
    isMouseMoveRef.current = false
    // touchPageXRef.current = 0
    // touchPageYRef.current = 0
  }

  useMount(() => {
    // 设置宽高
    // const { width, height } = innerElement.current!.getBoundingClientRect()
    // const canvasWidth = width - 2
    // const canvasHeight = height - 2
    // canvasElement.current!.width = canvasWidth
    // canvasElement.current!.height = canvasHeight
    // canvasElement.current!.style.width = canvasWidth + 'px'
    // canvasElement.current!.style.height = canvasHeight + 'px'

    // 初始化，使画布不可选择，且鼠标指针改为 pointer
    const fabricCanvas = new fabric.Canvas(canvasElement.current, { selection: false, hoverCursor: 'pointer' })
    // 监听鼠标事件（移动端触摸同样触发）
    fabricCanvas.on('mouse:down', onMouseDown)
    fabricCanvas.on('mouse:move', onMouseMove)
    fabricCanvas.on('mouse:up', onMouseUp)

    canvasObj.current = fabricCanvas

    // 导入数据
    onImportData()
    // 人数
    setNumberOfDiners(location?.state?.numberOfDiners)
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
          <Col
            span={24}
            lg={{ flex: 'auto' }}
            css={css`
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              row-gap: 4px;

              @media screen and (max-width: ${Config.MOBILE_WIDTH}px) {
                margin-bottom: 8px;
              }
            `}
          >
            <Typography.Text>
              既に選
              <Typography.Text style={{ color: isSelectWarning ? '#f5222d' : '' }}>
                （{selectedObjects.length} / {numberOfDiners}）
              </Typography.Text>
              ：
            </Typography.Text>
            {selectedObjects.map((v) => (
              <Tag key={v.id} closable onClose={() => onRemoveSelect(v.id)}>
                {v.name || v.id}
              </Tag>
            ))}
          </Col>
          <Col span={24} lg={{ flex: 'none' }}>
            <Button
              icon={<SaveOutlined />}
              type="primary"
              onClick={onSaveData}
              loading={loading}
              css={css`
                @media screen and (max-width: ${Config.MOBILE_WIDTH}px) {
                  width: 100%;
                }
              `}
            >
              保存
            </Button>
          </Col>
        </Row>
        <div
          style={{
            flex: 1,
            boxSizing: 'border-box',
            border: '1px solid #cccccc',
            overflow: 'auto',
          }}
        >
          <div
            ref={innerElement}
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              backgroundImage: `url(${backgroundImage})`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <canvas
              ref={canvasElement}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            ></canvas>
          </div>
        </div>
      </div>
    </BasePage>
  )
}

export default LayoutSelectPage
