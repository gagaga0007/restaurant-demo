import { useEffect, useRef, useState } from 'react'
import { Button, Col, Dropdown, message, Popconfirm, Row, Space, Upload } from 'antd'
import { fabric } from 'fabric'
import {
  AppstoreAddOutlined,
  CloseCircleOutlined,
  ContainerOutlined,
  DeleteOutlined,
  DownOutlined,
  ImportOutlined,
  PictureOutlined,
  PlusOutlined,
  SaveOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { UploadChangeParam } from 'antd/lib/upload'
import { addCircle, addImage, addRect, addText, addTriangle, convertFileToBase64, getRandomId } from './core/util.ts'
import { ChairStatusEnum, CustomMenuEnum, TemplateEnum } from './core/interface.ts'
import {
  CHAIR_TYPE_VALUE,
  customMenu,
  defaultChairColor,
  defaultCircleOptions,
  defaultCircleWallColor,
  defaultCustomColor,
  defaultFillAlpha,
  defaultLineOptions,
  defaultLineWallColor,
  defaultRectOptions,
  defaultSemiCircleOptions,
  defaultTableColor,
  defaultTableTextOffset,
  defaultTextOptions,
  defaultTriangleOptions,
  ID_KEY,
  PARENT_ID_KEY,
  STATUS_KEY,
  STORAGE_BG_IMAGE_KEY,
  STORAGE_KEY,
  TABLE_TEXT_TYPE_VALUE,
  TABLE_TYPE_VALUE,
  templateMenu,
  TYPE_KEY,
} from './core/options.tsx'
import { EditForm } from './components/EditForm.tsx'

import './App.css'

function App() {
  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([])

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

  // 上传背景图触发
  const onBgImgFileChange = async (fileInfo?: UploadChangeParam) => {
    if (!fileInfo) {
      setBackgroundImage('')
    } else {
      const file = fileInfo.file.originFileObj
      // 转成 Base64
      const base64 = await convertFileToBase64(file as File)
      // 设置背景图
      setBgImg(base64)
    }
  }

  const addTable = (options: fabric.IRectOptions = {}, disableActiveOnCreate?: boolean) => {
    const { r, g, b } = defaultTableColor
    const primaryColor = `rgb(${r}, ${g}, ${b})`
    const fillColor = `rgba(${r}, ${g}, ${b}, ${defaultFillAlpha})`
    const id = getRandomId()
    // 添加桌子
    const rectOptions: fabric.IRectOptions = {
      ...defaultRectOptions,
      fill: fillColor,
      stroke: primaryColor,
      ...options,
      // 标识为桌子
      data: {
        [TYPE_KEY]: TABLE_TYPE_VALUE,
        [ID_KEY]: id,
      },
    }
    const rect = addRect(canvasObj.current, { options: rectOptions, disableActiveOnCreate: true })

    // 默认给一个文字的占位（用于显示桌位名）
    const textOptions: fabric.ITextOptions = {
      ...defaultTextOptions,
      left: rectOptions.left + defaultTableTextOffset,
      top: rectOptions.top,
      data: {
        [TYPE_KEY]: TABLE_TEXT_TYPE_VALUE,
        [PARENT_ID_KEY]: id,
      },
    }
    const text = addText(canvasObj.current, '', { options: textOptions, disableActiveOnCreate: true })
    text.set('top', text.top + rect.height / 2 - text.height / 2)
    // // 设置到最下层，防止覆盖 TODO: 设置颜色会被盖住
    // text.sendToBack()

    if (!disableActiveOnCreate) {
      // 选中新创建的项
      const activeObjects = new fabric.ActiveSelection([rect, text], { canvas: canvasObj.current })
      canvasObj.current.setActiveObject(activeObjects)
    }
    return [rect, text]
  }

  const addChair = (options: fabric.ICircleOptions = {}, disableActiveOnCreate?: boolean) => {
    const { r, g, b } = defaultChairColor
    const primaryColor = `rgb(${r}, ${g}, ${b})`
    const fillColor = `rgba(${r}, ${g}, ${b}, ${defaultFillAlpha})`
    const id = getRandomId()
    // 添加椅子
    const circleOptions = {
      ...defaultSemiCircleOptions,
      fill: fillColor,
      stroke: primaryColor,
      ...options,
      // 标识为椅子，给一个默认状态
      data: {
        [TYPE_KEY]: CHAIR_TYPE_VALUE,
        [STATUS_KEY]: ChairStatusEnum.DEFAULT,
        [ID_KEY]: id,
      },
    }
    const circle = addCircle(canvasObj.current, { options: circleOptions, disableActiveOnCreate: true })

    if (!disableActiveOnCreate) {
      // 选中新创建的项
      const activeObjects = new fabric.ActiveSelection([circle], { canvas: canvasObj.current })
      canvasObj.current.setActiveObject(activeObjects)
    }
    return [circle]
  }

  const addCircleWall = () => {
    const { r, g, b } = defaultCircleWallColor
    const primaryColor = `rgb(${r}, ${g}, ${b})`
    const options = { ...defaultCircleOptions, fill: primaryColor, stroke: primaryColor }
    addCircle(canvasObj.current, { options })
  }

  const addLineWall = () => {
    const { r, g, b } = defaultLineWallColor
    const primaryColor = `rgb(${r}, ${g}, ${b})`
    const options = { ...defaultLineOptions, fill: primaryColor, stroke: primaryColor }
    addRect(canvasObj.current, { options })
  }

  const addPicture = async (fileInfo?: UploadChangeParam) => {
    if (!fileInfo) return

    const file = fileInfo.file.originFileObj
    await addImage(canvasObj.current, file)
  }

  const addCustom = (key: string) => {
    const { r, g, b } = defaultCustomColor
    const primaryColor = `rgb(${r}, ${g}, ${b})`
    const defaultOptions = { stroke: primaryColor, left: 240 }

    switch (key) {
      case CustomMenuEnum.RECTANGLE:
        addRect(canvasObj.current, { options: { ...defaultRectOptions, ...defaultOptions } })
        break
      case CustomMenuEnum.CIRCLE:
        addCircle(canvasObj.current, { options: { ...defaultCircleOptions, ...defaultOptions } })
        break
      case CustomMenuEnum.TRIANGLE:
        addTriangle(canvasObj.current, { options: { ...defaultTriangleOptions, ...defaultOptions } })
        break
      default:
        break
    }
  }

  const addTemplate = (key: string) => {
    const newObjects: fabric.Object[] = []

    if (key === TemplateEnum.TWO) {
      // 双人桌
      const table = addTable({ left: 44, top: 155, width: 70, height: 70 }, true)
      const chair1 = addChair({ left: 60, top: 135 }, true)
      const chair2 = addChair({ left: 101, top: 247, angle: 180 }, true)
      newObjects.push(...table, ...chair1, ...chair2)
    } else if (key === TemplateEnum.FOUR) {
      // 四人桌
      const table = addTable({ left: 174, top: 155 }, true)
      const chair1 = addChair({ left: 186, top: 135 }, true)
      const chair2 = addChair({ left: 243, top: 135 }, true)
      const chair3 = addChair({ left: 229, top: 248, angle: 180 }, true)
      const chair4 = addChair({ left: 285, top: 248, angle: 180 }, true)
      newObjects.push(...table, ...chair1, ...chair2, ...chair3, ...chair4)
    } else if (key === TemplateEnum.SIX) {
      // 六人桌
      const table = addTable({ left: 362, top: 155, width: 180 }, true)
      const chair1 = addChair({ left: 374, top: 135 }, true)
      const chair2 = addChair({ left: 431, top: 135 }, true)
      const chair3 = addChair({ left: 488, top: 135 }, true)
      const chair4 = addChair({ left: 415, top: 248, angle: 180 }, true)
      const chair5 = addChair({ left: 472, top: 248, angle: 180 }, true)
      const chair6 = addChair({ left: 529, top: 248, angle: 180 }, true)
      newObjects.push(...table, ...chair1, ...chair2, ...chair3, ...chair4, ...chair5, ...chair6)
    }

    // 选中生成的图形
    canvasObj.current.discardActiveObject()
    const activeObjects = new fabric.ActiveSelection(newObjects, { canvas: canvasObj.current })
    canvasObj.current.setActiveObject(activeObjects)
  }

  const clearAll = () => {
    canvasObj.current!.clear()
    setBackgroundImage('')
    setSelectedObjects([])
  }

  const getActiveObjects = () => {
    const activeObjects = canvasObj.current.getActiveObjects()
    setSelectedObjects(activeObjects ?? [])
  }

  const onDeleteObjects = () => {
    // 清空选择框。多选时若删除元素，会在画布上留一个选择框
    canvasObj.current.discardActiveObject()
  }

  const onSaveData = async () => {
    try {
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
        message.warning('当前暂未添加内容，请在添加内容后再保存')
      } else {
        const json = JSON.stringify(objectsJson)
        localStorage.setItem(STORAGE_KEY, json)
        if (backgroundImage) {
          localStorage.setItem(STORAGE_BG_IMAGE_KEY, backgroundImage)
        }
        message.success('保存成功')
      }
    } catch (e) {
      if (e.message?.includes('Storage')) {
        message.error('背景图或数据中包含超出存储限制的图片，无法保存到浏览器缓存')
      } else {
        console.error(e)
      }
    }
  }

  const onImportData = async () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      const bgImage = localStorage.getItem(STORAGE_BG_IMAGE_KEY)
      if (!data && !bgImage) {
        message.warning('当前浏览器暂无可导入的数据')
      } else {
        if (data) {
          const objectsJson = JSON.parse(data)
          canvasObj.current.loadFromJSON(objectsJson, canvasObj.current.renderAll.bind(canvasObj.current))
        }
        if (bgImage) {
          setBgImg(bgImage)
        }
      }
    } catch (e) {
      message.error('导入时发生错误')
    }
  }

  const onDeleteData = async () => {
    const data = localStorage.getItem(STORAGE_KEY)
    const bgImage = localStorage.getItem(STORAGE_BG_IMAGE_KEY)
    if (!data && !bgImage) {
      message.warning('当前浏览器未保存数据，无需清除')
    } else {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(STORAGE_BG_IMAGE_KEY)
      message.success('清除成功')
    }
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

    // 初始化
    const fabricCanvas = new fabric.Canvas(canvasElement.current)

    // 监听选择元素 初始/更新/取消
    fabricCanvas.on('selection:created', getActiveObjects)
    fabricCanvas.on('selection:updated', getActiveObjects)
    fabricCanvas.on('selection:cleared', getActiveObjects)

    updateCanvasContext(fabricCanvas)

    return () => {
      updateCanvasContext(null)
      fabricCanvas.dispose()
      setSelectedObjects([])
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
        overflowY: 'scroll',
      }}
    >
      <Row>
        <Col flex="auto">
          <Space style={{ marginBottom: 12 }}>
            <Dropdown menu={{ items: templateMenu, onClick: (e) => addTemplate(e.key) }}>
              <Button icon={<ContainerOutlined />} type="primary" ghost>
                <Space>
                  模板
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Upload onChange={onBgImgFileChange} fileList={[]} customRequest={() => {}}>
              <Button icon={<PictureOutlined />} type="primary" ghost>
                背景
              </Button>
            </Upload>
            {!!backgroundImage && (
              <Button icon={<CloseCircleOutlined />} type="primary" ghost danger onClick={() => onBgImgFileChange()}>
                删除背景
              </Button>
            )}
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={addTable}>
              桌子
            </Button>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={addChair}>
              椅子
            </Button>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={addCircleWall}>
              柱子
            </Button>
            <Button icon={<PlusOutlined />} type="primary" ghost onClick={addLineWall}>
              墙体
            </Button>
            <Upload onChange={addPicture} fileList={[]} customRequest={() => {}}>
              <Button icon={<PlusOutlined />} type="primary" ghost>
                图片
              </Button>
            </Upload>
            <Dropdown menu={{ items: customMenu, onClick: (e) => addCustom(e.key) }}>
              <Button icon={<AppstoreAddOutlined />} type="primary" ghost>
                <Space>
                  图形
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Popconfirm
              title="清空全部"
              description="确认清空全部内容吗？此操作不可恢复。"
              placement="bottom"
              okText="确定"
              cancelText="取消"
              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
              onConfirm={clearAll}
            >
              <Button icon={<DeleteOutlined />} type="primary" ghost danger>
                清空
              </Button>
            </Popconfirm>
          </Space>
        </Col>
        <Col flex="none">
          <Space>
            <Button icon={<SaveOutlined />} type="primary" onClick={onSaveData}>
              保存
            </Button>
            <Popconfirm
              title="导入数据"
              description="导入数据会清空当前画布的全部内容，是否继续导入？"
              placement="bottomLeft"
              okText="确定"
              cancelText="取消"
              icon={<WarningOutlined style={{ color: '#ffaad14' }} />}
              onConfirm={onImportData}
            >
              <Button icon={<ImportOutlined />} type="primary" ghost>
                导入
              </Button>
            </Popconfirm>
            <Popconfirm
              title="清空浏览器保存的数据"
              description="确认清空浏览器保存的数据吗？此操作不可恢复。"
              placement="bottomLeft"
              okText="确定"
              cancelText="取消"
              icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
              onConfirm={onDeleteData}
            >
              <Button icon={<DeleteOutlined />} type="primary" ghost danger>
                清除缓存
              </Button>
            </Popconfirm>
          </Space>
        </Col>
      </Row>

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
            <EditForm
              selectedObjects={selectedObjects}
              setSelectedObjects={setSelectedObjects}
              onDeleteObjects={onDeleteObjects}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App
