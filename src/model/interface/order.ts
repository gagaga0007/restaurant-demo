import { BaseProps } from '@/model/interface/base.ts'

export interface OrderEditProps {
  numberOfDiners: number
  mealTime: string
  userName: string
  deptName: string
}

export interface OrderProps extends OrderEditProps, BaseProps {
  deleteFlg: number
  isCheckIn: number
}

export interface SearchOrderProps extends Partial<OrderProps> {
  page?: number
}

export enum OrderTypeEnum {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}
