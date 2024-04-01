import { ICircleOptions, IRectOptions, ITriangleOptions } from 'fabric/fabric-impl'
import {
  defaultImageOptions,
  defaultRectOptions,
  defaultSemiCircleOptions,
  defaultTriangleOptions,
} from '../model/options/editor.tsx'
import { fabric } from 'fabric'

/**
 * 将文件转为 Base64
 * @param file 文件对象
 */
export const convertFileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (!file) return resolve('')

    const reader = new FileReader()
    reader.readAsDataURL(file as Blob)
    reader.onload = () => {
      return resolve(reader.result as string)
    }
  })
}

/**
 * 生成随机字符串
 * @param length
 */
export const getRandomId = (length = 12) => {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let code = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    code += charset.charAt(randomIndex)
  }
  return code
}

/**
 * 添加矩形
 * @param ctx canvas 对象
 * @param options 配置
 * @param disableActiveOnCreate 禁用在创建后自动选择该元素
 */
export const addRect = (
  ctx: fabric.Canvas,
  {
    options = defaultRectOptions,
    disableActiveOnCreate,
  }: { options?: IRectOptions; disableActiveOnCreate?: boolean } = {},
) => {
  const rect = new fabric.Rect({ ...options })
  ctx.add(rect)
  if (!disableActiveOnCreate) {
    ctx.discardActiveObject()
    ctx.setActiveObject(rect)
  }

  return rect
}

/**
 * 添加圆形
 * @param ctx canvas 对象
 * @param options 配置
 * @param disableActiveOnCreate 禁用在创建后自动选择该元素
 */
export const addCircle = (
  ctx: fabric.Canvas,
  {
    options = defaultSemiCircleOptions,
    disableActiveOnCreate,
  }: { options?: ICircleOptions; disableActiveOnCreate?: boolean } = {},
) => {
  const circle = new fabric.Circle({ ...options })
  ctx.add(circle)
  if (!disableActiveOnCreate) {
    ctx.discardActiveObject()
    ctx.setActiveObject(circle)
  }

  return circle
}

/**
 * 添加三角形
 * @param ctx canvas 对象
 * @param options 配置
 * @param disableActiveOnCreate 禁用在创建后自动选择该元素
 */
export const addTriangle = (
  ctx: fabric.Canvas,
  {
    options = defaultTriangleOptions,
    disableActiveOnCreate,
  }: { options?: ITriangleOptions; disableActiveOnCreate?: boolean } = {},
) => {
  const triangle = new fabric.Triangle({ ...options })
  ctx.add(triangle)
  if (!disableActiveOnCreate) {
    ctx.discardActiveObject()
    ctx.setActiveObject(triangle)
  }

  return triangle
}

export const addImage = async (ctx: fabric.Canvas, file?: File | string) => {
  if (!file) return

  let src: string

  if (typeof file === 'string') {
    src = file
  } else {
    // 转成 Base64
    src = await convertFileToBase64(file)
  }

  return new Promise((resolve) => {
    const addImage = new Image()
    addImage.src = src
    addImage.onload = () => {
      const image = new fabric.Image(addImage, { ...defaultImageOptions })
      // 缩放到宽度为 300
      image.scaleToWidth(300)

      ctx.add(image)
      ctx.discardActiveObject()
      ctx.setActiveObject(image)

      return resolve(image)
    }
  })
}

/**
 * 添加文字
 * @param ctx canvas 对象
 * @param text 文字内容
 * @param options 配置
 * @param disableActiveOnCreate 禁用在创建后自动选择该元素
 */
export const addText = (
  ctx: fabric.Canvas,
  text: string,
  { options, disableActiveOnCreate }: { options?: fabric.ITextOptions; disableActiveOnCreate?: boolean } = {},
) => {
  const fText = new fabric.Text(text, { ...options })
  ctx.add(fText)
  if (!disableActiveOnCreate) {
    ctx.discardActiveObject()
    ctx.setActiveObject(fText)
  }

  return fText
}
