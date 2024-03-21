import { Color } from 'antd/lib/color-picker'

export interface KeyPairProps {
  key: string
  value: string
}

export interface ChangePropertiesProps {
  fillColor: Color
  strokeColor: Color
  strokeWidth: string | number
  name?: string
  status?: string
}

export enum CustomMenuEnum {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  TRIANGLE = 'triangle',
}

export enum TemplateEnum {
  TWO = '2',
  FOUR = '4',
  SIX = '6',
}

/**
 * 椅子状态
 * 可预约
 * 已预约
 * 未预约
 * 控制中
 */
export enum ChairStatusEnum {
  STATUS1 = '1',
  STATUS2 = '2',
  STATUS3 = '3',
  STATUS4 = '4',
}
