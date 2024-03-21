import { Color } from 'antd/lib/color-picker'

export interface ChangePropertiesProps {
  fillColor: Color
  strokeColor: Color
  strokeWidth: string | number
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
