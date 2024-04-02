export interface KeyPairProps {
  key: string
  value: string
}

export interface BaseProps {
  id: string
}

export enum UserTypeEnum {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}
