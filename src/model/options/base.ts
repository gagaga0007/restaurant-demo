import { KeyPairProps, UserTypeEnum } from '@/model/interface/base.ts'

export const userTypeOptions: KeyPairProps[] = [
  { key: '顾客', value: UserTypeEnum.CUSTOMER },
  { key: '管理员', value: UserTypeEnum.ADMIN },
]
