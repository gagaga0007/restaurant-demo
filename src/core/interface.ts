import { Color } from 'antd/lib/color-picker'

export interface CanvasPropertiesProps {
  width: number
  height: number
}

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
