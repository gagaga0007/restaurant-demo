import { BaseProps } from '@/model/interface/base.ts'

export interface OrderEditProps {
  peopleNumber: number
  dateTime: string
  type: string
}

export interface OrderProps extends OrderEditProps, BaseProps {
  userName: string
  roomName: string
}

export enum OrderTypeEnum {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}
