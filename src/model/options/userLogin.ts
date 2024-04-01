import { KeyPairProps } from '@/model/interface/base.ts'
import { UserOrderTypeEnum } from '@/model/interface/userLogin.ts'

export const userOrderTypeOptions: (KeyPairProps & { color: string })[] = [
  { key: '早餐', value: UserOrderTypeEnum.BREAKFAST, color: '#13c2c2' },
  { key: '午餐', value: UserOrderTypeEnum.LUNCH, color: '#fa8c16' },
  { key: '晚餐', value: UserOrderTypeEnum.DINNER, color: '#2f54eb' },
]
