import { BasePage } from '@/components/base/basePage.tsx'
import { useCallback, useMemo, useRef, useState } from 'react'
import { fabric } from 'fabric'
import {
  CHAIR_TYPE_VALUE,
  chairStatusOptions,
  defaultFillAlpha,
  STATUS_KEY,
  TABLE_TYPE_VALUE,
} from '@/model/options/editor.tsx'
import { Button, Col, message, Row, Tag, Typography } from 'antd'
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
  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const [selectedObjects, setSelectedObjects] = useState<SelectProps[]>([])
  const selectIds = useRef<string[]>([])

  const [backgroundImage, setBackgroundImage] = useState('')
  const [numberOfDiners, setNumberOfDiners] = useState(0)
  const [loading, setLoading] = useState(false)

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
    (e: fabric.IEvent<MouseEvent>) => {
      if (!e.target) return
      const data = e.target.data
      // 只能选择椅子
      if (data?.type !== CHAIR_TYPE_VALUE) return

      if (selectIds.current.includes(data.id)) {
        // 移除
        onRemoveSelect(data.id)
      } else {
        // 添加
        onAddSelect(e.target)
      }
    },
    [onAddSelect, onRemoveSelect],
  )

  const onSaveData = async () => {
    if (selectedObjects.length !== numberOfDiners) {
      message.error(`您预约的人数为 ${numberOfDiners} 人，当前选择 ${selectedObjects.length} 人，请重新选择`)
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

      // const data = localStorage.getItem(STORAGE_KEY)
      // const bgImage = localStorage.getItem(STORAGE_BG_IMAGE_KEY)
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
        setBgImg(bgImage)
      }
    } catch (e) {
      console.error(e)
      message.error('インポート時エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  const isSelectWarning = useMemo(() => {
    return selectedObjects.length !== numberOfDiners
  }, [numberOfDiners, selectedObjects.length])

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
          <Col flex="auto" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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
          <Col flex="none">
            <Button icon={<SaveOutlined />} type="primary" onClick={onSaveData} loading={loading}>
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

export default LayoutSelectPage
