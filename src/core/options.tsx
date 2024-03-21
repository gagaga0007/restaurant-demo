import { fabric } from 'fabric'
import { ChairStatusEnum, CustomMenuEnum, KeyPairProps, TemplateEnum } from './interface.ts'
import { PlusOutlined } from '@ant-design/icons'

// 自定义形状菜单
export const customMenu = [
  {
    label: '矩形',
    key: CustomMenuEnum.RECTANGLE,
    icon: <PlusOutlined />,
  },
  {
    label: '圆形',
    key: CustomMenuEnum.CIRCLE,
    icon: <PlusOutlined />,
  },
  {
    label: '三角形',
    key: CustomMenuEnum.TRIANGLE,
    icon: <PlusOutlined />,
  },
]

// 自定义模板菜单
export const templateMenu = [
  {
    label: '双人桌',
    key: TemplateEnum.TWO,
    icon: <PlusOutlined />,
  },
  {
    label: '四人桌',
    key: TemplateEnum.FOUR,
    icon: <PlusOutlined />,
  },
  {
    label: '六人桌',
    key: TemplateEnum.SIX,
    icon: <PlusOutlined />,
  },
]

export const DEFAULT_NAME_NAME = '__NAME__'
export const DEFAULT_STATUS_NAME = '__STATUS__'
export const DEFAULT_TABLE_NAME = '__TABLE__'
export const DEFAULT_CHAIR_NAME = '__CHAIR__'

export const defaultFillAlpha = 0.1

export const defaultTableColor = {
  r: 0,
  g: 206,
  b: 209,
}

export const defaultChairColor = {
  r: 105,
  g: 105,
  b: 105,
}

export const defaultCircleWallColor = {
  r: 139,
  g: 69,
  b: 19,
}

export const defaultLineWallColor = {
  r: 0,
  g: 0,
  b: 0,
}

export const defaultCustomColor = {
  r: 0,
  g: 0,
  b: 0,
}

export const defaultRectOptions: fabric.IRectOptions = {
  left: 50,
  top: 100,
  width: 120,
  height: 70,
  strokeWidth: 2,
  fill: `rgba(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b}, ${defaultFillAlpha})`,
  stroke: `rgb(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b})`,
}

export const defaultSemiCircleOptions: fabric.ICircleOptions = {
  radius: 20,
  startAngle: -180,
  endAngle: 0,
  left: 50,
  top: 30,
  width: 40,
  height: 40,
  strokeWidth: 2,
  fill: `rgba(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b}, ${defaultFillAlpha})`,
  stroke: `rgb(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b})`,
}

export const defaultCircleOptions: fabric.ICircleOptions = {
  radius: 20,
  left: 180,
  top: 100,
  width: 40,
  height: 40,
  selectable: true,
  strokeWidth: 2,
  fill: `rgba(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b}, ${defaultFillAlpha})`,
  stroke: `rgb(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b})`,
}

export const defaultLineOptions: fabric.IRectOptions = {
  left: 240,
  top: 50,
  width: 5,
  height: 200,
  fill: `rgba(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b}, ${defaultFillAlpha})`,
  stroke: `rgb(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b})`,
}

export const defaultTriangleOptions: fabric.ITriangleOptions = {
  left: 50,
  top: 200,
  width: 100,
  height: 100,
  strokeWidth: 2,
  fill: `rgba(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b}, ${defaultFillAlpha})`,
  stroke: `rgb(${defaultCustomColor.r}, ${defaultCustomColor.g}, ${defaultCustomColor.b})`,
}

export const defaultImageOptions: fabric.IImageOptions = {
  left: 200,
  top: 200,
}

/**
 * 椅子状态
 */
export const chairStatusOptions: (KeyPairProps & { color: string })[] = [
  {
    key: '默认',
    value: ChairStatusEnum.DEFAULT,
    color: `rgb(${defaultChairColor.r}, ${defaultChairColor.g}, ${defaultChairColor.b})`,
  },
  {
    key: '已预约',
    value: ChairStatusEnum.HAS_ORDER,
    color: `rgb(255, 77, 79)`,
  },
  {
    key: '未预约',
    value: ChairStatusEnum.NO_ORDER,
    color: `rgb(82, 196, 26)`,
  },
  {
    key: '其他',
    value: ChairStatusEnum.UNNAME_ORDER,
    color: `rgb(255, 169, 64)`,
  },
]