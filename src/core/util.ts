import { ICircleOptions, IRectOptions, ITriangleOptions } from 'fabric/fabric-impl'
import {
  defaultImageOptions,
  defaultRectOptions,
  defaultSemiCircleOptions,
  defaultTriangleOptions,
} from './options.tsx'
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
export const getRandomId = (length = 8) => {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let code = ''
  for (let i = 0; i < length; i++) {
    // 步骤3 开始循环
    const randomIndex = Math.floor(Math.random() * charset.length)
    code += charset.charAt(randomIndex)
  }
  return code
}

/**
 * 获取元素 name 属性中组合的某个属性值
 * @param name name 属性
 * @param propertyName 属性值
 */
export const getNameProperties = (name: string, propertyName: string) => {
  const property = name.split(':').find((v) => v.includes(propertyName))
  return property?.replace(propertyName, '') ?? ''
}

/**
 * 添加矩形
 * @param ctx canvas 对象
 * @param options 配置
 */
export const addRect = (ctx: fabric.Canvas, { options = defaultRectOptions }: { options?: IRectOptions } = {}) => {
  const rect = new fabric.Rect({ ...options })
  ctx.add(rect)
  ctx.discardActiveObject()
  ctx.setActiveObject(rect)

  return rect
}

/**
 * 添加圆形
 * @param ctx canvas 对象
 * @param options 配置
 */
export const addCircle = (
  ctx: fabric.Canvas,
  { options = defaultSemiCircleOptions }: { options?: ICircleOptions } = {},
) => {
  const circle = new fabric.Circle({ ...options })
  ctx.add(circle)
  ctx.discardActiveObject()
  ctx.setActiveObject(circle)

  return circle
}

/**
 * 添加三角形
 * @param ctx canvas 对象
 * @param options 配置
 */
export const addTriangle = (
  ctx: fabric.Canvas,
  { options = defaultTriangleOptions }: { options?: ITriangleOptions } = {},
) => {
  const triangle = new fabric.Triangle({ ...options })
  ctx.add(triangle)
  ctx.discardActiveObject()
  ctx.setActiveObject(triangle)

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
 */
export const addText = (ctx: fabric.Canvas, text: string, { options }: { options?: fabric.ITextOptions } = {}) => {
  const fText = new fabric.Text(text, { ...options })
  ctx.add(fText)
  ctx.discardActiveObject()
  ctx.setActiveObject(fText)

  return fText
}

/**
 * 添加文字盒子
 * @param ctx canvas 对象
 * @param text 文字内容
 * @param options 配置
 */
export const addTextBox = (
  ctx: fabric.Canvas,
  text: string,
  { options }: { options?: fabric.ITextboxOptions } = {},
) => {
  const textBox = new fabric.Textbox(text, { ...options })
  ctx.add(textBox)
  ctx.discardActiveObject()
  ctx.setActiveObject(textBox)

  return textBox
}
