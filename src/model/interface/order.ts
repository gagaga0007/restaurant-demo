import { BaseProps } from '@/model/interface/base.ts'

export interface OrderEditProps {
  numberOfDiners: number
  mealTime: string
  userName: string
  // type: string
}

export interface OrderProps extends OrderEditProps, BaseProps {
  deptName: string
}

export interface SearchOrderProps extends Partial<OrderProps> {}

export enum OrderTypeEnum {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}
