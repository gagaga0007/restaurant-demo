import { css } from '@emotion/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { UploadChangeParam } from 'antd/lib/upload'
import { addCircle, addImage, addRect, addText, addTriangle, convertFileToBase64, getRandomId } from '@/core/util.ts'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
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
  TABLE_TEXT_TYPE_VALUE,
  TABLE_TYPE_VALUE,
  templateMenu,
  TYPE_KEY,
} from '@/model/options/editor.tsx'
import { ChairStatusEnum, CustomMenuEnum, TemplateEnum } from '@/model/interface/editor.ts'
import { App, Button, Col, Dropdown, Popconfirm, Row, Space, theme, Upload } from 'antd'
import {
  AppstoreAddOutlined,
  CloseCircleOutlined,
  ContainerOutlined,
  DeleteOutlined,
  DownOutlined,
  ImportOutlined,
  PlusOutlined,
  SaveOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { EditForm } from '@/components/editor/EditForm.tsx'
import { BasePage } from '@/components/base/basePage.tsx'
import { createLayout, editLayout, getLayout } from '@/model/api/layout.ts'
import { Config } from '@/core/config.ts'

const { useToken } = theme

const LayoutEditPage = () => {
  const { token } = useToken()
  const { message } = App.useApp()

  const innerElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)

  const canvasObj = useRef<fabric.Canvas | null>(null)
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([])
  const [backgroundImage, setBackgroundImage] = useState('')

  const [loading, setLoading] = useState(false)

  // 上传背景图触发
  const onBgImgFileChange = async (fileInfo?: UploadChangeParam) => {
    if (!fileInfo) {
      setBackgroundImage('')
    } else {
      const file = fileInfo.file.originFileObj
      // 转成 Base64
      const base64 = await convertFileToBase64(file as File)
      // 设置背景图
      // setBgImg(base64)
      setBackgroundImage(base64)
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
        // TODO: 临时写法，先查有没有 id 为 1 的数据，有则修改，没有则添加
        const defaultLayout = await getLayout(Config.LAYOUT_ID)
        const formData = { jsonData: json, imageData: backgroundImage }
        let res
        if (defaultLayout.data) {
          res = await editLayout({ ...formData, id: Config.LAYOUT_ID })
        } else {
          res = await createLayout(formData)
        }
        if (res.code === 200) {
          message.success('保存しました')
        }
      }
    } catch (e) {
      message.error(e.msg ?? e.message)
    } finally {
      setLoading(false)
    }
  }

  const onImportData = async () => {
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
        canvasObj.current.loadFromJSON(objectsJson, canvasObj.current.renderAll.bind(canvasObj.current))
      }
      if (bgImage) {
        // setBgImg(bgImage)
        setBackgroundImage(bgImage)
      }
    } catch (e) {
      message.error('インポート時エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const renderDropdown = useCallback(
    (menu: React.ReactNode) => {
      const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
      }

      const buttonStyle: React.CSSProperties = {
        padding: '5px 12px',
        margin: '-4px 4px 4px',
        width: 96,
        textAlign: 'left',
      }

      return (
        <div style={contentStyle}>
          {React.cloneElement(menu as React.ReactElement, { style: { boxShadow: 'none' } })}
          <Upload
            accept="image/*"
            onChange={onBgImgFileChange}
            fileList={[]}
            customRequest={() => {}}
            disabled={loading}
          >
            <Button type="text" disabled={loading} style={buttonStyle}>
              背景
            </Button>
          </Upload>
          <Upload accept="image/*" onChange={addPicture} fileList={[]} customRequest={() => {}} disabled={loading}>
            <Button type="text" disabled={loading} style={buttonStyle}>
              画像
            </Button>
          </Upload>
        </div>
      )
    },
    [loading, token.borderRadiusLG, token.boxShadowSecondary, token.colorBgElevated],
  )

  const updateCanvasContext = (canvas: fabric.Canvas | null) => {
    canvasObj.current = canvas
  }

  useEffect(() => {
    setTimeout(() => {
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
    }, 100)
  }, [])

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
        <Row>
          <Col flex="auto" style={{ overflowX: 'auto' }}>
            <Space style={{ marginBottom: 12 }}>
              <Dropdown menu={{ items: templateMenu, onClick: (e) => addTemplate(e.key) }} disabled={loading}>
                <Button icon={<ContainerOutlined />} type="primary" ghost disabled={loading}>
                  <Space>
                    テンプレート
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <Button icon={<PlusOutlined />} type="primary" ghost onClick={addTable} disabled={loading}>
                テーブル
              </Button>
              <Button icon={<PlusOutlined />} type="primary" ghost onClick={addChair} disabled={loading}>
                椅子
              </Button>
              <Button icon={<PlusOutlined />} type="primary" ghost onClick={addCircleWall} disabled={loading}>
                柱
              </Button>
              <Button icon={<PlusOutlined />} type="primary" ghost onClick={addLineWall} disabled={loading}>
                ライン
              </Button>
              <Dropdown
                menu={{ items: customMenu, onClick: (e) => addCustom(e.key) }}
                disabled={loading}
                dropdownRender={renderDropdown}
              >
                <Button icon={<AppstoreAddOutlined />} type="primary" ghost disabled={loading}>
                  <Space>
                    その他
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              {!!backgroundImage && (
                <Button
                  icon={<CloseCircleOutlined />}
                  type="primary"
                  ghost
                  danger
                  onClick={() => onBgImgFileChange()}
                  disabled={loading}
                >
                  背景を削除
                </Button>
              )}
              <Popconfirm
                title="すべてクリア"
                description="すべての内容をクリアしてもよろしいですか？この操作を実行すると元に戻せなくなります。"
                placement="bottom"
                okText="確定"
                cancelText="キャンセル"
                icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                onConfirm={clearAll}
                disabled={loading}
              >
                <Button icon={<DeleteOutlined />} type="primary" ghost danger disabled={loading}>
                  クリア
                </Button>
              </Popconfirm>
            </Space>
          </Col>
          <Col flex="none">
            <Space>
              <Popconfirm
                title="保存"
                description="保存は現在のデータを上書きする。インポートを続けますか？"
                placement="bottomLeft"
                okText="確定"
                cancelText="キャンセル"
                icon={<WarningOutlined style={{ color: '#ffaad14' }} />}
                onConfirm={onSaveData}
                disabled={loading}
              >
                <Button icon={<SaveOutlined />} type="primary" loading={loading}>
                  保存
                </Button>
              </Popconfirm>
              <Popconfirm
                title="データインポート"
                description="データをインポートすると既存データは上書きされます。インポートを続けますか？"
                placement="bottomLeft"
                okText="確定"
                cancelText="キャンセル"
                icon={<WarningOutlined style={{ color: '#ffaad14' }} />}
                onConfirm={onImportData}
                disabled={loading}
              >
                <Button icon={<ImportOutlined />} type="primary" ghost loading={loading}>
                  インポート
                </Button>
              </Popconfirm>
            </Space>
          </Col>
        </Row>

        <Row style={{ flex: 1, height: 0 }}>
          <Col
            lg={19}
            span={24}
            style={{
              height: '100%',
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
          </Col>

          <Col
            css={css`
              height: 100%;
              padding: 12px 24px;
              box-sizing: border-box;
              background-color: #eeeeee;

              @media screen and (max-width: ${Config.MOBILE_WIDTH}px) {
                height: auto;
                margin-top: 24px;
              }
            `}
            lg={5}
            span={24}
          >
            {selectedObjects.length > 0 ? (
              <EditForm
                selectedObjects={selectedObjects}
                setSelectedObjects={setSelectedObjects}
                onDeleteObjects={onDeleteObjects}
              />
            ) : null}
          </Col>
        </Row>
      </div>
    </BasePage>
  )
}

export default LayoutEditPage
