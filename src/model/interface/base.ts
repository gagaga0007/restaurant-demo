export interface KeyPairProps {
  key: string
  value: string
}

export interface BaseProps {
  id: string
}

export interface BaseApiProps<T> {
  msg: string
  code: number
  data: T
}

export enum UserTypeEnum {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}
