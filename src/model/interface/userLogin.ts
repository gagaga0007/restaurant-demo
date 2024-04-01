export interface UserLoginProps {
  userName: string
  roomName: string
}

export interface UserOrderProps {
  peopleNumber: number
  dateTime: string
  type: string
}

export enum UserOrderTypeEnum {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
}
