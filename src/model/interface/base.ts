export interface KeyPairProps {
  key: string
  value: string
}

export interface BaseProps {
  id: number
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
  data?: any
}

export interface BasePageProps<T> {
  msg: string
  code: number
  rows: T[]
  total: number
}

export interface BaseTableProps<T> {
  data: T[]
  loading: boolean
}

export enum UserTypeEnum {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export enum BaseStatusEnum {
  YES = 1,
  NO = 0,
}
