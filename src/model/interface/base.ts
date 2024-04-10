export interface KeyPairProps {
  key: string
  value: string
}

export interface BaseProps {
  id: string
  createTime: string
  createBy: string
}

export interface BaseApiProps<T> {
  msg: string
  code: number
  data: T
}

export interface BaseApiResultProps {
  msg: string
  code: number
}

export interface BaseTableProps<T> {
  data: T[]
  loading: boolean
}

export enum UserTypeEnum {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}
