import { fabric } from 'fabric'
import { ChairStatusEnum, CustomMenuEnum, TemplateEnum } from '../interface/editor.ts'
import { PlusOutlined } from '@ant-design/icons'
import { KeyPairProps } from '@/model/interface/base.ts'

/** 自定义形状菜单 */
export const customMenu = [
  {
    label: '矩形',
    key: CustomMenuEnum.RECTANGLE,
  },
  {
    label: '円形',
    key: CustomMenuEnum.CIRCLE,
  },
  {
    label: '三角形',
    key: CustomMenuEnum.TRIANGLE,
  },
]

/** 自定义模板菜单 */
export const templateMenu = [
  {
    label: '2人用テーブル',
    key: TemplateEnum.TWO,
    icon: <PlusOutlined />,
  },
  {
    label: '4人用テーブル',
    key: TemplateEnum.FOUR,
    icon: <PlusOutlined />,
  },
  {
    label: '6人用テーブル',
    key: TemplateEnum.SIX,
    icon: <PlusOutlined />,
  },
]

/** fabric object data - { key: value } - KEY */
export const TYPE_KEY = 'type'
export const NAME_KEY = 'name'
export const STATUS_KEY = 'status'
export const ID_KEY = 'id'
export const PARENT_ID_KEY = 'parent_id'

/** fabric object data - { key: value } - VALUE */
export const TABLE_TYPE_VALUE = 'table'
export const CHAIR_TYPE_VALUE = 'chair'
export const TABLE_TEXT_TYPE_VALUE = 'table_text'

/** Canvas config */
export const CANVAS_WIDTH = 2000
export const CANVAS_HEIGHT = 1125

/** Object config */
export const defaultTableTextOffset = 20
export const defaultFillAlpha = 0.1

/** Object color */
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

/** Object options */
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

export const defaultTextOptions: fabric.ITextOptions = {
  fontSize: 16,
}

/** 椅子状态 */
export const chairStatusOptions: (KeyPairProps & { color: string })[] = [
  {
    key: 'デフォルト',
    value: ChairStatusEnum.DEFAULT,
    color: `rgb(${defaultChairColor.r}, ${defaultChairColor.g}, ${defaultChairColor.b})`,
  },
  {
    key: '予約済み',
    value: ChairStatusEnum.HAS_ORDER,
    color: `rgb(255, 77, 79)`,
  },
  {
    key: '未予約',
    value: ChairStatusEnum.NO_ORDER,
    color: `rgb(82, 196, 26)`,
  },
  {
    key: 'その他',
    value: ChairStatusEnum.UNNAME_ORDER,
    color: `rgb(255, 169, 64)`,
  },
]
