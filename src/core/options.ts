import { fabric } from 'fabric'

export const defaultFillAlpha = 0.1

export const defaultDeskColor = {
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
}

export const defaultCircleOptions: fabric.ICircleOptions = {
  radius: 20,
  left: 180,
  top: 100,
  width: 40,
  height: 40,
  selectable: true,
  strokeWidth: 2,
}

export const defaultLineOptions: fabric.IRectOptions = {
  left: 240,
  top: 50,
  width: 5,
  height: 200,
}

export const defaultTriangleOptions: fabric.ITriangleOptions = {
  left: 50,
  top: 200,
  width: 100,
  height: 100,
  strokeWidth: 2,
}

export const defaultImageOptions: fabric.IImageOptions = {
  left: 200,
  top: 200,
}
