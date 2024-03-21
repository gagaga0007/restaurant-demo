import { ICircleOptions, IRectOptions, ITriangleOptions } from 'fabric/fabric-impl'
import { defaultImageOptions, defaultRectOptions, defaultSemiCircleOptions, defaultTriangleOptions } from './options.ts'
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
 * 添加矩形
 * @param ctx canvas 对象
 * @param options 配置
 */
export const addRect = (ctx: fabric.Canvas, { options = defaultRectOptions }: { options?: IRectOptions } = {}) => {
  const rect = new fabric.Rect({ ...options })
  ctx.add(rect)
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
  const arc = new fabric.Circle({ ...options })
  ctx.add(arc)
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
  const arc = new fabric.Triangle({ ...options })
  ctx.add(arc)
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

  const addImage = new Image()
  addImage.src = src
  addImage.onload = () => {
    const image = new fabric.Image(addImage, { ...defaultImageOptions })
    // 缩放到宽度为 300
    image.scaleToWidth(300)

    ctx.add(image)
  }
}
