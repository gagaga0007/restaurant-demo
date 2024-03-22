import { Color } from 'antd/lib/color-picker'

export interface KeyPairProps {
  key: string
  value: string
}

export interface ChangePropertiesProps {
  fillColor: Color
  strokeColor: Color
  strokeWidth: string | number
  tableName?: string
  chairName?: string
  status?: string
}

/**
 * 自定义图形
 */
export enum CustomMenuEnum {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
}

/**
 * 模板类型
 */
export enum TemplateEnum {
  TWO = '2',
  FOUR = '4',
  SIX = '6',
}

/**
 * 椅子状态
 */
export enum ChairStatusEnum {
  DEFAULT = '1',
  HAS_ORDER = '2',
  UNNAME_ORDER = '3',
  NO_ORDER = '4',
}
